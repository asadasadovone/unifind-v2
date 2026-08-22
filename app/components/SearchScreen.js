'use client'
import { useState, useRef, useEffect } from 'react'
import { Icon, Logo, ChipGroup, RangeSlider } from './Icons'
import UserDropdown from './UserDropdown'
import MobileMenuDrawer from './MobileMenuDrawer'
import { POPULAR_COUNTRIES, ALL_COUNTRIES } from '../data'

// ── data ──────────────────────────────────────────────────────────────────────

const FIELD_TABS = ['Computer Science', 'Business & MBA', 'Engineering', 'Law']

const MASTER_UNIS = {
  'Computer Science': [
    { name: 'Technical University of Munich', city: 'Munich', country: 'Germany', tuition: 'Free tuition', start: 'Sep 2026', duration: '2 years', img: '/unis/master/cs/tum.jpg' },
    { name: 'ETH Zürich', city: 'Zürich', country: 'Switzerland', tuition: 'Free tuition', start: 'Sep 2026', duration: '2 years', img: '/unis/master/cs/eth.jpg' },
    { name: 'KTH Royal Institute of Technology', city: 'Stockholm', country: 'Sweden', tuition: 'Free tuition', start: 'Aug 2026', duration: '2 years', img: '/unis/master/cs/kth.jpg' },
    { name: 'TU Delft', city: 'Delft', country: 'Netherlands', tuition: '€2,314/yr', start: 'Sep 2026', duration: '2 years', img: '/unis/master/cs/tudelft.jpg' },
    { name: 'MIT', city: 'Cambridge', country: 'USA', tuition: '$59,000/yr', start: 'Sep 2026', duration: '2 years', img: '/unis/master/cs/mit.jpg' },
  ],
  'Business & MBA': [
    { name: 'HEC Paris', city: 'Paris', country: 'France', tuition: '€15,500/yr', start: 'Sep 2026', duration: '1 year', img: '/unis/master/business/hec.jpg' },
    { name: 'London Business School', city: 'London', country: 'UK', tuition: '£45,000/yr', start: 'Sep 2026', duration: '2 years', img: '/unis/master/business/lbs.jpg' },
    { name: 'INSEAD', city: 'Fontainebleau', country: 'France', tuition: '€95,000/yr', start: 'Sep 2026', duration: '1 year', img: '/unis/master/business/insead.webp' },
    { name: 'Bocconi University', city: 'Milan', country: 'Italy', tuition: '€14,000/yr', start: 'Sep 2026', duration: '2 years', img: '/unis/master/business/bocconi.jpg' },
    { name: 'Erasmus University (RSM)', city: 'Rotterdam', country: 'Netherlands', tuition: '€17,500/yr', start: 'Sep 2026', duration: '2 years', img: '/unis/master/business/rsm.jpg' },
  ],
  'Engineering': [
    { name: 'ETH Zürich', city: 'Zürich', country: 'Switzerland', tuition: 'Free tuition', start: 'Sep 2026', duration: '2 years', img: '/unis/master/engineering/eth.jpg' },
    { name: 'TU Delft', city: 'Delft', country: 'Netherlands', tuition: '€2,314/yr', start: 'Sep 2026', duration: '2 years', img: '/unis/master/engineering/tudelft.jpg' },
    { name: 'KTH Royal Institute of Technology', city: 'Stockholm', country: 'Sweden', tuition: 'Free tuition', start: 'Aug 2026', duration: '2 years', img: '/unis/master/engineering/kth.jpg' },
    { name: 'RWTH Aachen University', city: 'Aachen', country: 'Germany', tuition: 'Free tuition', start: 'Oct 2026', duration: '2 years', img: '/unis/master/engineering/rwth.jpg' },
    { name: 'University of Cambridge', city: 'Cambridge', country: 'UK', tuition: '£35,000/yr', start: 'Oct 2026', duration: '1 year', img: '/unis/master/engineering/cambridge.jpg' },
  ],
  'Law': [
    { name: 'Leiden University', city: 'Leiden', country: 'Netherlands', tuition: '€2,314/yr', start: 'Sep 2026', duration: '1 year', img: '/unis/master/law/leiden.webp' },
    { name: 'University of Oxford', city: 'Oxford', country: 'UK', tuition: '£31,000/yr', start: 'Oct 2026', duration: '1 year', img: '/unis/master/law/oxford.webp' },
    { name: 'Harvard Law School', city: 'Cambridge', country: 'USA', tuition: '$67,000/yr', start: 'Sep 2026', duration: '1 year', img: '/unis/master/law/harvard.webp' },
    { name: 'University of Amsterdam', city: 'Amsterdam', country: 'Netherlands', tuition: '€2,314/yr', start: 'Sep 2026', duration: '1 year', img: '/unis/master/law/amsterdam.jpg' },
    { name: 'Sciences Po Law School', city: 'Paris', country: 'France', tuition: '€14,000/yr', start: 'Sep 2026', duration: '2 years', img: '/unis/master/law/sciencespo.jpg' },
  ],
}

