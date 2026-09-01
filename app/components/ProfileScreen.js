'use client'
import { useState, useEffect, useRef } from 'react'
import { SiteNav, SiteFooter, useIsMobile } from './SiteChrome'
import MobileMenuDrawer from './MobileMenuDrawer'
import { loadUserData, saveUserData, K } from '../lib/user-data'

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const NATIONALITIES = [
  'Afghan','Albanian','Algerian','American','Andorran','Angolan','Argentinian','Armenian','Australian',
  'Austrian','Azerbaijani','Bahraini','Bangladeshi','Belarusian','Belgian','Bolivian','Bosnian','Brazilian',
  'British','Bulgarian','Cambodian','Cameroonian','Canadian','Chilean','Chinese','Colombian','Croatian',
  'Cuban','Czech','Danish','Dominican','Dutch','Ecuadorian','Egyptian','Emirati','Estonian','Ethiopian',
  'Filipino','Finnish','French','Georgian','German','Ghanaian','Greek','Guatemalan','Honduran','Hungarian',
  'Indian','Indonesian','Iranian','Iraqi','Irish','Israeli','Italian','Ivorian','Jamaican','Japanese',
  'Jordanian','Kazakh','Kenyan','Korean','Kuwaiti','Kyrgyz','Latvian','Lebanese','Libyan','Lithuanian',
  'Luxembourgish','Macedonian','Malaysian','Maldivian','Maltese','Mexican','Moldovan','Mongolian',
  'Montenegrin','Moroccan','Mozambican','Namibian','Nepali','New Zealander','Nigerian','Norwegian',
  'Omani','Pakistani','Palestinian','Panamanian','Paraguayan','Peruvian','Polish','Portuguese','Qatari',
  'Romanian','Russian','Saudi','Senegalese','Serbian','Singaporean','Slovak','Slovenian','South African',
  'Spanish','Sri Lankan','Sudanese','Swedish','Swiss','Syrian','Taiwanese','Tajik','Thai','Tunisian',
  'Turkish','Turkmen','Ugandan','Ukrainian','Uruguayan','Uzbek','Venezuelan','Vietnamese','Yemeni',
  'Zambian','Zimbabwean'
]
const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia','Austria',
  'Azerbaijan','Bahrain','Bangladesh','Belarus','Belgium','Bolivia','Bosnia and Herzegovina','Brazil',
  'Bulgaria','Cambodia','Cameroon','Canada','Chile','China','Colombia','Croatia','Cuba','Czech Republic',
  'Denmark','Dominican Republic','Ecuador','Egypt','El Salvador','Estonia','Ethiopia','Finland','France',
  'Georgia','Germany','Ghana','Greece','Guatemala','Honduras','Hungary','India','Indonesia','Iran','Iraq',
  'Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kosovo','Kuwait','Kyrgyzstan',
  'Latvia','Lebanon','Libya','Lithuania','Luxembourg','Malaysia','Maldives','Malta','Mexico','Moldova',
  'Mongolia','Montenegro','Morocco','Mozambique','Namibia','Nepal','Netherlands','New Zealand','Nigeria',
  'North Macedonia','Norway','Oman','Pakistan','Palestine','Panama','Paraguay','Peru','Philippines',
  'Poland','Portugal','Qatar','Romania','Russia','Saudi Arabia','Senegal','Serbia','Singapore','Slovakia',
  'Slovenia','South Africa','South Korea','Spain','Sri Lanka','Sudan','Sweden','Switzerland','Syria',
  'Taiwan','Tajikistan','Thailand','Tunisia','Turkey','Turkmenistan','Uganda','Ukraine','United Arab Emirates',
  'United Kingdom','United States','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'
]
const ENGLISH_LEVELS = ['I have completed a test', "I'm preparing for a test", 'Native speaker', 'No formal testing']
const ENGLISH_TESTS = ['IELTS', 'TOEFL', 'PTE', 'Duolingo', 'Cambridge (IELTS)', 'TOEIC']
const SCORE_MAP = {
  IELTS: ['9','8.5','8','7.5','7','6.5','6','5.5','5','4.5','4','3.5','3','2.5','2','1'],
  TOEFL: Array.from({length:121},(_,i)=>String(120-i)),
  Duolingo: Array.from({length:16},(_,i)=>String(160-i*10)),
  default: Array.from({length:100},(_,i)=>String(100-i)),
}
function getScores(test) { return SCORE_MAP[test] || SCORE_MAP.default }

