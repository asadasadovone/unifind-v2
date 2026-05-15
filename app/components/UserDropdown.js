'use client'
import { useState, useRef, useEffect } from 'react'
import { Icon } from './Icons'

export default function UserDropdown({ user, onSignOut, onProfile, onFeedback, onTerms, onPrivacy }) {
  const [open, setOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
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

  return (
    <div className="nav-user-dropdown nav-desktop-only" ref={ref}>
      <button className="nav-user-btn" onClick={() => { setOpen(o => !o); setHelpOpen(false) }}>
        <div className="nav-user-avatar">
          {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
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
