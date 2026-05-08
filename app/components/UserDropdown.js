'use client'
import { useState, useRef, useEffect } from 'react'
import { Icon } from './Icons'

export default function UserDropdown({ user, onSignOut }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null

  return (
    <div className="nav-user-dropdown" ref={ref}>
      <button className="nav-user-btn" onClick={() => setOpen(o => !o)}>
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
          <button className="nav-user-menu-item">
            <Icon name="person" size={15} /> Profile
          </button>
          <button className="nav-user-menu-item">
            <Icon name="settings" size={15} /> Settings
          </button>
          <button className="nav-user-menu-item">
            <Icon name="help" size={15} /> Help
          </button>
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
