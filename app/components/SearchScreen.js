'use client'
import { useState, useRef, useEffect, useLayoutEffect, Fragment } from 'react'
import { Icon, Logo, ChipGroup, RangeSlider } from './Icons'
import UserDropdown from './UserDropdown'
import { SiteNav, SiteFooter, useIsMobile } from './SiteChrome'
import MobileMenuDrawer from './MobileMenuDrawer'
import { POPULAR_COUNTRIES, ALL_COUNTRIES } from '../data'

// ── data ──────────────────────────────────────────────────────────────────────

const MASTER_TABS = ['Computer Science', 'Business & MBA', 'Engineering', 'Law']
const BACHELOR_TABS = ['Computer Science', 'Business & MBA', 'Engineering', 'Law']

const MASTER_UNIS = {
  'Computer Science': [
    { name: 'Technical University of Munich', program: 'MSc Informatics', loc: 'Munich, Germany', start: 'Oct 2026', tuition: 'Free tuition', duration: '2 years', img: '/unis/m/cs/tum.jpg' },
    { name: 'ETH Zürich', program: 'MSc Computer Science', loc: 'Zürich, Switzerland', start: 'Sep 2026', tuition: 'CHF 1,460/yr', duration: '2 years', img: '/unis/m/cs/eth.jpg' },
    { name: 'KTH Royal Institute of Technology', program: 'MSc Computer Science', loc: 'Stockholm, Sweden', start: 'Aug 2026', tuition: 'Free tuition (EU)', duration: '2 years', img: '/unis/m/cs/kth.jpg' },
    { name: 'TU Delft', program: 'MSc Computer Science', loc: 'Delft, Netherlands', start: 'Sep 2026', tuition: '€2,530/yr', duration: '2 years', img: '/unis/m/cs/delft.jpg' },
    { name: 'Imperial College London', program: 'MSc Computing', loc: 'London, United Kingdom', start: 'Sep 2026', tuition: '£17,400/yr', duration: '1 year', img: null },
    { name: 'Massachusetts Institute of Technology (MIT)', program: 'MSc Computer Science', loc: 'Cambridge, USA', start: 'Sep 2026', tuition: '$61,990/yr', duration: '2 years', img: '/unis/m/cs/mit.jpg' },
    { name: 'Carnegie Mellon University', program: 'MSc Computer Science', loc: 'Pittsburgh, USA', start: 'Sep 2026', tuition: '$54,672/yr', duration: '2 years', img: '/unis/m/cs/cmu.jpg' },
    { name: 'National University of Singapore (NUS)', program: 'MSc Computer Science', loc: 'Singapore', start: 'Aug 2026', tuition: 'SGD 18,400/yr', duration: '1.5 years', img: '/unis/m/cs/nus.jpg' },
  ],
  'Business & MBA': [
    { name: 'HEC Paris', program: 'MIM (Master in Management)', loc: 'Paris, France', start: 'Sep 2026', tuition: '€41,500 total', duration: '2 years', img: '/unis/m/biz/hec.jpg' },
    { name: 'Bocconi University', program: 'MSc International Management', loc: 'Milan, Italy', start: 'Sep 2026', tuition: '€17,116/yr', duration: '2 years', img: '/unis/m/biz/bocconi.jpg' },
    { name: 'Erasmus University Rotterdam (RSM)', program: 'MSc International Management', loc: 'Rotterdam, Netherlands', start: 'Sep 2026', tuition: '€2,530/yr (EU)', duration: '1 year', img: '/unis/m/biz/rsm.jpg' },
    { name: 'Copenhagen Business School', program: 'MSc Economics & Business', loc: 'Copenhagen, Denmark', start: 'Sep 2026', tuition: 'Free tuition (EU)', duration: '2 years', img: '/unis/m/biz/cbs.jpg' },
    { name: 'London Business School', program: 'MBA', loc: 'London, United Kingdom', start: 'Aug 2026', tuition: '£119,900 total', duration: '15–21 months', img: '/unis/m/biz/lbs.jpg' },
    { name: 'Harvard Business School', program: 'MBA', loc: 'Boston, USA', start: 'Sep 2026', tuition: '$76,410/yr', duration: '2 years', img: '/unis/m/biz/hbs.jpg' },
    { name: 'Stanford Graduate School of Business', program: 'MBA', loc: 'Stanford, USA', start: 'Sep 2026', tuition: '$84,168/yr', duration: '2 years', img: '/unis/m/biz/gsb.webp' },
    { name: 'INSEAD', program: 'MBA (Singapore campus)', loc: 'Singapore', start: 'Aug 2026 / Jan 2027', tuition: '€103,500 total', duration: '10 months', img: '/unis/m/biz/insead.webp' },
  ],
  'Engineering': [
    { name: 'ETH Zürich', program: 'MSc Mechanical Engineering', loc: 'Zürich, Switzerland', start: 'Sep 2026', tuition: 'CHF 1,460/yr', duration: '1.5 years', img: '/unis/m/eng/eth.jpg' },
    { name: 'TU Delft', program: 'MSc Aerospace Engineering', loc: 'Delft, Netherlands', start: 'Sep 2026', tuition: '€2,530/yr (EU)', duration: '2 years', img: '/unis/m/eng/delft.jpg' },
    { name: 'RWTH Aachen University', program: 'MSc Mechanical Engineering', loc: 'Aachen, Germany', start: 'Oct 2026', tuition: 'Free tuition', duration: '2 years', img: '/unis/m/eng/rwth.jpg' },
    { name: 'KTH Royal Institute of Technology', program: 'MSc Electrical Engineering', loc: 'Stockholm, Sweden', start: 'Aug 2026', tuition: 'Free tuition (EU)', duration: '2 years', img: '/unis/m/eng/kth.jpg' },
    { name: 'University of Cambridge', program: 'MPhil Engineering', loc: 'Cambridge, United Kingdom', start: 'Oct 2026', tuition: '£37,734/yr', duration: '1 year', img: '/unis/m/eng/cambridge.jpg' },
    { name: 'Massachusetts Institute of Technology (MIT)', program: 'MSc Mechanical Engineering', loc: 'Cambridge, USA', start: 'Sep 2026', tuition: '$61,990/yr', duration: '2 years', img: '/unis/m/eng/mit.jpg' },
    { name: 'Stanford University', program: 'MSc Electrical Engineering', loc: 'Stanford, USA', start: 'Sep 2026', tuition: '$59,250/yr', duration: '1.5–2 years', img: '/unis/m/eng/stanford.webp' },
    { name: 'National University of Singapore (NUS)', program: 'MSc Mechanical Engineering', loc: 'Singapore', start: 'Aug 2026', tuition: 'SGD 19,250/yr', duration: '1.5 years', img: '/unis/m/eng/nus.jpg' },
  ],
  'Law': [
    { name: 'Leiden University', program: 'LLM Advanced International Law', loc: 'Leiden, Netherlands', start: 'Sep 2026', tuition: '€21,800/yr', duration: '1 year', img: '/unis/m/law/leiden.webp' },
    { name: 'University of Amsterdam', program: 'LLM International & European Law', loc: 'Amsterdam, Netherlands', start: 'Sep 2026', tuition: '€17,500/yr (non-EU)', duration: '1 year', img: '/unis/m/law/uva.jpg' },
    { name: 'Sciences Po Law School', program: 'LLM Transnational Arbitration', loc: 'Paris, France', start: 'Sep 2026', tuition: '€21,950/yr', duration: '1 year', img: '/unis/m/law/sciencespo.jpg' },
    { name: 'Humboldt University of Berlin', program: 'LLM International Dispute Resolution', loc: 'Berlin, Germany', start: 'Oct 2026', tuition: '€13,400 total', duration: '1 year', img: null },
    { name: 'University of Oxford', program: 'BCL / MJur (Master of Law)', loc: 'Oxford, United Kingdom', start: 'Oct 2026', tuition: '£42,840/yr', duration: '1 year', img: '/unis/m/law/oxford.webp' },
    { name: 'Harvard Law School', program: 'LLM (Master of Laws)', loc: 'Cambridge, USA', start: 'Sep 2026', tuition: '$78,000/yr', duration: '1 year', img: '/unis/m/law/harvard.webp' },
    { name: 'Columbia Law School', program: 'LLM (Master of Laws)', loc: 'New York, USA', start: 'Aug 2026', tuition: '$84,376/yr', duration: '1 year', img: '/unis/m/law/columbia.jpg' },
    { name: 'National University of Singapore (NUS)', program: 'LLM Asian Legal Studies', loc: 'Singapore', start: 'Aug 2026', tuition: 'SGD 47,950 total', duration: '1 year', img: '/unis/m/law/nus.jpg' },
  ],
}

