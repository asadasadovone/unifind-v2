'use client'
import { useState } from 'react'
import { Icon, Logo } from './Icons'
import UserDropdown from './UserDropdown'
import MobileMenuDrawer from './MobileMenuDrawer'

export default function FeedbackScreen({ user, onBack, onSignOut, onMyPrograms, onMyChats,  onProfile, onFeedback, onTerms, onPrivacy }) {
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
    <div className="results-screen">
      <header className="results-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Logo size="sm" onClick={onBack} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="zap-nav-link nav-desktop-only" onClick={onMyPrograms}>
            <Icon name="heart" size={14} /> My Programs
          </button>
          <button className="zap-nav-link nav-desktop-only" onClick={onMyChats}>
            <Icon name="sparkle" size={14} /> My Chats
          </button>
          <UserDropdown user={user} onSignOut={onSignOut} onProfile={onProfile} onFeedback={onFeedback} onTerms={onTerms} onPrivacy={onPrivacy} />
          <button
            className="mobile-menu-burger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Icon name="menu" size={22} />
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 32px' }}>
        <h2 className="serif" style={{ fontSize: 36, color: 'var(--green-900)', lineHeight: 1.1 }}>
          Send <span className="serif-italic">Feedback</span>
        </h2>
        <p className="muted" style={{ marginTop: 8, fontSize: 14 }}>
          We read every message. Help us improve UniFind.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: 32,
            background: 'var(--white)',
            borderRadius: 'var(--r-lg)',
            border: '1px solid var(--border)',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-700)' }}>Category</label>
            <select
              className="select"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>Select a category…</option>
              <option value="bug">Bug report</option>
              <option value="feature">Feature request</option>
              <option value="content">Content issue</option>
              <option value="general">General feedback</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-700)' }}>Message</label>
            <textarea
              className="input"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tell us what's on your mind…"
              required
              style={{ minHeight: 120, resize: 'vertical' }}
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            style={{ alignSelf: 'flex-start' }}
          >
            {submitted ? '✓ Thank you!' : 'Send feedback'}
          </button>
        </form>
      </div>

      {menuOpen && (
        <MobileMenuDrawer
          user={user}
          onClose={() => setMenuOpen(false)}
          onSignOut={onSignOut}
          onMyPrograms={onMyPrograms}
          onMyChats={onMyChats}
          onProfile={onProfile}
        />
      )}
    </div>
  )
}
