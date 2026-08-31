'use client'
import { useState } from 'react'
import { SiteNav, SiteFooter, useIsMobile } from './SiteChrome'
import MobileMenuDrawer from './MobileMenuDrawer'

const CATEGORIES = [
  { value: 'bug', label: 'Bug report' },
  { value: 'feature', label: 'Feature request' },
  { value: 'content', label: 'Content issue' },
  { value: 'general', label: 'General feedback' },
]

export default function FeedbackScreen({ user, onBack, onSignOut, onMyPrograms, onMyChats, onProfile, onFeedback, onTerms, onPrivacy }) {
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setCategory('')
    setMessage('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', display: 'flex', flexDirection: 'column' }}>
      <SiteNav
        isMobile={isMobile}
        user={user}
        onOpenAuth={() => {}}
        onSignOut={onSignOut}
        onHome={onBack}
        onMyPrograms={onMyPrograms}
        onMyChats={onMyChats}
        onProfile={onProfile}
        onFeedback={onFeedback}
        onTerms={onTerms}
        onPrivacy={onPrivacy}
        onOpenMenu={() => setMenuOpen(true)}
      />

      <div style={{ flex: 1 }}>
        <div style={{ maxWidth: 940, margin: '0 auto', padding: isMobile ? '24px 16px 48px' : '56px 32px 80px' }}>

          <h1 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 700, color: '#0D2C54', lineHeight: 1.2, marginBottom: 8, letterSpacing: '-0.5px' }}>
            Send Feedback
          </h1>
          <p style={{ fontSize: isMobile ? 14 : 15, color: '#6B7280', marginBottom: isMobile ? 22 : 36 }}>
            We read every message. Help us improve UniAsk.
          </p>

          <form
            onSubmit={handleSubmit}
            style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: isMobile ? 20 : 24, padding: isMobile ? '22px 18px' : 40, display: 'flex', flexDirection: 'column' }}
          >
            {/* Category */}
            <label style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, color: '#0D2C54', marginBottom: isMobile ? 10 : 12 }}>
              Category
            </label>
            <div style={{ position: 'relative', marginBottom: isMobile ? 22 : 28 }}>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
                style={{
                  width: '100%', border: '1px solid #D5D9DE', borderRadius: 12,
                  padding: isMobile ? '15px 44px 15px 16px' : '16px 44px 16px 18px',
                  fontSize: 15, color: category ? '#111' : '#9AA7B4', fontFamily: 'inherit',
                  background: '#fff', appearance: 'none', cursor: 'pointer', outline: 'none',
                }}
              >
                <option value="" disabled>Select a category…</option>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <svg style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6B7280' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m6 9 6 6 6-6"/></svg>
            </div>

            {/* Message */}
            <label style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, color: '#0D2C54', marginBottom: isMobile ? 10 : 12 }}>
              Message
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tell us what's on your mind…"
              required
              style={{
                border: '1px solid #D5D9DE', borderRadius: 12,
                padding: isMobile ? '15px 16px' : '16px 18px',
                fontSize: 15, color: '#111', fontFamily: 'inherit',
                minHeight: isMobile ? 150 : 200, resize: 'vertical', outline: 'none',
              }}
            />

            <button
              type="submit"
              style={{
                marginTop: isMobile ? 22 : 28, alignSelf: isMobile ? 'stretch' : 'flex-start',
                background: '#1668E3', color: '#fff', border: 'none',
                borderRadius: 12, padding: isMobile ? '15px' : '15px 28px',
                fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {submitted ? '✓ Thank you!' : 'Send feedback'}
            </button>
          </form>
        </div>
      </div>

      <SiteFooter
        isMobile={isMobile}
        onHome={onBack}
        onMyPrograms={onMyPrograms}
        onMyChats={onMyChats}
        onTerms={onTerms}
        onPrivacy={onPrivacy}
      />

      {menuOpen && (
        <MobileMenuDrawer
          user={user}
          onClose={() => setMenuOpen(false)}
          onOpenAuth={() => {}}
          onSignOut={() => { setMenuOpen(false); onSignOut?.() }}
          onMyPrograms={() => { setMenuOpen(false); onMyPrograms?.() }}
          onMyChats={() => { setMenuOpen(false); onMyChats?.() }}
          onProfile={() => { setMenuOpen(false); onProfile?.() }}
          onFeedback={() => { setMenuOpen(false); onFeedback?.() }}
          onTerms={() => { setMenuOpen(false); onTerms?.() }}
          onPrivacy={() => { setMenuOpen(false); onPrivacy?.() }}
          onHome={() => { setMenuOpen(false); onBack?.() }}
        />
      )}
    </div>
  )
}
