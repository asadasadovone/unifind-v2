'use client'
import { useState } from 'react'
import { SiteNav, SiteFooter, useIsMobile } from './SiteChrome'
import MobileMenuDrawer from './MobileMenuDrawer'

const CATEGORIES = [
  { value: 'general', label: 'General inquiry' },
  { value: 'support', label: 'Product support' },
  { value: 'partnership', label: 'Partnership / university' },
  { value: 'press', label: 'Press & media' },
  { value: 'legal', label: 'Legal or privacy request' },
]

function ChannelCard({ title, description, action, href, onClick, isMobile }) {
  const clickable = !!(href || onClick)
  const Wrap = href ? 'a' : onClick ? 'button' : 'div'
  const props = href
    ? { href, target: href.startsWith('mailto') ? undefined : '_blank', rel: 'noopener noreferrer' }
    : onClick
      ? { type: 'button', onClick }
      : {}
  return (
    <Wrap
      {...props}
      style={{
        display: 'block', padding: isMobile ? '20px' : '24px',
        border: '1px solid #E8E8E8', borderRadius: 16, background: '#fff',
        textDecoration: 'none', color: 'inherit', textAlign: 'left', fontFamily: 'inherit',
        cursor: clickable ? 'pointer' : 'default', width: '100%',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#0162E3'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(1,98,227,0.08)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E8E8'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <p style={{ fontSize: isMobile ? 17 : 18, fontWeight: 500, color: '#000', letterSpacing: '-0.22px', margin: '0 0 6px' }}>{title}</p>
      <p style={{ fontSize: 15, lineHeight: '22px', color: '#3A3A35', margin: '0 0 12px' }}>{description}</p>
      <span style={{ fontSize: 14, color: '#0162E3', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {action}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </span>
    </Wrap>
  )
}

export default function ContactScreen({ user, onBack, onSignOut, onMyPrograms, onMyChats, onProfile, onFeedback, onTerms, onPrivacy, onCookies, onContact }) {
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)
  const [category, setCategory] = useState('general')
  const [name, setName] = useState(user?.user_metadata?.full_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    // Best-effort mailto compose so the user always has a way out even
    // before a real form backend is wired up.
    const subject = encodeURIComponent(`[UniAsk / ${CATEGORIES.find(c => c.value === category)?.label}] ${name || 'Contact'}`)
    const body = encodeURIComponent(`${message}\n\n—\n${name || ''}${email ? `\n${email}` : ''}`)
    window.location.href = `mailto:hello@uniask.ai?subject=${subject}&body=${body}`
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'Geist, sans-serif' }}>
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

          <h1 style={{ fontSize: isMobile ? 32 : 44, fontWeight: 500, color: '#000', lineHeight: 'normal', marginBottom: 12, letterSpacing: '-0.44px' }}>
            Contact us
          </h1>
          <p style={{ fontSize: 18, lineHeight: '26px', color: '#3A3A35', marginBottom: isMobile ? 32 : 48, maxWidth: 640 }}>
            We read every message. Whether you found a bug, want to partner with UniAsk, or just have a question about a program — reach out and we'll get back to you within five business days.
          </p>

          {/* Quick channels */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16, marginBottom: isMobile ? 40 : 56 }}>
            <ChannelCard
              isMobile={isMobile}
              title="Email us"
              description="The fastest way to reach the team. We reply within a few business days."
              action="hello@uniask.ai"
              href="mailto:hello@uniask.ai"
            />
            <ChannelCard
              isMobile={isMobile}
              title="Send feedback in-app"
              description="Report a bug or share what you'd like to see next. Straight into our roadmap."
              action="Open feedback"
              onClick={onFeedback}
            />
            <ChannelCard
              isMobile={isMobile}
              title="Follow us"
              description="Product updates, new features, and universities we've just added."
              action="Instagram · X · TikTok"
              href="https://instagram.com/uniask.ai"
            />
          </div>

          {/* Full form */}
          <h2 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 500, color: '#000', letterSpacing: '-0.28px', marginBottom: isMobile ? 20 : 24 }}>
            Send us a message
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 16 : 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, lineHeight: '22px', color: '#3A3A35', marginBottom: 8 }}>Your name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Full name"
                  style={{ width: '100%', border: '1px solid #D5D9DE', borderRadius: 12, padding: '14px 16px', fontSize: 16, lineHeight: '24px', color: '#000', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, lineHeight: '22px', color: '#3A3A35', marginBottom: 8 }}>Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ width: '100%', border: '1px solid #D5D9DE', borderRadius: 12, padding: '14px 16px', fontSize: 16, lineHeight: '24px', color: '#000', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, lineHeight: '22px', color: '#3A3A35', marginBottom: 8 }}>Topic</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{ width: '100%', border: '1px solid #D5D9DE', borderRadius: 12, padding: '14px 44px 14px 16px', fontSize: 16, lineHeight: '24px', color: '#000', fontFamily: 'inherit', background: '#fff', appearance: 'none', cursor: 'pointer', outline: 'none', boxSizing: 'border-box' }}
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <svg style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6B7280' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, lineHeight: '22px', color: '#3A3A35', marginBottom: 8 }}>Message</label>
              <textarea
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind…"
                style={{ width: '100%', border: '1px solid #D5D9DE', borderRadius: 12, padding: '14px 16px', fontSize: 16, lineHeight: '24px', color: '#000', fontFamily: 'inherit', minHeight: isMobile ? 160 : 200, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{ alignSelf: isMobile ? 'stretch' : 'flex-start', background: '#0162E3', color: '#fff', border: 'none', borderRadius: 12, padding: isMobile ? '15px' : '15px 32px', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {submitted ? '✓ Opening your email…' : 'Send message'}
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
        onCookies={onCookies}
        onContact={onContact}
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
