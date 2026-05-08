'use client'
import { useState, useEffect } from 'react'
import DetailScreen from '../components/DetailScreen'
import { supabase } from '../lib/supabase'

export default function ProgramPage() {
  const [uni, setUni] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Load uni data from localStorage
    try {
      const stored = localStorage.getItem('unifind_active_uni')
      if (stored) setUni(JSON.parse(stored))
    } catch {
      // ignore parse errors
    }

    // Load current user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

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

  return <DetailScreen uni={uni} onBack={() => window.close()} user={user} />
}