const BACHELOR_UNIS = {
  'Computer Science': [
    { name: 'Technical University of Munich', city: 'Munich', country: 'Germany', tuition: 'Free tuition', start: 'Oct 2026', duration: '3 years', img: '/unis/bachelor/cs/tum.jpg' },
    { name: 'ETH Zürich', city: 'Zürich', country: 'Switzerland', tuition: 'Free tuition', start: 'Sep 2026', duration: '3 years', img: '/unis/bachelor/cs/eth.jpg' },
    { name: 'KTH Royal Institute of Technology', city: 'Stockholm', country: 'Sweden', tuition: 'Free tuition', start: 'Aug 2026', duration: '3 years', img: '/unis/bachelor/cs/kth.jpg' },
    { name: 'TU Delft', city: 'Delft', country: 'Netherlands', tuition: '€2,314/yr', start: 'Sep 2026', duration: '3 years', img: '/unis/bachelor/cs/tudelft.jpg' },
    { name: 'EPFL', city: 'Lausanne', country: 'Switzerland', tuition: 'Free tuition', start: 'Sep 2026', duration: '3 years', img: '/unis/bachelor/cs/epfl.webp' },
  ],
  'Business & MBA': [
    { name: 'Bocconi University', city: 'Milan', country: 'Italy', tuition: '€14,000/yr', start: 'Sep 2026', duration: '3 years', img: '/unis/bachelor/business/bocconi.jpg' },
    { name: 'Copenhagen Business School', city: 'Copenhagen', country: 'Denmark', tuition: 'Free tuition', start: 'Sep 2026', duration: '3 years', img: '/unis/bachelor/business/cbs.jpg' },
    { name: 'Erasmus University (RSM)', city: 'Rotterdam', country: 'Netherlands', tuition: '€12,000/yr', start: 'Sep 2026', duration: '3 years', img: '/unis/bachelor/business/rsm.jpg' },
    { name: 'University of St. Gallen', city: 'St. Gallen', country: 'Switzerland', tuition: 'CHF 1,566/yr', start: 'Sep 2026', duration: '3 years', img: '/unis/bachelor/business/hsg.jpg' },
    { name: 'NUS Business School', city: 'Singapore', country: 'Singapore', tuition: 'S$17,500/yr', start: 'Aug 2026', duration: '4 years', img: '/unis/bachelor/business/nus.jpg' },
  ],
  'Engineering': [
    { name: 'ETH Zürich', city: 'Zürich', country: 'Switzerland', tuition: 'Free tuition', start: 'Sep 2026', duration: '3 years', img: '/unis/bachelor/engineering/eth.jpg' },
    { name: 'TU Delft', city: 'Delft', country: 'Netherlands', tuition: '€2,314/yr', start: 'Sep 2026', duration: '3 years', img: '/unis/bachelor/engineering/tudelft.jpg' },
    { name: 'KTH Royal Institute of Technology', city: 'Stockholm', country: 'Sweden', tuition: 'Free tuition', start: 'Aug 2026', duration: '3 years', img: '/unis/bachelor/engineering/kth.jpg' },
    { name: 'RWTH Aachen University', city: 'Aachen', country: 'Germany', tuition: 'Free tuition', start: 'Oct 2026', duration: '3 years', img: '/unis/bachelor/engineering/rwth.jpg' },
    { name: 'MIT', city: 'Cambridge', country: 'USA', tuition: '$59,000/yr', start: 'Sep 2026', duration: '4 years', img: '/unis/bachelor/engineering/mit.jpg' },
  ],
  'Law': [
    { name: 'Leiden University', city: 'Leiden', country: 'Netherlands', tuition: '€2,314/yr', start: 'Sep 2026', duration: '3 years', img: '/unis/bachelor/law/leiden.webp' },
    { name: 'University of Oxford', city: 'Oxford', country: 'UK', tuition: '£9,250/yr', start: 'Oct 2026', duration: '3 years', img: '/unis/bachelor/law/oxford.webp' },
    { name: 'University of Amsterdam', city: 'Amsterdam', country: 'Netherlands', tuition: '€2,314/yr', start: 'Sep 2026', duration: '3 years', img: '/unis/bachelor/law/amsterdam.jpg' },
    { name: 'Maastricht University', city: 'Maastricht', country: 'Netherlands', tuition: '€2,314/yr', start: 'Sep 2026', duration: '3 years', img: '/unis/bachelor/law/maastricht.jpg' },
    { name: 'Sciences Po Law School', city: 'Paris', country: 'France', tuition: '€14,000/yr', start: 'Sep 2026', duration: '3 years', img: '/unis/bachelor/law/sciencespo.jpg' },
  ],
}

