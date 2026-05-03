'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import { Icon, Logo, ChipGroup, RangeSlider } from './Icons'
import { UNI_DATA, COUNTRIES } from '../data'

// ── Field suggestions (shared with SearchScreen) ─────────────────────────────
const FIELDS = [
  { name: 'Agriculture & Forestry', icon: 'leaf' },
  { name: 'Applied Sciences & Professions', icon: 'flask' },
  { name: 'Arts, Design & Architecture', icon: 'palette' },
  { name: 'Business & Management', icon: 'briefcase' },
  { name: 'Computer Science & IT', icon: 'terminal' },
  { name: 'Education & Training', icon: 'book2' },
  { name: 'Engineering & Technology', icon: 'cog' },
  { name: 'Environmental Studies & Earth Sciences', icon: 'globe2' },
  { name: 'Hospitality, Leisure & Sports', icon: 'boat' },
  { name: 'Humanities', icon: 'feather' },
  { name: 'Journalism & Media', icon: 'video' },
  { name: 'Law', icon: 'scale' },
  { name: 'Medicine & Health', icon: 'medkit' },
  { name: 'Natural Sciences & Mathematics', icon: 'atom' },
  { name: 'Social Sciences', icon: 'people' },
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
    case 'cog': return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
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

export default function ResultsScreen({ filters, setFilters, onOpenUni, onBack, isPremium, onUpgrade, isLoading, apiResults, user, onOpenAuth, onSearch }) {
  const [sort, setSort] = useState('Best match')
  const [shownCount, setShownCount] = useState(10)

  // Use API results if available, otherwise use static data padded to 75
  const allUnis = useMemo(() => {
    if (apiResults && apiResults.length > 0) {
      return apiResults.map((u, i) => ({
        id: i + 1,
        name: u.name,
        short: u.name.split(' ').map(w => w[0]).join('').slice(0, 4),
        country: u.country,
        city: u.city,
        flag: '🎓',
        tuition: typeof u.tuition === 'number' ? u.tuition : parseInt(u.tuition?.replace(/[^0-9]/g, '') || '0'),
        degree: u.degree || filters.degree[0] || 'Master',
        attendance: u.attendance || filters.attendance[0] || 'On-campus',
        format: u.format || filters.format[0] || 'Full-time',
        language: u.language || 'English',
        duration: u.duration || '2 years',
        startDate: u.startDate || '2026',
        match: Math.max(60, 98 - i * 4),
        scholarship: u.scholarship || false,
        field: filters.field || u.field || 'Various',
        blurb: u.blurb || `${u.name} is a leading institution in ${u.city}, ${u.country}.`
      }))
    }
    const list = []
    for (let i = 0; i < 75; i++) {
      const base = UNI_DATA[i % UNI_DATA.length]
      list.push({
        ...base,
        id: i + 1,
        match: Math.max(40, base.match - Math.floor(i / UNI_DATA.length) * 8 - (i % 3))
      })
    }
    return list
  }, [apiResults, filters])

  const totalCount = apiResults ? apiResults.length : 75
  const visible = allUnis.slice(0, shownCount)

  const canFindMore = user && isPremium

  return (
    <div className="results-screen">
      <header className="results-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Logo onClick={onBack} size="sm" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn btn-outline" style={{ padding: '8px 14px' }}>
            <Icon name="star" size={14} /> Saved (4)
          </button>
          {user ? (
            <div className="user-pill">
              <div className="user-avatar">
                {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
              </div>
              <span style={{ fontSize: 13 }}>
                {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
              </span>
              {isPremium && (
                <span className="premium-tag"><Icon name="crown" size={11} /> Pro</span>
              )}
            </div>
          ) : (
            <button className="btn btn-primary" style={{ padding: '8px 14px' }} onClick={() => onOpenAuth?.('login')}>
              Log in
            </button>
          )}
        </div>
      </header>

      <div className="results-body">
        <aside className="results-sidebar">
          <FilterSidebar filters={filters} setFilters={setFilters} onSearch={onSearch} />
        </aside>

        <main className="results-main">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Searching universities with AI…</p>
            </div>
          ) : (
            <>
              <div className="results-toolbar">
                <div>
                  <h2 className="serif" style={{ fontSize: 30, color: 'var(--green-900)' }}>
                    AI handpicked the best programs <span className="serif-italic">just for you</span>
                  </h2>
                  <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>
                    Click any program to ask our AI anything about it
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="sort" size={14} />
                  <select
                    className="select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    style={{ width: 'auto', padding: '8px 32px 8px 12px', fontSize: 13 }}
                  >
                    <option>Best match</option>
                    <option>Tuition: low to high</option>
                    <option>Tuition: high to low</option>
                    <option>Start date</option>
                  </select>
                </div>
              </div>

              <div className="cards-list">
                {visible.map((uni) => (
                  <UniCard
                    key={uni.id}
                    uni={uni}
                    onOpen={() => onOpenUni(uni)}
                  />
                ))}
              </div>

              <div className="show-more-wrap">
                <button
                  className="btn btn-cta"
                  onClick={onSearch}
                >
                  <Icon name="sparkle" size={15} /> Find more programs
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function UniCard({ uni, onOpen }) {
  const tuitionLabel = uni.tuition === 0 ? 'Free tuition' : `${uni.tuition.toLocaleString()} USD/yr`

  return (
    <article className="uni-card" onClick={onOpen}>
      <div className="uni-card-body">
        <div className="uni-card-row">
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 className="serif" style={{ fontSize: 22, color: 'var(--green-900)', lineHeight: 1.2 }}>
              {uni.name}
            </h3>
            <div className="uni-card-meta">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Icon name="pin" size={13} /> {uni.city}, {uni.country}
              </span>
              <span className="dot">·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Icon name="calendar" size={13} /> Starts {uni.startDate}
              </span>
            </div>
          </div>
        </div>

        <div className="uni-card-badges">
          <span className="badge badge-tuition">{tuitionLabel}</span>
          <span className="badge"><Icon name="cap" size={12} /> {uni.degree}</span>
          <span className="badge"><Icon name="globe" size={12} /> {uni.attendance}</span>
          <span className="badge"><Icon name="language" size={12} /> {uni.language}</span>
          <span className="badge"><Icon name="clock" size={12} /> {uni.duration}</span>
          {uni.scholarship && <span className="badge badge-green"><Icon name="sparkle" size={12} /> Scholarship</span>}
        </div>
      </div>
    </article>
  )
}

function FilterSidebar({ filters, setFilters, onSearch }) {
  const update = (k, v) => setFilters(f => ({ ...f, [k]: v }))
  const [open, setOpen] = useState({
    field: false, country: false, tuition: false, format: false,
    attendance: false, degree: false, date: false
  })
  const [fieldOpen, setFieldOpen] = useState(false)
  const fieldRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (fieldRef.current && !fieldRef.current.contains(e.target)) setFieldOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredFields = FIELDS.filter(f =>
    !filters.field || f.name.toLowerCase().includes(filters.field.toLowerCase())
  )

  function Section({ id, title, children }) {
    return (
      <div className="sidebar-section">
        <button className="sidebar-section-head" onClick={() => setOpen(o => ({ ...o, [id]: !o[id] }))}>
          <span>{title}</span>
          <Icon name={open[id] ? 'chevronUp' : 'chevron'} size={14} />
        </button>
        {open[id] && <div className="sidebar-section-body">{children}</div>}
      </div>
    )
  }

  return (
    <div>
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="sliders" size={16} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>Filters</span>
        </div>
        <button
          className="btn btn-ghost"
          style={{ padding: '4px 8px', fontSize: 12 }}
          onClick={() => setFilters({
            field: '', country: 'Any country', startDate: '',
            tuition: [0, 100000], format: [], attendance: [], degree: []
          })}
        >
          Clear all
        </button>
      </div>

      <Section id="field" title="Field of study">
        <div className="sidebar-field-wrap" ref={fieldRef}>
          <input
            className="input"
            placeholder="e.g. Computer Science"
            value={filters.field}
            onChange={(e) => { update('field', e.target.value); setFieldOpen(true) }}
            onFocus={() => setFieldOpen(true)}
          />
          {fieldOpen && (
            <div className="sidebar-field-dropdown" onMouseDown={(e) => e.preventDefault()}>
              <div className="field-dropdown-list" style={{ maxHeight: 220 }}>
                {filteredFields.length === 0 && (
                  <div className="field-empty">No matches for &ldquo;{filters.field}&rdquo;</div>
                )}
                {filteredFields.map((f) => {
                  const selected = filters.field === f.name
                  return (
                    <button
                      key={f.name}
                      className={`field-option ${selected ? 'selected' : ''}`}
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
      </Section>

      <Section id="country" title="Country">
        <div style={{ position: 'relative' }}>
          <select
            className="select"
            value={filters.country}
            onChange={(e) => update('country', e.target.value)}
            style={{ appearance: 'none', paddingRight: 36 }}
          >
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--ink-500)' }}>
            <Icon name="chevron" size={14} />
          </div>
        </div>
      </Section>

      <Section id="tuition" title="Tuition fee (USD/yr)">
        <div style={{ padding: '0 10px' }}>
          <RangeSlider min={0} max={100000} step={100} value={filters.tuition} onChange={(v) => update('tuition', v)} />
        </div>
      </Section>

      <Section id="format" title="Format">
        <ChipGroup options={['Full-time', 'Part-time']} value={filters.format} onChange={(v) => update('format', v)} />
      </Section>

      <Section id="attendance" title="Attendance">
        <ChipGroup options={['On-campus', 'Online', 'Blended']} value={filters.attendance} onChange={(v) => update('attendance', v)} />
      </Section>

      <Section id="degree" title="Degree type">
        <ChipGroup options={['Bachelor', 'Master', 'PhD']} value={filters.degree} onChange={(v) => update('degree', v)} />
      </Section>

      <Section id="date" title="Start date">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Any intake', 'Fall 2026', 'Spring 2027', 'Fall 2027'].map(opt => {
            const val = opt === 'Any intake' ? '' : opt
            const active = filters.startDate === val
            return (
              <button
                key={opt}
                className={`chip${active ? ' active' : ''}`}
                onClick={() => update('startDate', val)}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </Section>

      {onSearch && (
        <div style={{ paddingTop: 20 }}>
          <button className="btn btn-cta" style={{ width: '100%' }} onClick={onSearch}>
            <Icon name="sparkle" size={14} /> Apply & search
          </button>
        </div>
      )}
    </div>
  )
}
