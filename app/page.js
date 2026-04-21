'use client'
import { useState } from 'react'
import styles from './page.module.css'

const CHIP_GROUPS = {
  format: { label: 'Format', options: ['Full-time', 'Part-time'] },
  attend: { label: 'Tədris forması', options: ['On-campus', 'Online', 'Blended'] },
  degree: { label: 'Dərəcə', options: ['Bachelor', 'Master', 'PhD'] },
  start: { label: 'Başlama tarixi', options: ['September 2025', 'January 2026', 'September 2026', 'Any intake'] },
}

const START_LABELS = {
  'September 2025': 'Sep 2025',
  'January 2026': 'Jan 2026',
  'September 2026': 'Sep 2026',
  'Any intake': 'İstənilən vaxt',
}

export default function Home() {
  const [field, setField] = useState('')
  const [country, setCountry] = useState('')
  const [feeMin, setFeeMin] = useState('')
  const [feeMax, setFeeMax] = useState('')
  const [chips, setChips] = useState({
    format: 'Full-time',
    attend: 'On-campus',
    degree: 'Bachelor',
    start: 'September 2025',
  })
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openDetail, setOpenDetail] = useState({})
  const [detailData, setDetailData] = useState({})
  const [detailLoading, setDetailLoading] = useState({})

  function setChip(group, val) {
    setChips(prev => ({ ...prev, [group]: val }))
  }

  async function search() {
    setLoading(true)
    setError('')
    setResults(null)
    setOpenDetail({})
    setDetailData({})

    const prompt = `Find 6 real universities matching: field="${field || 'any field'}", country="${country || 'any country'}", tuition $${feeMin || '0'}-$${feeMax || '60000'}/year, format="${chips.format}", attendance="${chips.attend}", degree="${chips.degree}", start="${chips.start}".
Reply ONLY with a valid JSON array, no markdown, no explanation:
[{"name":"...","country":"...","city":"...","tuition":"$X,XXX/year","ranking":"QS #XX or null","language":"English","deadline":"Jan 15, 2026","startDate":"...","programName":"..."}]`

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(JSON.stringify(data.error))
      const text = data.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim()
      setResults(JSON.parse(text))
    } catch (e) {
      setError('Xəta: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadDetail(idx, type, name, location) {
    const key = `${idx}-${type}`
    if (openDetail[key]) {
      setOpenDetail(prev => ({ ...prev, [key]: false }))
      return
    }
    setOpenDetail(prev => ({ ...prev, [key]: true }))
    if (detailData[key]) return
    setDetailLoading(prev => ({ ...prev, [key]: true }))

    const prompts = {
      apply: `Application deadlines for ${name} in ${location}? List main deadlines, required documents, portal link. Brief and practical.`,
      city: `Student life in ${location}? Cost of living, safety, transport, part-time jobs, why international students like it. 4-5 sentences.`,
      req: `Admission requirements for ${name}? GPA, IELTS/TOEFL, documents, special requirements. Specific.`,
      sch: `Scholarships for international students at ${name} in ${location}? List 3-5 options with brief details.`,
    }

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompts[type] }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(JSON.stringify(data.error))
      const text = data.content.map(b => b.text || '').join('')
      setDetailData(prev => ({ ...prev, [key]: text }))
    } catch (e) {
      setDetailData(prev => ({ ...prev, [key]: 'Xəta: ' + e.message }))
    } finally {
      setDetailLoading(prev => ({ ...prev, [key]: false }))
    }
  }

  return (
    <main className={styles.wrap}>
      <div className={styles.logo}>Uni<span>Find</span></div>
      <p className={styles.tagline}>AI ilə dünya universitetlərini kəşf et</p>

      {error && <div className={styles.errBox}>{error}</div>}

      <div className={styles.card}>
        <div className={styles.grid2}>
          <div>
            <label className={styles.label}>İxtisas sahəsi</label>
            <input className={styles.input} value={field} onChange={e => setField(e.target.value)} placeholder="məs. Computer Science, Business" />
          </div>
          <div>
            <label className={styles.label}>Ölkə</label>
            <input className={styles.input} value={country} onChange={e => setCountry(e.target.value)} placeholder="məs. Germany, UK, Canada" />
          </div>
        </div>

        <div className={styles.fieldWrap}>
          <label className={styles.label}>Tələbə haqqı (USD / il)</label>
          <div className={styles.feeRow}>
            <input className={styles.input} type="number" value={feeMin} onChange={e => setFeeMin(e.target.value)} placeholder="Min" />
            <span className={styles.feeSep}>—</span>
            <input className={styles.input} type="number" value={feeMax} onChange={e => setFeeMax(e.target.value)} placeholder="Max" />
          </div>
        </div>

        {Object.entries(CHIP_GROUPS).map(([group, { label, options }]) => (
          <div key={group} className={styles.fieldWrap}>
            <div className={styles.chipLabel}>{label}</div>
            <div className={styles.chipRow}>
              {options.map(opt => (
                <button
                  key={opt}
                  className={`${styles.chip} ${chips[group] === opt ? styles.chipOn : ''}`}
                  onClick={() => setChip(group, opt)}
                >
                  {START_LABELS[opt] || opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button className={styles.searchBtn} onClick={search} disabled={loading}>
          {loading ? 'Axtarılır...' : 'Universitetləri axtar'}
        </button>
      </div>

      {loading && (
        <div className={styles.center}>
          <div className={styles.spinner} />
          <p>AI universitetlər axtarır...</p>
        </div>
      )}

      {results && (
        <div>
          <p className={styles.resultHeader}>
            <strong>{results.length} universitet tapıldı</strong> · {field || 'hər ixtisas'} · {chips.degree}
          </p>
          {results.map((u, i) => (
            <div key={i} className={styles.uniCard} style={{ animationDelay: `${i * 60}ms` }}>
              <div className={styles.uniTop}>
                <div>
                  <div className={styles.uniName}>{u.name}</div>
                  <div className={styles.uniLoc}>📍 {u.city}, {u.country}</div>
                </div>
                <span className={styles.price}>{u.tuition}</span>
              </div>
              <div className={styles.badges}>
                <span className={`${styles.badge} ${styles.badgeGreen}`}>{chips.degree} · {chips.attend}</span>
                <span className={`${styles.badge} ${styles.badgeGray}`}>🗣 {u.language}</span>
                {u.ranking && u.ranking !== 'null' && <span className={`${styles.badge} ${styles.badgeGreen}`}>{u.ranking}</span>}
                <span className={`${styles.badge} ${styles.badgeGray}`}>📅 {u.startDate}</span>
                {u.programName && <span className={`${styles.badge} ${styles.badgeGray}`}>{u.programName}</span>}
              </div>
              <div className={styles.divider} />
              <div className={styles.actions}>
                {[
                  { type: 'apply', label: '📋 Apply tarixləri' },
                  { type: 'city', label: '🏙 Şəhər' },
                  { type: 'req', label: '📝 Requirements' },
                  { type: 'sch', label: '🎓 Stipendiya' },
                ].map(({ type, label }) => (
                  <button key={type} className={styles.actionBtn} onClick={() => loadDetail(i, type, u.name, `${u.city}, ${u.country}`)}>
                    {label}
                  </button>
                ))}
              </div>
              {['apply', 'city', 'req', 'sch'].map(type => {
                const key = `${i}-${type}`
                if (!openDetail[key]) return null
                return (
                  <div key={type} className={styles.detail}>
                    {detailLoading[key]
                      ? <em style={{ color: 'var(--muted)' }}>Yüklənir...</em>
                      : <div dangerouslySetInnerHTML={{ __html: (detailData[key] || '').replace(/\n\n/g, '<br><br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    }
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}

      <footer className={styles.footer}>Powered by Claude AI · UniFind © 2025</footer>
    </main>
  )
}
