'use client'
import { useState, useRef, useEffect } from 'react'
import { Logo } from './Icons'
import { useIsMobile } from './SiteChrome'

// ── ICONS (module scope) ──────────────────────────────────────────────────────

const IcoHeart = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const IcoHeartMobile = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? '#021d26' : 'none'} stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const IcoMenu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <path d="M4 6h16M4 12h16M4 18h16"/>
  </svg>
)

const IcoClose = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
)

const IcoChevron = ({ up }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {up ? <path d="M4 10.5l4-4 4 4"/> : <path d="M4 5.5l4 4 4-4"/>}
  </svg>
)

const IcoPin = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M10 2.5A4.5 4.5 0 0 0 5.5 7c0 3.5 4.5 9.5 4.5 9.5s4.5-6 4.5-9.5A4.5 4.5 0 0 0 10 2.5z" stroke="black" strokeWidth="1.3"/>
    <circle cx="10" cy="7" r="1.5" stroke="black" strokeWidth="1.3"/>
  </svg>
)

const IcoExternalLink = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9"/>
    <path d="M10 2h4v4M7.5 8.5L14 2"/>
  </svg>
)

const IcoClock = ({ color = '#6b7280' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="9" cy="9" r="7"/>
    <path d="M9 5v4l2.5 2.5"/>
  </svg>
)

const IcoCalendar = ({ color = '#6b7280' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="3" width="14" height="13" rx="2"/>
    <path d="M6 2v2M12 2v2M2 7h14"/>
  </svg>
)

const IcoLanguage = ({ color = '#6b7280' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="9" cy="9" r="7"/>
    <path d="M9 2c0 0-3 2.5-3 7s3 7 3 7M9 2c0 0 3 2.5 3 7s-3 7-3 7M2 9h14"/>
  </svg>
)

const IcoBuilding = ({ color = '#6b7280' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="5" width="14" height="11" rx="1"/>
    <path d="M6 16V9M12 16V9M2 9h14M7 5V3h4v2"/>
  </svg>
)

const IcoAISummary = () => (
  <svg width="24" height="24" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M10 12.667C10.8 10.215 11.684 9.33 14 8.667c-2.316-.664-3.2-1.548-4-4-.8 2.452-1.684 3.336-4 4 2.316.663 3.2 1.547 4 4zM4.667 6.667c.4-1.227.842-1.669 2-2-1.158-.333-1.6-.775-2-2-.4 1.225-.842 1.667-2 2 1.158.332 1.6.773 2 2zM5.667 13.333c.2-.613.42-.834 1-.5-.587-.167-.8-.387-1-1-.2.613-.42.834-1 1 .58.167.8.387 1 1z" stroke="#094aa1" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
)

const IcoPaperclip = ({ size = 16, color = 'black' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M13.5 7.5l-6 6a4 4 0 0 1-5.66-5.66l6-6a2.67 2.67 0 0 1 3.77 3.77L5.5 11.5a1.33 1.33 0 0 1-1.88-1.88L9 4.5"/>
  </svg>
)

const IcoSend = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M8 12V4M4 8l4-4 4 4"/>
  </svg>
)

const IcoX = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M2 2l6 6M8 2l-6 6"/>
  </svg>
)

const IcoFAQ = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#4b5563" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="8" cy="8" r="6.5"/>
    <path d="M6.5 6.5a1.5 1.5 0 1 1 2.5 1.12c-.5.4-.7.8-.7 1.38"/>
    <circle cx="8" cy="11.5" r="0.6" fill="#4b5563" stroke="none"/>
  </svg>
)

const IcoFeedback = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#4b5563" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10l3 2V3a1 1 0 0 0-1-1z"/>
  </svg>
)

const IcoBug = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#4b5563" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="8" cy="10" r="3.5"/>
    <path d="M5 7a3 3 0 0 1 6 0M1 9h3M12 9h3M3 4.5L5 6.5M13 4.5L11 6.5"/>
  </svg>
)

const IcoDoc = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#4b5563" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="1" width="10" height="14" rx="1.5"/>
    <path d="M6 5h4M6 8h4M6 11h2"/>
  </svg>
)

