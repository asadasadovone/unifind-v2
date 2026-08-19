'use client'
import { useState, useRef, useEffect } from 'react'
import { Icon, Logo, ChipGroup, RangeSlider } from './Icons'
import UserDropdown from './UserDropdown'
import MobileMenuDrawer from './MobileMenuDrawer'
import { POPULAR_COUNTRIES, ALL_COUNTRIES } from '../data'

const FIELDS = [
  { name: 'Agriculture & Forestry', count: '1.6k', icon: 'leaf' },
  { name: 'Applied Sciences & Professions', count: '3.5k', icon: 'flask' },
  { name: 'Arts, Design & Architecture', count: '7.8k', icon: 'palette' },
  { name: 'Business & Management', count: '21.9k', icon: 'briefcase' },
  { name: 'Computer Science & IT', count: '9.8k', icon: 'terminal' },
  { name: 'Education & Training', count: '9.8k', icon: 'book2' },
  { name: 'Engineering & Technology', count: '10.5k', icon: 'cog' },
  { name: 'Environmental Studies & Earth Sciences', count: '4.8k', icon: 'globe2' },
  { name: 'Hospitality, Leisure & Sports', count: '2.2k', icon: 'boat' },
  { name: 'Humanities', count: '7.8k', icon: 'feather' },
  { name: 'Journalism & Media', count: '1.7k', icon: 'video' },
  { name: 'Law', count: '3.4k', icon: 'scale' },
  { name: 'Medicine & Health', count: '13.2k', icon: 'medkit' },
  { name: 'Natural Sciences & Mathematics', count: '10.3k', icon: 'atom' },
  { name: 'Social Sciences', count: '15.8k', icon: 'people' },
]

const FIELD_TABS = ['Computer Science', 'Business & MBA', 'Engineering', 'Law']

const MASTER_UNIS = {
  'Computer Science': [
    { name: 'Technical University of Munich', city: 'Munich', country: 'Germany', tuition: 'Free', start: 'Sep 2026', duration: '2 years', img: 'tum' },
    { name: 'ETH Zürich', city: 'Zürich', country: 'Switzerland', tuition: 'Free', start: 'Sep 2026', duration: '2 years', img: 'ethzurich' },
    { name: 'KTH Royal Institute of Technology', city: 'Stockholm', country: 'Sweden', tuition: 'Free', start: 'Aug 2026', duration: '2 years', img: 'kth' },
    { name: 'TU Delft', city: 'Delft', country: 'Netherlands', tuition: '€2,209/yr', start: 'Sep 2026', duration: '2 years', img: 'tudelft' },
    { name: 'Aalto University', city: 'Espoo', country: 'Finland', tuition: 'Free', start: 'Sep 2026', duration: '2 years', img: 'aalto' },
  ],
  'Business & MBA': [
    { name: 'HEC Paris', city: 'Paris', country: 'France', tuition: '€15,500/yr', start: 'Sep 2026', duration: '1 year', img: 'hecparis' },
    { name: 'London Business School', city: 'London', country: 'UK', tuition: '£45,000/yr', start: 'Sep 2026', duration: '2 years', img: 'lbs' },
    { name: 'ESADE', city: 'Barcelona', country: 'Spain', tuition: '€29,900/yr', start: 'Sep 2026', duration: '1 year', img: 'esade' },
    { name: 'IE Business School', city: 'Madrid', country: 'Spain', tuition: '€32,000/yr', start: 'Sep 2026', duration: '1 year', img: 'iebusiness' },
    { name: 'Rotterdam School of Management', city: 'Rotterdam', country: 'Netherlands', tuition: '€17,500/yr', start: 'Sep 2026', duration: '2 years', img: 'rsm' },
  ],
  'Engineering': [
    { name: 'TU Munich', city: 'Munich', country: 'Germany', tuition: 'Free', start: 'Sep 2026', duration: '2 years', img: 'tumunich' },
    { name: 'Delft University', city: 'Delft', country: 'Netherlands', tuition: '€2,209/yr', start: 'Sep 2026', duration: '2 years', img: 'delft' },
    { name: 'EPFL', city: 'Lausanne', country: 'Switzerland', tuition: 'CHF 1,566/yr', start: 'Sep 2026', duration: '2 years', img: 'epfl' },
    { name: 'KU Leuven', city: 'Leuven', country: 'Belgium', tuition: '€1,500/yr', start: 'Sep 2026', duration: '2 years', img: 'kuleuven' },
    { name: 'Chalmers University', city: 'Gothenburg', country: 'Sweden', tuition: 'Free', start: 'Sep 2026', duration: '2 years', img: 'chalmers' },
  ],
  'Law': [
    { name: 'University of Amsterdam', city: 'Amsterdam', country: 'Netherlands', tuition: '€2,209/yr', start: 'Sep 2026', duration: '1 year', img: 'amsterdam' },
    { name: 'Uppsala University', city: 'Uppsala', country: 'Sweden', tuition: 'Free', start: 'Sep 2026', duration: '2 years', img: 'uppsala' },
    { name: 'University of Vienna', city: 'Vienna', country: 'Austria', tuition: '€1,500/yr', start: 'Sep 2026', duration: '2 years', img: 'vienna' },
    { name: 'Leiden University', city: 'Leiden', country: 'Netherlands', tuition: '€2,209/yr', start: 'Sep 2026', duration: '2 years', img: 'leiden' },
    { name: 'University of Helsinki', city: 'Helsinki', country: 'Finland', tuition: 'Free', start: 'Sep 2026', duration: '2 years', img: 'helsinki' },
  ],
}