const STORAGE_KEY = 'unifind_profile'
function loadProfile() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

// ── Sub-components defined at module scope to prevent remounting ──

function FloatField({ label, value, onChange, readOnly, type = 'text' }) {
  return (
    <div style={{ border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 14px 10px', background: '#fff' }}>
      <span style={{ display: 'block', fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        style={{ border: 'none', outline: 'none', width: '100%', fontSize: 15, background: 'transparent', color: '#111', padding: 0, cursor: readOnly ? 'default' : 'text' }}
      />
    </div>
  )
}

function FloatSelect({ label, value, onChange, placeholder, children }) {
  return (
    <div style={{ position: 'relative', border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 36px 10px 14px', background: '#fff' }}>
      <span style={{ display: 'block', fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>{label}</span>
      <select
        value={value}
        onChange={onChange}
        style={{ border: 'none', outline: 'none', width: '100%', fontSize: 15, background: 'transparent', color: value ? '#111' : '#9CA3AF', padding: 0, appearance: 'none', cursor: 'pointer' }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6B7280' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }}>
      {title && <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{title}</p>}
      {children}
    </div>
  )
}

function IconSettings() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  )
}

function IconEn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <text x="12" y="15.5" textAnchor="middle" fontSize="7.5" fontWeight="700" fontFamily="-apple-system,BlinkMacSystemFont,sans-serif" fill="currentColor" stroke="none">En</text>
    </svg>
  )
}

function GoogleBadge() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#374151', marginBottom: 14 }}>
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      You're logged in with Google
    </div>
  )
}

export default function ProfileScreen({ user, onBack, onSignOut, onMyPrograms, onMyChats, onProfile, onFeedback, onTerms, onPrivacy }) {
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)
  const [tab, setTab] = useState('personal')
  const debounceRef = useRef(null)

  const email = user?.email || ''
  const defaultName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const isGoogle = user?.app_metadata?.provider === 'google' || user?.identities?.some(i => i.provider === 'google')

  const [form, setForm] = useState(() => {
    const s = loadProfile()
    return {
      name: s.name ?? defaultName,
      gender: s.gender ?? '',
      dobDay: s.dobDay ?? '',
      dobMonth: s.dobMonth ?? '',
      dobYear: s.dobYear ?? '',
      nationality: s.nationality ?? '',
      country: s.country ?? '',
      englishLevel: s.englishLevel ?? '',
      englishTest: s.englishTest ?? '',
      englishScore: s.englishScore ?? '',
    }
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  // Load this user's profile from cloud on mount / when user changes.
  useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    ;(async () => {
      const remote = await loadUserData(user.id, K.PROFILE, null)
      if (!cancelled && remote && typeof remote === 'object') {
        setForm(f => ({ ...f, ...remote }))
      }
    })()
    return () => { cancelled = true }
  }, [user?.id])

  // Auto-save 800ms after last change — writes to cloud AND local cache.
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)) } catch {}
      if (user?.id) saveUserData(user.id, K.PROFILE, form)
    }, 800)
    return () => clearTimeout(debounceRef.current)
  }, [form, user?.id])

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 80 }, (_, i) => currentYear - 16 - i)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const showTest = form.englishLevel === 'I have completed a test' || form.englishLevel === "I'm preparing for a test"
  const showScore = showTest && form.englishTest

  const sidebarItems = [
    { id: 'personal', label: 'Personal info', Icon: IconSettings },
    { id: 'english', label: 'English level', Icon: IconEn },
  ]

  const contentMaxWidth = 1100

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
        <div style={{ maxWidth: contentMaxWidth, margin: '0 auto', padding: isMobile ? '24px 16px 48px' : '40px 24px 80px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          {/* Sidebar */}
          {!isMobile && (
            <div style={{ width: 220, flexShrink: 0, background: '#fff', borderRadius: 12, padding: 8 }}>
              {sidebarItems.map(({ id, label, Icon: ItemIcon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 15, fontFamily: 'inherit', textAlign: 'left',
                    background: tab === id ? '#EBF2FE' : 'transparent',
                    color: tab === id ? '#1668E3' : '#1a1a1a',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 6, background: tab === id ? '#D0E4FC' : '#F5F5F5', color: tab === id ? '#1668E3' : '#6B7280', flexShrink: 0 }}>
                    <ItemIcon />
                  </span>
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Main */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Mobile tab bar */}
            {isMobile && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {sidebarItems.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    style={{ padding: '8px 16px', borderRadius: 999, border: '1px solid #E5E5E5', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer', background: tab === id ? '#1668E3' : '#fff', color: tab === id ? '#fff' : '#374151', fontWeight: tab === id ? 600 : 400 }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a1a', margin: '0 0 20px' }}>Welcome to your profile!</h1>

            {/* ── Personal info tab ── */}
            {tab === 'personal' && (
              <>
                <Card title="Personal data">
                  {isGoogle && <GoogleBadge />}
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <FloatField label="Full Name" value={form.name} onChange={e => set('name', e.target.value)} />
                    <FloatField label="Email" value={email} readOnly type="email" />
                  </div>
                  <FloatSelect label="Gender" value={form.gender} onChange={e => set('gender', e.target.value)} placeholder="Select gender">
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </FloatSelect>
                </Card>

                <Card title="Date of birth">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1.2fr', gap: 12 }}>
                    <FloatSelect label="Day" value={form.dobDay} onChange={e => set('dobDay', e.target.value)} placeholder="Day">
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </FloatSelect>
                    <FloatSelect label="Month" value={form.dobMonth} onChange={e => set('dobMonth', e.target.value)} placeholder="Month">
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </FloatSelect>
                    <FloatSelect label="Year" value={form.dobYear} onChange={e => set('dobYear', e.target.value)} placeholder="Year">
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </FloatSelect>
                  </div>
                </Card>

                <Card title="Regional">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <FloatSelect label="Nationality" value={form.nationality} onChange={e => set('nationality', e.target.value)} placeholder="Select nationality">
                      {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                    </FloatSelect>
                    <FloatSelect label="Country of residence" value={form.country} onChange={e => set('country', e.target.value)} placeholder="Select country">
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </FloatSelect>
                  </div>
                </Card>

                <div style={{ background: '#fff', borderRadius: 12, padding: '4px' }}>
                  <button
                    onClick={onSignOut}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px', background: 'none', border: 'none', borderRadius: 10, fontSize: 15, fontFamily: 'inherit', cursor: 'pointer', color: '#374151', fontWeight: 500 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign out
                  </button>
                </div>
              </>
            )}

            {/* ── English level tab ── */}
            {tab === 'english' && (
              <>
                <Card title="English level">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <FloatSelect label="What is your English level?" value={form.englishLevel} onChange={e => set('englishLevel', e.target.value)} placeholder="Select level">
                      {ENGLISH_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </FloatSelect>
                    {showTest && (
                      <FloatSelect label="English test" value={form.englishTest} onChange={e => { set('englishTest', e.target.value); set('englishScore', '') }} placeholder="Select test">
                        {ENGLISH_TESTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </FloatSelect>
                    )}
                    {showScore && (
                      <FloatSelect label="Your score" value={form.englishScore} onChange={e => set('englishScore', e.target.value)} placeholder="Select score">
                        {getScores(form.englishTest).map(s => <option key={s} value={s}>{s}</option>)}
                      </FloatSelect>
                    )}
                  </div>
                </Card>

                <Card title="Our partners">
                  <div style={{ border: '1px solid #E5E5E5', borderRadius: 10, padding: '18px 20px' }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px' }}>Duolingo English Test</p>
                    <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6, margin: '0 0 16px' }}>
                      Certify your English proficiency with the Duolingo English Test! The DET is a convenient, fast, and affordable online English test accepted by over 4,000 universities around the world.
                    </p>
                    <a
                      href="https://englishtest.duolingo.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px', background: '#1668E3', color: '#fff', borderRadius: 22, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      Take A Free Practice Test!
                    </a>
                  </div>
                </Card>
              </>
            )}
          </div>
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
          onProfile={() => { setMenuOpen(false) }}
          onHome={() => { setMenuOpen(false); onBack?.() }}
        />
      )}
    </div>
  )
}
