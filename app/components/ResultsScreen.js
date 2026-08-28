'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import MobileMenuDrawer from './MobileMenuDrawer'
import { SiteNav, SiteFooter, useIsMobile } from './SiteChrome'
import { POPULAR_COUNTRIES, ALL_COUNTRIES } from '../data'

/* Figma 506:1964 — results page.
   Note: the card and sidebar in that frame still use the old green tokens
   (#143229 / #2a6b54) while the rest of the site is navy/blue. Reproduced
   here as drawn. */
const INK = '#1a1a17'
const CARD_BORDER = '#e6e2d6'
/* The newer mobile frame (550:6469) uses navy for both; the older desktop
   frame still carries the retired green tokens. Navy is used throughout so the
   card does not change colour across the breakpoint. */
const NAME = '#05203c'
const FIELD = '#05203c'
const BLUE = '#116ce4'

const DURATIONS = ['1 year', '1.5 years', '2 years', '3+ years']

/* Compare numerically, not by string prefix: "1 year" must not also match
   "1.5 years". Months are converted so "10 months" lands in the 1-year bucket. */
const durationYears = raw => {
  const d = String(raw ?? '').toLowerCase()
  const m = d.match(/(\d+(?:[.,]\d+)?)/)
  if (!m) return null
  const n = parseFloat(m[1].replace(',', '.'))
  return d.includes('month') ? n / 12 : n
}

const matchesDuration = (raw, sel) => {
  const y = durationYears(raw)
  if (y == null) return false
  if (sel === '3+ years') return y >= 2.75
  if (sel === '1 year') return y > 0 && y <= 1.24
  if (sel === '1.5 years') return y > 1.24 && y <= 1.74
  if (sel === '2 years') return y > 1.74 && y < 2.75
  return false
}

// ── small pieces ──────────────────────────────────────────────────────────────

function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 20px', borderRadius: 999,
        border: `1px solid ${active ? '#0162E3' : 'rgba(255,255,255,0.35)'}`,
        background: active ? '#0162E3' : 'transparent',
        color: '#fff', fontSize: 14, fontWeight: 500,
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      {children}
    </button>
  )
}

const ic = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
const IconCoin = () => <svg {...ic}><circle cx="12" cy="12" r="10" /><path d="M12 6v12M15 9.5a2.5 2.5 0 0 0-2.5-2.5h-1a2.5 2.5 0 0 0 0 5h1a2.5 2.5 0 0 1 0 5h-1A2.5 2.5 0 0 1 9 14.5" /></svg>
const IconHat = () => <svg {...ic}><path d="M22 9 12 5 2 9l10 4 10-4Z" /><path d="M6 11v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></svg>
const IconBuilding = () => <svg {...ic}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 8h1M14 8h1M9 12h1M14 12h1M10 21v-4h4v4" /></svg>
const IconLang = () => <svg {...ic}><path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" /></svg>
const IconClock = () => <svg {...ic}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
const IconPin = () => <svg {...ic}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
const IconCal = () => <svg {...ic}><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
const IconSparkle = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M10 12.6667C10.8 10.2147 11.684 9.33 14 8.66667C11.684 8.00333 10.8 7.11867 10 4.66667C9.2 7.11867 8.316 8.00333 6 8.66667C8.316 9.33 9.2 10.2147 10 12.6667ZM4.66667 6.66667C5.06667 5.44 5.50867 4.998 6.66667 4.66667C5.50867 4.33533 5.06667 3.89333 4.66667 2.66667C4.26667 3.89333 3.82467 4.33533 2.66667 4.66667C3.82467 4.998 4.26667 5.44 4.66667 6.66667ZM5.66667 13.3333C5.86667 12.72 6.08733 12.4993 6.66667 12.3333C6.08733 12.1673 5.86667 11.9467 5.66667 11.3333C5.46667 11.9467 5.246 12.1673 4.66667 12.3333C5.246 12.4993 5.46667 12.72 5.66667 13.3333Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
)
const IconExternal = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

function Badge({ icon, children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '6px 10px', borderRadius: 10, background: '#f7f7f7',
      fontSize: 12, fontWeight: 500, color: '#3a3a35', lineHeight: '18px',
    }}>
      {icon}
      {children}
    </span>
  )
}

