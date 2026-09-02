'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import SearchScreen from './components/SearchScreen'
import ResultsScreen from './components/ResultsScreen'
import DetailScreen from './components/DetailScreen'
import MyProgramsScreen from './components/MyProgramsScreen'
import MyChatsScreen from './components/MyChatsScreen'
import ProfileScreen from './components/ProfileScreen'
import FeedbackScreen from './components/FeedbackScreen'
import TermsScreen from './components/TermsScreen'
import PrivacyScreen from './components/PrivacyScreen'
import AuthModal from './components/AuthModal'
import ChatScreen from './components/ChatScreen'
import { supabase, signOut } from './lib/supabase'
import { syncUserData, saveUserData, K } from './lib/user-data'

const DEFAULT_FILTERS = {
  field: '',
  country: 'European Union',
  startDate: '',
  tuition: [0, 100000],
  format: ['Full-time'],
  attendance: ['On-campus'],
  degree: ['Bachelor', 'Master'],
  scholarship: false,
  english: true
}

const PERSISTED_SCREENS = new Set(['search', 'results', 'chat', 'my-programs', 'my-chats', 'profile', 'feedback', 'terms', 'privacy'])

// The chat currently on screen, mirrored locally so a refresh lands back in
// the same conversation rather than an empty one.
const ACTIVE_CHAT_UNI = 'unifind_active_chat_uni'
const ACTIVE_CHAT_MESSAGES = 'unifind_active_chat_messages'