const STORIES = [
  { stat: '8', label: 'free programs found', name: 'Seung', desc: 'Seung found 8 fully-funded CS programs in under 5 minutes and got into his first choice', tags: ['Computer Science', 'Germany', 'Free tuition'], img: '/students/s1.jpg' },
  { stat: '6 weeks', label: 'of research saved', name: 'Sofia', desc: 'Sofia replaced 6 weeks of browser tabs with one UniAsk conversation — then got into KTH', tags: ['European Law', 'Sweden', 'Free tuition'], img: '/students/s2.jpg' },
  { stat: '€0', label: 'tuition per year', name: 'Mohamed', desc: 'Mohamed discovered he could study Data Science in Europe for free', tags: ['Data Science', 'Netherlands', 'Free tuition'], img: '/students/s3.jpg' },
]

const FAQS = [
  { q: "Is UniAsk really free? What's the catch?", a: 'While you would spend weeks Googling, our AI scans thousands of programs in seconds — and ranks them by fit. The core search is always free.' },
  { q: 'How is this different from just Googling or using StudyPortals?', a: 'UniAsk uses AI to understand your goals, budget, and preferences — then finds and ranks programs that actually match, saving you weeks of manual research.' },
  { q: 'How accurate is the information? Can I rely on it for my application?', a: 'Our data is updated weekly from official university sources. Always verify final details directly with the university before applying.' },
  { q: "I don't know what I want to study yet. Can UniAsk still help me?", a: 'Absolutely. Describe your interests, budget, and target countries — our AI will suggest fields and programs that match your profile.' },
  { q: 'My situation is complicated. Will the AI actually understand me?', a: 'Yes. The AI is trained to handle complex situations — dual nationality, gap years, non-traditional backgrounds, specific visa requirements.' },
  { q: 'Does UniAsk cover visa requirements and cost of living?', a: 'Yes. The AI advisor on each program page can answer questions about visas, cost of living, housing, and life in that city.' },
  { q: 'What programs and countries does UniAsk cover?', a: 'UniAsk covers thousands of programs across 50+ countries, with a focus on English-taught and European programs.' },
  { q: 'Can I save my research and come back later?', a: 'Yes — create a free account to save programs, continue AI chats, and track your shortlist across devices.' },
]

// ── sub-components ────────────────────────────────────────────────────────────

function UniCard({ uni, field }) {
  const isFree = uni.tuition === 'Free tuition'
  return (
    <div style={{ minWidth: 280, maxWidth: 280, background: '#fff', borderRadius: 16, border: '1px solid #E8E8E8', overflow: 'hidden', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 172, overflow: 'hidden', position: 'relative' }}>
        <img src={uni.img} alt={uni.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#0162E3' }}>{field}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#111', lineHeight: 1.3 }}>{uni.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#555', marginTop: 2 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          {uni.city}, {uni.country}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#555' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          Starts {uni.start}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
          <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: isFree ? '#E8F5E9' : '#F2F2F2', color: isFree ? '#1B7C3A' : '#444', border: `1px solid ${isFree ? '#B8E0C0' : '#E0E0E0'}` }}>{uni.tuition}</span>
          <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: '#F2F2F2', color: '#444', border: '1px solid #E0E0E0' }}>English</span>
          <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: '#F2F2F2', color: '#444', border: '1px solid #E0E0E0' }}>{uni.duration}</span>
        </div>
        <button
          style={{ marginTop: 12, width: '100%', padding: '11px', background: '#0162E3', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Ask AI
        </button>
      </div>
    </div>
  )
}

