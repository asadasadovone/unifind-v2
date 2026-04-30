'use client'
import { useState, useRef, useEffect } from 'react'
import { Icon, Logo, ChipGroup, RangeSlider } from './Icons'
import { COUNTRIES } from '../data'

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

export default function SearchScreen({ filters, setFilters, onSearch, onOpenAuth }) {
  const update = (k, v) => setFilters(f => ({ ...f, [k]: v }))
  const [fieldOpen, setFieldOpen] = useState(false)
  const fieldRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (fieldRef.current && !fieldRef.current.contains(e.target)) setFieldOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const filteredFields = FIELDS.filter(f =>
    !filters.field || f.name.toLowerCase().includes(filters.field.toLowerCase())
  )

  return (
    <div className="zap-screen">
      <header className="zap-nav">
        <div className="zap-nav-left">
          <Logo />
          <nav className="zap-nav-links">
            <a href="#" className="zap-nav-link">Programs <Icon name="chevron" size={12} /></a>
            <a href="#" className="zap-nav-link">Countries <Icon name="chevron" size={12} /></a>
            <a href="#" className="zap-nav-link">Resources <Icon name="chevron" size={12} /></a>
            <a href="#" className="zap-nav-link">For universities</a>
            <a href="#" className="zap-nav-link">Pricing</a>
          </nav>
        </div>
        <div className="zap-nav-right">
          <a href="#" className="zap-nav-link"><Icon name="globe" size={14} /> Browse all</a>
          <a href="#" className="zap-nav-link">Contact</a>
          <button className="zap-link" onClick={() => onOpenAuth('login')}>Log in</button>
          <button className="zap-btn zap-btn-primary" onClick={() => onOpenAuth('register')}>Sign up</button>
        </div>
      </header>

      <section className="zap-hero">
        <div className="zap-eyebrow">UNIVERSITY DISCOVERY, PERSONALIZED</div>
        <h1 className="zap-headline">
          Your goals. Your budget. <span className="zap-italic">Any university.</span>
        </h1>
        <p className="zap-sub">
          UniFind gives students one place to compare 12,400 programs, weigh tuition and start dates,
          and get an AI-driven fit score — so you can apply with confidence, anywhere in the world.
        </p>
      </section>

      <section className="zap-search-section">
        <div className="zap-search-card">
          <div className="zap-search-head">
            <h2 className="zap-h2">Find your next university</h2>
          </div>

          <div className="zap-search-bar">
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
                          className={`field-option ${selected ? 'selected' : ''}`}
                          onClick={() => { update('field', f.name); setFieldOpen(false) }}
                        >
                          <span className="field-option-icon"><FieldIcon name={f.icon} size={16} /></span>
                          <span className="field-option-name">{f.name}</span>
                          <span className="field-option-count">{f.count}</span>
                          <span className={`field-option-radio ${selected ? 'checked' : ''}`} />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="zap-cell" style={{ position: 'relative' }}>
              <label>Country</label>
              <select value={filters.country} onChange={(e) => update('country', e.target.value)}>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="zap-cell">
              <label>Start date</label>
              <input
                type="month"
                value={filters.startDate}
                onChange={(e) => update('startDate', e.target.value)}
              />
            </div>

            <div className="zap-cell">
              <label>Tuition (AZN/yr)</label>
              <div className="zap-cell-static">
                {filters.tuition[0].toLocaleString()} – {filters.tuition[1].toLocaleString()}
              </div>
            </div>

            <button className="zap-btn zap-btn-primary zap-search-btn" onClick={onSearch}>
              <Icon name="search" size={16} /> Search
            </button>
          </div>

          <div className="zap-filter-grid">
            <div className="zap-filter">
              <span className="zap-filter-label">Degree</span>
              <ChipGroup options={['Bachelor', 'Master', 'PhD']} value={filters.degree} onChange={(v) => update('degree', v)} />
            </div>
            <div className="zap-filter">
              <span className="zap-filter-label">Format</span>
              <ChipGroup options={['Full-time', 'Part-time']} value={filters.format} onChange={(v) => update('format', v)} />
            </div>
            <div className="zap-filter">
              <span className="zap-filter-label">Attendance</span>
              <ChipGroup options={['On-campus', 'Online', 'Blended']} value={filters.attendance} onChange={(v) => update('attendance', v)} />
            </div>
            <div className="zap-filter">
              <span className="zap-filter-label">Tuition range</span>
              <RangeSlider min={0} max={20000} step={100} value={filters.tuition} onChange={(v) => update('tuition', v)} />
            </div>
          </div>
        </div>
      </section>

      <section className="zap-trust">
        <div className="zap-trust-label">TRUSTED BY STUDENTS APPLYING TO</div>
        <div className="zap-logos">
          {['Cambridge', 'ETH Zürich', 'TU Munich', 'Sorbonne', 'KTH', 'TU Delft', 'Aalto', 'Bocconi'].map(n => (
            <div key={n} className="zap-logo">{n}</div>
          ))}
        </div>
      </section>
    </div>
  )
}
