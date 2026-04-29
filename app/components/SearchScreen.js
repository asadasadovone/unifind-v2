'use client'
import { Icon, Logo, ChipGroup, RangeSlider } from './Icons'
import { COUNTRIES } from '../data'

export default function SearchScreen({ filters, setFilters, onSearch, onOpenAuth }) {
  const update = (k, v) => setFilters(f => ({ ...f, [k]: v }))

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
            <div className="zap-cell">
              <label>Field of study</label>
              <input
                placeholder="e.g. Computer Science"
                value={filters.field}
                onChange={(e) => update('field', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              />
            </div>
            <div className="zap-cell">
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
