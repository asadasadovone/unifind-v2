'use client'
import { useState, useEffect, useRef } from 'react'
import { Icon, Logo } from './Icons'
import { SAMPLE_CHAT } from '../data'

export default function DetailScreen({ uni, onBack, initialPrompt }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: `Ask me anything about **${uni.name}** — admissions, scholarships, life in ${uni.city}, requirements, visa, career prospects. What would you like to know? 🎓`
    }
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, thinking])

  useEffect(() => {
    if (initialPrompt && SAMPLE_CHAT[initialPrompt]) {
      setTimeout(() => runQuick(initialPrompt), 350)
    }
  }, [])

  const runQuick = async (label) => {
    const sample = SAMPLE_CHAT[label]
    if (!sample) return
    setMessages(m => [...m, sample[0]])
    setThinking(true)
    setTimeout(() => {
      setMessages(m => [...m, sample[1]])
      setThinking(false)
    }, 900)
  }

  const send = async () => {
    const text = input.trim()
    if (!text) return
    setMessages(m => [...m, { role: 'user', text }])
    setInput('')
    setThinking(true)

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `You are a helpful university advisor on UniFind, specializing in ${uni.name}.
You have deep knowledge about this specific university and program.

University context: ${uni.degree} program in ${uni.field || 'various fields'}, located in ${uni.city}, ${uni.country}, taught in ${uni.language}, ${uni.duration} duration, tuition ${uni.tuition === 0 ? 'free' : uni.tuition + ' USD/year'}, starts ${uni.startDate}.

STRICT RULES:
- Answer ONLY about ${uni.name} and its programs and related questions like visa, city, procedure, career and etc. If asked about other universities, politely redirect, but you can compare only if user asks.
- Always respond in the same language the user writes in. If they write in another language, respond in that language. If English, respond in English.
- Be conversational and warm, like a knowledgeable friend — not a robot. No formal intros.
- Be specific and personal. Reference what you know about their search (field, budget, timeline).
- NEVER use markdown tables (| column | column |) or horizontal rules (---). They render as raw text.
- NEVER start with 'Hi! I'm your UniFind assistant...' — just answer directly and naturally.
- Use bullet points sparingly. Max 1-2 short lists per response. Prefer natural flowing sentences.
- Use emojis but not incredibly too much in normal tone.
- Keep responses concise. If the user asks a simple question, give a simple answer first, then offer to elaborate.
- For application dates, requirements, costs — give real specific data, never generic placeholders.
- End responses with one natural follow-up question to keep the conversation going.

PERSONALIZATION:
- Reference their search filters when relevant: 'Since you're looking for free tuition...' or 'Given your interest in ${uni.field || 'this field'}...'
- Make them feel this advice is specifically for them, not copy-pasted.`,
          prompt: text
        })
      })
      const data = await res.json()
      const aiText = data.content?.map(b => b.text || '').join('') ||
        `Based on ${uni.name}'s latest published info: this program runs **${uni.duration}**, taught in ${uni.language}, with tuition of **${uni.tuition === 0 ? 'free for eligible students' : uni.tuition.toLocaleString() + ' USD/year'}**. Want me to dig into a specific aspect?`
      setMessages(m => [...m, { role: 'ai', text: aiText }])
    } catch {
      setMessages(m => [...m, {
        role: 'ai',
        text: `Based on ${uni.name}'s latest published info: this program runs **${uni.duration}**, taught in ${uni.language}, with tuition of **${uni.tuition === 0 ? 'free for eligible students' : uni.tuition.toLocaleString() + ' USD/year'}**. Want me to dig into a specific aspect?`
      }])
    } finally {
      setThinking(false)
    }
  }

  const tuitionLabel = uni.tuition === 0 ? 'Free' : `${uni.tuition.toLocaleString()} USD/yr`

  return (
    <div className="detail-screen">
      <header className="detail-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="btn btn-ghost" onClick={onBack} style={{ padding: '8px 10px' }}>
            <Icon name="chevronLeft" size={18} /> Back to results
          </button>
          <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
          <Logo onClick={onBack} size="sm" />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" style={{ padding: '8px 14px' }}>
            <Icon name="star" size={14} /> Save
          </button>
          <a
            className="btn btn-primary"
            style={{ padding: '8px 14px', textDecoration: 'none' }}
            href={`https://www.google.com/search?q=${encodeURIComponent(uni.name + ' official website')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit program <Icon name="arrow" size={14} />
          </a>
        </div>
      </header>

      <div className="detail-body">
        {/* Mobile compact info strip — visible only on small screens */}
        <div className="mobile-uni-strip">
          <div className="mobile-uni-head">
            <h1 className="serif">{uni.name}</h1>
            <div className="muted" style={{ fontSize: 13, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="pin" size={12} /> {uni.city}, {uni.country}
            </div>
          </div>
          <div className="mobile-info-scroll">
            <MobileInfoChip icon="money" label="Tuition" value={tuitionLabel} />
            <MobileInfoChip icon="clock" label="Duration" value={uni.duration} />
            <MobileInfoChip icon="calendar" label="Starts" value={uni.startDate} />
            <MobileInfoChip icon="language" label="Language" value={uni.language} />
            <MobileInfoChip icon="cap" label="Degree" value={uni.degree} />
            <MobileInfoChip icon="globe" label="Format" value={uni.attendance} />
            <MobileInfoChip icon="sparkle" label="Scholarship" value={uni.scholarship ? 'Available' : 'None'} accent={uni.scholarship} />
          </div>
        </div>

        <aside className="detail-sidebar">
          <div>
            <h1 className="serif" style={{ fontSize: 28, color: 'var(--green-900)', lineHeight: 1.15 }}>
              {uni.name}
            </h1>
            <div className="muted" style={{ fontSize: 13, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="pin" size={12} /> {uni.city}, {uni.country}
            </div>
          </div>

          <div className="match-banner">
            <div className="match-banner-row">
              <div>
                <div className="match-banner-label">Your fit score</div>
                <div className="match-banner-sub">Based on your profile</div>
              </div>
              <div className="match-banner-value">
                {uni.match}<span className="match-banner-pct">%</span>
              </div>
            </div>
            <div className="match-bar">
              <div className="match-bar-fill" style={{ width: `${uni.match}%` }} />
            </div>
          </div>

          <div className="info-list">
            <InfoRow icon="money" label="Tuition fee" value={tuitionLabel} />
            <InfoRow icon="clock" label="Duration" value={uni.duration} />
            <InfoRow icon="calendar" label="Start date" value={uni.startDate} />
            <InfoRow icon="pin" label="Location" value={`${uni.city}, ${uni.country}`} />
            <InfoRow icon="language" label="Language" value={uni.language} />
            <InfoRow icon="cap" label="Degree" value={uni.degree} />
            <InfoRow icon="globe" label="Attendance" value={uni.attendance} />
            <InfoRow
              icon="sparkle" label="Scholarships"
              value={uni.scholarship ? 'Available' : 'Not offered'}
              accent={uni.scholarship}
            />
          </div>

          <div>
            <div className="eyebrow">Top reasons it matches</div>
            <ul className="reasons">
              <li><Icon name="check" size={13} /> Matches your &ldquo;{uni.field}&rdquo; field</li>
              <li><Icon name="check" size={13} /> Within your tuition range</li>
              <li><Icon name="check" size={13} /> Start date aligns with your timeline</li>
              <li><Icon name="check" size={13} /> Strong placement in your target industry</li>
            </ul>
          </div>
        </aside>

        <main className="detail-chat">
          <div className="chat-quick-actions">
            <div className="chat-quick-label">
              <Icon name="sparkle" size={13} /> Quick questions
            </div>
            <div className="quick-buttons quick-buttons-scroll">
              {['Apply dates', 'City info', 'Requirements', 'Scholarships', 'Living costs', 'Visa info'].map(q => (
                <button key={q} className="quick-btn" onClick={() => runQuick(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="chat-scroll" ref={scrollRef}>
            <div className="chat-stream">
              {messages.map((m, i) => <ChatBubble key={i} msg={m} />)}
              {thinking && (
                <div className="chat-bubble ai">
                  <div className="chat-avatar ai-avatar"><Icon name="bot" size={16} /></div>
                  <div className="chat-content">
                    <div className="thinking"><span /><span /><span /></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="chat-input-wrap">
            <div className="chat-input">
              <input
                placeholder={`Ask anything about ${uni.short || uni.name}…`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
              <button className="chat-send" onClick={send} disabled={!input.trim()}>
                <Icon name="send" size={16} />
              </button>
            </div>
            <div className="chat-disclaimer">
              UniFind AI uses public university data and is verified weekly. Always confirm dates and requirements on the official website.
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value, accent }) {
  return (
    <div className="info-row">
      <div className="info-icon"><Icon name={icon} size={15} /></div>
      <div style={{ flex: 1 }}>
        <div className="info-label">{label}</div>
        <div className="info-value" style={accent ? { color: 'var(--green-700)', fontWeight: 600 } : {}}>{value}</div>
      </div>
    </div>
  )
}

function ChatBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`chat-bubble ${isUser ? 'user' : 'ai'}`}>
      {!isUser && <div className="chat-avatar ai-avatar"><Icon name="bot" size={16} /></div>}
      <div className="chat-content">
        <div
          className="chat-text"
          dangerouslySetInnerHTML={{ __html: formatChat(msg.text) }}
        />
      </div>
      {isUser && <div className="chat-avatar chat-user-avatar">A</div>}
    </div>
  )
}

function MobileInfoChip({ icon, label, value, accent }) {
  return (
    <div className={`mobile-info-chip ${accent ? 'accent' : ''}`}>
      <div className="mobile-info-chip-icon"><Icon name={icon} size={14} /></div>
      <div>
        <div className="mobile-info-chip-label">{label}</div>
        <div className="mobile-info-chip-value">{value}</div>
      </div>
    </div>
  )
}

function formatChat(t) {
  return t
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
}
