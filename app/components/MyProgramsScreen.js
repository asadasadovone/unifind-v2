'use client'
import { useState } from 'react'
import { SiteNav, SiteFooter, useIsMobile } from './SiteChrome'
import MobileMenuDrawer from './MobileMenuDrawer'

function Tag({ label, green }) {
  return (
    <span style={{
      background: green ? 'var(--green-100)' : 'var(--cream-300)',
      color: green ? 'var(--green-800)' : '#55605a',
      fontSize: 11, padding: '4px 8px', borderRadius: 6,
      display: 'inline-flex', gap: 4, alignItems: 'center'
    }}>
      {label}
    </span>
  )
}

function ProgramCard({ uni, tuitionLabel, onOpen, onAskAI }) {
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Thumbnail */}
      <div
        onClick={onOpen}
        style={{ height: 150, background: 'var(--cream-300)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
      >
        <div style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 5px rgba(0,0,0,0.14)', color: 'var(--green-800)', fontSize: 18 }}>
          ♥
        </div>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--ink-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
        </svg>
      </div>

      {/* Body */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p
          onClick={onOpen}
          style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.25, color: 'var(--ink-900)', cursor: 'pointer', margin: 0 }}
        >
          {uni.name}
        </p>
        <p style={{ color: 'var(--green-700)', fontSize: 13, margin: '5px 0 9px', fontWeight: 500 }}>
          {uni.field}
        </p>
        <p style={{ color: 'var(--ink-500)', fontSize: 12.5, marginBottom: 3 }}>
          📍 {uni.city}, {uni.country}
        </p>
        <p style={{ color: 'var(--ink-500)', fontSize: 12.5, marginBottom: 9 }}>
          📅 Starts {uni.startDate}
        </p>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '0 0 14px' }}>
          <Tag label={tuitionLabel} />
          {uni.degree && <Tag label={uni.degree} />}
          <Tag label={uni.language || 'English'} />
          {uni.duration && <Tag label={uni.duration} />}
          {uni.scholarship && <Tag label="Scholarship" green />}
        </div>

        <button
          onClick={onAskAI}
          style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'var(--green-800)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
            <path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z"/>
          </svg>
          Ask AI
        </button>
      </div>
    </div>
  )
}

export default function MyProgramsScreen({
  user, savedPrograms = [], onBack, onOpenUni, onAskAI,
  onMyPrograms, onMyChats, onProfile, onFeedback, onTerms, onPrivacy, onSignOut
}) {
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream-200)', display: 'flex', flexDirection: 'column' }}>
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
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: isMobile ? '22px 16px 48px' : '44px 48px 64px' }}>

          <h1 className="serif" style={{ fontSize: isMobile ? 30 : 44, fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.05, marginBottom: 10 }}>
            My <em className="serif-italic">Programs</em>
          </h1>
          <p style={{ fontSize: isMobile ? 14 : 16, color: 'var(--ink-500)', marginBottom: 6 }}>
            Programs you've saved across all your searches.
          </p>
          {savedPrograms.length > 0 && (
            <p style={{ fontSize: 13, color: 'var(--ink-400)', marginBottom: isMobile ? 20 : 28 }}>
              {savedPrograms.length} saved program{savedPrograms.length !== 1 ? 's' : ''}
            </p>
          )}

          {savedPrograms.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 32px', gap: 16, textAlign: 'center', background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: 48 }}>🎓</div>
              <div className="serif" style={{ fontSize: 24, color: 'var(--green-900)' }}>
                No saved programs <em className="serif-italic">yet</em>
              </div>
              <p style={{ fontSize: 14, color: 'var(--ink-500)', maxWidth: 320, lineHeight: 1.6 }}>
                When you save a program from the search results, it will appear here.
              </p>
              <button
                onClick={onBack}
                style={{ marginTop: 8, padding: '11px 28px', background: 'var(--green-800)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Browse programs
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 16 : 22 }}>
              {savedPrograms.map((uni) => {
                const tuitionLabel = uni.tuition === 0 ? 'Free tuition' : `${uni.tuition?.toLocaleString?.()} USD/yr`
                return (
                  <ProgramCard
                    key={uni.name}
                    uni={uni}
                    tuitionLabel={tuitionLabel}
                    onOpen={() => onOpenUni?.(uni)}
                    onAskAI={() => onAskAI?.(uni)}
                  />
                )
              })}
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