export default function App() {
  const [screen, setScreenRaw] = useState('search')
  const setScreen = (s) => {
    setScreenRaw(s)
    if (typeof window !== 'undefined' && PERSISTED_SCREENS.has(s)) {
      const params = new URLSearchParams(window.location.search)
      if (s === 'search') params.delete('screen')
      else params.set('screen', s)
      const qs = params.toString()
      window.history.pushState({}, '', qs ? `/?${qs}` : '/')
    }
  }
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [authMode, setAuthMode] = useState(null)
  const [activeUni, setActiveUni] = useState(null)
  const [chatUni, setChatUni] = useState(null)
  const [chatMessages, setChatMessages] = useState(null)
  const [initialChatPrompt, setInitialChatPrompt] = useState(null)
  const [isPremium, setIsPremium] = useState(false)
  const [savedPrograms, setSavedPrograms] = useState([])
  const [savedChats, setSavedChats] = useState([])
  const [toast, setToast] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFindingMore, setIsFindingMore] = useState(false)
  const [apiResults, setApiResults] = useState(null)
  const [user, setUser] = useState(null)

  // ── Supabase auth listener ──────────────────────────────────
  useEffect(() => {
    // Restore screen from URL (?screen=…) so refresh keeps the current page
    if (typeof window !== 'undefined') {
      const s = new URLSearchParams(window.location.search).get('screen')
      if (s && PERSISTED_SCREENS.has(s) && s !== 'results' && s !== 'chat') {
        setScreenRaw(s)
      } else if (s === 'chat') {
        try {
          const savedUni = localStorage.getItem(ACTIVE_CHAT_UNI)
          if (savedUni) {
            const savedMsgs = localStorage.getItem(ACTIVE_CHAT_MESSAGES)
            if (savedMsgs) setChatMessages(JSON.parse(savedMsgs))
            setChatUni(JSON.parse(savedUni))
            setScreenRaw('chat')
          }
        } catch {}
      }
    }

    // Browser back/forward should switch screens instead of leaving the site
    const onPop = () => {
      if (typeof window === 'undefined') return
      const s = new URLSearchParams(window.location.search).get('screen') || 'search'
      if (PERSISTED_SCREENS.has(s)) setScreenRaw(s)
      else setScreenRaw('search')
    }
    window.addEventListener('popstate', onPop)

    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Arriving from the "Reset Password" email. Supabase may hand the token
    // back either as ?code= (PKCE) or as a #access_token=...&type=recovery
    // fragment (implicit), so detect both.
    const cleanUrl = () => {
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
    const openReset = ({ clean }) => {
      setAuthMode('reset')
      // Only tidy the address bar once the token has been consumed — wiping
      // the fragment too early would take it away before supabase-js reads it.
      if (clean) cleanUrl()
    }

    if (typeof window !== 'undefined') {
      const hash = window.location.hash || ''
      const isRecoveryHash = hash.includes('type=recovery')
      if (new URLSearchParams(window.location.search).get('reset') === '1') {
        openReset({ clean: !isRecoveryHash && !hash })
      } else if (isRecoveryHash) {
        openReset({ clean: false })
      }
    }

    // Listen for sign-in / sign-out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'PASSWORD_RECOVERY') openReset({ clean: true })
    })

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('popstate', onPop)
    }
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  const buildPrompt = (filters, exclude = []) => {
    const exclusion = exclude.length > 0
      ? `\nDo NOT include any of these universities already shown: ${exclude.join(', ')}.`
      : ''
    return `Find 10 real universities matching: field="${filters.field || 'any field'}", country="${filters.country || 'any country'}", tuition ${filters.tuition[0]}-${filters.tuition[1]} USD/year, format="${filters.format.join(' or ') || 'any'}", attendance="${filters.attendance.join(' or ') || 'any'}", degree="${filters.degree.join(' or ') || 'any'}".${exclusion}
Reply ONLY with a valid JSON array of exactly 10 items, no markdown, no explanation:
[{"name":"...","country":"...","city":"...","tuition":NUMBER,"degree":"...","attendance":"...","language":"English","duration":"...","startDate":"Sep/Oct 2026","scholarship":true/false,"field":"...","blurb":"one sentence about this university"}]`
  }

  const fetchUniversities = async (prompt) => {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
    const data = await res.json()
    if (!res.ok) throw new Error('API error')
    const text = data.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(text)
    return Array.isArray(parsed) ? parsed : []
  }

  const handleSearch = async () => {
    setScreen('results')
    setIsLoading(true)
    setApiResults(null)
    try {
      const results = await fetchUniversities(buildPrompt(filters))
      setApiResults(results)
    } catch {
      setApiResults(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFindMore = async () => {
    setIsFindingMore(true)
    try {
      const alreadyShown = (apiResults || []).map(u => u.name)
      const more = await fetchUniversities(buildPrompt(filters, alreadyShown))
      setApiResults(prev => [...(prev || []), ...more])
    } catch {
      // silently fail — keep existing results
    } finally {
      setIsFindingMore(false)
    }
  }

  const openUni = (uni, prompt = null) => {
    try {
      localStorage.setItem('unifind_active_uni', JSON.stringify(uni))
    } catch { /* ignore */ }
    window.open('/program', '_blank')
  }

  const handleAuthSuccess = (authUser) => {
    setAuthMode(null)
    const displayName = authUser?.user_metadata?.full_name?.split(' ')[0] || authUser?.email?.split('@')[0] || 'back'
    showToast(`✓ Welcome, ${displayName}!`)
  }

  const handleSignOut = async () => {
    await signOut()
    setScreen('search')
    showToast('Signed out')
  }

  const onSyncError = (err) => {
    const msg = err?.message || String(err)
    showToast('Sync failed: ' + msg.slice(0, 80))
  }

  // Pull this account's programs and chats from Supabase, merging in anything
  // saved locally, so every device the user signs in on converges on the same
  // data. Runs on sign-in, on tab focus, and when entering a saved-items
  // screen — SPA navigation never fires 'focus', so that last one matters.
  const pullUserData = useCallback(async (userId) => {
    if (!userId) return
    const [programs, chats] = await Promise.all([
      syncUserData(K.SAVED_PROGRAMS, { userId, onError: onSyncError }),
      syncUserData(K.SAVED_CHATS, { userId, onError: onSyncError }),
    ])
    if (Array.isArray(programs)) setSavedPrograms(programs)
    if (Array.isArray(chats)) setSavedChats(chats)
  }, [])

  useEffect(() => {
    if (!user?.id) {
      // Signed out: never leave the previous account's data on screen.
      setSavedPrograms([])
      setSavedChats([])
      return
    }
    pullUserData(user.id)
  }, [user?.id, pullUserData])

  useEffect(() => {
    if (!user?.id) return
    const sync = () => pullUserData(user.id)
    window.addEventListener('focus', sync)
    return () => window.removeEventListener('focus', sync)
  }, [user?.id, pullUserData])

  useEffect(() => {
    if (!user?.id) return
    if (screen !== 'my-programs' && screen !== 'my-chats') return
    pullUserData(user.id)
  }, [screen, user?.id, pullUserData])

  // Persistence happens outside the state updater: React may invoke an updater
  // more than once, and a save must fire exactly once per user action.
  const handleSaveChat = ({ uni, messages }) => {
    if (savedChats.some(c => c.uni.name === uni.name)) return
    const updated = [...savedChats, { id: Date.now(), uni, messages, savedAt: new Date().toISOString() }]
    setSavedChats(updated)
    saveUserData(K.SAVED_CHATS, updated, { userId: user?.id, onError: onSyncError })
    showToast('✓ Chat saved to My Chats')
  }

  // ChatScreen calls this as the conversation progresses. It reads through a
  // ref because the debounced calls can arrive faster than state settles, and
  // a stale closure here would drop earlier turns.
  const savedChatsRef = useRef(savedChats)
  useEffect(() => { savedChatsRef.current = savedChats }, [savedChats])

  const handleChatPersist = useCallback(({ uni, messages }) => {
    const list = savedChatsRef.current
    const i = list.findIndex(c => c.uni?.name === uni.name)
    const entry = {
      id: i >= 0 ? list[i].id : Date.now(),
      uni,
      messages,
      savedAt: new Date().toISOString(),
    }
    const updated = i >= 0 ? list.map((c, j) => (j === i ? entry : c)) : [...list, entry]
    savedChatsRef.current = updated
    setSavedChats(updated)
    // Mirrored locally so a page refresh restores the transcript immediately,
    // without waiting on the cloud round-trip.
    try { localStorage.setItem(ACTIVE_CHAT_MESSAGES, JSON.stringify(messages)) } catch {}
    saveUserData(K.SAVED_CHATS, updated, { userId: user?.id })
  }, [user?.id])

  // Opening a chat resumes the stored conversation for that university, so
  // clicking Ask AI twice continues one thread instead of starting over.
  const openChatFor = (uni) => {
    const existing = savedChatsRef.current.find(c => c.uni?.name === uni.name)
    const msgs = existing?.messages ?? null
    try {
      localStorage.setItem(ACTIVE_CHAT_UNI, JSON.stringify(uni))
      if (msgs) localStorage.setItem(ACTIVE_CHAT_MESSAGES, JSON.stringify(msgs))
      else localStorage.removeItem(ACTIVE_CHAT_MESSAGES)
    } catch {}
    setChatMessages(msgs)
    setChatUni(uni)
    setScreen('chat')
  }

  const handleUnsaveChat = ({ uni }) => {
    const updated = savedChats.filter(c => c.uni.name !== uni.name)
    setSavedChats(updated)
    saveUserData(K.SAVED_CHATS, updated, { userId: user?.id, onError: onSyncError })
    showToast('Chat removed')
  }

  const handleSaveToggle = (uni) => {
    if (!user) {
      setAuthMode('save-programs')
      return
    }
    const exists = savedPrograms.some(p => p.name === uni.name)
    const updated = exists ? savedPrograms.filter(p => p.name !== uni.name) : [...savedPrograms, uni]
    setSavedPrograms(updated)
    saveUserData(K.SAVED_PROGRAMS, updated, { userId: user.id, onError: onSyncError })
    showToast(exists ? 'Removed from My Programs' : '✓ Saved to My Programs')
  }

  return (
    <>
      {screen === 'search' && (
        <SearchScreen
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onOpenAuth={setAuthMode}
          user={user}
          onSignOut={handleSignOut}
          isPremium={isPremium}
          onMyPrograms={() => setScreen('my-programs')}
          onMyChats={() => setScreen('my-chats')}
          onProfile={() => setScreen('profile')}
          onFeedback={() => setScreen('feedback')}
          onTerms={() => setScreen('terms')}
          onPrivacy={() => setScreen('privacy')}
          onAskAI={(u) => {
            // Popular-fields cards have a lightweight shape — normalise to what ChatScreen expects.
            const [city, country] = String(u.loc || '').split(',').map(s => s.trim())
            const normalized = {
              name: u.name,
              field: u.field || u.program || '',
              program: u.program || '',
              city: city || '',
              country: country || '',
              tuition: u.tuition,
              duration: u.duration,
              startDate: u.start || u.startDate,
              language: u.language || 'English',
              url: u.url,
              img: u.img,
            }
            openChatFor(normalized)
          }}
          onUpgrade={() => {
            setIsPremium(true)
            showToast('✓ Pro unlocked — all universities visible')
          }}
        />
      )}

      {screen === 'results' && (
        <ResultsScreen
          filters={filters}
          setFilters={setFilters}
          onOpenUni={openUni}
          onAskAI={openChatFor}
          onBack={() => setScreen('search')}
          isPremium={isPremium}
          isLoading={isLoading}
          isFindingMore={isFindingMore}
          apiResults={apiResults}
          user={user}
          onOpenAuth={setAuthMode}
          onSearch={handleSearch}
          onFindMore={handleFindMore}
          onMyPrograms={() => setScreen('my-programs')}
          onMyChats={() => setScreen('my-chats')}
          onProfile={() => setScreen('profile')}
          onFeedback={() => setScreen('feedback')}
          onTerms={() => setScreen('terms')}
          onPrivacy={() => setScreen('privacy')}
          savedIds={new Set(savedPrograms.map(p => p.name))}
          onSaveToggle={handleSaveToggle}
          onSignOut={handleSignOut}
          onUpgrade={() => {
            setIsPremium(true)
            showToast('✓ Pro unlocked — all universities visible')
          }}
        />
      )}

      {screen === 'chat' && chatUni && (
        <ChatScreen
          // Remount per university so the resumed transcript replaces the
          // previous one — ChatScreen seeds its messages from state.
          key={chatUni.name}
          uni={chatUni}
          initialMessages={chatMessages}
          onChatPersist={handleChatPersist}
          user={user}
          onHome={() => setScreen('search')}
          onMyPrograms={() => setScreen('my-programs')}
          onMyChats={() => setScreen('my-chats')}
          onSaveToggle={handleSaveToggle}
          onOpenAuth={setAuthMode}
          onSignOut={handleSignOut}
          onFeedback={() => setScreen('feedback')}
          onTerms={() => setScreen('terms')}
          onPrivacy={() => setScreen('privacy')}
          onProfile={() => setScreen('profile')}
          savedIds={new Set(savedPrograms.map(p => p.name))}
        />
      )}

      {screen === 'detail' && activeUni && (
        <DetailScreen
          uni={activeUni}
          initialPrompt={initialChatPrompt}
          onBack={() => setScreen('results')}
          user={user}
          onSignOut={handleSignOut}
          onOpenAuth={setAuthMode}
          onMyPrograms={() => setScreen('my-programs')}
          onMyChats={() => setScreen('my-chats')}
          onProfile={() => setScreen('profile')}
          onFeedback={() => setScreen('feedback')}
          onTerms={() => setScreen('terms')}
          onPrivacy={() => setScreen('privacy')}
          onSaveChat={handleSaveChat}
          onUnsaveChat={handleUnsaveChat}
          isChatSaved={savedChats.some(c => c.uni.name === activeUni?.name)}
        />
      )}

      {screen === 'my-programs' && user && (
        <MyProgramsScreen
          user={user}
          savedPrograms={savedPrograms}
          onBack={() => setScreen('search')}
          onOpenUni={openUni}
          onAskAI={openChatFor}
          onUnsave={handleSaveToggle}
          onMyPrograms={() => setScreen('my-programs')}
          onMyChats={() => setScreen('my-chats')}
          onProfile={() => setScreen('profile')}
          onFeedback={() => setScreen('feedback')}
          onTerms={() => setScreen('terms')}
          onPrivacy={() => setScreen('privacy')}
          onSignOut={handleSignOut}
        />
      )}

      {screen === 'my-chats' && user && (
        <MyChatsScreen
          user={user}
          savedChats={savedChats}
          onBack={() => setScreen('search')}
          onOpenChat={(chat) => openChatFor(chat.uni)}
          onUnsaveChat={handleUnsaveChat}
          onMyPrograms={() => setScreen('my-programs')}
          onMyChats={() => setScreen('my-chats')}
          onProfile={() => setScreen('profile')}
          onFeedback={() => setScreen('feedback')}
          onTerms={() => setScreen('terms')}
          onPrivacy={() => setScreen('privacy')}
          onSignOut={handleSignOut}
        />
      )}

      {screen === 'profile' && user && (
        <ProfileScreen
          user={user}
          onBack={() => setScreen('search')}
          onSignOut={handleSignOut}
          onMyPrograms={() => setScreen('my-programs')}
          onMyChats={() => setScreen('my-chats')}
          onProfile={() => setScreen('profile')}
          onFeedback={() => setScreen('feedback')}
          onTerms={() => setScreen('terms')}
          onPrivacy={() => setScreen('privacy')}
        />
      )}

      {screen === 'feedback' && (
        <FeedbackScreen
          user={user}
          onBack={() => setScreen('search')}
          onSignOut={handleSignOut}
          onMyPrograms={() => setScreen('my-programs')}
          onMyChats={() => setScreen('my-chats')}
          onProfile={() => setScreen('profile')}
          onFeedback={() => setScreen('feedback')}
          onTerms={() => setScreen('terms')}
          onPrivacy={() => setScreen('privacy')}
        />
      )}

      {screen === 'terms' && (
        <TermsScreen
          user={user}
          onBack={() => setScreen('search')}
          onSignOut={handleSignOut}
          onMyPrograms={() => setScreen('my-programs')}
          onMyChats={() => setScreen('my-chats')}
          onProfile={() => setScreen('profile')}
          onFeedback={() => setScreen('feedback')}
          onTerms={() => setScreen('terms')}
          onPrivacy={() => setScreen('privacy')}
        />
      )}

      {screen === 'privacy' && (
        <PrivacyScreen
          user={user}
          onBack={() => setScreen('search')}
          onSignOut={handleSignOut}
          onMyPrograms={() => setScreen('my-programs')}
          onMyChats={() => setScreen('my-chats')}
          onProfile={() => setScreen('profile')}
          onFeedback={() => setScreen('feedback')}
          onTerms={() => setScreen('terms')}
          onPrivacy={() => setScreen('privacy')}
        />
      )}

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onMode={setAuthMode}
          onSubmit={handleAuthSuccess}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