function Checkbox({ checked, onChange, label, count }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', cursor: 'pointer' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" checked={checked} onChange={onChange} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
        <span style={{
          width: 20, height: 20, borderRadius: 6, flexShrink: 0,
          border: `1px solid ${checked ? '#000' : '#6b6b6b'}`,
          background: checked ? '#000' : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {checked && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
        <span style={{ fontSize: 16, fontWeight: 500, color: INK, lineHeight: '20px' }}>{label}</span>
      </span>
      <span style={{ fontSize: 14, fontWeight: 500, color: '#818181', lineHeight: '20px' }}>{count}</span>
    </label>
  )
}

/* Module scope on purpose — declared inside the screen it would be a new
   component type each render and remount its children on every keystroke. */
function FilterGroup({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ borderBottom: `1px solid ${CARD_BORDER}`, padding: '22px 0 23px', display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '4px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
      >
        <span style={{ fontSize: 13, fontWeight: 500, color: INK, textTransform: 'uppercase', letterSpacing: '0.78px' }}>{title}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>{children}</div>}
    </div>
  )
}

function PromoCard({ children }) {
  return <div style={{ background: '#fff', border: '1px solid #e6e6e6', borderRadius: 20, overflow: 'hidden' }}>{children}</div>
}

// ── result card ───────────────────────────────────────────────────────────────

function ResultCard({ uni, onOpen, onAskAI, saved, onSave, isMobile }) {
  return (
    <article style={{ background: '#fff', border: `1px solid ${CARD_BORDER}`, borderRadius: 20, padding: isMobile ? 18 : 25 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 0 }}>
          <div style={{ flex: '1 0 0', minWidth: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button
              onClick={onOpen}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: isMobile ? 19 : 22, fontWeight: 500, color: NAME, lineHeight: '26.4px', wordBreak: 'break-word' }}
            >
              {uni.name}
            </button>
            <div style={{ fontSize: 16, fontWeight: 500, color: FIELD, lineHeight: '19.5px' }}>{uni.field}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 8, paddingTop: 4.5, color: '#000' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <IconPin />
                <span style={{ fontSize: 14, lineHeight: '19.5px' }}>{[uni.city, uni.country].filter(Boolean).join(', ')}</span>
              </span>
              <span style={{ width: 3, height: 3, background: '#000', flexShrink: 0 }} />
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <IconCal />
                <span style={{ fontSize: 14, lineHeight: '19.5px' }}>Starts {uni.startDate}</span>
              </span>
            </div>
          </div>

          {!isMobile && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
            <button
              onClick={onSave}
              aria-pressed={saved}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px',
                borderRadius: 12, border: '1px solid rgba(2,29,38,0.2)',
                background: saved ? 'rgba(2,29,38,0.06)' : '#fff',
                color: '#021d26', fontSize: 14, fontWeight: 500, letterSpacing: '-0.28px',
                cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? '#021d26' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
              </svg>
              {saved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={onAskAI}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px',
                borderRadius: 12, border: 'none', background: BLUE, color: '#fff',
                fontSize: 14, fontWeight: 500, letterSpacing: '-0.28px',
                cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
            >
              <IconSparkle />
              Ask AI
            </button>
          </div>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Badge icon={<IconCoin />}>{uni.tuitionLabel}</Badge>
          <Badge icon={<IconHat />}>{uni.degree}</Badge>
          <Badge icon={<IconBuilding />}>{uni.attendance}</Badge>
          <Badge icon={<IconLang />}>{uni.language}</Badge>
          <Badge icon={<IconClock />}>{uni.duration}</Badge>
          {uni.scholarship && <Badge icon={<IconHat />}>Scholarship</Badge>}
        </div>

        {/* Mobile (Figma 550:6491): the actions move below the badges, half width each */}
        {isMobile && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%' }}>
            <button
              onClick={onSave}
              aria-pressed={saved}
              style={{
                flex: '1 0 0', minWidth: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(2,29,38,0.2)',
                background: saved ? 'rgba(2,29,38,0.06)' : '#fff', color: '#021d26',
                fontSize: 14, fontWeight: 500, letterSpacing: '-0.28px', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? '#021d26' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
              </svg>
              {saved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={onAskAI}
              style={{
                flex: '1 0 0', minWidth: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '12px 16px', borderRadius: 12, border: 'none', background: BLUE, color: '#fff',
                fontSize: 14, fontWeight: 500, letterSpacing: '-0.28px', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <IconSparkle />
              Ask AI
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

// ── screen ────────────────────────────────────────────────────────────────────

export default function ResultsScreen({
  filters, setFilters, onOpenUni, onAskAI, onBack, isLoading, isFindingMore, apiResults,
  user, onOpenAuth, onSearch, onFindMore, onMyPrograms, onMyChats, onProfile,
  onFeedback, onTerms, onPrivacy, savedIds = new Set(), onSaveToggle, onSignOut,
}) {
  const isMobile = useIsMobile()
  const [sort, setSort] = useState('Best match')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showTuition, setShowTuition] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const tuitionRef = useRef(null)

  // Sidebar refinements — applied client-side on top of the AI's results.
  const [onlyFree, setOnlyFree] = useState(false)
  const [onlyScholarship, setOnlyScholarship] = useState(false)
  const [durations, setDurations] = useState([])

  useEffect(() => {
    const close = e => { if (tuitionRef.current && !tuitionRef.current.contains(e.target)) setShowTuition(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const [tuitionLo, tuitionHi] = filters.tuition || [0, 100000]
  const tuitionLabel = tuitionLo === 0 && tuitionHi === 100000
    ? 'Free – $100,000'
    : `$${tuitionLo.toLocaleString()} – $${tuitionHi.toLocaleString()}`

  const setDegree = d => setFilters(f => ({ ...f, degree: [d] }))
  const toggleMulti = (key, v) => setFilters(f => {
    const cur = f[key] || []
    return { ...f, [key]: cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v] }
  })

  // Normalise whatever the API returned into what the card needs.
  const allUnis = useMemo(() => {
    if (!apiResults || apiResults.length === 0) return []
    return apiResults.map((u, i) => {
      const tuitionNum = typeof u.tuition === 'number'
        ? u.tuition
        : parseInt(String(u.tuition ?? '').replace(/[^0-9]/g, '') || '0', 10)
      return {
        id: `${u.name}-${i}`,
        name: u.name,
        city: u.city,
        country: u.country,
        tuition: tuitionNum,
        tuitionLabel: tuitionNum === 0 ? 'Free tuition' : `$${tuitionNum.toLocaleString()}/yr`,
        degree: u.degree || filters.degree?.[0] || 'Master',
        attendance: u.attendance || filters.attendance?.[0] || 'On-campus',
        language: u.language || 'English',
        duration: u.duration || '2 years',
        startDate: u.startDate || 'Sep 2026',
        scholarship: !!u.scholarship,
        field: u.field || filters.field || 'Various',
        raw: u,
      }
    })
  }, [apiResults, filters])

  const refined = useMemo(() => allUnis.filter(u =>
    (!onlyFree || u.tuition === 0) &&
    (!onlyScholarship || u.scholarship) &&
    (durations.length === 0 || durations.some(sel => matchesDuration(u.duration, sel)))
  ), [allUnis, onlyFree, onlyScholarship, durations])

  const sorted = useMemo(() => {
    const list = [...refined]
    if (sort === 'Tuition: low to high') list.sort((a, b) => a.tuition - b.tuition)
    if (sort === 'Tuition: high to low') list.sort((a, b) => b.tuition - a.tuition)
    if (sort === 'Start date') list.sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)))
    return list
  }, [refined, sort])

  // Counts beside each checkbox, taken from the unrefined set.
  const counts = useMemo(() => ({
    free: allUnis.filter(u => u.tuition === 0).length,
    scholarship: allUnis.filter(u => u.scholarship).length,
    duration: Object.fromEntries(DURATIONS.map(d => [d, allUnis.filter(u => matchesDuration(u.duration, d)).length])),
  }), [allUnis])

  const clearAll = () => { setOnlyFree(false); setOnlyScholarship(false); setDurations([]) }

  const cell = {
    padding: isMobile ? '15px 21px' : '16px 21px',
    display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0,
    background: '#fff',
    ...(isMobile ? { borderRadius: 16 } : {}),
  }
  const cellLabel = { fontSize: 13, fontWeight: 700, color: '#747474', textTransform: 'uppercase', letterSpacing: '0.66px', lineHeight: '16.5px' }
  const cellValue = { fontSize: 18, fontWeight: 500, color: '#1a1a17', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', padding: 0, width: '100%' }
  const caret = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3a3a35" strokeWidth="2" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )

  // Stacked search controls, used inside the mobile "Edit search" sheet.
  const searchForm = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ ...cell, borderRadius: 16 }}>
        <label style={cellLabel}>Field of study</label>
        <input
          value={filters.field || ''}
          onChange={e => setFilters(f => ({ ...f, field: e.target.value }))}
          placeholder="e.g. Computer Science"
          style={{ ...cellValue, fontWeight: 400 }}
        />
      </div>
      <div style={{ ...cell, borderRadius: 16 }}>
        <label style={cellLabel}>Country</label>
        <div style={{ position: 'relative' }}>
          <select value={filters.country || ''} onChange={e => setFilters(f => ({ ...f, country: e.target.value }))} style={{ ...cellValue, appearance: 'none', cursor: 'pointer', paddingRight: 26 }}>
            <option value="">Any country</option>
            {POPULAR_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            <option disabled>──────────</option>
            {ALL_COUNTRIES.filter(c => !POPULAR_COUNTRIES.includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {caret}
        </div>
      </div>
      <div style={{ ...cell, borderRadius: 16 }}>
        <label style={cellLabel}>Start date</label>
        <div style={{ position: 'relative' }}>
          <select value={filters.startDate || ''} onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))} style={{ ...cellValue, appearance: 'none', cursor: 'pointer', paddingRight: 26 }}>
            <option value="">Any start date</option>
            {['Jan 2026','Feb 2026','Mar 2026','Apr 2026','May 2026','Jun 2026','Jul 2026','Aug 2026','Sep 2026','Oct 2026','Nov 2026','Dec 2026'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {caret}
        </div>
      </div>
      <div style={{ ...cell, borderRadius: 16 }}>
        <label style={cellLabel}>Tuition (USD/yr)</label>
        <TuitionRange value={filters.tuition || [0, 100000]} onChange={v => setFilters(f => ({ ...f, tuition: v }))} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 6 }}>
        {[
          { label: 'Degree', key: 'degree', opts: ['Bachelor', 'Master', 'PhD'], single: true },
          { label: 'Format', key: 'format', opts: ['Full-time', 'Part-time'] },
          { label: 'Attendance', key: 'attendance', opts: ['On-campus', 'Online', 'Blended'] },
        ].map(({ label, key, opts, single }) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#f7f7f7', textTransform: 'uppercase', letterSpacing: '0.66px', lineHeight: '16.5px' }}>{label}</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {opts.map(o => {
                const active = single ? filters.degree?.[0] === o : (filters[key] || []).includes(o)
                return <Chip key={o} active={active} onClick={() => (single ? setDegree(o) : toggleMulti(key, o))}>{o}</Chip>
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const sidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 15, borderBottom: `1px solid ${CARD_BORDER}` }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          <span style={{ fontSize: 16, fontWeight: 500, color: INK, lineHeight: '21px' }}>Filters</span>
        </span>
        <button onClick={clearAll} style={{ padding: '8px 14px', borderRadius: 12, background: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, color: '#3a3a35', textDecoration: 'underline' }}>
          Clear all
        </button>
      </div>

      <FilterGroup title="Popular">
        <Checkbox checked={onlyFree} onChange={() => setOnlyFree(v => !v)} label="Free tuition" count={counts.free} />
        <Checkbox checked={onlyScholarship} onChange={() => setOnlyScholarship(v => !v)} label="Scholarship available" count={counts.scholarship} />
      </FilterGroup>

      <FilterGroup title="Duration">
        {DURATIONS.map(d => (
          <Checkbox
            key={d}
            checked={durations.includes(d)}
            onChange={() => setDurations(cur => cur.includes(d) ? cur.filter(x => x !== d) : [...cur, d])}
            label={d}
            count={counts.duration[d]}
          />
        ))}
      </FilterGroup>
    </div>
  )

  return (
    <div style={{ fontFamily: 'Geist, -apple-system, sans-serif', background: '#f7f7f7', minHeight: '100vh' }}>
      <SiteNav
        isMobile={isMobile}
        user={user}
        onOpenAuth={onOpenAuth}
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

      {/* ── Search: full form on desktop, a summary pill on mobile (Figma 550:5777) ── */}
      {isMobile ? (
        <>
          <div style={{ background: '#05203C', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: '#153852', display: 'flex', gap: 12, alignItems: 'center', padding: 13, borderRadius: 16, width: '100%' }}>
              <button
                onClick={onSearch}
                aria-label="Search again"
                style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 12, background: '#0162e3', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
                </svg>
              </button>
              <div style={{ flex: '1 0 0', minWidth: 1, display: 'flex', flexDirection: 'column', gap: 6, color: '#fff' }}>
                <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '0.66px', lineHeight: '16.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {filters.field?.trim() || 'Any field'}
                </span>
                <span style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  {[filters.country?.trim() || 'Any country', filters.degree?.[0], filters.format?.[0]]
                    .filter(Boolean)
                    .map((part, i, arr) => (
                      <span key={part + i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: 14 }}>{part}</span>
                        {i < arr.length - 1 && <span style={{ fontSize: 18 }}>•</span>}
                      </span>
                    ))}
                </span>
              </div>
              <button
                onClick={() => setEditOpen(true)}
                aria-label="Edit search"
                style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 12, background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filters + sort (Figma 550:7185) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
            <button
              onClick={() => setFiltersOpen(true)}
              style={{ width: 133, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 14px', borderRadius: 12, background: '#fff', border: '1px solid #ced3d9', cursor: 'pointer', fontFamily: 'inherit', fontSize: 16, fontWeight: 500, color: INK, lineHeight: '21px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              Filters
            </button>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M7 4v16M7 20l-3-3M7 4l3 3M17 20V4M17 4l3 3M17 20l-3-3" />
              </svg>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                aria-label="Sort results"
                style={{ width: 133, appearance: 'none', background: '#fff', border: '1px solid #ced3d9', borderRadius: 12, padding: '12px 34px 12px 14px', fontSize: 13, fontFamily: 'inherit', color: INK, cursor: 'pointer' }}
              >
                <option>Best match</option>
                <option>Tuition: low to high</option>
                <option>Tuition: high to low</option>
                <option>Start date</option>
              </select>
            </span>
          </div>
        </>
      ) : (
        <section style={{ background: '#05203C', padding: '24px 120px 40px' }}>
          <div style={{ maxWidth: 1272, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 8, alignItems: 'stretch' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 4, borderRadius: 16, overflow: isMobile ? 'visible' : 'hidden' }}>
          <div style={{ ...cell, flex: isMobile ? 'none' : '1 1 383px' }}>
            <label style={cellLabel}>Field of study</label>
            <input
              value={filters.field || ''}
              onChange={e => setFilters(f => ({ ...f, field: e.target.value }))}
              placeholder="e.g. Computer Science"
              style={{ ...cellValue, fontWeight: 400 }}
            />
          </div>

          <div style={{ ...cell, flex: isMobile ? 'none' : '1 1 256px' }}>
            <label style={cellLabel}>Country</label>
            <div style={{ position: 'relative' }}>
              <select value={filters.country || ''} onChange={e => setFilters(f => ({ ...f, country: e.target.value }))} style={{ ...cellValue, appearance: 'none', cursor: 'pointer', paddingRight: 26 }}>
                <option value="">Any country</option>
                {POPULAR_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                <option disabled>──────────</option>
                {ALL_COUNTRIES.filter(c => !POPULAR_COUNTRIES.includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {caret}
            </div>
          </div>

          <div style={{ ...cell, flex: isMobile ? 'none' : '1 1 221px' }}>
            <label style={cellLabel}>Start date</label>
            <div style={{ position: 'relative' }}>
              <select value={filters.startDate || ''} onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))} style={{ ...cellValue, appearance: 'none', cursor: 'pointer', paddingRight: 26 }}>
                <option value="">Any start date</option>
                {['Jan 2026','Feb 2026','Mar 2026','Apr 2026','May 2026','Jun 2026','Jul 2026','Aug 2026','Sep 2026','Oct 2026','Nov 2026','Dec 2026'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {caret}
            </div>
          </div>

          <div ref={tuitionRef} onClick={() => setShowTuition(s => !s)} style={{ ...cell, flex: isMobile ? 'none' : '1 1 254px', position: 'relative', cursor: 'pointer' }}>
            <label style={{ ...cellLabel, pointerEvents: 'none' }}>Tuition (USD/yr)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ ...cellValue, display: 'block', userSelect: 'none', paddingRight: 26 }}>{tuitionLabel}</span>
              {caret}
            </div>
            {showTuition && (
              <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, left: isMobile ? 0 : 'auto', minWidth: isMobile ? 0 : 300, background: '#fff', border: '1px solid #E0E0E0', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: 16, zIndex: 200 }}>
                <TuitionRange value={filters.tuition || [0, 100000]} onChange={v => setFilters(f => ({ ...f, tuition: v }))} />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onSearch}
          style={{ flexShrink: 0, width: isMobile ? '100%' : 138, height: isMobile ? 64 : 'auto', background: '#0162E3', color: '#fff', border: 'none', borderRadius: 16, fontSize: 20, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Search
        </button>
      </div>

      {/* Degree / Format / Attendance */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 16 : 48, marginTop: 24 }}>
        {[
          { label: 'Degree', key: 'degree', opts: ['Bachelor', 'Master', 'PhD'], single: true },
          { label: 'Format', key: 'format', opts: ['Full-time', 'Part-time'] },
          { label: 'Attendance', key: 'attendance', opts: ['On-campus', 'Online', 'Blended'] },
        ].map(({ label, key, opts, single }) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#f7f7f7', textTransform: 'uppercase', letterSpacing: '0.66px', lineHeight: '16.5px' }}>{label}</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {opts.map(o => {
                const active = single ? filters.degree?.[0] === o : (filters[key] || []).includes(o)
                return <Chip key={o} active={active} onClick={() => (single ? setDegree(o) : toggleMulti(key, o))}>{o}</Chip>
              })}
            </div>
          </div>
        ))}
      </div>
          </div>
        </section>
      )}

      {/* ── Body ── */}
      <div style={{ padding: isMobile ? '24px 16px 40px' : '32px 120px 56px' }}>
        <div style={{ maxWidth: 1272, margin: '0 auto', display: 'flex', gap: 34, alignItems: 'flex-start' }}>
          {!isMobile && (
            <aside style={{ width: 289, flexShrink: 0, background: '#fff', border: '1px solid #e6e6e6', borderRadius: 24, padding: '24px 31px' }}>
              {sidebar}
            </aside>
          )}

          <main style={{ flex: '1 1 0', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 22, flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: isMobile ? 22 : 26, fontWeight: 500, color: INK, letterSpacing: '-0.3px' }}>
                AI handpicked the best programs
              </h2>
              {!isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M7 4v16M7 20l-3-3M7 4l3 3M17 20V4M17 4l3 3M17 20l-3-3" />
                  </svg>
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    aria-label="Sort results"
                    style={{ appearance: 'none', border: `1px solid ${CARD_BORDER}`, background: '#fff', borderRadius: 10, padding: '9px 34px 9px 13px', fontSize: 14, fontFamily: 'inherit', color: INK, cursor: 'pointer' }}
                  >
                    <option>Best match</option>
                    <option>Tuition: low to high</option>
                    <option>Tuition: high to low</option>
                    <option>Start date</option>
                  </select>
                </span>
              </div>
              )}
            </div>

            {isLoading ? (
              <div style={{ background: '#fff', border: `1px solid ${CARD_BORDER}`, borderRadius: 20, padding: 48, textAlign: 'center' }}>
                <div style={{ width: 28, height: 28, margin: '0 auto 14px', border: '3px solid rgba(0,0,0,0.1)', borderTopColor: BLUE, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                <p style={{ margin: 0, fontSize: 15, color: '#3a3a35' }}>Searching universities with AI…</p>
              </div>
            ) : sorted.length === 0 ? (
              <div style={{ background: '#fff', border: `1px solid ${CARD_BORDER}`, borderRadius: 20, padding: 48, textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 16, color: INK, fontWeight: 500 }}>
                  {allUnis.length === 0 ? 'No programs yet — run a search to get started.' : 'No programs match these filters.'}
                </p>
                {allUnis.length > 0 && (
                  <button onClick={clearAll} style={{ marginTop: 14, padding: '10px 18px', borderRadius: 12, border: `1px solid ${CARD_BORDER}`, background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 500 }}>
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {sorted.map(uni => (
                    <ResultCard
                      key={uni.id}
                      uni={uni}
                      isMobile={isMobile}
                      onOpen={() => onOpenUni(uni.raw ?? uni)}
                      onAskAI={() => onAskAI?.(uni.raw ?? uni)}
                      saved={savedIds.has(uni.name)}
                      onSave={e => { e.stopPropagation(); onSaveToggle?.(uni.raw ?? uni) }}
                    />
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                  <button
                    onClick={onFindMore}
                    disabled={isFindingMore}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      minWidth: 267, height: 53, padding: '0 24px', borderRadius: 14,
                      background: '#0162E3', color: '#fff', border: 'none',
                      fontSize: 16, fontWeight: 500, fontFamily: 'inherit',
                      cursor: isFindingMore ? 'not-allowed' : 'pointer',
                      opacity: isFindingMore ? 0.75 : 1,
                    }}
                  >
                    {isFindingMore ? (
                      <>
                        <span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block', flexShrink: 0 }} />
                        Finding more…
                      </>
                    ) : (
                      <><IconSparkle /> Find more programs</>
                    )}
                  </button>
                </div>
              </>
            )}
          </main>

          {!isMobile && (
            <div style={{ width: 268, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <PromoCard>
                <div style={{ height: 124, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e6e6e6' }}>
                  <span style={{ fontSize: 34, fontWeight: 800, color: '#e2231a', letterSpacing: '-1px' }}>IELTS</span>
                </div>
                <div style={{ padding: 24 }}>
                  <h3 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 600, color: INK }}>IELTS English Test</h3>
                  <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: '21px', color: '#3a3a35' }}>
                    IELTS is <strong>accepted by over 11,000+ universities</strong> across 140+ countries.
                  </p>
                  <a href="https://www.ielts.org/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 45, borderRadius: 12, background: '#0162E3', color: '#fff', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
                    <IconExternal /> Take an IELTS Test
                  </a>
                </div>
              </PromoCard>

              <PromoCard>
                <div style={{ padding: 24 }}>
                  <h3 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 600, color: INK }}>Duolingo English Test</h3>
                  <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: '21px', color: '#3a3a35' }}>
                    Certify your English proficiency with the Duolingo English Test!
                  </p>
                  <a href="https://englishtest.duolingo.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 45, borderRadius: 12, background: '#f7f7f7', border: `1px solid ${CARD_BORDER}`, color: INK, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
                    <IconExternal /> Take A Free Test!
                  </a>
                </div>
              </PromoCard>
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

      {/* Mobile: edit the search without leaving the results */}
      {isMobile && editOpen && (
        <div onClick={() => setEditOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#05203C', width: '100%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px 24px 0 0', padding: '20px 16px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ color: '#fff', fontSize: 18, fontWeight: 500 }}>Edit search</span>
              <button onClick={() => setEditOpen(false)} aria-label="Close" style={{ width: 36, height: 36, borderRadius: '50%', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
              </button>
            </div>
            {searchForm}
            <button
              onClick={() => { setEditOpen(false); onSearch() }}
              style={{ marginTop: 20, width: '100%', height: 56, borderRadius: 16, background: '#0162E3', color: '#fff', border: 'none', fontSize: 18, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}
            >
              Search
            </button>
          </div>
        </div>
      )}

      {/* Mobile filter sheet */}
      {isMobile && filtersOpen && (
        <div onClick={() => setFiltersOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', width: '100%', maxHeight: '85vh', overflowY: 'auto', borderRadius: '24px 24px 0 0', padding: '24px 20px 32px' }}>
            {sidebar}
            <button onClick={() => setFiltersOpen(false)} style={{ marginTop: 20, width: '100%', height: 50, borderRadius: 14, background: '#0162E3', color: '#fff', border: 'none', fontSize: 16, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}>
              Show {sorted.length} program{sorted.length === 1 ? '' : 's'}
            </button>
          </div>
        </div>
      )}

      {menuOpen && (
        <MobileMenuDrawer
          user={user}
          onClose={() => setMenuOpen(false)}
          onOpenAuth={m => { setMenuOpen(false); onOpenAuth?.(m) }}
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

// Dual-handle tuition range — same behaviour as the landing page's.
function TuitionRange({ value, onChange }) {
  const [lo, hi] = value
  const [loStr, setLoStr] = useState(String(lo))
  const [hiStr, setHiStr] = useState(String(hi))
  const MIN = 0, MAX = 100000, STEP = 500, GAP = 1000
  useEffect(() => { setLoStr(String(lo)) }, [lo])
  useEffect(() => { setHiStr(String(hi)) }, [hi])
  const applyLo = raw => { const n = Math.max(MIN, Math.min(Number(raw) || MIN, hi - GAP)); onChange([n, hi]); setLoStr(String(n)) }
  const applyHi = raw => { const n = Math.min(MAX, Math.max(Number(raw) || MIN, lo + GAP)); onChange([lo, n]); setHiStr(String(n)) }
  const pctLo = (lo / MAX) * 100
  const pctHi = (hi / MAX) * 100
  return (
    <div style={{ padding: 4 }}>
      <div style={{ position: 'relative', height: 32, margin: '4px 0 14px', padding: '0 9px' }}>
        <div style={{ position: 'absolute', left: 9, right: 9, top: '50%', height: 4, background: '#E0E0E0', borderRadius: 999, transform: 'translateY(-50%)' }} />
        <div style={{ position: 'absolute', left: `calc(9px + (100% - 18px) * ${pctLo / 100})`, right: `calc(9px + (100% - 18px) * ${(100 - pctHi) / 100})`, top: '50%', height: 4, background: '#0162E3', borderRadius: 999, transform: 'translateY(-50%)' }} />
        <input type="range" min={MIN} max={MAX} step={STEP} value={lo} onChange={e => onChange([Math.min(Number(e.target.value), hi - GAP), hi])} className="tuition-range" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', margin: 0 }} />
        <input type="range" min={MIN} max={MAX} step={STEP} value={hi} onChange={e => onChange([lo, Math.max(Number(e.target.value), lo + GAP)])} className="tuition-range" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', margin: 0 }} />
        <style jsx>{`
          .tuition-range { -webkit-appearance: none; appearance: none; background: transparent; padding: 0; pointer-events: none; }
          .tuition-range::-webkit-slider-runnable-track { background: transparent; height: 32px; border: none; }
          .tuition-range::-moz-range-track { background: transparent; height: 32px; border: none; }
          .tuition-range::-webkit-slider-thumb {
            -webkit-appearance: none; appearance: none;
            width: 18px; height: 18px; border-radius: 50%;
            background: #fff; border: 2px solid #0162E3;
            cursor: grab; pointer-events: auto; margin-top: 7px;
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
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, background: '#F5F5F5', border: '1px solid #E0E0E0', borderRadius: 8, padding: '8px 10px' }}>
          <span style={{ fontSize: 12, color: '#888' }}>$</span>
          <input value={loStr} onChange={e => setLoStr(e.target.value)} onBlur={e => applyLo(e.target.value)} style={{ flex: 1, border: 'none', background: 'none', fontSize: 13, outline: 'none', minWidth: 0, fontFamily: 'inherit' }} />
        </div>
        <span style={{ color: '#ccc' }}>—</span>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, background: '#F5F5F5', border: '1px solid #E0E0E0', borderRadius: 8, padding: '8px 10px' }}>
          <span style={{ fontSize: 12, color: '#888' }}>$</span>
          <input value={hiStr} onChange={e => setHiStr(e.target.value)} onBlur={e => applyHi(e.target.value)} style={{ flex: 1, border: 'none', background: 'none', fontSize: 13, outline: 'none', minWidth: 0, fontFamily: 'inherit' }} />
        </div>
      </div>
    </div>
  )
}
