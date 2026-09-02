'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import ChatScreen from '../components/ChatScreen'
import AuthModal from '../components/AuthModal'
import { supabase } from '../lib/supabase'
import { syncUserData, saveUserData, K } from '../lib/user-data'

export default function ProgramPage() {
  const [uni, setUni] = useState(null)
  const [user, setUser] = useState(null)
  const [savedPrograms, setSavedPrograms] = useState([])
  const [initialMessages, setInitialMessages] = useState(null)
  const [ready, setReady] = useState(false)
  const [authMode, setAuthMode] = useState(null)
  const [toast, setToast] = useState(null)
  const savedChatsRef = useRef([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('unifind_active_uni')
      if (stored) setUni(JSON.parse(stored))
    } catch {}

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user?.id) { setSavedPrograms([]); return }
    let cancelled = false
    ;(async () => {
      const list = await syncUserData(K.SAVED_PROGRAMS, { userId: user.id, onError: (e) => showToast('Sync failed: ' + e.message) })
      if (!cancelled && Array.isArray(list)) setSavedPrograms(list)
    })()
    return () => { cancelled = true }
  }, [user?.id])

  // Resume this university's existing conversation, if the account has one.
  // ChatScreen seeds its transcript once at mount, so it is held back until
  // the stored chats have arrived.
  useEffect(() => {
    if (!uni?.name) return
    let cancelled = false
    ;(async () => {
      const chats = user?.id ? await syncUserData(K.SAVED_CHATS, { userId: user.id }) : []
      if (cancelled) return
      savedChatsRef.current = Array.isArray(chats) ? chats : []
      const existing = savedChatsRef.current.find(c => c.uni?.name === uni.name)
      setInitialMessages(existing?.messages ?? null)
      setReady(true)
    })()
    return () => { cancelled = true }
  }, [uni?.name, user?.id])

  const handleChatPersist = useCallback(({ uni: u, messages }) => {
    const list = savedChatsRef.current
    const i = list.findIndex(c => c.uni?.name === u.name)
    const entry = { id: i >= 0 ? list[i].id : Date.now(), uni: u, messages, savedAt: new Date().toISOString() }
    const updated = i >= 0 ? list.map((c, j) => (j === i ? entry : c)) : [...list, entry]
    savedChatsRef.current = updated
    saveUserData(K.SAVED_CHATS, updated, { userId: user?.id })
  }, [user?.id])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  const handleSaveToggle = (u) => {
    if (!user) { setAuthMode('login'); return }
    const exists = savedPrograms.some(p => p.name === u.name)
    const updated = exists ? savedPrograms.filter(p => p.name !== u.name) : [...savedPrograms, u]
    setSavedPrograms(updated)
    saveUserData(K.SAVED_PROGRAMS, updated, { userId: user.id, onError: (e) => showToast('Sync failed: ' + e.message) })
    showToast(exists ? 'Removed from My Programs' : '✓ Saved to My Programs')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const handleAuthSuccess = () => setAuthMode(null)

  const [loadedOnce, setLoadedOnce] = useState(false)
  useEffect(() => { const t = setTimeout(() => setLoadedOnce(true), 400); return () => clearTimeout(t) }, [])

  if (uni && !ready) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'white', color: '#888', fontSize: 15, fontFamily: 'Geist, sans-serif' }}>
        Loading…
      </div>
    )
  }

  if (!uni) {
    if (!loadedOnce) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'white', color: '#888', fontSize: 15, fontFamily: 'Geist, sans-serif' }}>
          Loading…
        </div>
      )
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F5F5F5', color: '#1a1a1a', fontFamily: 'Geist, sans-serif', gap: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#0D2C54' }}>No program selected</div>
        <p style={{ fontSize: 14, color: '#6B7280', maxWidth: 340 }}>Pick a program from the homepage to start a conversation.</p>
        <a href="/" style={{ padding: '12px 28px', background: '#1668E3', color: '#fff', borderRadius: 22, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Back to homepage</a>
      </div>
    )
  }

  return (
    <>
      <ChatScreen
        uni={uni}
        initialMessages={initialMessages}
        onChatPersist={handleChatPersist}
        user={user}
        onHome={() => { window.location.href = '/' }}
        onMyPrograms={() => { window.location.href = '/' }}
        onMyChats={() => { window.location.href = '/' }}
        onSaveToggle={handleSaveToggle}
        onOpenAuth={setAuthMode}
        onSignOut={handleSignOut}
        onFeedback={() => {}}
        onTerms={() => { window.open('/terms', '_blank') }}
        onPrivacy={() => { window.open('/privacy', '_blank') }}
        onProfile={() => { window.location.href = '/?screen=profile' }}
        savedIds={new Set(savedPrograms.map(p => p.name))}
      />
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