const BACHELOR_UNIS = MASTER_UNIS

const STORIES = [
  {
    stat: '8',
    label: 'free programs found',
    name: 'Seung',
    desc: 'Seung found 8 fully-funded CS programs in under 5 minutes and got into his first choice',
    tags: 'Computer Science · Germany · Free tuition',
    seed: 'student1',
  },
  {
    stat: '6 weeks',
    label: 'of research saved',
    name: 'Sofia',
    desc: 'Sofia replaced 6 weeks of browser tabs with one UniFind conversation — then got into KTH',
    tags: 'Computer Science · Sweden · Free tuition',
    seed: 'student2',
  },
  {
    stat: '€0',
    label: 'tuition per year',
    name: 'Mohamed',
    desc: 'Mohamed discovered he could study Data Science in Europe for free',
    tags: 'Data Science · Netherlands · Free tuition',
    seed: 'student3',
  },
]

const FAQS = [
  {
    q: "Is UniFind really free? What's the catch?",
    a: 'While you would spend weeks Googling, our AI scans thousands of programs in seconds — and ranks them by fit.',
  },
  {
    q: 'How is this different from just Googling or using StudyPortals?',
    a: 'UniFind uses AI to understand your goals, budget, and preferences — then finds and ranks programs that actually match, saving you weeks of manual research.',
  },
  {
    q: 'How accurate is the information? Can I rely on it for my application?',
    a: 'Our data is updated weekly from official university sources. Always verify final details directly with the university before applying.',
  },
  {
    q: "I don't know what I want to study yet. Can UniFind still help me?",
    a: 'Absolutely. Describe your interests, budget, and target countries — our AI will suggest fields and programs that match your profile.',
  },
  {
    q: 'My situation is complicated. Will the AI actually understand me?',
    a: 'Yes. The AI is trained to handle complex situations — dual nationality, gap years, non-traditional backgrounds, specific visa requirements.',
  },
  {
    q: 'Does UniFind cover visa requirements and cost of living?',
    a: 'Yes. The AI advisor on each program page can answer questions about visas, cost of living, housing, and life in that city.',
  },
  {
    q: 'What programs and countries does UniFind cover?',
    a: 'UniFind covers thousands of programs across 50+ countries, with a focus on English-taught and European programs.',
  },
  {
    q: 'Can I save my research and come back later?',
    a: 'Yes — create a free account to save programs, continue AI chats, and track your shortlist across devices.',
  },
]

