'use client'
import { useState, useEffect } from 'react'
import SearchScreen from './components/SearchScreen'
import ResultsScreen from './components/ResultsScreen'
import DetailScreen from './components/DetailScreen'
import AuthModal from './components/AuthModal'

const DEFAULT_FILTERS = {
  field: 'Computer Science',
  country: 'European Union',
  startDate: '2026-09',
  tuition: [0, 8000],
  format: ['Full-time'],
  attendance: ['On-campus'],
  degree: ['Master'],
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
  const [toast, setToast] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [apiResults, setApiResults] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  const handleSearch = async () => {
    setScreen('results')
    setIsLoading(true)
    setApiResults(null)

    const prompt = `Find 6 real universities matching: field="${filters.field || 'any field'}", country="${filters.country || 'any country'}", tuition ${filters.tuition[0]}-${filters.tuition[1]} AZN/year, format="${filters.format.join(' or ') || 'any'}", attendance="${filters.attendance.join(' or ') || 'any'}", degree="${filters.degree.join(' or ') || 'any'}".
Reply ONLY with a valid JSON array, no markdown, no explanation:
[{"name":"...","country":"...","city":"...","tuition":NUMBER,"degree":"...","attendance":"...","language":"...","duration":"...","startDate":"Sep/Oct 2026","scholarship":true/false,"field":"...","blurb":"one sentence about this university"}]`

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      if (!res.ok) throw new Error('API error')
      const text = data.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(text)
      setApiResults(Array.isArray(parsed) ? parsed : null)
    } catch {
      setApiResults(null)
    } finally {
      setIsLoading(false)
    }
  }

  const openUni = (uni, prompt = null) => {
    setActiveUni(uni)
    setInitialChatPrompt(prompt)
    setScreen('detail')
  }

  const submitAuth = () => {
    setAuthMode(null)
    showToast('✓ Welcome to UniFind')
  }

  return (
    <>
      {screen === 'search' && (
        <SearchScreen
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onOpenAuth={setAuthMode}
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
          apiResults={apiResults}
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
        />
      )}

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onMode={setAuthMode}
          onSubmit={submitAuth}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
