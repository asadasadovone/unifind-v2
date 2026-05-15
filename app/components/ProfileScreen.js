'use client'
import { useState, useEffect } from 'react'
import { Icon, Logo } from './Icons'
import UserDropdown from './UserDropdown'
import MobileMenuDrawer from './MobileMenuDrawer'

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

const STORAGE_KEY = 'unifind_profile'

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export default function ProfileScreen({ user, onBack, onSignOut, onMyPrograms, onMyChats }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  const email = user?.email || ''
  const defaultName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''

  const [form, setForm] = useState(() => {
    const stored = loadProfile()
    return {
      name: stored.name ?? defaultName,
      gender: stored.gender ?? '',
      dobDay: stored.dobDay ?? '',
      dobMonth: stored.dobMonth ?? '',
      dobYear: stored.dobYear ?? '',
      nationality: stored.nationality ?? '',
      country: stored.country ?? '',
    }
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)) } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 80 }, (_, i) => currentYear - 16 - i)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <div className="results-screen">
      <header className="results-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="mobile-burger-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Icon name="menu" size={22} />
          </button>
          <Logo size="sm" onClick={onBack} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="zap-nav-link nav-desktop-only" onClick={onMyPrograms}>
            <Icon name="heart" size={14} /> My Programs
          </button>
          <button className="zap-nav-link nav-desktop-only" onClick={onMyChats}>
            <Icon name="sparkle" size={14} /> My Chats
          </button>
          <UserDropdown user={user} onSignOut={onSignOut} onProfile={onBack} />
        </div>
      </header>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px 80px' }}>
        <h2 className="serif" style={{ fontSize: 36, color: 'var(--green-900)', lineHeight: 1.1 }}>
          My <span className="serif-italic">Profile</span>
        </h2>
        <p className="muted" style={{ marginTop: 8, fontSize: 14 }}>
          Personal information used to personalise your university matches.
        </p>

        <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Name */}
          <div className="profile-field">
            <label className="profile-label">Name</label>
            <input
              className="input"
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Your full name"
            />
          </div>

          {/* Email — read only */}
          <div className="profile-field">
            <label className="profile-label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              readOnly
              style={{ background: 'var(--cream-200)', color: 'var(--ink-500)', cursor: 'default' }}
            />
          </div>

          {/* Gender */}
          <div className="profile-field">
            <label className="profile-label">Gender</label>
            <div className="profile-select-wrap">
              <select className="select" value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="">Select gender</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Date of birth */}
          <div className="profile-field">
            <label className="profile-label">Date of birth</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1.2fr', gap: 12 }}>
              <div className="profile-select-wrap">
                <select className="select" value={form.dobDay} onChange={e => set('dobDay', e.target.value)}>
                  <option value="">Day</option>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="profile-select-wrap">
                <select className="select" value={form.dobMonth} onChange={e => set('dobMonth', e.target.value)}>
                  <option value="">Month</option>
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="profile-select-wrap">
                <select className="select" value={form.dobYear} onChange={e => set('dobYear', e.target.value)}>
                  <option value="">Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Nationality */}
          <div className="profile-field">
            <label className="profile-label">Nationality</label>
            <div className="profile-select-wrap">
              <select className="select" value={form.nationality} onChange={e => set('nationality', e.target.value)}>
                <option value="">Select nationality</option>
                {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {/* Country of residence */}
          <div className="profile-field">
            <label className="profile-label">Country of residence</label>
            <div className="profile-select-wrap">
              <select className="select" value={form.country} onChange={e => set('country', e.target.value)}>
                <option value="">Select country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Save button */}
          <div style={{ paddingTop: 8 }}>
            <button
              className="btn btn-primary"
              style={{ padding: '12px 32px', fontSize: 15 }}
              onClick={handleSave}
            >
              {saved ? '✓ Saved!' : 'Save changes'}
            </button>
          </div>

        </div>
      </div>

      {menuOpen && (
        <MobileMenuDrawer
          user={user}
          onClose={() => setMenuOpen(false)}
          onOpenAuth={() => {}}
          onSignOut={() => { setMenuOpen(false); onSignOut?.() }}
          onMyPrograms={() => { setMenuOpen(false); onMyPrograms?.() }}
          onMyChats={() => { setMenuOpen(false); onMyChats?.() }}
          onProfile={() => { setMenuOpen(false) }}
        />
      )}
    </div>
  )
}
