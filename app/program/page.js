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

  if (!uni) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'white', color: '#888', fontSize: 15, fontFamily: 'Geist, sans-serif' }}>
        Loading…
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
