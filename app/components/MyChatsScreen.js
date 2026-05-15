'use client'
import { Icon, Logo } from './Icons'
import UserDropdown from './UserDropdown'

export default function MyChatsScreen({ user, savedChats = [], onBack, onOpenChat, onMyPrograms, onMyChats, onProfile, onFeedback, onTerms, onPrivacy, onSignOut }) {
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
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 32px' }}>
        <h2 className="serif" style={{ fontSize: 36, color: 'var(--green-900)', lineHeight: 1.1 }}>
          My <span className="serif-italic">Chats</span>
        </h2>
        <p className="muted" style={{ marginTop: 8, fontSize: 14 }}>
          Saved AI conversations about university programs.
        </p>

        <div style={{ marginTop: 32 }}>
          {savedChats.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '80px 32px', gap: 16, textAlign: 'center',
              background: 'var(--white)', borderRadius: 'var(--r-lg)',
              border: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: 48 }}>💬</div>
              <div className="serif" style={{ fontSize: 24, color: 'var(--green-900)' }}>
                No saved chats <span className="serif-italic">yet</span>
              </div>
              <p className="muted" style={{ fontSize: 14, maxWidth: 320, lineHeight: 1.6 }}>
                Open a program and click "Save chat" to save your AI conversation here.
              </p>
              <button className="btn btn-primary" onClick={onBack} style={{ marginTop: 8 }}>
                <Icon name="search" size={14} /> Browse programs
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {savedChats.map((chat) => {
                const lastMsg = [...chat.messages].reverse().find(m => m.role === 'ai')
                const preview = lastMsg?.text?.replace(/\*\*/g, '').slice(0, 120) + '…'
                const date = new Date(chat.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                return (
                  <article
                    key={chat.id}
                    className="my-chat-card"
                    onClick={() => onOpenChat?.(chat)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="my-chat-card-header">
                      <div>
                        <div className="serif" style={{ fontSize: 18, color: 'var(--green-900)', fontWeight: 600 }}>
                          {chat.uni.name}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Icon name="tag" size={11} />
                          <span style={{ color: 'var(--green-700)', fontWeight: 500 }}>{chat.uni.field}</span>
                          <span>·</span>
                          <Icon name="pin" size={11} />
                          {chat.uni.city}, {chat.uni.country}
                          <span>·</span>
                          {date}
                        </div>
                      </div>
                    </div>
                    {preview && (
                      <p className="my-chat-card-preview">{preview}</p>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
