'use client'
import { useState, useRef, useEffect } from 'react'
import { Icon, Logo } from './Icons'
import UserDropdown from './UserDropdown'

/* Nav and footer are identical on the landing and results pages, so they live
   here rather than being copied into both and drifting apart. */

/* This screen styles almost everything inline, and inline styles beat media
   queries, so the mobile layout branches in JS instead. 768px matches the
   nav's existing desktop/mobile break. */
export function useIsMobile(query = '(max-width: 768px)') {
  const [is, setIs] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setIs(mq.matches)
    on()
    // Both signals: the media query itself, plus resize as a fallback for
    // environments where the change event does not fire.
    mq.addEventListener('change', on)
    window.addEventListener('resize', on)
    return () => { mq.removeEventListener('change', on); window.removeEventListener('resize', on) }
  }, [query])
  return is
}

export function SiteNav({
  isMobile, user, onOpenAuth, onSignOut, onHome, onMyPrograms, onMyChats,
  onProfile, onFeedback, onTerms, onPrivacy, onOpenMenu,
}) {
  const [showHelp, setShowHelp] = useState(false)
  const helpRef = useRef(null)

  useEffect(() => {
    const close = e => { if (helpRef.current && !helpRef.current.contains(e.target)) setShowHelp(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const setMenuOpen = () => onOpenMenu?.()

  return (
<header style={{ background: '#05203C', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
  <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '16px 30px' : '0 32px', height: isMobile ? 'auto' : 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
    {/* Left — logo (the burger sits on the right on mobile, per Figma) */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {!isMobile && (
        <button className="mobile-burger-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu" style={{ color: '#fff' }}>
          <Icon name="menu" size={22} />
        </button>
      )}
      <Logo size="sm" />
    </div>

    {/* Center nav */}
    <nav className="nav-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
      <button onClick={onHome} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', padding: '8px 14px', borderRadius: 8 }}>Homepage</button>
      <button onClick={onMyPrograms} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', padding: '8px 14px', borderRadius: 8 }}>My Programs</button>
      <button onClick={onMyChats} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', padding: '8px 14px', borderRadius: 8 }}>My Chats</button>
      {/* Help dropdown */}
      <div ref={helpRef} style={{ position: 'relative' }}>
        <button onClick={() => setShowHelp(s => !s)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', padding: '8px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
          Help
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        {showHelp && (
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 200, zIndex: 300, overflow: 'hidden' }}>
            <button onClick={() => { setShowHelp(false); onFeedback?.() }} style={{ display: 'block', width: '100%', padding: '12px 18px', background: 'none', border: 'none', textAlign: 'left', fontSize: 14, color: '#111', cursor: 'pointer', fontFamily: 'inherit' }}>Send feedback</button>
            <button onClick={() => { setShowHelp(false); onTerms?.() }} style={{ display: 'block', width: '100%', padding: '12px 18px', background: 'none', border: 'none', textAlign: 'left', fontSize: 14, color: '#111', cursor: 'pointer', fontFamily: 'inherit' }}>Terms of Service</button>
            <button onClick={() => { setShowHelp(false); onPrivacy?.() }} style={{ display: 'block', width: '100%', padding: '12px 18px', background: 'none', border: 'none', textAlign: 'left', fontSize: 14, color: '#111', cursor: 'pointer', fontFamily: 'inherit' }}>Privacy Policy</button>
          </div>
        )}
      </div>
    </nav>

    {/* Right */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {isMobile ? (
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          style={{ width: 24, height: 24, padding: 0, border: 'none', background: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      ) : user ? (
        <UserDropdown user={user} onSignOut={onSignOut} onProfile={onProfile} onFeedback={onFeedback} onTerms={onTerms} onPrivacy={onPrivacy} dark />
      ) : (
        <>
          <button onClick={() => onOpenAuth?.('login')} style={{ padding: '9px 22px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.5)', background: '#fff', color: '#05203C', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Log in</button>
          <button onClick={() => onOpenAuth?.('register')} style={{ padding: '9px 22px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.5)', background: 'transparent', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Sign up for free</button>
        </>
      )}
    </div>
  </div>
  <style>{`.mobile-burger-btn { display: none !important; } @media (max-width: 768px) { .mobile-burger-btn { display: flex !important; } }`}</style>
</header>

  )
}

export function SiteFooter({ isMobile, onHome, onMyPrograms, onMyChats, onTerms, onPrivacy }) {
  return (
<footer style={{ background: '#05203C', padding: isMobile ? '40px 16px 24px' : '80px 48px 32px', color: '#fff', overflow: 'hidden' }}>
  <div style={{ maxWidth: 1400, margin: '0 auto' }}>
    {/* Top row: description (left) + nav+social (right) */}
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: isMobile ? 24 : 40, marginBottom: isMobile ? 16 : 24, flexWrap: 'wrap' }}>
      <p style={{ fontSize: isMobile ? 16 : 14, color: isMobile ? 'rgba(233,240,243,0.8)' : 'rgba(255,255,255,0.55)', lineHeight: isMobile ? '24px' : 1.7, margin: 0, maxWidth: isMobile ? '100%' : 520 }}>
        University research is broken. Students spend weeks across dozens of tabs — and still miss the best options. UniAsk fixes that. Describe your goals, and our AI finds, ranks, and explains the right programs for you. Free for every student. Always.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'flex-end', gap: 24, width: isMobile ? '100%' : 'auto' }}>
        <nav style={{ display: 'flex', gap: isMobile ? 24 : 40, flexWrap: 'wrap' }}>
          <button onClick={onHome} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Home</button>
          <button onClick={onMyPrograms} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>My Programs</button>
          <button onClick={onMyChats} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>My Chats</button>
          <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Contact Us</button>
        </nav>
        <div style={{ display: 'flex', gap: isMobile ? 6 : 8, flexWrap: 'wrap' }}>
          {[
            { label: 'Instagram', d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z' },
            { label: 'Facebook', d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
            { label: 'TikTok', d: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.03-8.49a8.18 8.18 0 0 0 4.79 1.52V5.01a4.85 4.85 0 0 1-1-.32z' },
            { label: 'X', d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
          ].map(({ label, d }) => (
            <div key={label} title={label} style={{ width: 32, height: 32, borderRadius: '50%', background: '#0162E3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d={d} /></svg>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Watermark — gradient silver text */}
    <div style={{ position: 'relative', margin: isMobile ? '16px 0 24px' : '20px 0 32px', textAlign: isMobile ? 'left' : 'center', overflow: 'hidden' }}>
      <div
        style={{
          fontSize: isMobile ? 90 : 'clamp(90px, 17vw, 260px)',
          fontWeight: isMobile ? 500 : 800,
          lineHeight: isMobile ? 'normal' : 0.95,
          letterSpacing: isMobile ? 0 : '-0.04em',
          fontFamily: 'Geist, sans-serif',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          background: isMobile
            ? 'linear-gradient(180deg, #f0f0f0 0%, #041a30 80%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.32) 30%, rgba(5,32,60,0.85) 85%, rgba(5,32,60,1) 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          margin: 0,
        }}
      >
        UniAsk AI
      </div>
    </div>

    {/* Bottom bar */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <button onClick={onPrivacy} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Privacy Policy</button>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
        <button onClick={onTerms} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Terms</button>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
        <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Cookies</button>
      </div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>© 2025 UniAsk · Built for students, by people who remember the struggle.</div>
    </div>
  </div>
</footer>

  )
}
