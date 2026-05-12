'use client'
import { useState, useEffect } from 'react'
import DetailScreen from '../components/DetailScreen'
import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'unifind_saved_chats'

function loadSavedChats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function persistSavedChats(chats) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(chats)) } catch {}
}

export default function ProgramPage() {
  const [uni, setUni] = useState(null)
  const [user, setUser] = useState(null)
  const [savedChats, setSavedChats] = useState([])
  const [toast, setToast] = useState(null)

  useEffect(() => {
    // Load uni data from localStorage
    try {
      const stored = localStorage.getItem('unifind_active_uni')
      if (stored) setUni(JSON.parse(stored))
    } catch {}

    // Load saved chats from localStorage
    setSavedChats(loadSavedChats())

    // Load current user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  const handleSaveChat = ({ uni, messages }) => {
    const current = loadSavedChats()
    const exists = current.find(c => c.uni.name === uni.name)
    if (exists) {
      showToast('Chat already saved')
      return
    }
    const updated = [...current, { id: Date.now(), uni, messages, savedAt: new Date().toISOString() }]
    persistSavedChats(updated)
    setSavedChats(updated)
    showToast('✓ Chat saved to My Chats')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.close()
  }

  if (!uni) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'var(--cream-200)', color: 'var(--ink-500)',
        fontSize: 15, fontFamily: 'inherit'
      }}>
        Loading…
      </div>
    )
  }

  const isChatSaved = savedChats.some(c => c.uni.name === uni.name)

  return (
    <>
      <DetailScreen
        uni={uni}
        onBack={() => window.close()}
        user={user}
        onSignOut={handleSignOut}
        onOpenAuth={() => {}}
        onMyPrograms={() => window.open('/', '_self')}
        onMyChats={() => window.open('/', '_self')}
        onSaveChat={handleSaveChat}
        isChatSaved={isChatSaved}
      />
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