function FieldIcon({ name, size = 16 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (name) {
    case 'leaf': return <svg {...props}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.5 2c.5 9 .5 13-2 17-1.5 2-4 2.5-6 2.5"/><path d="M2 21c0-3 1-7 8-13"/></svg>
    case 'flask': return <svg {...props}><path d="M9 2v6L4 18a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3L15 8V2"/><path d="M8 2h8"/><path d="M7 14h10"/></svg>
    case 'palette': return <svg {...props}><circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 22a10 10 0 1 1 10-10c0 2-2 3-4 3h-3a2 2 0 0 0-1 4 2 2 0 0 1-2 3"/></svg>
    case 'briefcase': return <svg {...props}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    case 'terminal': return <svg {...props}><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
    case 'book2': return <svg {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    case 'cog': return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    case 'globe2': return <svg {...props}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>
    case 'boat': return <svg {...props}><path d="M3 18 12 4l9 14"/><path d="M3 18a4 4 0 0 0 4 2c2 0 2-1 4-1s2 1 4 1c2 0 2-1 4-1"/></svg>
    case 'feather': return <svg {...props}><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>
    case 'video': return <svg {...props}><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m22 8-6 4 6 4z"/></svg>
    case 'scale': return <svg {...props}><path d="M12 3v18M5 21h14M5 6h14M3 12l3-6 3 6a3 3 0 0 1-6 0M15 12l3-6 3 6a3 3 0 0 1-6 0"/></svg>
    case 'medkit': return <svg {...props}><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M9 7V4h6v3M12 11v6M9 14h6"/></svg>
    case 'atom': return <svg {...props}><circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>
    case 'people': return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    default: return null
  }
}

function UniCard({ uni, onSearch }) {
  const isFree = uni.tuition === 'Free'
  return (
    <div className="home-card">
      <img
        className="uni-card-img"
        src={`https://picsum.photos/seed/${uni.img}/400/220`}
        alt={uni.name}
      />
      <div className="home-card-body">
        <div style={{ fontWeight: 700, color: 'var(--green-800)', fontSize: 14, marginBottom: 6, lineHeight: 1.3 }}>
          {uni.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--green-700)', marginBottom: 4 }}>
          <Icon name="tag" size={11} />
          <span>Master's Program</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--ink-500)', marginBottom: 3 }}>
          <Icon name="pin" size={11} />
          <span>{uni.city}, {uni.country}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--ink-500)', marginBottom: 12 }}>
          <Icon name="calendar" size={11} />
          <span>{uni.start}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
          <span
            className="badge"
            style={isFree ? { background: 'var(--green-800)', color: 'var(--cream-100)', border: 'none', fontWeight: 600 } : {}}
          >
            {isFree ? 'Free' : uni.tuition}
          </span>
          <span className="badge badge-green">English</span>
          <span className="badge">{uni.duration}</span>
        </div>
        <button
          onClick={() => onSearch()}
          style={{
            width: '100%',
            padding: '9px 0',
            border: '1.5px solid var(--green-700)',
            borderRadius: 'var(--r-md)',
            color: 'var(--green-800)',
            fontSize: 13,
            fontWeight: 600,
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--green-800)'; e.currentTarget.style.color = 'var(--cream-100)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--green-800)' }}
        >
          <Icon name="sparkle" size={13} /> Ask AI
        </button>
      </div>
    </div>
  )
}