const BACHELOR_UNIS = {
  'Computer Science': [
    { name: 'Technical University of Munich', program: 'BSc Informatics', loc: 'Munich, Germany', start: 'Oct 2026', tuition: 'Free tuition', duration: '3 years', img: '/unis/b/cs/tum.jpg' },
    { name: 'KTH Royal Institute of Technology', program: 'BSc Computer Science & Engineering', loc: 'Stockholm, Sweden', start: 'Aug 2026', tuition: 'Free tuition (EU)', duration: '3 years', img: '/unis/b/cs/kth.jpg' },
    { name: 'TU Delft', program: 'BSc Computer Science & Engineering', loc: 'Delft, Netherlands', start: 'Sep 2026', tuition: '€2,314/yr', duration: '3 years', img: '/unis/b/cs/delft.jpg' },
    { name: 'ETH Zürich', program: 'BSc Computer Science', loc: 'Zürich, Switzerland', start: 'Sep 2026', tuition: 'CHF 730/yr', duration: '3 years', img: '/unis/b/cs/eth.jpg' },
    { name: 'Imperial College London', program: 'MEng Computing', loc: 'London, United Kingdom', start: 'Sep 2026', tuition: '£9,250/yr', duration: '4 years', img: null },
    { name: 'Massachusetts Institute of Technology (MIT)', program: 'BSc Computer Science & Engineering', loc: 'Cambridge, USA', start: 'Sep 2026', tuition: '$57,986/yr', duration: '4 years', img: '/unis/b/cs/mit.jpg' },
    { name: 'Carnegie Mellon University', program: 'BSc Computer Science', loc: 'Pittsburgh, USA', start: 'Sep 2026', tuition: '$57,116/yr', duration: '4 years', img: '/unis/b/cs/cmu.jpg' },
    { name: 'National University of Singapore (NUS)', program: 'BComp Computer Science', loc: 'Singapore', start: 'Aug 2026', tuition: 'SGD 8,250/yr', duration: '4 years', img: '/unis/b/cs/nus.jpg' },
  ],
  'Business & MBA': [
    { name: 'Bocconi University', program: 'BSc Economics and Management', loc: 'Milan, Italy', start: 'Sep 2026', tuition: '€13,986/yr', duration: '3 years', img: '/unis/b/biz/bocconi.jpg' },
    { name: 'Erasmus University Rotterdam (RSM)', program: 'BSc International Business', loc: 'Rotterdam, Netherlands', start: 'Sep 2026', tuition: '€2,314/yr', duration: '3 years', img: '/unis/b/biz/rsm.jpg' },
    { name: 'University of St. Gallen (HSG)', program: 'BSc Business Administration', loc: 'St. Gallen, Switzerland', start: 'Sep 2026', tuition: 'CHF 720/yr', duration: '3 years', img: '/unis/b/biz/hsg.jpg' },
    { name: 'Copenhagen Business School', program: 'BSc Business & Information Systems', loc: 'Copenhagen, Denmark', start: 'Sep 2026', tuition: 'Free tuition (EU)', duration: '3 years', img: '/unis/b/biz/cbs.jpg' },
    { name: 'London School of Economics', program: 'BSc Management', loc: 'London, United Kingdom', start: 'Sep 2026', tuition: '£9,250/yr', duration: '4 years', img: null },
    { name: 'University of Pennsylvania (Wharton)', program: 'BSc in Economics', loc: 'Philadelphia, USA', start: 'Sep 2026', tuition: '$59,928/yr', duration: '4 years', img: '/unis/b/biz/wharton.jpg' },
    { name: 'New York University (Stern)', program: 'BS in Business', loc: 'New York, USA', start: 'Sep 2026', tuition: '$54,630/yr', duration: '4 years', img: null },
    { name: 'National University of Singapore (NUS)', program: 'BBA Business Administration', loc: 'Singapore', start: 'Aug 2026', tuition: 'SGD 8,250/yr', duration: '4 years', img: '/unis/b/biz/nus.jpg' },
  ],
  'Engineering': [
    { name: 'ETH Zürich', program: 'BSc Mechanical Engineering', loc: 'Zürich, Switzerland', start: 'Sep 2026', tuition: 'CHF 730/yr', duration: '3 years', img: '/unis/b/eng/eth.jpg' },
    { name: 'TU Delft', program: 'BSc Mechanical Engineering', loc: 'Delft, Netherlands', start: 'Sep 2026', tuition: '€2,314/yr', duration: '3 years', img: '/unis/b/eng/delft.jpg' },
    { name: 'RWTH Aachen University', program: 'BSc Mechanical Engineering', loc: 'Aachen, Germany', start: 'Oct 2026', tuition: 'Free tuition', duration: '3 years', img: '/unis/b/eng/rwth.jpg' },
    { name: 'KTH Royal Institute of Technology', program: 'BSc Engineering (Track: CS & IT)', loc: 'Stockholm, Sweden', start: 'Aug 2026', tuition: 'Free tuition', duration: '3 years', img: '/unis/b/eng/kth.jpg' },
    { name: 'Imperial College London', program: 'BSc Engineering', loc: 'London, United Kingdom', start: 'Sep 2026', tuition: '£9,250/yr', duration: '4 years', img: null },
    { name: 'Massachusetts Institute of Technology (MIT)', program: 'BSc Mechanical Engineering', loc: 'Cambridge, USA', start: 'Sep 2026', tuition: '$57,986/yr', duration: '4 years', img: '/unis/b/eng/mit.jpg' },
    { name: 'Stanford University', program: 'BSc Engineering', loc: 'Stanford, USA', start: 'Sep 2026', tuition: '$56,169/yr', duration: '4 years', img: '/unis/b/eng/stanford.webp' },
    { name: 'National University of Singapore (NUS)', program: 'BSc Engineering', loc: 'Singapore', start: 'Aug 2026', tuition: 'SGD 8,800/yr', duration: '4 years', img: '/unis/b/eng/nus.jpg' },
  ],
  'Law': [
    { name: 'University of Amsterdam', program: 'LLB International Business Law', loc: 'Amsterdam, Netherlands', start: 'Sep 2026', tuition: '€2,314/yr', duration: '3 years', img: '/unis/b/law/uva.jpg' },
    { name: 'Leiden University', program: 'LLB Law', loc: 'Leiden, Netherlands', start: 'Sep 2026', tuition: '€2,314/yr', duration: '3 years', img: '/unis/b/law/leiden.webp' },
    { name: 'Maastricht University', program: 'LLB Law', loc: 'Maastricht, Netherlands', start: 'Sep 2026', tuition: '€2,314/yr', duration: '3 years', img: '/unis/b/law/maastricht.jpg' },
    { name: 'Sciences Po', program: 'BA Law & Politics', loc: 'Paris, France', start: 'Sep 2026', tuition: '€3,770/yr', duration: '3 years', img: '/unis/b/law/sciencespo.jpg' },
    { name: 'University of Oxford', program: 'BA Jurisprudence (Law)', loc: 'Oxford, United Kingdom', start: 'Oct 2026', tuition: '£9,250/yr', duration: '4 years', img: '/unis/b/law/oxford.webp' },
    { name: 'Yale University', program: 'BA Political Science & Law', loc: 'New Haven, USA', start: 'Sep 2026', tuition: '$61,750/yr', duration: '4 years', img: '/unis/b/law/yale.png' },
    { name: 'Georgetown University', program: 'BSc Justice & Legal Studies', loc: 'Washington D.C., USA', start: 'Sep 2026', tuition: '$57,590/yr', duration: '4 years', img: null },
    { name: 'National University of Singapore (NUS)', program: 'LLB Law', loc: 'Singapore', start: 'Aug 2026', tuition: 'SGD 8,250/yr', duration: '4 years', img: '/unis/b/law/nus.jpg' },
  ],
}

