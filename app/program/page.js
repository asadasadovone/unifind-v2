'use client'
import { useState, useEffect } from 'react'
import DetailScreen from '../components/DetailScreen'

export default function ProgramPage() {
  const [uni, setUni] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('unifind_active_uni')
      if (stored) setUni(JSON.parse(stored))
    } catch {
      // ignore parse errors
    }
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

  return <DetailScreen uni={uni} onBack={() => window.close()} />
}