function CardsSection({ title, unisData, onSearch }) {
  const [activeTab, setActiveTab] = useState(FIELD_TABS[0])
  const rowRef = useRef(null)
  const scrollRow = (dir) => {
    if (rowRef.current) rowRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }
  const unis = unisData[activeTab] || []
  return (
    <section style={{ background: 'var(--cream-100)', padding: '80px 0' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
        <h2
          style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 400, marginBottom: 28, color: 'var(--ink-900)', lineHeight: 1.2 }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {FIELD_TABS.map(tab => (
            <button
              key={tab}
              className={`field-tab${tab === activeTab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <div className="home-cards-row" ref={rowRef}>
            {unis.map(uni => (
              <UniCard key={uni.name} uni={uni} onSearch={onSearch} />
            ))}
          </div>
          <button
            onClick={() => scrollRow(-1)}
            aria-label="Scroll left"
            style={{
              position: 'absolute',
              left: -18,
              top: '40%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--white)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer',
              color: 'var(--ink-700)',
            }}
          >
            <Icon name="chevronLeft" size={16} />
          </button>
          <button
            onClick={() => scrollRow(1)}
            aria-label="Scroll right"
            style={{
              position: 'absolute',
              right: -18,
              top: '40%',
              transform: 'translateY(-50%) rotate(180deg)',
              zIndex: 10,
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--white)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer',
              color: 'var(--ink-700)',
            }}
          >
            <Icon name="chevronLeft" size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <span style={{ fontSize: 22, fontWeight: 300, lineHeight: 1, flexShrink: 0 }}>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div className="faq-answer">{a}</div>
      )}
    </div>
  )
}

export default function SearchScreen({ filters, setFilters, onSearch, onOpenAuth, user, onSignOut, isPremium, onUpgrade, onMyPrograms, onMyChats, onProfile, onFeedback, onTerms, onPrivacy }) {
  const update = (k, v) => setFilters(f => ({ ...f, [k]: v }))
  const [fieldOpen, setFieldOpen] = useState(false)
  const [tuitionOpen, setTuitionOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sliderVal, setSliderVal] = useState(0)
  const fieldRef = useRef(null)
  const tuitionRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (fieldRef.current && !fieldRef.current.contains(e.target)) setFieldOpen(false)
      if (tuitionRef.current && !tuitionRef.current.contains(e.target)) setTuitionOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const filteredFields = FIELDS.filter(f =>
    !filters.field || f.name.toLowerCase().includes(filters.field.toLowerCase())
  )

  const hours = Math.round(240 - 239 * (sliderVal / 100))

  return (
    <div className="zap-screen">
      {/* ── Nav ──────────────────────────────────────────────── */}
      <header className="zap-nav">
        <div className="zap-nav-left">
          <button
            className="mobile-burger-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Icon name="menu" size={22} />
          </button>
          <Logo />
        </div>
        <div className="zap-nav-right">
          <button
            className="zap-nav-link nav-desktop-only"
            onClick={() => user ? onMyPrograms?.() : onOpenAuth?.('save-programs')}
          >
            <Icon name="heart" size={14} /> My Programs
          </button>
          <button
            className="zap-nav-link nav-desktop-only"
            onClick={() => user ? onMyChats?.() : onOpenAuth?.('save-chats')}
          >
            <Icon name="sparkle" size={14} /> My Chats
          </button>
          {user ? (
            <UserDropdown user={user} onSignOut={onSignOut} onProfile={onProfile} onFeedback={onFeedback} onTerms={onTerms} onPrivacy={onPrivacy} />
          ) : (
            <>
              <button className="zap-link nav-desktop-only" onClick={() => onOpenAuth('login')}>Log in</button>
              <button className="zap-btn zap-btn-primary nav-desktop-only" onClick={() => onOpenAuth('register')}>Sign up</button>
            </>
          )}
        </div>
      </header>

      {/* ── Section 1: Hero ──────────────────────────────────── */}
      <div style={{ background: 'var(--cream-200)', padding: '60px 24px 56px' }}>
        <div className="home-search-card">
          {/* Eyebrow */}
          <div
            className="eyebrow"
            style={{ textAlign: 'center', marginBottom: 14, letterSpacing: '0.12em' }}
          >
            YOUR GOALS. YOUR BUDGET. ANY UNIVERSITY.
          </div>

          {/* H1 */}
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: 'clamp(32px, 5vw, 52px)',
              textAlign: 'center',
              color: 'var(--ink-900)',
              lineHeight: 1.12,
              margin: '0 0 24px',
            }}
          >
            Find your next university
          </h1>

          {/* Degree toggle pills */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
            {['Bachelor', 'Master', 'PhD'].map(d => (
              <button
                key={d}
                className={`degree-pill${filters.degree?.includes(d) ? ' active' : ''}`}
                onClick={() => update('degree', [d])}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="zap-search-bar" style={{ marginBottom: 20 }}>
            {/* Field of study */}
            <div className="zap-cell zap-cell-field" ref={fieldRef}>
              <label>Field of study</label>
              <input
                placeholder="e.g. Computer Science"
                value={filters.field}
                onChange={(e) => { update('field', e.target.value); setFieldOpen(true) }}
                onFocus={() => setFieldOpen(true)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              />
              {fieldOpen && (
                <div className="field-dropdown" onMouseDown={(e) => e.preventDefault()}>
                  <div className="field-dropdown-head">Suggested fields of study</div>
                  <div className="field-dropdown-list">
                    {filteredFields.length === 0 && (
                      <div className="field-empty">No matches — press Enter to search &ldquo;{filters.field}&rdquo;</div>
                    )}
                    {filteredFields.map((f) => {
                      const selected = filters.field === f.name
                      return (
                        <button
                          key={f.name}
                          className={`field-option${selected ? ' selected' : ''}`}
                          onClick={() => { update('field', f.name); setFieldOpen(false) }}
                        >
                          <span className="field-option-icon"><FieldIcon name={f.icon} size={16} /></span>
                          <span className="field-option-name">{f.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Country */}
            <div className="zap-cell">
              <label>Country</label>
              <select value={filters.country} onChange={(e) => update('country', e.target.value)}>
                <optgroup label="— Popular —">
                  {POPULAR_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </optgroup>
                <optgroup label="— All countries —">
                  {ALL_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </optgroup>
              </select>
            </div>

            {/* Start date */}
            <div className="zap-cell">
              <label>Start date</label>
              <select value={filters.startDate} onChange={(e) => update('startDate', e.target.value)}>
                <option value="">Any intake</option>
                <option value="Fall 2026">Fall 2026</option>
                <option value="Spring 2027">Spring 2027</option>
                <option value="Fall 2027">Fall 2027</option>
              </select>
            </div>

            {/* Tuition */}
            <div className="zap-cell zap-cell-tuition" ref={tuitionRef}>
              <label>Tuition (USD/yr)</label>
              <button className="zap-tuition-trigger" onClick={() => setTuitionOpen(o => !o)}>
                <span>
                  {filters.tuition[0] === 0 ? 'Free' : `$${filters.tuition[0].toLocaleString()}`}
                  {' – '}
                  ${filters.tuition[1].toLocaleString()}
                </span>
              </button>
              {tuitionOpen && (
                <div className="tuition-dropdown" onMouseDown={(e) => e.stopPropagation()}>
                  <TuitionCard
                    value={filters.tuition}
                    onChange={(v) => { update('tuition', v); setTuitionOpen(false) }}
                  />
                </div>
              )}
            </div>

            {/* Search button */}
            <button className="zap-btn zap-btn-primary zap-search-btn" onClick={onSearch}>
              <Icon name="search" size={16} /> Search
            </button>
          </div>

          {/* Format + Attendance chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, paddingTop: 16, borderTop: '1px solid var(--cream-300)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="zap-filter-label">Format</span>
              <ChipGroup options={['Full-time', 'Part-time']} value={filters.format} onChange={(v) => update('format', v)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="zap-filter-label">Attendance</span>
              <ChipGroup options={['On-campus', 'Online', 'Blended']} value={filters.attendance} onChange={(v) => update('attendance', v)} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Master programs ───────────────────────── */}
      <CardsSection
        title="Popular fields. Top <em style='font-style:italic'>master</em> programs."
        unisData={MASTER_UNIS}
        onSearch={onSearch}
      />

      {/* ── Section 3: Student stories ───────────────────────── */}
      <section style={{ background: 'var(--cream-200)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: 'clamp(26px, 4vw, 40px)',
              color: 'var(--ink-900)',
              marginBottom: 40,
              lineHeight: 1.2,
            }}
          >
            Students getting accepted.
          </h2>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {STORIES.map((s) => (
              <div
                key={s.name}
                className="story-card"
                style={{
                  backgroundImage: `url(https://picsum.photos/seed/${s.seed}/400/300)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(160deg, rgba(10,30,20,0.55) 0%, rgba(10,30,20,0.82) 100%)',
                    borderRadius: 'var(--r-lg)',
                  }}
                />
                <div style={{ position: 'relative', zIndex: 1, padding: 28, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end' }}>
                  <div className="story-stat">{s.stat}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 12, marginTop: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 15, color: 'white', lineHeight: 1.55, marginBottom: 14 }}>{s.desc}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.02em' }}>{s.tags}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Bachelor programs ─────────────────────── */}
      <CardsSection
        title="Popular fields. Top <em style='font-style:italic'>bachelor</em> programs."
        unisData={BACHELOR_UNIS}
        onSearch={onSearch}
      />

      {/* ── Section 5: Time comparison ───────────────────────── */}
      <section style={{ background: 'var(--cream-200)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: 'clamp(26px, 4vw, 42px)',
              color: 'var(--ink-900)',
              marginBottom: 18,
              lineHeight: 1.2,
            }}
          >
            Students waste months on research that should take minutes.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink-500)', lineHeight: 1.65, marginBottom: 48, maxWidth: 580, margin: '0 auto 48px' }}>
            The average student spends 6–10 weeks comparing programs across dozens of browser tabs. UniFind replaces all of that with one conversation.
          </p>

          <div style={{ fontSize: 15, color: 'var(--ink-700)', fontWeight: 500, marginBottom: 20 }}>
            I&apos;ve been researching universities for
          </div>

          <input
            type="range"
            className="time-slider"
            min={0}
            max={100}
            value={sliderVal}
            onChange={e => setSliderVal(Number(e.target.value))}
            style={{ width: '100%', marginBottom: 40 }}
          />

          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Left stat */}
            <div
              style={{
                flex: 1,
                minWidth: 200,
                background: 'var(--white)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-xl)',
                padding: '36px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div className="time-stat-red">{hours}</div>
              <div style={{ fontSize: 14, color: 'var(--ink-500)', fontWeight: 500 }}>hours spent researching</div>
            </div>
            {/* Right stat */}
            <div
              style={{
                flex: 1,
                minWidth: 200,
                background: 'var(--white)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-xl)',
                padding: '36px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div className="time-stat-green">3</div>
              <div style={{ fontSize: 14, color: 'var(--ink-500)', fontWeight: 500 }}>minutes to your shortlist</div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: 'var(--green-700)',
                  textTransform: 'uppercase',
                }}
              >
                WITH UNIFIND
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 6: FAQ ───────────────────────────────────── */}
      <section style={{ background: 'var(--cream-100)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: 'clamp(26px, 4vw, 40px)',
              color: 'var(--ink-900)',
              marginBottom: 40,
              lineHeight: 1.2,
            }}
          >
            More questions?
          </h2>
          {FAQS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* ── Section 7: Footer ────────────────────────────────── */}
      <footer className="home-footer">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 48,
              marginBottom: 56,
            }}
          >
            {/* Left: logo + tagline */}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 22,
                  color: 'white',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: 'rgba(255,255,255,0.15)',
                    display: 'grid',
                    placeItems: 'center',
                    fontStyle: 'italic',
                    fontSize: 20,
                  }}
                >
                  U
                </div>
                UniFind
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.7,
                  maxWidth: 280,
                }}
              >
                University research is broken. Students spend weeks across dozens of tabs — and still miss the best options. UniFind fixes that. Describe your goals, and our AI finds, ranks, and explains the right programs for you. Free for every student. Always.
              </p>
            </div>

            {/* Center: links */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 20 }}>
                Navigation
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Home', action: null },
                  { label: 'My Programs', action: () => user ? onMyPrograms?.() : onOpenAuth?.('save-programs') },
                  { label: 'My Chats', action: () => user ? onMyChats?.() : onOpenAuth?.('save-chats') },
                  { label: 'Contact Us', action: () => onFeedback?.() },
                ].map(link => (
                  <button
                    key={link.label}
                    onClick={link.action}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: 14,
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: 0,
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'white' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: social + legal */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 20 }}>
                Follow Us
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {/* Twitter/X */}
                <a
                  href="#"
                  aria-label="Twitter"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.color = 'white' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="#"
                  aria-label="LinkedIn"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.color = 'white' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                {/* Instagram */}
                <a
                  href="#"
                  aria-label="Instagram"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.color = 'white' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: 24,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              fontSize: 13,
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            <div style={{ display: 'flex', gap: 20 }}>
              <button
                onClick={() => onPrivacy?.()}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}
              >
                Privacy Policy
              </button>
              <span>·</span>
              <button
                onClick={() => onTerms?.()}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}
              >
                Terms
              </button>
              <span>·</span>
              <span>Cookies</span>
            </div>
            <div>© {new Date().getFullYear()} UniFind AI. All rights reserved.</div>
          </div>
        </div>

        {/* Watermark */}
        <div className="home-footer-watermark">UniFind AI</div>
      </footer>

      {/* ── Mobile menu drawer ────────────────────────────────── */}
      {menuOpen && (
        <MobileMenuDrawer
          user={user}
          onClose={() => setMenuOpen(false)}
          onOpenAuth={(mode) => { setMenuOpen(false); onOpenAuth(mode) }}
          onSignOut={() => { setMenuOpen(false); onSignOut() }}
          onMyPrograms={() => { setMenuOpen(false); onMyPrograms?.() }}
          onMyChats={() => { setMenuOpen(false); onMyChats?.() }}
          onProfile={() => { setMenuOpen(false); onProfile?.() }}
          onFeedback={() => { setMenuOpen(false); onFeedback?.() }}
          onTerms={() => { setMenuOpen(false); onTerms?.() }}
          onPrivacy={() => { setMenuOpen(false); onPrivacy?.() }}
        />
      )}
    </div>
  )
}

