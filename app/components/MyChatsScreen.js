'use client'
import { useState } from 'react'
import { SiteNav, SiteFooter, useIsMobile } from './SiteChrome'
import MobileMenuDrawer from './MobileMenuDrawer'

function I({ d, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  )
}

const icons = {
  building: <I size={22} d={<><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22V12h6v10M9 6h1M9 10h1M14 6h1M14 10h1"/></>} />,
  heart: <I size={18} d={<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>} />,
  msg: <I size={13} d={<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>} />,
  arrow: <I size={13} d={<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>} />,
  chat: <I size={28} d={<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>} />,
}

function timeAgo(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const ms = Date.now() - d.getTime()
  const m = Math.floor(ms / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const days = Math.floor(h / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  const w = Math.floor(days / 7)
  if (w < 4) return `${w}w ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function ChatCard({ chat, onOpen, onUnsave }) {
  const lastUser = [...(chat.messages || [])].reverse().find(m => m.role === 'user')
  const preview = lastUser?.text?.slice(0, 140) || 'Start a conversation…'
  const msgCount = (chat.messages || []).length
  const when = timeAgo(chat.savedAt)

  return (
    <div
      onClick={onOpen}
      style={{
        background: '#fff', border: '1px solid #E8E8E8', borderRadius: 16,
        padding: 18, cursor: 'pointer', transition: 'box-shadow 0.15s',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.06)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Top */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EBF2FE', color: '#1668E3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icons.building}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3, color: '#0D2C54', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {chat.uni.name}
          </p>
          <p style={{ color: '#1668E3', fontSize: 13, marginTop: 3, fontWeight: 500 }}>
            {chat.uni.field}
          </p>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onUnsave?.() }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#1668E3', display: 'flex', flexShrink: 0 }}
          title="Remove from saved"
        >
          {icons.heart}
        </button>
      </div>

      {/* Preview */}
      <p style={{ fontSize: 13.5, color: '#4B5563', lineHeight: 1.55, margin: '14px 0 16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        <span style={{ color: '#9CA3AF', marginRight: 4 }}>You:</span>{preview}
      </p>

      {/* Footer */}
      <div style={{ borderTop: '0.5px solid #E8E8E8', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ fontSize: 12.5, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 5 }}>
          {icons.msg}
          {msgCount} message{msgCount !== 1 ? 's' : ''} · {when}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1668E3', display: 'flex', alignItems: 'center', gap: 5 }}>
          Continue {icons.arrow}
        </span>
      </div>
    </div>
  )
}

export default function MyChatsScreen({
  user, savedChats = [], onBack, onOpenChat, onUnsaveChat,
  onMyPrograms, onMyChats, onProfile, onFeedback, onTerms, onPrivacy, onSignOut
}) {
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)

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
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: isMobile ? '24px 16px 48px' : '44px 32px 64px' }}>

          <h1 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 700, color: '#0D2C54', lineHeight: 1.2, marginBottom: 8, letterSpacing: '-0.5px' }}>
            My Chats
          </h1>
          <p style={{ fontSize: isMobile ? 14 : 15, color: '#6B7280', marginBottom: 4 }}>
            Saved AI conversations about university programs.
          </p>
          {savedChats.length > 0 && (
            <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: isMobile ? 20 : 28 }}>
              {savedChats.length} saved chat{savedChats.length !== 1 ? 's' : ''}
            </p>
          )}
          {savedChats.length === 0 && <div style={{ marginBottom: 28 }} />}

          {savedChats.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 32px', gap: 16, textAlign: 'center', background: '#fff', borderRadius: 16, border: '1px solid #E8E8E8' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#EBF2FE', color: '#1668E3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icons.chat}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0D2C54' }}>
                No saved chats yet
              </div>
              <p style={{ fontSize: 14, color: '#6B7280', maxWidth: 340, lineHeight: 1.6 }}>
                Ask AI about any program and the conversation is kept here automatically, ready to pick up later.
              </p>
              <button
                onClick={onBack}
                style={{ marginTop: 8, padding: '12px 28px', background: '#1668E3', color: '#fff', border: 'none', borderRadius: 22, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Browse programs
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(420px, 1fr))', gap: isMobile ? 14 : 22 }}>
              {savedChats.map((chat) => (
                <ChatCard
                  key={chat.id}
                  chat={chat}
                  onOpen={() => onOpenChat?.(chat)}
                  onUnsave={() => onUnsaveChat?.(chat)}
                />
              ))}
            </div>
          )}
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
