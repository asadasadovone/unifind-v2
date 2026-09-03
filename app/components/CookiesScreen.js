'use client'
import { useState } from 'react'
import { SiteNav, SiteFooter, useIsMobile } from './SiteChrome'
import MobileMenuDrawer from './MobileMenuDrawer'

const SECTIONS = [
  {
    h: '1. What Cookies Are',
    p: `Cookies are small text files that a website stores on your browser to remember information about your visit — like whether you're signed in, or which filters you last used. This policy also covers local storage and similar technologies (IndexedDB, session storage) that UniAsk uses in the same way.`,
  },
  {
    h: '2. Cookies We Use',
    p: `UniAsk uses a small number of cookies and storage entries, grouped by purpose:

Essential — required for the site to work. These keep you signed in (Supabase authentication tokens), remember your active chat and search filters, and cache your saved programs and chats for offline access. Without them you would be signed out on every page load.

Functional — remember your preferences: the last field of study you searched for, tuition range, degree, and format filters, whether the Help menu is expanded, and the profile details you have entered.

Analytics — currently none. We do not run third-party analytics scripts, tracking pixels, or advertising cookies. If we ever add opt-in analytics we will update this page and ask for your consent first.`,
  },
  {
    h: '3. Third-Party Cookies',
    p: `We embed no advertising or social-media tracking. The only third-party cookies that may appear come from Supabase (our authentication provider) when you sign in, and from Google when you use "Sign in with Google". These are strictly for authentication and no data from them is shared with advertisers.`,
  },
  {
    h: '4. How Long We Keep Them',
    p: `Authentication tokens are refreshed automatically and expire when you sign out or after a period of inactivity set by Supabase. Preference cookies and cached data live in your browser until you clear site data. Nothing is written to disk that persists beyond the browser storage you can inspect and clear yourself.`,
  },
  {
    h: '5. Managing Cookies',
    p: `You can clear UniAsk's cookies and local storage at any time from your browser settings — this will sign you out and reset your local cache, but saved programs and chats are also stored on our servers under your account and will re-sync when you sign in again. You can also block cookies at the browser level, though essential features (signing in, saving programs) will stop working.`,
  },
  {
    h: '6. Do Not Track',
    p: `UniAsk does not currently respond to Do Not Track signals because we do not perform cross-site tracking in the first place. If we ever introduce optional analytics, DNT will be honored automatically.`,
  },
  {
    h: '7. Changes to This Policy',
    p: `We may update this Cookie Policy when we add or change technologies. When we do, we update the "last updated" date above and — for material changes — surface a notice inside the product.`,
  },
  {
    h: '8. Contact',
    p: `Questions about cookies? Reach us at hello@uniask.ai and we'll respond within five business days.`,
  },
]

export default function CookiesScreen({ user, onBack, onSignOut, onMyPrograms, onMyChats, onProfile, onFeedback, onTerms, onPrivacy, onCookies, onContact }) {
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'Geist, sans-serif' }}>
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
        <div style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '24px 16px 48px' : '56px 32px 80px' }}>

          <h1 style={{ fontSize: isMobile ? 32 : 44, fontWeight: 500, color: '#000', lineHeight: 'normal', marginBottom: 8, letterSpacing: '-0.44px' }}>
            Cookie Policy
          </h1>
          <p style={{ fontSize: 14, lineHeight: '22px', color: '#6B7280', marginBottom: isMobile ? 32 : 48 }}>
            Last updated: 15 January 2026
          </p>

          <p style={{ fontSize: 18, lineHeight: '26px', color: '#000', marginBottom: 40 }}>
            This page explains what cookies and browser storage <span style={{ color: '#0162E3' }}>uniask.ai</span> uses, why we need them, and how you can control them. We try to keep the list short — UniAsk uses cookies only where they meaningfully improve the product.
          </p>

          {SECTIONS.map((s) => (
            <section key={s.h} style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 500, color: '#000', lineHeight: 'normal', letterSpacing: '-0.22px', marginBottom: 12 }}>
                {s.h}
              </h2>
              <p style={{ fontSize: 16, lineHeight: '24px', color: '#3A3A35', margin: 0, whiteSpace: 'pre-line' }}>
                {s.p}
              </p>
            </section>
          ))}
        </div>
      </div>

      <SiteFooter
        isMobile={isMobile}
        onHome={onBack}
        onMyPrograms={onMyPrograms}
        onMyChats={onMyChats}
        onTerms={onTerms}
        onPrivacy={onPrivacy}
        onCookies={onCookies}
        onContact={onContact}
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
