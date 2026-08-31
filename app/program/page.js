'use client'
import { useState, useEffect } from 'react'
import ChatScreen from '../components/ChatScreen'
import AuthModal from '../components/AuthModal'
import { supabase } from '../lib/supabase'

const SAVED_PROGRAMS_KEY = 'unifind_saved_programs'

function loadSavedPrograms() {
  try { return JSON.parse(localStorage.getItem(SAVED_PROGRAMS_KEY) || '[]') } catch { return [] }
}
function persistSavedPrograms(list) {
  try { localStorage.setItem(SAVED_PROGRAMS_KEY, JSON.stringify(list)) } catch {}
}

export default function ProgramPage() {
  const [uni, setUni] = useState(null)
  const [user, setUser] = useState(null)
  const [savedPrograms, setSavedPrograms] = useState([])
  const [authMode, setAuthMode] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('unifind_active_uni')
      if (stored) setUni(JSON.parse(stored))
    } catch {}

    setSavedPrograms(loadSavedPrograms())

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  const handleSaveToggle = (u) => {
    if (!user) { setAuthMode('login'); return }
    const current = loadSavedPrograms()
    const exists = current.some(p => p.name === u.name)
    const updated = exists ? current.filter(p => p.name !== u.name) : [...current, u]
    persistSavedPrograms(updated)
    setSavedPrograms(updated)
    showToast(exists ? 'Removed from My Programs' : '✓ Saved to My Programs')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const handleAuthSuccess = () => setAuthMode(null)

  const [loadedOnce, setLoadedOnce] = useState(false)
  useEffect(() => { const t = setTimeout(() => setLoadedOnce(true), 400); return () => clearTimeout(t) }, [])

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
