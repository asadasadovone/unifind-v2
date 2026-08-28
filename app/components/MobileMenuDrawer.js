'use client'
import { useState } from 'react'
import { Logo } from './Icons'

function ChevronIcon({ up }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d={up ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"}/>
    </svg>
  )
}

export default function MobileMenuDrawer({ user, onClose, onOpenAuth, onSignOut, onMyPrograms, onMyChats, onProfile, onFeedback, onTerms, onPrivacy, onHome }) {
  const [helpOpen, setHelpOpen] = useState(false)

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const initials = displayName ? displayName[0].toUpperCase() : 'U'

  const navBtn = (label, onClick) => (
    <button
      onClick={() => { onClose(); onClick?.() }}
      style={{ display: 'block', width: '100%', padding: '11px 4px', fontSize: 15, fontFamily: 'inherit', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#1a1a1a' }}
    >
      {label}
    </button>
  )

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex' }}>
      {/* Drawer panel */}
      <div onClick={e => e.stopPropagation()} style={{ width: 288, background: '#fff', height: '100%', display: 'flex', flexDirection: 'column', padding: '14px 16px 16px', overflowY: 'auto' }}>

        {/* Logo + close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Logo size="sm" color="#05203C" onClick={() => { onClose(); onHome?.() }} />
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#6B7280', display: 'flex', alignItems: 'center' }}
            aria-label="Close menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Nav */}
        <div style={{ flex: 1 }}>
          {navBtn('Homepage', onHome)}
          {navBtn('My Programs', user ? onMyPrograms : () => onOpenAuth?.('save-programs'))}
          {navBtn('My Chats', user ? onMyChats : () => onOpenAuth?.('save-chats'))}

          {/* Help — same style as other nav items, expands below */}
          <button
            onClick={() => setHelpOpen(h => !h)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '11px 4px', fontSize: 15, fontFamily: 'inherit', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#1a1a1a' }}
          >
            <span>Help</span>
            <ChevronIcon up={helpOpen} />
          </button>
          {helpOpen && (
            <div style={{ paddingLeft: 8, marginBottom: 4 }}>
              <HelpRow label="Send Feedback" onClick={() => { onClose(); onFeedback?.() }} />
              <HelpRow label="Terms of Service" onClick={() => { onClose(); onTerms?.() }} />
              <HelpRow label="Privacy Policy" onClick={() => { onClose(); onPrivacy?.() }} />
            </div>
          )}

          {/* Login CTA (logged out) */}
          {!user && (
            <div style={{ marginTop: 20, padding: '16px', background: '#F4F4F4', borderRadius: 12 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', margin: '0 0 4px' }}>Get personalized results</p>
              <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 12px' }}>Save searches and unlock your fit score.</p>
              <button
                onClick={() => { onClose(); onOpenAuth?.('login') }}
                style={{ width: '100%', padding: '12px', background: '#1668E3', color: '#fff', border: 'none', borderRadius: 22, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Log in
              </button>
            </div>
          )}
        </div>

        {/* Bottom: avatar+name → Profile, logout icon */}
        {user && (
          <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.1)', paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => { onClose(); onProfile?.() }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
            >
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#0D2C54', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
                {initials}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>{displayName}</span>
            </button>
            <button
              onClick={() => { onClose(); onSignOut?.() }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#6B7280', display: 'flex', alignItems: 'center' }}
              title="Log out"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* Dark overlay */}
      <div style={{ flex: 1, background: 'rgba(13,44,84,0.4)' }} />
    </div>
  )
}

function HelpRow({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ display: 'block', width: '100%', padding: '9px 4px', fontSize: 14, fontFamily: 'inherit', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#4B5563' }}
    >
      {label}
    </button>
  )
}