function TuitionCard({ value, onChange }) {
  const [draft, setDraft] = useState(value)
  const [loStr, setLoStr] = useState(String(value[0]))
  const [hiStr, setHiStr] = useState(String(value[1]))

  useEffect(() => {
    setDraft(value)
    setLoStr(String(value[0]))
    setHiStr(String(value[1]))
  }, [value])

  const [lo, hi] = draft

  const applyLo = (raw) => {
    const n = Math.max(0, Math.min(Number(raw) || 0, hi - 100))
    setDraft([n, hi])
    setLoStr(String(n))
  }
  const applyHi = (raw) => {
    const n = Math.min(100000, Math.max(Number(raw) || 0, lo + 100))
    setDraft([lo, n])
    setHiStr(String(n))
  }

  const handleSliderChange = (v) => {
    setDraft(v)
    setLoStr(String(v[0]))
    setHiStr(String(v[1]))
  }

  return (
    <div className="tuition-card">
      <RangeSlider min={0} max={100000} step={100} value={draft} onChange={handleSliderChange} hideInputs />
      <div className="tuition-card-inputs">
        <div className="tuition-input-wrap">
          <span className="tuition-dollar">$</span>
          <input
            type="number"
            value={loStr}
            min={0}
            onChange={(e) => setLoStr(e.target.value)}
            onBlur={(e) => applyLo(e.target.value)}
          />
        </div>
        <span className="tuition-dash">—</span>
        <div className="tuition-input-wrap">
          <span className="tuition-dollar">$</span>
          <input
            type="number"
            value={hiStr}
            max={100000}
            onChange={(e) => setHiStr(e.target.value)}
            onBlur={(e) => applyHi(e.target.value)}
          />
        </div>
      </div>
      <button className="tuition-apply-btn" onClick={() => onChange(draft)}>
        Apply
      </button>
    </div>
  )
}
