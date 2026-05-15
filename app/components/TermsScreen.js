'use client'
import { useState } from 'react'
import { Icon, Logo } from './Icons'
import UserDropdown from './UserDropdown'
import MobileMenuDrawer from './MobileMenuDrawer'

export default function TermsScreen({ user, onBack, onSignOut, onMyPrograms, onMyChats,  onProfile, onFeedback, onTerms, onPrivacy }) {
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
          Terms of <span className="serif-italic">Service</span>
        </h2>
        <p className="muted" style={{ marginTop: 8, fontSize: 13 }}>Last updated: May 2025</p>

        <div className="legal-content" style={{ marginTop: 40 }}>
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing or using UniFind (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to all of the terms and conditions set out here, you may not access or use the Service. These terms apply to all visitors, users, and others who access the Service.
          </p>

          <h3>2. Use of Service</h3>
          <p>
            UniFind is an AI-powered university discovery platform that helps prospective students explore undergraduate and postgraduate programmes at universities around the world. The Service provides personalised programme recommendations, AI-generated summaries, and tools to save and compare programmes of interest. UniFind is intended for personal, non-commercial use only. You agree not to misuse the Service, attempt to circumvent any security measures, scrape or harvest data programmatically, or use the platform for any purpose that violates applicable law.
          </p>

          <h3>3. User Accounts</h3>
          <p>
            Certain features of the Service require you to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to provide accurate and complete information when registering and to update that information as necessary. UniFind reserves the right to suspend or terminate accounts that violate these Terms or that have been inactive for an extended period.
          </p>

          <h3>4. Intellectual Property</h3>
          <p>
            All content, design, graphics, logos, and software comprising the Service are the property of UniFind or its licensors and are protected by applicable intellectual property laws. You are granted a limited, non-exclusive, non-transferable licence to access and use the Service for its intended purpose. You may not reproduce, distribute, modify, create derivative works of, or publicly display any content from the Service without prior written permission.
          </p>

          <h3>5. Disclaimer of Warranties</h3>
          <p>
            UniFind is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. Programme information, AI-generated descriptions, and admission guidance provided through the Service are for informational purposes only and do not constitute official advice from any university. You should always verify information directly with the relevant institution before making any application or enrolment decision. UniFind does not guarantee the accuracy, completeness, or timeliness of any information displayed on the platform.
          </p>

          <h3>6. Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by applicable law, UniFind and its officers, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of or inability to use the Service, even if UniFind has been advised of the possibility of such damages. UniFind's total liability to you for any claims arising under these Terms shall not exceed the amount you paid, if any, to use the Service in the twelve months preceding the claim.
          </p>

          <h3>7. Privacy</h3>
          <p>
            Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review the Privacy Policy to understand how we collect, use, and share information about you.
          </p>

          <h3>8. Changes to Terms</h3>
          <p>
            UniFind reserves the right to modify these Terms at any time. When changes are made, we will update the "last updated" date at the top of this page. If we make material changes, we may also notify you by email or by displaying a notice within the Service. Your continued use of the Service after changes become effective constitutes your acceptance of the revised Terms.
          </p>

          <h3>9. Contact</h3>
          <p>
            If you have any questions about these Terms of Service, please contact us at support@unifind.app. We aim to respond to all enquiries within five business days.
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
