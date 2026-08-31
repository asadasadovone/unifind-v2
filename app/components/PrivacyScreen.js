'use client'
import { useState } from 'react'
import { SiteNav, SiteFooter, useIsMobile } from './SiteChrome'
import MobileMenuDrawer from './MobileMenuDrawer'

const SECTIONS = [
  {
    h: '1. Information We Collect',
    p: `We collect information you provide directly — such as your name, email address, and profile details when you sign up — along with information that is generated as you use UniAsk, including saved programs, saved chats, search filters, and messages you send to the AI. We also collect technical data (device type, browser, approximate location derived from IP, and pages visited) to keep the Service secure and to understand how it is used.`,
  },
  {
    h: '2. How We Use Your Information',
    p: `Your information is used to (a) run and personalize the Service, (b) match programs to your goals and profile, (c) improve our AI and search quality, (d) communicate with you about your account and product updates, (e) prevent fraud and abuse, and (f) comply with legal obligations. We do not sell your personal data.`,
  },
  {
    h: '3. AI Interactions',
    p: `When you use the "Ask AI" chat, your messages and the associated program context are processed by our AI provider (Anthropic) to generate a response. We do not use your chat content to train third-party foundation models. Aggregated, de-identified usage patterns may be used to improve our own prompts and product quality.`,
  },
  {
    h: '4. Cookies & Local Storage',
    p: `UniAsk uses cookies and browser local storage to keep you signed in, remember your filters, and cache your saved programs and chats. Essential storage cannot be disabled without breaking parts of the Service. Analytics cookies are only set when you accept them in the cookie banner.`,
  },
  {
    h: '5. Sharing of Information',
    p: `We share information with (a) service providers that host our infrastructure, database, authentication, and email delivery, (b) AI providers strictly for generating responses to your queries, and (c) authorities where required by law. All providers are contractually bound to protect your data. We never share your data with advertisers.`,
  },
  {
    h: '6. Data Retention',
    p: `We retain your account data for as long as your account is active and for a reasonable period afterward for legal and operational reasons. Saved programs, saved chats, and profile information are deleted when you delete your account. Anonymized analytics may be retained indefinitely.`,
  },
  {
    h: '7. Your Rights',
    p: `Depending on your location, you may have the right to access, correct, export, or delete your personal data, and to object to or restrict certain processing. To exercise any of these rights, contact hello@uniask.ai. We will respond within 30 days.`,
  },
  {
    h: '8. Security',
    p: `We use industry-standard measures — encryption in transit, access controls, and regular security reviews — to protect your data. No system is perfectly secure, but if we ever detect a breach that affects you, we will notify you as required by applicable law.`,
  },
  {
    h: "9. Children's Privacy",
    p: `UniAsk is not directed at children under 16. If you believe a minor has provided us with personal information without appropriate consent, please contact us and we will delete the data.`,
  },
  {
    h: '10. International Users',
    p: `UniAsk is operated from the European Union. If you access the Service from another region, you consent to the transfer and processing of your information in the EU under appropriate safeguards.`,
  },
  {
    h: '11. Changes to This Policy',
    p: `We may update this Privacy Policy as the Service evolves. When we make material changes, we will notify you via the platform or by email. The "last updated" date at the top of this page will always reflect the most recent version.`,
  },
  {
    h: '12. Contact',
    p: `Privacy questions or requests can be sent to hello@uniask.ai. We aim to respond within five business days.`,
  },
]

export default function PrivacyScreen({ user, onBack, onSignOut, onMyPrograms, onMyChats, onProfile, onFeedback, onTerms, onPrivacy }) {
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
            Privacy Policy
          </h1>
          <p style={{ fontSize: 14, lineHeight: '22px', color: '#6B7280', marginBottom: isMobile ? 32 : 48 }}>
            Last updated: 15 January 2026
          </p>

          <p style={{ fontSize: 18, lineHeight: '26px', color: '#000', marginBottom: 40 }}>
            At UniAsk we believe that great products treat people's data with care. This Privacy Policy explains what information we collect when you use <span style={{ color: '#0162E3' }}>uniask.ai</span>, why we collect it, and how you can control it.
          </p>

          {SECTIONS.map((s) => (
            <section key={s.h} style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 500, color: '#000', lineHeight: 'normal', letterSpacing: '-0.22px', marginBottom: 12 }}>
                {s.h}
              </h2>
              <p style={{ fontSize: 16, lineHeight: '24px', color: '#3A3A35', margin: 0 }}>
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
