'use client'
import { useState, useEffect } from 'react'
import SearchScreen from './components/SearchScreen'
import ResultsScreen from './components/ResultsScreen'
import DetailScreen from './components/DetailScreen'
import MyProgramsScreen from './components/MyProgramsScreen'
import AuthModal from './components/AuthModal'
import { supabase, signOut } from './lib/supabase'

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

export default function App() {
  const [screen, setScreen] = useState('search')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [authMode, setAuthMode] = useState(null)
  const [activeUni, setActiveUni] = useState(null)
  const [initialChatPrompt, setInitialChatPrompt] = useState(null)
  const [isPremium, setIsPremium] = useState(false)
  const [savedPrograms, setSavedPrograms] = useState([])
  const [toast, setToast] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFindingMore, setIsFindingMore] = useState(false)
  const [apiResults, setApiResults] = useState(null)
  const [user, setUser] = useState(null)

  // ── Supabase auth listener ──────────────────────────────────
  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for sign-in / sign-out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
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
    setActiveUni(uni)
    setInitialChatPrompt(prompt)
    setScreen('detail')
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

  const handleSaveToggle = (uni) => {
    if (!user) {
      setAuthMode('save-programs')
      return
    }
    setSavedPrograms(prev => {
      const exists = prev.some(p => p.name === uni.name)
      if (exists) {
        showToast('Removed from My Programs')
        return prev.filter(p => p.name !== uni.name)
      } else {
        showToast('✓ Saved to My Programs')
        return [...prev, uni]
      }
    })
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
          onMyChats={() => showToast('My Chats coming soon!')}
          savedIds={new Set(savedPrograms.map(p => p.name))}
          onSaveToggle={handleSaveToggle}
          onUpgrade={() => {
            setIsPremium(true)
            showToast('✓ Pro unlocked — all universities visible')
          }}
        />
      )}

      {screen === 'detail' && activeUni && (
        <DetailScreen
          uni={activeUni}
          initialPrompt={initialChatPrompt}
          onBack={() => setScreen('results')}
          user={user}
        />
      )}

      {screen === 'my-programs' && user && (
        <MyProgramsScreen
          user={user}
          savedPrograms={savedPrograms}
          onBack={() => setScreen('results')}
          onOpenUni={openUni}
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