const IcoShield = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#4b5563" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M8 1L2 3.5v4.5c0 3 2 5.5 6 6.5 4-1 6-3.5 6-6.5V3.5L8 1z"/>
  </svg>
)

// ── MODULE-SCOPE SUB-COMPONENTS ───────────────────────────────────────────────

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 10, fontFamily: 'Geist, sans-serif', fontWeight: 400, color: '#6b6b62', textTransform: 'uppercase', letterSpacing: '0.066em', lineHeight: 1.65 }}>{label}</div>
        <div style={{ fontSize: 14, fontFamily: 'Geist, sans-serif', fontWeight: 500, color: '#1a1a17', lineHeight: 1.5 }}>{value || '—'}</div>
      </div>
    </div>
  )
}

function DetRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '9px 0', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
      <span style={{ color: '#6b7280' }}>{icon}</span>
      <span>
        <span style={{ display: 'block', fontSize: 9, letterSpacing: '0.4px', textTransform: 'uppercase', color: '#9aa7b4' }}>{label}</span>
        <span style={{ fontSize: 14 }}>{value || '—'}</span>
      </span>
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: '#e5e5e5', width: '100%' }} />
}

function AiBubble({ content }) {
  const html = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      <div style={{ background: 'white', borderRadius: '16px 16px 16px 4px', padding: '14px 18px', fontSize: 16, fontFamily: 'Geist, sans-serif', color: '#1a1a17', lineHeight: 1.45, maxWidth: '100%' }}>
        <span dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  )
}

function AiBubbleMobile({ content }) {
  const html = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
  return (
    <p style={{ fontSize: 14, lineHeight: 1.6, color: '#1a1a1a', marginBottom: 16 }}>
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </p>
  )
}

function UserBubble({ content, isMobile }) {
  if (isMobile) {
    return (
      <div style={{ alignSelf: 'flex-end', background: '#efefef', borderRadius: 16, padding: '10px 14px', fontSize: 14, maxWidth: '82%', marginBottom: 16 }}>
        {content}
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ background: '#f2f2f2', borderRadius: 20, padding: '14px 18px', maxWidth: 522, fontSize: 16, fontFamily: 'Geist, sans-serif', color: 'black', lineHeight: 1.45, wordBreak: 'break-word' }}>
        {content}
      </div>
    </div>
  )
}

function ImageThumb({ src, onRemove, isMobile }) {
  const size = isMobile ? 52 : 70
  return (
    <div style={{ position: 'relative', width: size, height: size, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#c0c0c0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {src ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
      <button onClick={onRemove} style={{ position: 'absolute', top: isMobile ? -6 : 4, right: isMobile ? -6 : 4, width: 18, height: 18, borderRadius: '50%', background: '#1a1a1a', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
        <IcoX size={10} />
      </button>
    </div>
  )
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', gap: 5 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#c0c0c0', animation: `chatBounce 1.2s ${i * 0.18}s infinite ease-in-out` }} />
      ))}
    </div>
  )
}

function TypingDotsMobile() {
  return (
    <div style={{ display: 'flex', gap: 5, padding: '8px 0 16px' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#c0c0c0', animation: `chatBounce 1.2s ${i * 0.18}s infinite ease-in-out` }} />
      ))}
    </div>
  )
}

// ── PILLS ─────────────────────────────────────────────────────────────────────

