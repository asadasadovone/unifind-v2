'use client'
import { useState } from 'react'
import { Icon, Logo } from './Icons'
import UserDropdown from './UserDropdown'
import MobileMenuDrawer from './MobileMenuDrawer'

export default function PrivacyScreen({ user, onBack, onSignOut, onMyPrograms, onMyChats,  onProfile, onFeedback, onTerms, onPrivacy }) {
  const [menuOpen, setMenuOpen] = useState(false)

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
          <button
            className="mobile-menu-burger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Icon name="menu" size={22} />
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 32px' }}>
        <h2 className="serif" style={{ fontSize: 36, color: 'var(--green-900)', lineHeight: 1.1 }}>
          Privacy <span className="serif-italic">Policy</span>
        </h2>
        <p className="muted" style={{ marginTop: 8, fontSize: 13 }}>Last updated: May 2025</p>

        <div className="legal-content" style={{ marginTop: 40 }}>
          <h3>1. Information We Collect</h3>
          <p>
            When you create an account, we collect basic account information such as your name and email address. As you use UniFind, we collect the search queries you submit, the university programmes you save or compare, and the AI chat conversations you choose to store. We also collect standard usage data including pages visited, features used, and session duration, which helps us understand how the platform is used and where improvements can be made.
          </p>

          <h3>2. How We Use Your Information</h3>
          <p>
            We use the information we collect to operate and improve the Service, to personalise your experience — for example by surfacing programmes that match your stated interests — and to train and refine the AI models that power UniFind's recommendations. We may use your email address to send you product updates, important notices about your account, or occasional communications about new features. You may opt out of non-essential communications at any time through your account settings.
          </p>

          <h3>3. Data Storage & Security</h3>
          <p>
            Account data, saved programmes, and chat histories are stored securely using Supabase, a managed database platform with encryption at rest and in transit. Certain preferences and session state may also be stored in your browser's localStorage for performance reasons. While we take reasonable technical and organisational precautions to protect your data, no system is completely secure, and we cannot guarantee the absolute security of information you transmit to us.
          </p>

          <h3>4. Cookies & Analytics</h3>
          <p>
            UniFind uses essential cookies to maintain your session and keep you logged in across page loads. We may also use lightweight analytics tools to collect aggregated, anonymised data about how users interact with the platform. These analytics do not track you across third-party websites. You can disable cookies in your browser settings, though doing so may affect the functionality of the Service.
          </p>

          <h3>5. Third-Party Services</h3>
          <p>
            UniFind integrates with third-party services in order to deliver core functionality. AI-generated programme descriptions and chat responses are produced using Anthropic's Claude API; queries you submit may be processed by Anthropic's infrastructure in accordance with their own privacy and data handling policies. Database and authentication services are provided by Supabase. We do not sell your personal information to any third party.
          </p>

          <h3>6. Your Rights</h3>
          <p>
            Depending on your jurisdiction, you may have rights to access the personal information we hold about you, to request correction of inaccurate data, or to request deletion of your account and associated data. To exercise any of these rights, please contact us at support@unifind.app. We will respond to all verified requests within thirty days. In some circumstances, we may be required to retain certain information even after an account deletion request.
          </p>

          <h3>7. Children's Privacy</h3>
          <p>
            UniFind is not directed at children under the age of 13, and we do not knowingly collect personal information from anyone under 13. If we become aware that we have inadvertently collected such information, we will take steps to delete it promptly. Users between 13 and 18 should ensure they have parental or guardian consent before using the Service.
          </p>

          <h3>8. Contact</h3>
          <p>
            If you have questions, concerns, or requests relating to this Privacy Policy or our handling of your personal data, please reach out to us at support@unifind.app. We take privacy seriously and will do our best to address your enquiry as quickly as possible.
          </p>
        </div>
      </div>

      {menuOpen && (
        <MobileMenuDrawer
          user={user}
          onClose={() => setMenuOpen(false)}
          onSignOut={onSignOut}
          onMyPrograms={onMyPrograms}
          onMyChats={onMyChats}
          onProfile={onProfile}
        />
      )}
    </div>
  )
}
