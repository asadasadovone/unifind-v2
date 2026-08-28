'use client'
import { useState } from 'react'
import { SiteNav, SiteFooter, useIsMobile } from './SiteChrome'
import MobileMenuDrawer from './MobileMenuDrawer'

function Tag({ icon, label }) {
  return (
    <span style={{
      background: '#F5F5F5', color: '#374151',
      fontSize: 12, padding: '4px 10px', borderRadius: 999,
      display: 'inline-flex', gap: 5, alignItems: 'center', border: '1px solid #EAEAEA'
    }}>
      {icon && <span style={{ color: '#6B7280', display: 'flex' }}>{icon}</span>}
      {label}
    </span>
  )
}

function I({ d, size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  )
}

const iconMap = {
  cash: <I d={<><circle cx="12" cy="12" r="10"/><path d="M12 6v12M15 9.5A2.5 2.5 0 0 0 12.5 7h-1a2.5 2.5 0 0 0 0 5h1a2.5 2.5 0 0 1 0 5h-1A2.5 2.5 0 0 1 9 14.5"/></>} />,
  cap: <I d={<><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>} />,
  lang: <I d={<><path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/></>} />,
  clock: <I d={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>} />,
  pin: <I d={<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></>} />,
  cal: <I d={<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>} />,
  building: <I size={40} d={<><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22V12h6v10M9 6h1M9 10h1M14 6h1M14 10h1"/></>} />,
  heart: <I size={18} d={<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>} />,
  sparkle: <I size={14} d={<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>} />,
}

function ProgramCard({ uni, tuitionLabel, onOpen, onAskAI, onUnsave }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E8E8E8', borderRadius: 16,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      transition: 'box-shadow 0.15s, transform 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Thumbnail */}
      <div
        onClick={onOpen}
        style={{ height: 160, background: 'linear-gradient(135deg,#EEF2F7,#DDE4EC)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: '#B8C1CB' }}
      >
        <button
          onClick={e => { e.stopPropagation(); onUnsave?.() }}
          style={{ position: 'absolute', top: 12, right: 12, width: 38, height: 38, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.12)', color: '#1668E3', border: 'none', cursor: 'pointer' }}
          aria-label="Remove from saved"
        >
          {iconMap.heart}
        </button>
        {iconMap.building}
      </div>

      {/* Body */}
      <div style={{ padding: '18px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p
          onClick={onOpen}
          style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.3, color: '#0D2C54', cursor: 'pointer', margin: 0 }}
        >
          {uni.name}
        </p>
        <p style={{ color: '#1668E3', fontSize: 13, margin: '6px 0 12px', fontWeight: 500 }}>
          {uni.field}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13, marginBottom: 4 }}>
          <span style={{ display: 'flex' }}>{iconMap.pin}</span>
          {uni.city}, {uni.country}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13, marginBottom: 12 }}>
          <span style={{ display: 'flex' }}>{iconMap.cal}</span>
          Starts {uni.startDate}
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          <Tag icon={iconMap.cash} label={tuitionLabel} />
          {uni.degree && <Tag icon={iconMap.cap} label={uni.degree} />}
          <Tag icon={iconMap.lang} label={uni.language || 'English'} />
          {uni.duration && <Tag icon={iconMap.clock} label={uni.duration} />}
        </div>

        <button
          onClick={onAskAI}
          style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: '#1668E3', color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}
        >
          {iconMap.sparkle}
          Ask AI
        </button>
      </div>
    </div>
  )
}

export default function MyProgramsScreen({
  user, savedPrograms = [], onBack, onOpenUni, onAskAI, onUnsave,
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
            My Programs
          </h1>
          <p style={{ fontSize: isMobile ? 14 : 15, color: '#6B7280', marginBottom: 4 }}>
            Programs you've saved across all your searches.
          </p>
          {savedPrograms.length > 0 && (
            <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: isMobile ? 20 : 28 }}>
              {savedPrograms.length} saved program{savedPrograms.length !== 1 ? 's' : ''}
            </p>
          )}
          {savedPrograms.length === 0 && <div style={{ marginBottom: 28 }} />}

          {savedPrograms.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 32px', gap: 16, textAlign: 'center', background: '#fff', borderRadius: 16, border: '1px solid #E8E8E8' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#EBF2FE', color: '#1668E3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <I size={28} d={<><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0D2C54' }}>
                No saved programs yet
              </div>
              <p style={{ fontSize: 14, color: '#6B7280', maxWidth: 320, lineHeight: 1.6 }}>
                When you save a program from the search results, it will appear here.
              </p>
              <button
                onClick={onBack}
                style={{ marginTop: 8, padding: '12px 28px', background: '#1668E3', color: '#fff', border: 'none', borderRadius: 22, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Browse programs
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: isMobile ? 16 : 22 }}>
              {savedPrograms.map((uni) => {
                const tuitionLabel = uni.tuition === 0 ? 'Free tuition' : (typeof uni.tuition === 'number' ? `${uni.tuition.toLocaleString()} USD/yr` : (uni.tuition || 'Contact university'))
                return (
                  <ProgramCard
                    key={uni.name}
                    uni={uni}
                    tuitionLabel={tuitionLabel}
                    onOpen={() => onOpenUni?.(uni)}
                    onAskAI={() => onAskAI?.(uni)}
                    onUnsave={() => onUnsave?.(uni)}
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