const PILLS = ['English Certificate', 'Requirements', 'Scholarships', 'Living costs', 'Visa info']

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function ChatScreen({
  uni,
  user,
  onHome,
  onMyPrograms,
  onMyChats,
  onSaveToggle,
  onOpenAuth,
  onSignOut,
  onFeedback,
  onTerms,
  onPrivacy,
  onProfile,
  savedIds,
}) {
  const isMobile = useIsMobile()
  const greeting = `Ask me anything about **${uni?.name || 'this university'}** — admissions, scholarships, life in ${uni?.city || 'the city'}, requirements, visa, career prospects. What would you like to know? 🎓`

  const [messages, setMessages] = useState([{ role: 'assistant', content: greeting }])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [images, setImages] = useState([])
  const [isSaved, setIsSaved] = useState(savedIds?.has(uni?.name) ?? false)

  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  const fileRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  function resizeTextarea() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }

  function handleInputChange(e) { setInput(e.target.value); resizeTextarea() }

  async function sendMessage(text) {
    const txt = text ?? input
    if ((!txt.trim() && images.length === 0) || streaming) return
    const userMsg = { role: 'user', content: txt.trim() || '[Image attached]' }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setImages([])
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setStreaming(true)
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role, content: m.content })),
          uniName: uni?.name,
          field: uni?.field,
          location: [uni?.city, uni?.country].filter(Boolean).join(', '),
        })
      })
      if (!res.ok) throw new Error()
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        setMessages(prev => {
          const next = [...prev]
          next[next.length - 1] = { role: 'assistant', content: full }
          return next
        })
      }
    } catch {
      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = { role: 'assistant', content: 'Sorry, an error occurred. Please try again.' }
        return next
      })
    } finally { setStreaming(false) }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  function handleFileChange(e) {
    Array.from(e.target.files).filter(f => f.type.startsWith('image/')).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setImages(prev => [...prev, { src: ev.target.result }])
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  function handleSave() { setIsSaved(s => !s); onSaveToggle?.(uni) }

  const canSend = (input.trim().length > 0 || images.length > 0) && !streaming

  const helpItems = [
    { icon: <IcoFAQ />, label: 'FAQs', action: null },
    { icon: <IcoFeedback />, label: 'Send Feedback', action: onFeedback },
    { icon: <IcoBug />, label: 'Bug Report', action: onFeedback },
    { icon: <IcoDoc />, label: 'Terms of Service', action: onTerms },
    { icon: <IcoShield />, label: 'Privacy Policy', action: onPrivacy },
  ]

  const infoRowsSidebar = [
    { icon: <IcoClock />, label: 'Duration', value: uni?.duration },
    { icon: <IcoCalendar />, label: 'Start date', value: uni?.startDate },
    { icon: <IcoLanguage />, label: 'Language', value: uni?.language || 'English' },
    { icon: <IcoBuilding />, label: 'Attendance', value: uni?.attendance || 'On-campus' },
  ]

  // ── DRAWER CONTENT (shared mobile + desktop sidebar) ──────────────────────

  const DrawerContent = ({ onClose }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Logo + close */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexShrink: 0 }}>
        <button onClick={onHome} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <Logo color="#0162e3" size={20} />
          <span style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', fontFamily: 'Geist, sans-serif' }}>UniAsk</span>
        </button>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <IcoClose />
          </button>
        )}
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* Save Program */}
        <button onClick={handleSave} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, border: '0.5px solid #cdd2d8', background: 'white', borderRadius: 22, padding: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12, color: '#021d26' }}>
          <IcoHeart filled={isSaved} />
          {isSaved ? 'Saved' : 'Save Program'}
        </button>

        {/* Nav */}
        {[{ label: 'Homepage', action: onHome }, { label: 'My Programs', action: onMyPrograms }, { label: 'My Chats', action: onMyChats }].map(({ label, action }) => (
          <button key={label} onClick={() => { onClose?.(); action?.() }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 4px', fontSize: 15, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: '#1a1a1a' }}>
            {label}
          </button>
        ))}

        {/* Help */}
        <div style={{ background: '#f4f4f4', borderRadius: 10, padding: '4px 6px', margin: '6px 0 4px' }}>
          <button onClick={() => setHelpOpen(o => !o)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '8px 4px', fontSize: 15, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: '#1a1a1a' }}>
            Help
            <IcoChevron up={helpOpen} />
          </button>
          {helpOpen && helpItems.map(({ icon, label, action }) => (
            <button key={label} onClick={() => { onClose?.(); setHelpOpen(false); action?.() }} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 8px', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, fontFamily: 'inherit', color: '#1a1a1a', textAlign: 'left' }}>
              {icon}{label}
            </button>
          ))}
        </div>

        {/* Program card */}
        {uni && (
          <div style={{ background: '#f5f5f5', borderRadius: 14, padding: 16, margin: '12px 0 14px' }}>
            <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.25, color: '#1a1a1a', marginBottom: 6 }}>{uni.name}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#0162e3', marginBottom: 4 }}>{uni.field}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#4b5563', marginBottom: 12 }}>
              <IcoPin size={14} />
              {[uni.city, uni.country].filter(Boolean).join(', ')}
            </div>
            <button onClick={() => uni.url && window.open(uni.url, '_blank')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: '#0162e3', color: '#fff', border: 'none', borderRadius: 22, padding: 11, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              <IcoExternalLink />Visit Program
            </button>
            <div style={{ marginTop: 14 }}>
              {[
                { icon: <IcoClock color="#6b7280" />, label: 'Duration', value: uni.duration },
                { icon: <IcoCalendar color="#6b7280" />, label: 'Start date', value: uni.startDate },
                { icon: <IcoLanguage color="#6b7280" />, label: 'Language', value: uni.language || 'English' },
              ].map(row => <DetRow key={row.label} {...row} />)}
            </div>
          </div>
        )}

        {/* AI Summary */}
        {uni?.blurb && (
          <div style={{ background: '#f7f7f7', borderRadius: 16, padding: 16, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IcoAISummary />
              <span style={{ fontSize: 18, fontWeight: 500, color: '#094aa1', fontFamily: 'Geist, sans-serif' }}>AI Summary</span>
            </div>
            <div style={{ fontSize: 14, color: 'black', lineHeight: 1.5 }}>{uni.blurb}</div>
          </div>
        )}

        {/* Bottom (user / login) */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderTop: '0.5px solid rgba(0,0,0,0.1)', paddingTop: 14 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#0d2c54', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
              {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
            </div>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
          </div>
        ) : (
          <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.1)', paddingTop: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: '#0d0d0d' }}>Get responses tailored to you</div>
            <div style={{ fontSize: 12, color: '#4b5563', marginBottom: 12, lineHeight: 1.5 }}>Log in to get answers based on saved chats, plus create images and upload files.</div>
            <button onClick={() => { onClose?.(); onOpenAuth?.('login') }} style={{ width: '100%', border: '1px solid rgba(0,0,0,0.55)', borderRadius: 1000, padding: '12px 20px', background: 'white', cursor: 'pointer', fontSize: 15, fontWeight: 500, fontFamily: 'inherit', color: 'black' }}>
              Log in
            </button>
          </div>
        )}
      </div>
    </div>
  )

  // ── MOBILE LAYOUT ─────────────────────────────────────────────────────────

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden', background: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, sans-serif' }}>

        {/* Drawer overlay */}
        {drawerOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}>
            <div style={{ width: 288, background: 'white', padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
              <DrawerContent onClose={() => setDrawerOpen(false)} />
            </div>
            <div style={{ flex: 1, background: 'rgba(13,44,84,0.4)' }} onClick={() => setDrawerOpen(false)} />
          </div>
        )}

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '0.5px solid rgba(0,0,0,0.1)', flexShrink: 0 }}>
          <button onClick={() => setDrawerOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#1a1a1a' }}>
            <IcoMenu />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#1a1a1a' }}>{uni?.name || 'Program Chat'}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{uni?.field || ''}</div>
          </div>
          <button onClick={handleSave} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
            <IcoHeartMobile filled={isSaved} />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column' }}>
          {messages.map((msg, i) =>
            msg.role === 'assistant'
              ? <AiBubbleMobile key={i} content={msg.content} />
              : <UserBubble key={i} content={msg.content} isMobile />
          )}
          {streaming && messages[messages.length - 1]?.content === '' && <TypingDotsMobile />}
          <div ref={bottomRef} />
        </div>

        {/* Suggestion pills */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '8px 16px 10px', scrollbarWidth: 'none', flexShrink: 0 }}>
          {PILLS.map(pill => (
            <button key={pill} onClick={() => sendMessage(pill)} style={{ background: '#f2f2f2', border: 'none', borderRadius: 20, padding: '9px 14px', fontSize: 13, whiteSpace: 'nowrap', color: '#1a1a1a', cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit' }}>
              {pill}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '0 12px 16px', flexShrink: 0 }}>
          <div style={{ border: '0.5px solid rgba(0,0,0,0.18)', borderRadius: 20, padding: '12px 14px 10px' }}>
            {images.length > 0 && (
              <div style={{ display: 'flex', gap: 14, marginBottom: 12, padding: '2px 4px 0' }}>
                {images.map((img, i) => (
                  <ImageThumb key={i} src={img.src} onRemove={() => setImages(prev => prev.filter((_, j) => j !== i))} isMobile />
                ))}
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Ask about ${uni?.name || 'this program'}...`}
              rows={1}
              style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', fontSize: 14, lineHeight: 1.5, background: 'transparent', fontFamily: 'inherit', color: '#1a1a1a', minHeight: 22, boxSizing: 'border-box', marginBottom: 10 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => fileRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'white', border: '0.5px solid #cdd2d8', borderRadius: 16, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#1a1a1a' }}>
                <IcoPaperclip size={14} />Attach file
              </button>
              <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
              <button
                onClick={() => sendMessage()}
                disabled={!canSend}
                style={{ width: 34, height: 34, borderRadius: '50%', background: canSend ? '#1a1a1a' : '#d0d0d0', border: 'none', cursor: canSend ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
              >
                <IcoSend />
              </button>
            </div>
          </div>
        </div>

        <style>{`@keyframes chatBounce { 0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-6px);opacity:1}}`}</style>
      </div>
    )
  }

  // ── DESKTOP LAYOUT ────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'white', fontFamily: 'Geist, sans-serif' }}>

      {/* Sidebar */}
      <div style={{ width: 360, flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid #e8e8e8', height: '100vh', overflow: 'hidden' }}>
        <div style={{ padding: 24, borderBottom: '1px solid #e8e8e8', flexShrink: 0 }}>
          <button onClick={onHome} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <Logo color="#05203c" size="sm" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Save Program */}
          <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1px solid rgba(2,29,38,0.2)', borderRadius: 16, padding: '12px 14px', background: isSaved ? 'rgba(2,29,38,0.04)' : 'white', cursor: 'pointer', width: '100%', color: '#021d26', fontFamily: 'Geist, sans-serif', fontSize: 16, fontWeight: 500 }}>
            <IcoHeart filled={isSaved} />{isSaved ? 'Saved' : 'Save Program'}
          </button>

          {/* Nav */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[{ label: 'Homepage', action: onHome }, { label: 'My Programs', action: onMyPrograms }, { label: 'My Chats', action: onMyChats }].map(({ label, action }) => (
              <button key={label} onClick={action} style={{ display: 'flex', alignItems: 'center', height: 48, padding: '10px 12px', background: 'none', border: 'none', borderRadius: 12, cursor: 'pointer', color: '#404040', fontSize: 16, fontWeight: 500, fontFamily: 'inherit', textAlign: 'left' }}>
                {label}
              </button>
            ))}
            <button onClick={() => setHelpOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 48, padding: '10px 12px', background: 'none', border: 'none', borderRadius: 12, cursor: 'pointer', color: '#404040', fontSize: 16, fontWeight: 500, fontFamily: 'inherit', width: '100%' }}>
              Help<IcoChevron up={helpOpen} />
            </button>
            {helpOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 4 }}>
                {helpItems.map(({ icon, label, action }) => (
                  <button key={label} onClick={() => { setHelpOpen(false); action?.() }} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '8px 12px 8px 20px', background: 'none', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#404040', fontSize: 14, fontFamily: 'inherit', textAlign: 'left', width: '100%' }}>
                    {icon}{label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* University card */}
          {uni && (
            <div style={{ background: '#f7f7f7', borderRadius: 16, padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 20, fontWeight: 500, color: '#143229', lineHeight: 1.3 }}>{uni.name}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 500, color: '#05203c' }}>{uni.field}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <IcoPin /><span style={{ fontSize: 16, color: 'black' }}>{[uni.city, uni.country].filter(Boolean).join(', ')}</span>
                  </div>
                </div>
              </div>
              {uni.url && (
                <button onClick={() => window.open(uni.url, '_blank')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#0162e3', borderRadius: 160, padding: '12px 14px', border: 'none', cursor: 'pointer', width: '100%', color: 'white', fontSize: 16, fontWeight: 500, fontFamily: 'inherit' }}>
                  <IcoExternalLink />Visit Program
                </button>
              )}
            </div>
          )}

          {/* Program info */}
          {uni && (
            <div style={{ border: '1px solid #e5e5e5', borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {infoRowsSidebar.map((row, i) => (
                <div key={row.label} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <InfoRow {...row} />
                  {i < infoRowsSidebar.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          )}

          {/* AI Summary */}
          {uni?.blurb && (
            <div style={{ background: '#f7f7f7', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <IcoAISummary /><span style={{ fontSize: 20, fontWeight: 500, color: '#094aa1' }}>AI Summary</span>
              </div>
              <div style={{ fontSize: 16, color: 'black', lineHeight: 1.45 }}>{uni.blurb}</div>
            </div>
          )}
        </div>

        {/* Desktop bottom */}
        <div style={{ padding: 24, borderTop: '1px solid #e8e8e8', background: 'white', flexShrink: 0 }}>
          {user ? (
            <button onClick={onProfile} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'inherit', borderRadius: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#143229', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
              </div>
              <span style={{ fontSize: 15, fontWeight: 500, color: '#1a1a17' }}>{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 18, fontWeight: 500, color: '#0d0d0d', letterSpacing: '-0.0086em', lineHeight: '20px' }}>Get responses tailored to you</div>
                <div style={{ fontSize: 14, color: 'black', letterSpacing: '-0.0086em', lineHeight: '20px' }}>Log in to get answers based on saved chats, plus create images and upload files.</div>
              </div>
              <button onClick={() => onOpenAuth?.('login')} style={{ border: '1px solid rgba(0,0,0,0.55)', borderRadius: 1000, padding: '14px 20px', background: 'white', cursor: 'pointer', fontFamily: 'Geist, sans-serif', fontSize: 16, fontWeight: 500, color: 'black', letterSpacing: '-0.02em', width: '100%' }}>
                Log in
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 80px 0', minWidth: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 860, margin: '0 auto' }}>
            {messages.map((msg, i) => (
              msg.role === 'assistant' ? <AiBubble key={i} content={msg.content} /> : <UserBubble key={i} content={msg.content} />
            ))}
            {streaming && messages[messages.length - 1]?.content === '' && <TypingDots />}
            <div ref={bottomRef} />
          </div>
        </div>
        <div style={{ padding: '16px 80px 24px', display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
            {PILLS.map(pill => (
              <button key={pill} onClick={() => sendMessage(pill)} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', background: '#f4f4f4', border: 'none', borderRadius: 999, cursor: 'pointer', fontSize: 16, fontFamily: 'DM Sans, sans-serif', fontWeight: 500, color: '#3a3a35', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {pill}
              </button>
            ))}
          </div>
          <div style={{ background: 'white', border: '1px solid #cacaca', borderRadius: 24, padding: '18px 18px 18px 24px', boxShadow: '0 4px 22.4px 0 rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {images.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <ImageThumb key={i} src={img.src} onRemove={() => setImages(prev => prev.filter((_, j) => j !== i))} />
                ))}
              </div>
            )}
            <textarea ref={textareaRef} value={input} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder={`Ask about ${uni?.name || 'this program'}...`} rows={1} style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', fontSize: 16, fontFamily: 'Geist, sans-serif', color: 'black', lineHeight: 1.45, background: 'transparent', minHeight: 24, boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={() => fileRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 13px', background: 'white', border: '1px solid #e7e7e7', borderRadius: 999, height: 36, cursor: 'pointer', fontSize: 14, fontFamily: 'Geist, sans-serif', fontWeight: 500, color: 'black' }}>
                <IcoPaperclip />Attach file
              </button>
              <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
              <button onClick={() => sendMessage()} disabled={!canSend} style={{ width: 36, height: 36, borderRadius: 160, background: canSend ? 'black' : '#d0d0d0', border: 'none', cursor: canSend ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}>
                <IcoSend />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes chatBounce{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-6px);opacity:1}}`}</style>
    </div>
  )
}
