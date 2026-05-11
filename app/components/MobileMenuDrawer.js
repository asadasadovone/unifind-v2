'use client'
import { useState } from 'react'
import { Icon, Logo } from './Icons'

export default function MobileMenuDrawer({ user, onClose, onOpenAuth, onSignOut, onMyPrograms, onMyChats }) {
  const [helpOpen, setHelpOpen] = useState(false)

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const initials = displayName ? displayName[0].toUpperCase() : 'U'

  return (
    <>
      <div className="mobile-menu-overlay" onClick={onClose} />
      <div className="mobile-menu-drawer">

        {/* Header row */}
        <div className="mobile-menu-header">
          <Logo size="sm" />
          <button className="mobile-menu-close" onClick={onClose} aria-label="Close menu">
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* User info block (logged-in only) */}
        {user && (
          <div className="mobile-menu-user">
            <div className="mobile-menu-avatar">{initials}</div>
            <div className="mobile-menu-user-info">
              <div className="mobile-menu-user-name">{displayName}</div>
              <div className="mobile-menu-user-email">{user.email}</div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="mobile-menu-nav">
          {/* My Programs */}
          <button
            className="mobile-menu-item"
            onClick={() => { onClose(); user ? onMyPrograms?.() : onOpenAuth?.('save-programs') }}
          >
            <span className="mobile-menu-item-icon"><Icon name="heart" size={17} /></span>
            My Programs
          </button>

          {/* My Chats */}
          <button
            className="mobile-menu-item"
            onClick={() => { onClose(); user ? onMyChats?.() : onOpenAuth?.('save-chats') }}
          >
            <span className="mobile-menu-item-icon"><Icon name="sparkle" size={17} /></span>
            My Chats
          </button>

          {user && (
            <>
              <div className="mobile-menu-divider" />
              <button className="mobile-menu-item">
                <span className="mobile-menu-item-icon"><Icon name="person" size={17} /></span>
                Profile
              </button>
              <button className="mobile-menu-item">
                <span className="mobile-menu-item-icon"><Icon name="settings" size={17} /></span>
                Settings
              </button>
            </>
          )}

          {/* Help accordion */}
          <div>
            <button
              className="mobile-menu-item"
              onClick={() => setHelpOpen(h => !h)}
            >
              <span className="mobile-menu-item-icon"><Icon name="help" size={17} /></span>
              Help
              <span className="mobile-menu-item-arrow">
                <Icon name={helpOpen ? 'chevronUp' : 'chevron'} size={15} />
              </span>
            </button>
            {helpOpen && (
              <div className="mobile-menu-sub">
                <button className="mobile-menu-subitem">FAQs</button>
                <button className="mobile-menu-subitem">Terms of Service</button>
                <button className="mobile-menu-subitem">Privacy Policy</button>
                <button className="mobile-menu-subitem">Report a bug</button>
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="mobile-menu-footer">
          {user ? (
            <button className="mobile-menu-logout" onClick={() => { onClose(); onSignOut?.() }}>
              <Icon name="signout" size={16} />
              Log out
            </button>
          ) : (
            <div className="mobile-menu-auth-cta">
              <div className="mobile-menu-auth-text">
                <div className="mobile-menu-auth-title">Get personalized results</div>
                <div className="mobile-menu-auth-sub">Save searches and unlock your fit score.</div>
              </div>
              <button
                className="zap-btn zap-btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: 15 }}
                onClick={() => { onClose(); onOpenAuth?.('login') }}
              >
                Log in
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  )
}
