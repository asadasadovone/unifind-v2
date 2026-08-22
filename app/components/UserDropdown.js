'use client'
import { useState, useRef, useEffect } from 'react'
import { Icon } from './Icons'

export default function UserDropdown({ user, onSignOut, onProfile, onFeedback, onTerms, onPrivacy, dark = false }) {
  const [open, setOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        setHelpOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null

  const initial = (user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()

  if (dark) {
    return (
      <div className="nav-user-dropdown nav-desktop-only" ref={ref} style={{ position: 'relative' }}>
        <button
          onClick={() => { setOpen(o => !o); setHelpOpen(false) }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, background: hovered ? 'rgba(255,255,255,0.1)' : 'transparent',
            border: 'none', borderRadius: 999, padding: '6px 12px 6px 6px', cursor: 'pointer', transition: 'background 0.15s', fontFamily: 'inherit'
          }}
        >
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {initial}
          </div>
          <span style={{ fontSize: 15, fontWeight: 500, color: '#fff' }}>Profile</span>
        </button>

        {open && (
          <div className="nav-user-menu" style={{ right: 0, left: 'auto' }}>
            <button className="nav-user-menu-item" onClick={() => { setOpen(false); onProfile?.() }}>
              <Icon name="person" size={15} /> Profile
            </button>
            <div className="nav-user-menu-parent">
              <button className={`nav-user-menu-item nav-user-menu-item--has-sub ${helpOpen ? 'active' : ''}`} onClick={() => setHelpOpen(h => !h)}>
                <Icon name="help" size={15} /> Help
                <Icon name={helpOpen ? 'chevronUp' : 'chevron'} size={13} style={{ marginLeft: 'auto' }} />
              </button>
              {helpOpen && (
                <div className="nav-user-submenu">
                  <button className="nav-user-menu-item nav-user-menu-item--sub" onClick={() => { setOpen(false); onFeedback?.() }}><Icon name="feedback" size={14} /> Send feedback</button>
                  <button className="nav-user-menu-item nav-user-menu-item--sub" onClick={() => { setOpen(false); onTerms?.() }}><Icon name="doc" size={14} /> Terms of Service</button>
                  <button className="nav-user-menu-item nav-user-menu-item--sub" onClick={() => { setOpen(false); onPrivacy?.() }}><Icon name="shield" size={14} /> Privacy Policy</button>
                </div>
              )}
            </div>
            <div className="nav-user-menu-divider" />
            <button className="nav-user-menu-item nav-user-menu-item--danger" onClick={() => { setOpen(false); onSignOut?.() }}>
              <Icon name="signout" size={15} /> Log out
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="nav-user-dropdown nav-desktop-only" ref={ref}>
      <button className="nav-user-btn" onClick={() => { setOpen(o => !o); setHelpOpen(false) }}>
        <div className="nav-user-avatar">
          {initial}
        </div>
        <span className="nav-user-name">
          {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
        </span>
        <Icon name={open ? 'chevronUp' : 'chevron'} size={14} />
      </button>

      {open && (
        <div className="nav-user-menu">
          <button className="nav-user-menu-item" onClick={() => { setOpen(false); onProfile?.() }}>
            <Icon name="person" size={15} /> Profile
          </button>

          {/* Help with submenu */}
          <div className="nav-user-menu-parent">
            <button
              className={`nav-user-menu-item nav-user-menu-item--has-sub ${helpOpen ? 'active' : ''}`}
              onClick={() => setHelpOpen(h => !h)}
            >
              <Icon name="help" size={15} /> Help
              <Icon name={helpOpen ? 'chevronUp' : 'chevron'} size={13} style={{ marginLeft: 'auto' }} />
            </button>
            {helpOpen && (
              <div className="nav-user-submenu">
                <button className="nav-user-menu-item nav-user-menu-item--sub"
                  onClick={() => { setOpen(false); onFeedback?.() }}>
                  <Icon name="feedback" size={14} /> Send feedback
                </button>
                <button className="nav-user-menu-item nav-user-menu-item--sub"
                  onClick={() => { setOpen(false); onTerms?.() }}>
                  <Icon name="doc" size={14} /> Terms of Service
                </button>
                <button className="nav-user-menu-item nav-user-menu-item--sub"
                  onClick={() => { setOpen(false); onPrivacy?.() }}>
                  <Icon name="shield" size={14} /> Privacy Policy
                </button>
              </div>
            )}
          </div>

          <div className="nav-user-menu-divider" />
          <button
            className="nav-user-menu-item nav-user-menu-item--danger"
            onClick={() => { setOpen(false); onSignOut?.() }}
          >
            <Icon name="signout" size={15} /> Log out
          </button>
        </div>
      )}
    </div>
  )
}