const STORIES = [
  { stat: '8', label: 'free programs found', name: 'Seung', desc: 'Seung found 8 fully-funded CS programs in under 5 minutes and got into his first choice', tags: ['Computer Science', 'Germany', 'Free tuition'], img: '/students/s1.jpg' },
  { stat: '6 weeks', label: 'of research saved', name: 'Sofia', desc: 'Sofia replaced 6 weeks of browser tabs with one UniAsk conversation — then got into KTH', tags: ['European Law', 'Sweden', 'Free tuition'], img: '/students/s4.jpg' },
  { stat: '€0', label: 'tuition per year', name: 'Mohamed', desc: 'Mohamed discovered he could study Data Science in Europe for free', tags: ['Data Science', 'Netherlands', 'Free tuition'], img: '/students/s5.jpg' },
]

const FAQS = [
  {
    q: "Is UniAsk really free? What's the catch?",
    a: "There's no catch. UniAsk is completely free for students — no credit card, no trial period, no hidden upgrade wall. You can search thousands of programs, chat with AI about any of them, and save your favorites without spending a cent. We believe the best university discovery tool should be accessible to every student, regardless of budget.",
  },
  {
    q: 'How is this different from just Googling or using StudyPortals?',
    a: "Google and directory sites show you lists — you still have to visit each university website, read PDFs, email admissions offices, and piece the answers together yourself. That process takes weeks. UniAsk replaces it entirely: your results are already ranked by how well they fit your profile, and you can ask specific questions and get direct answers without leaving the page. The difference is searching a library versus asking a librarian who's already read everything.",
  },
  {
    q: 'How accurate is the information? Can I rely on it for my application?',
    a: "Our data comes directly from official university sources — admissions pages, program handbooks, and scholarship databases — and we verify it weekly. That said, we always recommend confirming final details (especially deadlines and required documents) on the university's official website before submitting anything. Use UniAsk to discover, research, and shortlist confidently — then do one final check before you apply. The AI will remind you of this too.",
  },
  {
    q: "I don't know what I want to study yet. Can UniAsk still help me?",
    a: 'This is actually where UniAsk is most useful. You don\u2019t need a specific program in mind. Tell us your interests, career goals, or even something as broad as "I enjoy problem-solving and want to study in Europe on a tight budget" — the AI will guide you through options and surface directions you might not have considered. Many of our most satisfied users arrived with a vague idea and left with a clear shortlist.',
  },
  {
    q: 'My situation is complicated. Will the AI actually understand me?',
    a: "UniAsk is built for real students — not textbook cases. Whether you're switching fields, have a non-traditional academic background, need programs compatible with a work visa, or have budget constraints most databases don't filter for — explain your situation in plain language and the AI will work with it. If something is outside what it can answer with confidence, it will tell you directly rather than guess.",
  },
  {
    q: 'Does UniAsk cover visa requirements and cost of living?',
    a: "Yes — every program's AI chat covers far more than admission criteria. Ask about visa requirements for your specific nationality, average living costs in that city, part-time work regulations, housing options, health insurance, and more. We include this information specifically so you can make a fully-informed decision: not just choose a program, but actually be prepared to go.",
  },
  {
    q: 'What programs and countries does UniAsk cover?',
    a: "UniAsk currently indexes 40,000+ programs across 85+ countries, with the strongest coverage in Europe, North America, and Oceania — including hundreds of fully-funded programs that most students never find on their own. We cover virtually all major academic fields, from Computer Science and Medicine to Architecture and Education. If a search area isn't well-covered yet, the AI will tell you honestly rather than return weak results.",
  },
  {
    q: 'Can I save my research and come back later?',
    a: "Create a free account — it takes under 30 seconds — and everything stays with you: saved programs, AI conversations, and your full search history. Pick up any chat exactly where you left off, on any device, whenever you're ready. No time pressure, no expiry date on your research.",
  },
]

// ── sub-components ────────────────────────────────────────────────────────────

