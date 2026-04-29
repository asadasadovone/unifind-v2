'use client'
import { useState, useMemo } from 'react'
import { Icon, Logo, ChipGroup, RangeSlider } from './Icons'
import { UNI_DATA, COUNTRIES } from '../data'

export default function ResultsScreen({ filters, setFilters, onOpenUni, onBack, isPremium, onUpgrade, isLoading, apiResults }) {
  const [expandedId, setExpandedId] = useState(null)
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

  return (
    <div className="results-screen">
      <header className="results-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="btn btn-ghost" onClick={onBack} style={{ padding: '8px 10px' }}>
            <Icon name="chevronLeft" size={18} /> Back
          </button>
          <Logo onClick={onBack} size="sm" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn btn-outline" style={{ padding: '8px 14px' }}>
            <Icon name="star" size={14} /> Saved (4)
          </button>
          <div className="user-pill">
            <div className="user-avatar">A</div>
            <span style={{ fontSize: 13 }}>Aysel</span>
            {isPremium && (
              <span className="premium-tag"><Icon name="crown" size={11} /> Pro</span>
            )}
          </div>
        </div>
      </header>

      <div className="results-body">
        <aside className="results-sidebar">
          <FilterSidebar filters={filters} setFilters={setFilters} />
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
                    <span className="serif-italic">{totalCount}</span> universities found
                  </h2>
                  <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>
                    {filters.field || 'All fields'} · {filters.country} · sorted by {sort.toLowerCase()}
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
                    expanded={expandedId === uni.id}
                    onToggle={() => setExpandedId(expandedId === uni.id ? null : uni.id)}
                    onOpen={() => onOpenUni(uni)}
                  />
                ))}
              </div>

              <div className="show-more-wrap">
                {isPremium ? (
                  <button
                    className="btn btn-cta"
                    onClick={() => setShownCount(c => Math.min(c + 10, totalCount))}
                    disabled={shownCount >= totalCount}
                    style={shownCount >= totalCount ? {
                      background: 'var(--cream-300)', color: 'var(--ink-400)',
                      cursor: 'not-allowed', boxShadow: 'none'
                    } : {}}
                  >
                    {shownCount >= totalCount ? 'All universities shown' : <>Show 10 more <Icon name="chevron" size={14} /></>}
                  </button>
                ) : (
                  <div className="show-more-locked">
                    <button className="btn btn-disabled" style={{ padding: '16px 32px', fontSize: 16, borderRadius: 12 }}>
                      <Icon name="lock" size={16} /> Show 10 more
                    </button>
                    <div className="upgrade-hint">
                      <div>
                        <div className="serif" style={{ fontSize: 20, color: 'var(--green-900)' }}>
                          Unlock all <span className="serif-italic">{totalCount} matches</span>
                        </div>
                        <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                          Free plan shows your top 10. Upgrade to Pro for full results, saved searches and AI insights.
                        </div>
                      </div>
                      <button className="btn btn-primary" onClick={onUpgrade}>
                        <Icon name="crown" size={14} /> Upgrade to Pro
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function UniCard({ uni, expanded, onToggle, onOpen }) {
  const tuitionLabel = uni.tuition === 0 ? 'Free tuition' : `${uni.tuition.toLocaleString()} AZN/yr`

  return (
    <article className={`uni-card ${expanded ? 'expanded' : ''}`} onClick={onToggle}>
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

        {expanded && (
          <div className="uni-card-expand" onClick={(e) => e.stopPropagation()}>
            <p style={{ margin: 0, color: 'var(--ink-700)', fontSize: 14, lineHeight: 1.55 }}>
              {uni.blurb}
            </p>
            <div className="action-buttons">
              {[
                { icon: 'calendar', label: 'Apply dates' },
                { icon: 'pin', label: 'City info' },
                { icon: 'paper', label: 'Requirements' },
                { icon: 'sparkle', label: 'Scholarships' },
              ].map(({ icon, label }) => (
                <button key={label} className="action-btn" onClick={onOpen}>
                  <Icon name={icon} size={15} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary"
              onClick={(e) => { e.stopPropagation(); onOpen(); }}
              style={{ alignSelf: 'flex-start', marginTop: 4 }}
            >
              View details <Icon name="arrow" size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="uni-card-toggle">
        <Icon name={expanded ? 'chevronUp' : 'chevron'} size={18} />
      </div>
    </article>
  )
}

function FilterSidebar({ filters, setFilters }) {
  const update = (k, v) => setFilters(f => ({ ...f, [k]: v }))
  const [open, setOpen] = useState({
    field: true, country: true, tuition: true, format: true,
    attendance: true, degree: true, date: true
  })

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
            tuition: [0, 20000], format: [], attendance: [], degree: []
          })}
        >
          Clear all
        </button>
      </div>

      <Section id="field" title="Field of study">
        <input
          className="input"
          placeholder="e.g. Computer Science"
          value={filters.field}
          onChange={(e) => update('field', e.target.value)}
        />
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

      <Section id="tuition" title="Tuition fee (AZN/yr)">
        <RangeSlider min={0} max={20000} step={100} value={filters.tuition} onChange={(v) => update('tuition', v)} />
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
        <input
          type="month"
          className="input"
          value={filters.startDate}
          onChange={(e) => update('startDate', e.target.value)}
        />
      </Section>
    </div>
  )
}