function CardsSection({ heading, data, field, onFieldChange }) {
  const rowRef = useRef(null)
  const scroll = (dir) => {
    if (rowRef.current) rowRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }
  const unis = data[field] || []
  return (
    <section style={{ background: '#fff', padding: '72px 0 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
        <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: '#111', margin: '0 0 28px', fontFamily: 'Geist, sans-serif' }}>{heading}</h2>
        {/* Field tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, borderBottom: '1px solid #E8E8E8', paddingBottom: 0 }}>
          {FIELD_TABS.map(t => (
            <button key={t} onClick={() => onFieldChange(t)} style={{ padding: '8px 0', marginRight: 24, fontSize: 15, fontWeight: 500, color: t === field ? '#0162E3' : '#888', background: 'none', border: 'none', borderBottom: t === field ? '2px solid #0162E3' : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit', marginBottom: -1, transition: 'all 0.15s' }}>
              {t}
            </button>
          ))}
        </div>
        {/* Cards row */}
        <div ref={rowRef} style={{ display: 'flex', gap: 16, overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: 4 }}>
          {unis.map((u, i) => <UniCard key={i} uni={u} field={field} />)}
        </div>
        {/* Nav arrows */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <button onClick={() => scroll(-1)} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #E0E0E0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button onClick={() => scroll(1)} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #E0E0E0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </section>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #E8E8E8', padding: '20px 0' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', padding: 0 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#111', paddingRight: 24 }}>{q}</span>
        <span style={{ fontSize: 22, color: '#555', lineHeight: 1, flexShrink: 0, fontWeight: 300 }}>{open ? '−' : '+'}</span>
      </button>
      {open && <p style={{ margin: '12px 0 0', fontSize: 15, color: '#555', lineHeight: 1.7 }}>{a}</p>}
    </div>
  )
}

// ── TuitionCard (local) ───────────────────────────────────────────────────────

function TuitionCard({ value, onChange }) {
  const [lo, hi] = value
  const [loStr, setLoStr] = useState(String(lo))
  const [hiStr, setHiStr] = useState(String(hi))
  const MIN = 0, MAX = 100000, STEP = 500, GAP = 1000
  useEffect(() => { setLoStr(String(lo)) }, [lo])
  useEffect(() => { setHiStr(String(hi)) }, [hi])
  const applyLoTxt = raw => { const n = Math.max(MIN, Math.min(Number(raw) || MIN, hi - GAP)); onChange([n, hi]); setLoStr(String(n)) }
  const applyHiTxt = raw => { const n = Math.min(MAX, Math.max(Number(raw) || MIN, lo + GAP)); onChange([lo, n]); setHiStr(String(n)) }
  const onLoRange = e => { const n = Math.min(Number(e.target.value), hi - GAP); onChange([n, hi]) }
  const onHiRange = e => { const n = Math.max(Number(e.target.value), lo + GAP); onChange([lo, n]) }
  const pctLo = (lo / MAX) * 100
  const pctHi = (hi / MAX) * 100
  return (
    <div style={{ padding: 4 }}>
      {/* Slider */}
      <div style={{ position: 'relative', height: 32, margin: '4px 0 14px' }}>
        {/* Track */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 4, background: '#E0E0E0', borderRadius: 999, transform: 'translateY(-50%)' }} />
        {/* Filled */}
        <div style={{ position: 'absolute', left: `${pctLo}%`, right: `${100 - pctHi}%`, top: '50%', height: 4, background: '#0162E3', borderRadius: 999, transform: 'translateY(-50%)' }} />
        {/* Lo input */}
        <input
          type="range" min={MIN} max={MAX} step={STEP} value={lo} onChange={onLoRange}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent', appearance: 'none', WebkitAppearance: 'none', pointerEvents: 'none', margin: 0, opacity: 1 }}
          className="tuition-range tuition-range-lo"
        />
        {/* Hi input */}
        <input
          type="range" min={MIN} max={MAX} step={STEP} value={hi} onChange={onHiRange}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent', appearance: 'none', WebkitAppearance: 'none', pointerEvents: 'none', margin: 0, opacity: 1 }}
          className="tuition-range tuition-range-hi"
        />
        <style jsx>{`
          .tuition-range { -webkit-appearance: none; appearance: none; background: transparent; }
          .tuition-range::-webkit-slider-runnable-track { background: transparent; height: 32px; }
          .tuition-range::-moz-range-track { background: transparent; height: 32px; }
          .tuition-range::-webkit-slider-thumb {
            -webkit-appearance: none; appearance: none;
            width: 18px; height: 18px; border-radius: 50%;
            background: #fff; border: 2px solid #0162E3;
            cursor: grab; pointer-events: auto; margin-top: 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          }
          .tuition-range::-moz-range-thumb {
            width: 18px; height: 18px; border-radius: 50%;
            background: #fff; border: 2px solid #0162E3;
            cursor: grab; pointer-events: auto;
            box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          }
        `}</style>
      </div>
      {/* Text inputs */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, background: '#F5F5F5', border: '1px solid #E0E0E0', borderRadius: 8, padding: '8px 10px' }}>
          <span style={{ fontSize: 12, color: '#888' }}>$</span>
          <input value={loStr} onChange={e => setLoStr(e.target.value)} onBlur={e => applyLoTxt(e.target.value)} style={{ flex: 1, border: 'none', background: 'none', fontSize: 13, outline: 'none', minWidth: 0, fontFamily: 'inherit' }} />
        </div>
        <span style={{ color: '#ccc' }}>—</span>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, background: '#F5F5F5', border: '1px solid #E0E0E0', borderRadius: 8, padding: '8px 10px' }}>
          <span style={{ fontSize: 12, color: '#888' }}>$</span>
          <input value={hiStr} onChange={e => setHiStr(e.target.value)} onBlur={e => applyHiTxt(e.target.value)} style={{ flex: 1, border: 'none', background: 'none', fontSize: 13, outline: 'none', minWidth: 0, fontFamily: 'inherit' }} />
        </div>
      </div>
    </div>
  )
}