function UniCard({ uni, progMinH, onAskAI }) {
  // Figma 506:1028 — Article
  const iconRow = { display: 'flex', alignItems: 'center', gap: 5 }
  const iconTxt = { fontSize: 14, fontWeight: 400, color: '#000', lineHeight: '19.5px' }
  const badge = {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '6px 10px', borderRadius: 10, background: '#f7f7f7',
    fontSize: 12, fontWeight: 500, color: '#3a3a35', lineHeight: '18px',
  }
  return (
    <div style={{ minWidth: 314, maxWidth: 314, background: '#fff', borderRadius: 20, overflow: 'hidden', flexShrink: 0, display: 'flex', flexDirection: 'column', scrollSnapAlign: 'start' }}>
      {/* Image — 202px, top corners 20px */}
      <div style={{ height: 202, overflow: 'hidden', position: 'relative', flexShrink: 0, background: '#05203C' }}>
        {uni.img ? (
          <img src={uni.img} alt={uni.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #05203C 0%, #0A3A66 100%)', color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: 500, textAlign: 'center', padding: 20, lineHeight: 1.4 }}>
            {uni.name}
          </div>
        )}
      </div>

      {/* Body — p16, gap20 between content and button */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', width: '100%' }}>
            {/* Name gets a fixed 2-line slot (as in Figma); program is always
                a single line, so every card keeps the same vertical rhythm. */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
              <div style={{
                fontSize: 22, fontWeight: 500, color: '#0162e3', lineHeight: '26.4px',
                minHeight: 52.8, wordBreak: 'break-word',
                display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden',
              }}>{uni.name}</div>
              <div data-prog style={{
                fontSize: 16, fontWeight: 500, color: '#0162e3', lineHeight: '19.5px',
                wordBreak: 'break-word', width: '100%', minHeight: progMinH || undefined,
                display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden',
              }}>{uni.program}</div>
            </div>
            {/* Location + start date — gap 10, 20px icons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start', width: '100%' }}>
              <div style={iconRow}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span style={iconTxt}>{uni.loc}</span>
              </div>
              <div style={iconRow}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                <span style={iconTxt}>Starts {uni.start}</span>
              </div>
            </div>
          </div>

          {/* Badges — gap 8, #f7f7f7, radius 10 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'flex-start', width: '100%' }}>
            <span style={badge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M15 9.5a2.5 2.5 0 0 0-2.5-2.5h-1a2.5 2.5 0 0 0 0 5h1a2.5 2.5 0 0 1 0 5h-1A2.5 2.5 0 0 1 9 14.5"/></svg>
              {uni.tuition}
            </span>
            <span style={badge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/></svg>
              English
            </span>
            <span style={badge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {uni.duration}
            </span>
          </div>
        </div>

        {/* Ask AI — radius 12, py12 px16, 14px */}
        <button
          onClick={() => onAskAI?.(uni)}
          style={{
            marginTop: 'auto', width: '100%', padding: '12px 16px', background: '#0162e3', color: '#fff',
            border: 'none', borderRadius: 12, fontWeight: 500, fontSize: 14, letterSpacing: '-0.28px',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Ask AI
        </button>
      </div>
    </div>
  )
}

// Ratio anchor: what UniAsk does in 5 minutes takes 120 minutes by hand — 24x.
const UNIASK_MIN = 5      // slider at 0
const UNIASK_MAX = 60     // slider at 100 — an hour of UniAsk vs a full day by hand
const MANUAL_FACTOR = 24

function TimeSection() {
  const isMobile = useIsMobile()
  const [pos, setPos] = useState(0) // 0-100

  const uniask = Math.round(UNIASK_MIN + (pos / 100) * (UNIASK_MAX - UNIASK_MIN))
  const manual = uniask * MANUAL_FACTOR
  const fmt = n => n.toLocaleString('en-US')

  // Thumb is 18px, so its centre travels between 9px and (100% - 9px).
  const centre = `calc(9px + (100% - 18px) * ${pos / 100})`

  const statLabel = { fontSize: isMobile ? 12 : 16, fontWeight: 600, textTransform: 'uppercase', lineHeight: 'normal', margin: 0 }
  const statNum = { fontSize: isMobile ? 40 : 64, fontWeight: 600, lineHeight: 'normal', margin: 0 }
  const statFoot = { fontSize: isMobile ? 14 : 20, fontWeight: 400, color: '#1f1f1f', lineHeight: 'normal', margin: 0 }

  return (
    <section style={{ background: '#fff', padding: isMobile ? '40px 16px' : '80px 64px', display: 'flex', flexDirection: 'column', gap: isMobile ? 40 : 56, alignItems: 'center' }}>
      {/* Heading */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%', maxWidth: 1084 }}>
        <h2 style={{ fontSize: isMobile ? 32 : 40, fontWeight: 500, color: '#000', textAlign: 'center', letterSpacing: isMobile ? '-0.32px' : '-0.4px', lineHeight: 'normal', margin: 0, width: '100%', fontFamily: 'Geist, sans-serif' }}>
          Students waste months on research<br />that should take minutes.
        </h2>
        <p style={{ fontSize: 16, fontWeight: 400, color: '#31464b', textAlign: 'center', lineHeight: 'normal', margin: 0, maxWidth: 590 }}>
          The average student spends 6–10 weeks comparing programs across dozens of browser tabs. UniAsk replaces all of that with one conversation.
        </p>
      </div>

      {/* Slider + stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', width: '100%', maxWidth: 856 }}>
        <p style={{ fontSize: isMobile ? 16 : 20, fontWeight: 400, color: '#31464b', textAlign: 'center', lineHeight: 'normal', margin: 0, maxWidth: 590 }}>
          I&apos;ve been researching universities for
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', width: '100%' }}>
          {/* Slider — track #C9D5E7, fill gradient #E2EAF6 -> #0F2D63, thumb #173468 */}
          <div style={{ position: 'relative', height: 18, width: '100%' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 5, height: 8, borderRadius: 4, background: '#C9D5E7' }} />
            <div style={{ position: 'absolute', left: 0, width: centre, top: 5, height: 8, borderRadius: 4, background: 'linear-gradient(90deg, #E2EAF6 0%, #0F2D63 100%)' }} />
            <div style={{ position: 'absolute', left: centre, top: 0, width: 18, height: 18, borderRadius: '50%', background: '#173468', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
            <input
              type="range" min={0} max={100} step={1} value={pos}
              onChange={e => setPos(Number(e.target.value))}
              aria-label="How long you have been researching universities"
              className="time-range"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', margin: 0, opacity: 0, cursor: 'pointer' }}
            />
            <style jsx>{`
              .time-range::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; }
              .time-range::-moz-range-thumb { width: 18px; height: 18px; border: none; border-radius: 50%; }
            `}</style>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', textAlign: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', width: isMobile ? 'auto' : 272 }}>
              <p style={{ ...statLabel, color: '#73767b' }}>Your research so far</p>
              <p style={{ ...statNum, color: '#ec4244' }}>{fmt(manual)}</p>
              <p style={statFoot}><span style={{ fontWeight: 600 }}>minutes</span> spent researching</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', whiteSpace: 'nowrap' }}>
              <p style={{ ...statLabel, color: '#73767b' }}>With <span style={{ color: '#05203c' }}>UniAsk</span></p>
              <p style={{ ...statNum, color: '#2e579f' }}>{fmt(uniask)}</p>
              <p style={statFoot}><span style={{ fontWeight: 600 }}>minutes</span> to your shortlist</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StoriesSection() {
  const isMobile = useIsMobile()
  const rowRef = useRef(null)
  const [tagFS, setTagFS] = useState(12)

  // Figma sizes the tags at 12px and they sit on one line at the 1512px design
  // width. Below that the side columns narrow, so step the size down just
  // enough to keep every tag row on a single line.
  useLayoutEffect(() => {
    const el = rowRef.current
    if (!el) return
    const ctx = document.createElement('canvas').getContext('2d')
    const PAD_X = 10, GAP = 8
    const SIZES = [12, 11.5, 11, 10.5, 10]
    let lastW = -1
    const fit = () => {
      const groups = Array.from(el.querySelectorAll('[data-tags]'))
      if (!groups.length) return
      let chosen = SIZES[SIZES.length - 1]
      for (const size of SIZES) {
        ctx.font = `500 ${size}px Geist, sans-serif`
        const ok = groups.every(g => {
          const texts = Array.from(g.children).map(c => c.textContent)
          const need = texts.reduce((a, t) => a + ctx.measureText(t).width + PAD_X * 2, 0) + GAP * (texts.length - 1)
          return need <= g.clientWidth
        })
        if (ok) { chosen = size; break }
      }
      setTagFS(prev => (prev === chosen ? prev : chosen))
    }
    const onResize = () => {
      const w = el.clientWidth
      if (w === lastW) return // ignore height-only changes so this cannot loop
      lastW = w
      fit()
    }
    onResize()
    // Both signals: ResizeObserver for container-driven changes, and window
    // resize because RO alone can be unreliable depending on the environment.
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null
    ro?.observe(el)
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(fit)
    return () => { ro?.disconnect(); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <section style={{ background: '#fff', padding: isMobile ? '40px 16px' : '80px 64px', display: 'flex', flexDirection: 'column', gap: isMobile ? 24 : 40, alignItems: 'center' }}>
      <h2 style={{ fontSize: isMobile ? 24 : 40, fontWeight: 500, color: '#000', margin: 0, fontFamily: 'Geist, sans-serif', textAlign: 'center', letterSpacing: '-0.4px', lineHeight: 'normal', width: '100%' }}>
        Students getting accepted.
      </h2>

      {/* Column ratio 318 : 691 : 318 reproduces Figma at the design width and
          scales proportionally below it. Images bottom-align. */}
      <div ref={rowRef} className="stories-row" style={{ display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'center', width: '100%', maxWidth: 1384 }}>
        {STORIES.map((s, i) => {
          const wide = i === 1
          return (
            <div
              key={i}
              className="story-col"
              style={{
                display: 'flex', flexDirection: 'column', gap: 24,
                alignItems: 'flex-start',
                flex: wide ? '2.173 0 0' : '1 0 0', minWidth: 1,
              }}
            >
              {/* Photo — radius 32, 348px (406 for the wide one), bottom-aligned
                  inside a 406px slot so every column's photo ends on one line */}
              <div className="story-photo-slot" style={{ width: '100%', height: 406, display: 'flex', alignItems: 'flex-end' }}>
              <div className="story-photo" style={{ position: 'relative', width: '100%', height: wide ? 406 : 348, borderRadius: 32, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 24 }}>
                <img src={s.img} alt={s.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: wide ? 122 : 155, background: 'linear-gradient(180deg, rgba(65,65,65,0) 0%, #031930 100%)' }} />
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start', color: '#fff', width: '100%' }}>
                  <div style={{ fontSize: isMobile ? 32 : 40, fontWeight: 500, lineHeight: 'normal' }}>{s.stat}</div>
                  <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 400, lineHeight: 'normal' }}>{s.label}</div>
                </div>
              </div>
              </div>

              {/* Tags + description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', width: '100%' }}>
                <div data-tags style={{ display: 'flex', flexWrap: 'wrap', columnGap: 8, rowGap: 0, alignItems: 'flex-start', width: '100%' }}>
                  {s.tags.map(t => (
                    <span key={t} style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 10px', borderRadius: 10, background: '#f7f7f7', fontSize: tagFS, fontWeight: 500, color: '#3a3a35', lineHeight: '18px', whiteSpace: 'nowrap' }}>{t}</span>
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: isMobile ? 16 : 20, fontWeight: 500, color: '#000', lineHeight: 'normal' }}>{s.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
      <style jsx>{`
        @media (max-width: 1279px) {
          .stories-row { flex-wrap: wrap; }
          .stories-row .story-col { flex: 1 1 100% !important; }
          .stories-row .story-photo-slot { height: auto !important; }
          .stories-row .story-photo { height: 320px !important; }
        }
      `}</style>
    </section>
  )
}

function CardsSection({ heading, data, tabs, field, onFieldChange, onAskAI }) {
  const isMobile = useIsMobile()
  const rowRef = useRef(null)
  const [active, setActive] = useState(0)
  const [progMinH, setProgMinH] = useState(0)
  const unis = data[field] || []

  // The programme line is one line for most cards and two for a few long
  // names. Reserve the tallest one across the visible tab so every card keeps
  // the same rhythm, without padding tabs whose names all fit on one line.
  useLayoutEffect(() => {
    const measure = () => {
      const els = rowRef.current?.querySelectorAll('[data-prog]')
      if (!els?.length) return
      let max = 0
      els.forEach(el => { max = Math.max(max, el.scrollHeight) })
      setProgMinH(prev => (Math.abs(prev - max) > 0.5 ? max : prev))
    }
    setProgMinH(0)
    const raf = requestAnimationFrame(measure)
    document.fonts?.ready.then(measure)
    return () => cancelAnimationFrame(raf)
  }, [field, unis])

  const CARD_STEP = 330 // card width 314 + gap 16

  // Figma shows five indicators for eight cards: the dots track scroll
  // positions, not cards — cards - fully visible cards + 1.
  const [visible, setVisible] = useState(4)
  useLayoutEffect(() => {
    const el = rowRef.current
    if (!el) return
    const calc = () => setVisible(Math.max(1, Math.floor((el.clientWidth + 16) / CARD_STEP)))
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const pages = Math.max(1, unis.length - visible + 1)

  const scroll = (dir) => {
    if (rowRef.current) rowRef.current.scrollBy({ left: dir * CARD_STEP, behavior: 'smooth' })
  }
  const onScroll = () => {
    if (!rowRef.current) return
    const i = Math.round(rowRef.current.scrollLeft / CARD_STEP)
    setActive(Math.min(Math.max(i, 0), pages - 1))
  }

  return (
    <section style={{ background: '#f2f2f2', padding: isMobile ? '40px 0' : '80px 0' }}>
      <div style={{ maxWidth: 1448, margin: '0 auto', paddingLeft: isMobile ? 16 : 64 }}>
        {/* Heading — 40px Geist Medium, tracking -0.4 */}
        <h2 style={{ fontSize: isMobile ? 32 : 40, fontWeight: 500, color: '#000', margin: '0 0 16px', paddingRight: isMobile ? 16 : 0, fontFamily: 'Geist, sans-serif', letterSpacing: isMobile ? '-0.32px' : '-0.4px', lineHeight: 'normal' }}>{heading}</h2>

        {/* Field tabs — p16, 18px, 3px active underline */}
        <div className="uni-tabs" style={{ display: 'flex', borderBottom: '1px solid #dfe0e4', marginBottom: 24, paddingRight: isMobile ? 16 : 64, overflowX: isMobile ? 'auto' : 'visible' }}>
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => onFieldChange(t)}
              style={{
                padding: isMobile ? '16px 8px' : 16, marginBottom: -1, fontSize: isMobile ? 14 : 18, fontWeight: 500, flexShrink: 0,
                color: t === field ? '#0162e3' : '#000', background: 'none', border: 'none',
                borderBottom: t === field ? '3px solid #0162e3' : '3px solid transparent',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.15s, border-color 0.15s', whiteSpace: 'nowrap',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Cards row */}
        <div
          ref={rowRef}
          onScroll={onScroll}
          className="uni-cards-row"
          style={{ display: 'flex', gap: 16, overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: 4 }}
        >
          {unis.map((u, i) => <UniCard key={i} uni={u} progMinH={progMinH} onAskAI={onAskAI} />)}
          {/* Trailing spacer so the last card clears the right edge by the same
              64px the first card is inset from the left. 48px + the row's 16px
              flex gap = 64. A spacer is used rather than padding-right, which
              flex scroll containers drop at the end of the scroll range. */}
          <div aria-hidden style={{ flex: isMobile ? '0 0 0px' : '0 0 48px', alignSelf: 'stretch' }} />
        </div>
        <style jsx>{`.uni-cards-row::-webkit-scrollbar { display: none; } .uni-cards-row { scrollbar-width: none; -ms-overflow-style: none; } .uni-tabs::-webkit-scrollbar { display: none; } .uni-tabs { scrollbar-width: none; }`}</style>

        {/* Pagination + arrows */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 24, paddingRight: isMobile ? 16 : 64, position: 'relative' }}>
          {/* Centered dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '0 auto' }}>
            {Array.from({ length: pages }, (_, i) => (
              <span
                key={i}
                style={{
                  width: i === active ? 45 : 9, height: 9,
                  borderRadius: 4.5, background: i === active ? '#14140E' : '#B8B8B7',
                  transition: 'width 0.2s, background 0.2s', flexShrink: 0,
                }}
              />
            ))}
          </div>
          {/* Arrows pinned right */}
          <div style={{ display: 'flex', gap: 17, position: 'absolute', right: isMobile ? 16 : 64 }}>
            <button onClick={() => scroll(-1)} style={{ width: 45, height: 45, borderRadius: 200, border: '1px solid #000', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button onClick={() => scroll(1)} style={{ width: 45, height: 45, borderRadius: 200, border: '1px solid #000', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function FaqSection() {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(0) // Figma shows the first item expanded

  return (
    <section style={{ background: '#f2f2f2', padding: isMobile ? '40px 16px' : '80px 64px', display: 'flex', flexDirection: 'column', gap: isMobile ? 32 : 56, alignItems: 'center' }}>
      <h2 style={{ fontSize: isMobile ? 32 : 40, fontWeight: 500, color: '#000', textAlign: 'center', letterSpacing: '-0.4px', lineHeight: 'normal', margin: 0, width: '100%', fontFamily: 'Geist, sans-serif' }}>
        More questions?
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', width: '100%', maxWidth: 984 }}>
        {FAQS.map((f, i) => {
          const isOpen = open === i
          return (
            <Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 20, alignItems: 'flex-start', padding: '6px 0', width: '100%' }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
                >
                  <span style={{ flex: '1 0 0', minWidth: 1, fontSize: isMobile ? 16 : 24, fontWeight: 600, color: '#000', lineHeight: 'normal', wordBreak: 'break-word' }}>{f.q}</span>
                  {/* Minus is #05203C and 2px; plus is black and 1.33px — per Figma */}
                  <span style={{ flexShrink: 0, width: 20.418, height: 20.418, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isOpen ? (
                      <svg width="20.418" height="20.418" viewBox="0 0 20.418 20.418" fill="none" aria-hidden>
                        <path d="M4.55 10.209H15.87" stroke="#05203C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="20.418" height="20.418" viewBox="0 0 20.418 20.418" fill="none" aria-hidden>
                        <path d="M10.209 4.209V16.209" stroke="black" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.209 10.209H16.209" stroke="black" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </button>
                {isOpen && (
                  <p style={{ margin: 0, fontSize: isMobile ? 14 : 20, fontWeight: 400, color: '#000', lineHeight: isMobile ? '20px' : 'normal', width: '100%' }}>{f.a}</p>
                )}
              </div>
              {i < FAQS.length - 1 && <div style={{ width: '100%', height: 1, background: '#CDCDCD', flexShrink: 0 }} />}
            </Fragment>
          )
        })}
      </div>
    </section>
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
      <div style={{ position: 'relative', height: 32, margin: '4px 0 14px', padding: '0 9px' }}>
        {/* Track */}
        <div style={{ position: 'absolute', left: 9, right: 9, top: '50%', height: 4, background: '#E0E0E0', borderRadius: 999, transform: 'translateY(-50%)' }} />
        {/* Filled — thumb center = 9px + pct * (100% - 18px) */}
        <div style={{
          position: 'absolute',
          left: `calc(9px + (100% - 18px) * ${pctLo / 100})`,
          right: `calc(9px + (100% - 18px) * ${(100 - pctHi) / 100})`,
          top: '50%', height: 4, background: '#0162E3', borderRadius: 999, transform: 'translateY(-50%)'
        }} />
        {/* Lo input */}
        <input
          type="range" min={MIN} max={MAX} step={STEP} value={lo} onChange={onLoRange}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent', appearance: 'none', WebkitAppearance: 'none', pointerEvents: 'none', margin: 0 }}
          className="tuition-range tuition-range-lo"
        />
        {/* Hi input */}
        <input
          type="range" min={MIN} max={MAX} step={STEP} value={hi} onChange={onHiRange}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent', appearance: 'none', WebkitAppearance: 'none', pointerEvents: 'none', margin: 0 }}
          className="tuition-range tuition-range-hi"
        />
        <style jsx>{`
          .tuition-range { -webkit-appearance: none; appearance: none; background: transparent; padding: 0; }
          .tuition-range::-webkit-slider-runnable-track { background: transparent; height: 32px; border: none; }
          .tuition-range::-moz-range-track { background: transparent; height: 32px; border: none; }
          .tuition-range::-webkit-slider-thumb {
            -webkit-appearance: none; appearance: none;
            width: 18px; height: 18px; border-radius: 50%;
            background: #fff; border: 2px solid #0162E3;
            cursor: grab; pointer-events: auto;
            margin-top: 7px;
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
      {/* Text inputs. The wrappers need an explicit minWidth:0 — a flex item's
          default min-width:auto refuses to shrink past the input's intrinsic
          size, which pushed the whole popover wider than the screen on mobile.
          16px text also stops iOS Safari zooming when the field is focused. */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 4, background: '#F5F5F5', border: '1px solid #E0E0E0', borderRadius: 8, padding: '8px 10px', boxSizing: 'border-box' }}>
          <span style={{ fontSize: 12, color: '#888', flexShrink: 0 }}>$</span>
          <input inputMode="numeric" value={loStr} onChange={e => setLoStr(e.target.value)} onBlur={e => applyLoTxt(e.target.value)} style={{ flex: 1, width: '100%', border: 'none', background: 'none', fontSize: 16, outline: 'none', minWidth: 0, fontFamily: 'inherit' }} />
        </div>
        <span style={{ color: '#ccc', flexShrink: 0 }}>—</span>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 4, background: '#F5F5F5', border: '1px solid #E0E0E0', borderRadius: 8, padding: '8px 10px', boxSizing: 'border-box' }}>
          <span style={{ fontSize: 12, color: '#888', flexShrink: 0 }}>$</span>
          <input inputMode="numeric" value={hiStr} onChange={e => setHiStr(e.target.value)} onBlur={e => applyHiTxt(e.target.value)} style={{ flex: 1, width: '100%', border: 'none', background: 'none', fontSize: 16, outline: 'none', minWidth: 0, fontFamily: 'inherit' }} />
        </div>
      </div>
    </div>
  )
}

// ── main export ───────────────────────────────────────────────────────────────

export default function SearchScreen({ filters, setFilters, onSearch, onOpenAuth, user, onSignOut, isPremium, onUpgrade, onMyPrograms, onMyChats, onProfile, onFeedback, onTerms, onPrivacy, onAskAI }) {
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showTuition, setShowTuition] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [masterField, setMasterField] = useState('Computer Science')
  const [bachelorField, setBachelorField] = useState('Computer Science')
  const tuitionRef = useRef(null)
  const helpRef = useRef(null)

  // derived display values
  const degree = filters.degree?.[0] || 'Bachelor'
  const [tuitionLo, tuitionHi] = filters.tuition || [0, 100000]
  const tuitionLabel = tuitionLo === 0 && tuitionHi === 100000 ? 'Free – $100,000' : `$${tuitionLo.toLocaleString()} – $${tuitionHi.toLocaleString()}`

  useEffect(() => {
    const close = e => {
      if (tuitionRef.current && !tuitionRef.current.contains(e.target)) setShowTuition(false)
      if (helpRef.current && !helpRef.current.contains(e.target)) setShowHelp(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const setDegree = d => setFilters(f => ({ ...f, degree: [d] }))

  // Desktop: one horizontal white pill. Mobile (Figma 535:1857): four
  // stacked #f7f7f7 cards, 10px apart.
  const cell = {
    padding: isMobile ? '15px 21px' : '16px 24px',
    borderRight: isMobile ? 'none' : '1px solid #EEE',
    display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0,
    ...(isMobile ? { background: '#f7f7f7', borderRadius: 16, justifyContent: 'center' } : null),
  }
  const cellLabel = isMobile
    ? { fontSize: 13, fontWeight: 700, color: '#747474', textTransform: 'uppercase', letterSpacing: '0.66px', lineHeight: '16.5px' }
    : { fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }
  const cellValue = isMobile
    ? { fontSize: 18, fontWeight: 500, color: '#1a1a17' }
    : { fontSize: 15, color: '#111' }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: 'Geist, -apple-system, sans-serif', background: '#fff', minHeight: '100vh' }}>

      <SiteNav
        isMobile={isMobile}
        user={user}
        onOpenAuth={onOpenAuth}
        onSignOut={onSignOut}
        onMyPrograms={onMyPrograms}
        onMyChats={onMyChats}
        onProfile={onProfile}
        onFeedback={onFeedback}
        onTerms={onTerms}
        onPrivacy={onPrivacy}
        onOpenMenu={() => setMenuOpen(true)}
      />

      {/* ── HERO ── */}
      <section style={{ background: '#05203C', padding: isMobile ? '40px 16px' : '56px 48px 72px', textAlign: 'center' }}>
        <p style={{ fontSize: isMobile ? 12 : 13, fontWeight: isMobile ? 400 : 500, letterSpacing: isMobile ? '-0.24px' : '0.02em', color: '#fff', textTransform: 'uppercase', marginBottom: isMobile ? 2 : 20 }}>YOUR GOALS. YOUR BUDGET. ANY UNIVERSITY.</p>
        <h1 style={{ fontSize: isMobile ? 32 : 'clamp(40px,5.5vw,68px)', fontWeight: isMobile ? 500 : 700, color: '#fff', margin: isMobile ? '0 0 27px' : '0 0 36px', lineHeight: isMobile ? 'normal' : 1.1, fontFamily: 'Geist, sans-serif', letterSpacing: isMobile ? 0 : '-0.02em' }}>Find your next university</h1>

        {/* Degree pills — white container, navy filled active */}
        <div style={{ display: 'inline-flex', gap: isMobile ? 0 : 0, justifyContent: isMobile ? 'space-between' : undefined, width: isMobile ? 333 : undefined, maxWidth: '100%', background: isMobile ? '#f7f7f7' : '#fff', border: isMobile ? '1px solid rgba(228,228,228,0.38)' : 'none', boxShadow: isMobile ? '0px 4px 13.95px rgba(0,0,0,0.04)' : 'none', borderRadius: isMobile ? 100 : 999, padding: 4, marginBottom: isMobile ? 27 : 32 }}>
          {['Bachelor', 'Master', 'PhD'].map(d => {
            const active = degree === d
            return (
              <button
                key={d}
                onClick={() => setDegree(d)}
                style={{
                  padding: isMobile ? '10px 18px' : '10px 32px',
                  borderRadius: isMobile ? 1000 : 999,
                  border: active && !isMobile ? '2px solid #fff' : 'none',
                  background: active ? '#05203C' : 'transparent',
                  color: active ? '#fff' : '#05203C',
                  fontWeight: 500,
                  fontSize: isMobile ? 16 : 15,
                  letterSpacing: isMobile ? '-0.32px' : undefined,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {d}
              </button>
            )
          })}
        </div>

        {/* Search bar */}
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'stretch', gap: isMobile ? 8 : 12, textAlign: 'left' }}>
          <div style={{ flex: 1, background: isMobile ? 'transparent' : '#fff', borderRadius: 16, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 0, alignItems: 'stretch', overflow: 'visible', boxShadow: isMobile ? 'none' : '0 4px 24px rgba(0,0,0,0.15)' }}>
            {/* Field of study */}
            <div style={{ ...cell, flex: isMobile ? 'none' : '1 1 240px' }}>
              <label style={cellLabel}>Field of Study</label>
              <input
                value={filters.field || ''}
                onChange={e => setFilters(f => ({ ...f, field: e.target.value }))}
                placeholder="e.g. Computer Science"
                style={{ ...cellValue, border: 'none', outline: 'none', fontFamily: 'inherit', background: 'transparent', padding: 0, fontWeight: isMobile ? 400 : undefined }}
              />
            </div>
            {/* Country */}
            <div style={{ ...cell, flex: isMobile ? 'none' : '1 1 180px', position: 'relative' }}>
              <label style={cellLabel}>Country</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={filters.country || ''}
                  onChange={e => setFilters(f => ({ ...f, country: e.target.value }))}
                  style={{ ...cellValue, width: '100%', border: 'none', outline: 'none', fontFamily: 'inherit', background: 'transparent', appearance: 'none', cursor: 'pointer', padding: '0 22px 0 0' }}
                >
                  <option value="">Any country</option>
                  {POPULAR_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  <option disabled>──────────</option>
                  {ALL_COUNTRIES.filter(c => !POPULAR_COUNTRIES.includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <svg width={isMobile ? 18 : 14} height={isMobile ? 18 : 14} viewBox="0 0 24 24" fill="none" stroke={isMobile ? "#3a3a35" : "#666"} strokeWidth="2" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
            {/* Start date */}
            <div style={{ ...cell, flex: isMobile ? 'none' : '1 1 160px' }}>
              <label style={cellLabel}>Start Date</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={filters.startDate || ''}
                  onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))}
                  style={{ ...cellValue, width: '100%', border: 'none', outline: 'none', fontFamily: 'inherit', background: 'transparent', appearance: 'none', cursor: 'pointer', padding: '0 22px 0 0' }}
                >
                  <option value="">Any start date</option>
                  {['Jan 2025','Feb 2025','Mar 2025','Apr 2025','May 2025','Jun 2025','Jul 2025','Aug 2025','Sep 2025','Oct 2025','Nov 2025','Dec 2025','Jan 2026','Feb 2026','Mar 2026','Apr 2026','May 2026','Jun 2026','Jul 2026','Aug 2026','Sep 2026','Oct 2026','Nov 2026','Dec 2026'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <svg width={isMobile ? 18 : 14} height={isMobile ? 18 : 14} viewBox="0 0 24 24" fill="none" stroke={isMobile ? "#3a3a35" : "#666"} strokeWidth="2" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
            {/* Tuition */}
            <div ref={tuitionRef} style={{ ...cell, flex: isMobile ? 'none' : '1 1 180px', borderRight: 'none', position: 'relative', cursor: 'pointer' }} onClick={() => setShowTuition(s => !s)}>
              <label style={{ ...cellLabel, pointerEvents: 'none' }}>Tuition (USD/yr)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ ...cellValue, userSelect: 'none', display: 'block', padding: '0 22px 0 0' }}>{tuitionLabel}</span>
                <svg width={isMobile ? 18 : 14} height={isMobile ? 18 : 14} viewBox="0 0 24 24" fill="none" stroke={isMobile ? "#3a3a35" : "#666"} strokeWidth="2" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><path d="m6 9 6 6 6-6"/></svg>
              </div>
              {showTuition && (
                <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, left: isMobile ? 0 : 'auto', minWidth: isMobile ? 0 : 300, maxWidth: isMobile ? 'calc(100vw - 32px)' : undefined, boxSizing: 'border-box', background: '#fff', border: '1px solid #E0E0E0', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: 16, zIndex: 200 }}>
                  <TuitionCard value={filters.tuition || [0, 100000]} onChange={v => setFilters(f => ({ ...f, tuition: v }))} />
                </div>
              )}
            </div>
          </div>
          {/* Search button — separate rounded */}
          <button
            onClick={onSearch}
            style={{ flexShrink: 0, width: isMobile ? '100%' : undefined, height: isMobile ? 64 : undefined, padding: isMobile ? 0 : '0 40px', background: '#0162E3', color: '#fff', border: 'none', fontSize: isMobile ? 20 : 16, fontWeight: isMobile ? 500 : 600, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 16, minWidth: isMobile ? 0 : 120 }}
          >
            Search
          </button>
        </div>

        {/* Format + Attendance chips */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 16 : 40, justifyContent: 'flex-start', maxWidth: 1240, margin: isMobile ? '24px auto 0' : '20px auto 0', paddingLeft: isMobile ? 0 : 4, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: isMobile ? 12 : 10 }}>
            <span style={{ fontSize: 12, fontWeight: isMobile ? 700 : 600, color: isMobile ? '#f7f7f7' : '#fff', textTransform: 'uppercase', letterSpacing: isMobile ? '0.66px' : '0.05em', lineHeight: isMobile ? '16.5px' : undefined }}>Format</span>
            <div style={{ display: 'flex', gap: isMobile ? 6 : 8, flexWrap: 'wrap' }}>
              {['Full-time', 'Part-time'].map(v => {
                const active = (filters.format || []).includes(v)
                return (
                  <button
                    key={v}
                    onClick={() => setFilters(f => ({ ...f, format: active ? (f.format || []).filter(x => x !== v) : [...(f.format || []), v] }))}
                    style={{
                      padding: isMobile ? (active ? '8px 14px' : '9px 15px') : '8px 20px',
                      borderRadius: 999,
                      border: active ? `1px solid ${isMobile ? '#0162E3' : '#0162E3'}` : `1px solid rgba(255,255,255,${isMobile ? '0.4' : '0.35'})`,
                      background: active ? '#0162E3' : 'transparent',
                      color: active && isMobile ? '#f7f7f7' : '#fff',
                      fontSize: isMobile ? 16 : 14,
                      fontWeight: isMobile ? 400 : 500,
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: isMobile ? 12 : 10 }}>
            <span style={{ fontSize: 12, fontWeight: isMobile ? 700 : 600, color: isMobile ? '#f7f7f7' : '#fff', textTransform: 'uppercase', letterSpacing: isMobile ? '0.66px' : '0.05em', lineHeight: isMobile ? '16.5px' : undefined }}>Attendance</span>
            <div style={{ display: 'flex', gap: isMobile ? 6 : 8, flexWrap: 'wrap' }}>
              {['On-campus', 'Online', 'Blended'].map(v => {
                const active = (filters.attendance || []).includes(v)
                return (
                  <button
                    key={v}
                    onClick={() => setFilters(f => ({ ...f, attendance: active ? (f.attendance || []).filter(x => x !== v) : [...(f.attendance || []), v] }))}
                    style={{
                      padding: isMobile ? (active ? '8px 14px' : '9px 15px') : '8px 20px',
                      borderRadius: 999,
                      border: active ? `1px solid ${isMobile ? '#0162E3' : '#0162E3'}` : `1px solid rgba(255,255,255,${isMobile ? '0.4' : '0.35'})`,
                      background: active ? '#0162E3' : 'transparent',
                      color: active && isMobile ? '#f7f7f7' : '#fff',
                      fontSize: isMobile ? 16 : 14,
                      fontWeight: isMobile ? 400 : 500,
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
        heading={<>Popular fields. Top <span style={{ color: '#05203c', fontWeight: 600 }}>master</span> programs.</>}
        data={MASTER_UNIS}
        tabs={MASTER_TABS}
        field={masterField}
        onFieldChange={setMasterField}
        onAskAI={onAskAI}
      />

      <StoriesSection />

      {/* ── BACHELOR PROGRAMS ── */}
      <CardsSection
        heading={<>Popular fields. Top <span style={{ color: '#05203c', fontWeight: 600 }}>bachelor</span> programs.</>}
        data={BACHELOR_UNIS}
        tabs={BACHELOR_TABS}
        field={bachelorField}
        onFieldChange={setBachelorField}
        onAskAI={onAskAI}
      />

      <TimeSection />

      <FaqSection />

      <SiteFooter
        isMobile={isMobile}
        onMyPrograms={onMyPrograms}
        onMyChats={onMyChats}
        onTerms={onTerms}
        onPrivacy={onPrivacy}
      />

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
          onHome={() => { setMenuOpen(false) }}
        />
      )}
    </div>
  )
}