// ── main export ───────────────────────────────────────────────────────────────

export default function SearchScreen({ filters, setFilters, onSearch, onOpenAuth, user, onSignOut, isPremium, onUpgrade, onMyPrograms, onMyChats, onProfile, onFeedback, onTerms, onPrivacy }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showTuition, setShowTuition] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [masterField, setMasterField] = useState('Computer Science')
  const [bachelorField, setBachelorField] = useState('Computer Science')
  const [sliderVal, setSliderVal] = useState(0)
  const tuitionRef = useRef(null)
  const helpRef = useRef(null)

  // derived display values
  const degree = filters.degree?.[0] || 'Bachelor'
  const [tuitionLo, tuitionHi] = filters.tuition || [0, 100000]
  const tuitionLabel = tuitionLo === 0 && tuitionHi === 100000 ? 'Free – $100,000' : `$${tuitionLo.toLocaleString()} – $${tuitionHi.toLocaleString()}`
  const hoursVal = Math.round(240 - (sliderVal / 100) * 239)

  useEffect(() => {
    const close = e => {
      if (tuitionRef.current && !tuitionRef.current.contains(e.target)) setShowTuition(false)
      if (helpRef.current && !helpRef.current.contains(e.target)) setShowHelp(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const setDegree = d => setFilters(f => ({ ...f, degree: [d] }))

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: 'Geist, -apple-system, sans-serif', background: '#fff', minHeight: '100vh' }}>

      {/* ── NAV ── */}
      <header style={{ background: '#05203C', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {/* Left — logo + center nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <button className="mobile-burger-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu" style={{ color: '#fff' }}>
              <Icon name="menu" size={22} />
            </button>
            <Logo size="sm" />
          </div>

          {/* Center nav */}
          <nav className="nav-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', padding: '8px 14px', borderRadius: 8 }}>Homepage</button>
            <button onClick={onMyPrograms} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', padding: '8px 14px', borderRadius: 8 }}>My Programs</button>
            <button onClick={onMyChats} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', padding: '8px 14px', borderRadius: 8 }}>My Chats</button>
            {/* Help dropdown */}
            <div ref={helpRef} style={{ position: 'relative' }}>
              <button onClick={() => setShowHelp(s => !s)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', padding: '8px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                Help
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              {showHelp && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '1px solid #E8E8E8', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 200, zIndex: 300, overflow: 'hidden' }}>
                  <button onClick={() => { setShowHelp(false); onFeedback?.() }} style={{ display: 'block', width: '100%', padding: '12px 18px', background: 'none', border: 'none', textAlign: 'left', fontSize: 14, color: '#111', cursor: 'pointer', fontFamily: 'inherit' }}>Send feedback</button>
                  <button onClick={() => { setShowHelp(false); onTerms?.() }} style={{ display: 'block', width: '100%', padding: '12px 18px', background: 'none', border: 'none', textAlign: 'left', fontSize: 14, color: '#111', cursor: 'pointer', fontFamily: 'inherit' }}>Terms of Service</button>
                  <button onClick={() => { setShowHelp(false); onPrivacy?.() }} style={{ display: 'block', width: '100%', padding: '12px 18px', background: 'none', border: 'none', textAlign: 'left', fontSize: 14, color: '#111', cursor: 'pointer', fontFamily: 'inherit' }}>Privacy Policy</button>
                </div>
              )}
            </div>
          </nav>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {user ? (
              <UserDropdown user={user} onSignOut={onSignOut} onProfile={onProfile} onFeedback={onFeedback} onTerms={onTerms} onPrivacy={onPrivacy} dark />
            ) : (
              <>
                <button onClick={onOpenAuth} style={{ padding: '9px 22px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.5)', background: '#fff', color: '#05203C', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Log in</button>
                <button onClick={onOpenAuth} style={{ padding: '9px 22px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.5)', background: 'transparent', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Sign up for free</button>
              </>
            )}
          </div>
        </div>
        <style>{`.mobile-burger-btn { display: none !important; } @media (max-width: 768px) { .mobile-burger-btn { display: flex !important; } }`}</style>
      </header>

      {/* ── HERO ── */}
      <section style={{ background: '#05203C', padding: '56px 48px 72px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.02em', color: '#fff', textTransform: 'uppercase', marginBottom: 20 }}>YOUR GOALS. YOUR BUDGET. ANY UNIVERSITY.</p>
        <h1 style={{ fontSize: 'clamp(40px,5.5vw,68px)', fontWeight: 700, color: '#fff', margin: '0 0 36px', lineHeight: 1.1, fontFamily: 'Geist, sans-serif', letterSpacing: '-0.02em' }}>Find your next university</h1>

        {/* Degree pills — white container, navy filled active */}
        <div style={{ display: 'inline-flex', gap: 0, background: '#fff', borderRadius: 999, padding: 4, marginBottom: 32 }}>
          {['Bachelor', 'Master', 'PhD'].map(d => {
            const active = degree === d
            return (
              <button
                key={d}
                onClick={() => setDegree(d)}
                style={{
                  padding: '10px 32px',
                  borderRadius: 999,
                  border: active ? '2px solid #fff' : 'none',
                  background: active ? '#05203C' : 'transparent',
                  color: active ? '#fff' : '#05203C',
                  fontWeight: 500,
                  fontSize: 15,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                {d}
              </button>
            )
          })}
        </div>

        {/* Search bar */}
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', alignItems: 'stretch', gap: 12 }}>
          <div style={{ flex: 1, background: '#fff', borderRadius: 16, display: 'flex', alignItems: 'stretch', overflow: 'visible', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
            {/* Field of study */}
            <div style={{ flex: '1 1 240px', padding: '16px 24px', borderRight: '1px solid #EEE', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Field of Study</label>
              <input
                value={filters.field || ''}
                onChange={e => setFilters(f => ({ ...f, field: e.target.value }))}
                placeholder="e.g. Computer Science"
                style={{ border: 'none', outline: 'none', fontSize: 15, color: '#111', fontFamily: 'inherit', background: 'transparent', padding: 0 }}
              />
            </div>
            {/* Country */}
            <div style={{ flex: '1 1 180px', padding: '16px 24px', borderRight: '1px solid #EEE', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, position: 'relative' }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Country</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={filters.country || ''}
                  onChange={e => setFilters(f => ({ ...f, country: e.target.value }))}
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15, color: '#111', fontFamily: 'inherit', background: 'transparent', appearance: 'none', cursor: 'pointer', padding: '0 22px 0 0' }}
                >
                  <option value="">Any country</option>
                  {POPULAR_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  <option disabled>──────────</option>
                  {ALL_COUNTRIES.filter(c => !POPULAR_COUNTRIES.includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
            {/* Start date */}
            <div style={{ flex: '1 1 160px', padding: '16px 24px', borderRight: '1px solid #EEE', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start Date</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={filters.startDate || ''}
                  onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))}
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15, color: '#111', fontFamily: 'inherit', background: 'transparent', appearance: 'none', cursor: 'pointer', padding: '0 22px 0 0' }}
                >
                  <option value="">Any start date</option>
                  {['Jan 2025','Feb 2025','Mar 2025','Apr 2025','May 2025','Jun 2025','Jul 2025','Aug 2025','Sep 2025','Oct 2025','Nov 2025','Dec 2025','Jan 2026','Feb 2026','Mar 2026','Apr 2026','May 2026','Jun 2026','Jul 2026','Aug 2026','Sep 2026','Oct 2026','Nov 2026','Dec 2026'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
            {/* Tuition */}
            <div ref={tuitionRef} style={{ flex: '1 1 180px', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, position: 'relative', cursor: 'pointer' }} onClick={() => setShowTuition(s => !s)}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', pointerEvents: 'none' }}>Tuition (USD/yr)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ fontSize: 15, color: '#111', userSelect: 'none', display: 'block', padding: '0 22px 0 0' }}>{tuitionLabel}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><path d="m6 9 6 6 6-6"/></svg>
              </div>
              {showTuition && (
                <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 300, background: '#fff', border: '1px solid #E0E0E0', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: 16, zIndex: 200 }}>
                  <TuitionCard value={filters.tuition || [0, 100000]} onChange={v => setFilters(f => ({ ...f, tuition: v }))} />
                </div>
              )}
            </div>
          </div>
          {/* Search button — separate rounded */}
          <button
            onClick={onSearch}
            style={{ flexShrink: 0, padding: '0 40px', background: '#0162E3', color: '#fff', border: 'none', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 16, minWidth: 120 }}
          >
            Search
          </button>
        </div>

        {/* Format + Attendance chips */}
        <div style={{ display: 'flex', gap: 40, justifyContent: 'flex-start', maxWidth: 1240, margin: '20px auto 0', paddingLeft: 4, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Format</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Full-time', 'Part-time'].map(v => {
                const active = (filters.format || []).includes(v)
                return (
                  <button
                    key={v}
                    onClick={() => setFilters(f => ({ ...f, format: active ? (f.format || []).filter(x => x !== v) : [...(f.format || []), v] }))}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 999,
                      border: `1px solid ${active ? '#0162E3' : 'rgba(255,255,255,0.35)'}`,
                      background: active ? '#0162E3' : 'transparent',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}
                  >
                    {v}
                  </button>
                )
              })}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attendance</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {['On-campus', 'Online', 'Blended'].map(v => {
                const active = (filters.attendance || []).includes(v)
                return (
                  <button
                    key={v}
                    onClick={() => setFilters(f => ({ ...f, attendance: active ? (f.attendance || []).filter(x => x !== v) : [...(f.attendance || []), v] }))}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 999,
                      border: `1px solid ${active ? '#0162E3' : 'rgba(255,255,255,0.35)'}`,
                      background: active ? '#0162E3' : 'transparent',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}
                  >
                    {v}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── MASTER PROGRAMS ── */}
      <CardsSection
        heading={<>Popular fields. Top <span style={{ color: '#0162E3' }}>master</span> programs.</>}
        data={MASTER_UNIS}
        field={masterField}
        onFieldChange={setMasterField}
      />

      {/* ── STUDENTS GETTING ACCEPTED ── */}
      <section style={{ background: '#F2F2F2', padding: '80px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: '#111', margin: '0 0 36px', fontFamily: 'Geist, sans-serif' }}>Students getting accepted.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {STORIES.map((s, i) => (
              <div key={i} style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', border: '1px solid #E8E8E8' }}>
                <div style={{ position: 'relative', height: 220 }}>
                  <img src={s.img} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
                    <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.stat}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{s.label}</div>
                  </div>
                </div>
                <div style={{ padding: '16px 20px 20px' }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                    {s.tags.map(t => <span key={t} style={{ padding: '3px 10px', borderRadius: 999, background: '#F2F2F2', fontSize: 12, color: '#555', border: '1px solid #E0E0E0' }}>{t}</span>)}
                  </div>
                  <p style={{ margin: 0, fontSize: 15, color: '#111', lineHeight: 1.5, fontWeight: 500 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BACHELOR PROGRAMS ── */}
      <CardsSection
        heading={<>Popular fields. Top <span style={{ color: '#0162E3' }}>bachelor</span> programs.</>}
        data={BACHELOR_UNIS}
        field={bachelorField}
        onFieldChange={setBachelorField}
      />

      {/* ── TIME COMPARISON ── */}
      <section style={{ background: '#F2F2F2', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: '#111', margin: '0 0 16px', fontFamily: 'Geist, sans-serif', lineHeight: 1.2 }}>Students waste months on research<br />that should take minutes.</h2>
          <p style={{ fontSize: 16, color: '#666', margin: '0 0 48px', lineHeight: 1.6 }}>The average student spends 6–10 weeks comparing programs across dozens of browser tabs. UniAsk replaces all of that with one conversation.</p>
          <p style={{ fontSize: 15, color: '#555', marginBottom: 16 }}>I've been researching universities for</p>
          <input type="range" min="0" max="100" value={sliderVal} onChange={e => setSliderVal(Number(e.target.value))} style={{ width: '100%', accentColor: '#05203C', cursor: 'pointer', marginBottom: 36 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '28px', border: '1px solid #E8E8E8', textAlign: 'left' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>YOUR RESEARCH SO FAR</div>
              <div style={{ fontSize: 64, fontWeight: 800, color: '#E53E3E', lineHeight: 1 }}>{hoursVal}</div>
              <div style={{ fontSize: 15, color: '#555', marginTop: 8 }}><strong>hours</strong> spent researching</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 16, padding: '28px', border: '1px solid #E8E8E8', textAlign: 'left' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0162E3', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>WITH <strong>UNIASK</strong></div>
              <div style={{ fontSize: 64, fontWeight: 800, color: '#0162E3', lineHeight: 1 }}>3</div>
              <div style={{ fontSize: 15, color: '#555', marginTop: 8 }}><strong>minutes</strong> to your shortlist</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: '#111', margin: '0 0 8px', fontFamily: 'Geist, sans-serif', textAlign: 'center' }}>More questions?</h2>
          <p style={{ textAlign: 'center', color: '#888', marginBottom: 40, fontSize: 15 }}>Everything you need to know about UniAsk.</p>
          {FAQS.map((f, i) => <FaqItem key={i} {...f} />)}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#05203C', padding: '80px 48px 32px', color: '#fff', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Top row: description (left) + nav+social (right) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 40, marginBottom: 24, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0, maxWidth: 520 }}>
              University research is broken. Students spend weeks across dozens of tabs — and still miss the best options. UniAsk fixes that. Describe your goals, and our AI finds, ranks, and explains the right programs for you. Free for every student. Always.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 24 }}>
              <nav style={{ display: 'flex', gap: 40 }}>
                <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Home</button>
                <button onClick={onMyPrograms} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>My Programs</button>
                <button onClick={onMyChats} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>My Chats</button>
                <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Contact Us</button>
              </nav>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { label: 'Instagram', d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z' },
                  { label: 'Facebook', d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                  { label: 'TikTok', d: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.03-8.49a8.18 8.18 0 0 0 4.79 1.52V5.01a4.85 4.85 0 0 1-1-.32z' },
                  { label: 'X', d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                ].map(({ label, d }) => (
                  <div key={label} title={label} style={{ width: 32, height: 32, borderRadius: '50%', background: '#0162E3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d={d} /></svg>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Watermark — gradient silver text */}
          <div style={{ position: 'relative', margin: '20px 0 32px', textAlign: 'center', overflow: 'hidden' }}>
            <div
              style={{
                fontSize: 'clamp(90px, 17vw, 260px)',
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                fontFamily: 'Geist, sans-serif',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.32) 30%, rgba(5,32,60,0.85) 85%, rgba(5,32,60,1) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                margin: 0,
              }}
            >
              UniAsk AI
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <button onClick={onPrivacy} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Privacy Policy</button>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
              <button onClick={onTerms} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Terms</button>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
              <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Cookies</button>
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>© 2025 UniAsk · Built for students, by people who remember the struggle.</div>
          </div>
        </div>
      </footer>

      {menuOpen && (
        <MobileMenuDrawer
          user={user}
          onClose={() => setMenuOpen(false)}
          onOpenAuth={() => { setMenuOpen(false); onOpenAuth?.() }}
          onSignOut={() => { setMenuOpen(false); onSignOut?.() }}
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
