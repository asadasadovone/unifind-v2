'use client'
import { useState } from 'react'
import { signIn, signUp, signInWithGoogle } from '../lib/supabase'

/* Figma 619:1263 (Log in) and 444:768 (Sign Up) */
const BORDER = 'rgba(0,0,0,0.15)'
const INK = '#0d0d0d'
const BLUE = '#0162e3'

const pillInput = {
  width: '100%',
  height: 52,
  padding: '0 20px',
  borderRadius: 100,
  border: `1px solid ${BORDER}`,
  background: '#fff',
  fontSize: 16,
  letterSpacing: '-0.32px',
  color: INK,
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

const pillButton = {
  width: '100%',
  height: 50,
  minHeight: 34,
  borderRadius: 16777200,
  border: 'none',
  background: BLUE,
  color: '#fff',
  fontSize: 16,
  fontWeight: 500,
  letterSpacing: '-0.32px',
  lineHeight: '24px',
  cursor: 'pointer',
  fontFamily: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
}

/* Defined at module scope on purpose: a component declared inside AuthModal
   would be a new type on every render, remounting the inputs and wiping
   whatever the user had typed. */
function Shell({ onClose, label, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        style={{
          width: 388,
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0px 8px 12px 0px rgba(0,0,0,0.08), 0px 0px 1px 0px rgba(0,0,0,0.62)',
          animation: 'slideUp 0.25s ease',
          fontFamily: 'Geist, -apple-system, sans-serif',
        }}
      >
        {/* Header — close button, right aligned */}
        <div style={{ minHeight: 52, padding: '10px 10px 6px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: INK }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div style={{ padding: '0 24px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default function AuthModal({ mode, onClose, onMode, onSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(null)
  const [confirmation, setConfirmation] = useState(false)

  const isLogin = mode === 'login'
  const subtitle = isLogin
    ? 'Welcome back. Your programs and chats are waiting for you.'
    : mode === 'save-programs' ? 'Create your account to save your programs.'
    : mode === 'save-chats'    ? 'Create your account to save your chats.'
    : 'Save your favorite programs and continue your AI conversations anytime.'

  const handleGoogle = async () => {
    setError(null)
    setGoogleLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) throw error
      // Redirect happens automatically — Supabase takes over
    } catch (err) {
      setError(err.message)
      setGoogleLoading(false)
    }
  }

  const submit = async (e) => {
    e?.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (isLogin) {
        const { data, error } = await signIn(email, password)
        if (error) throw error
        onSubmit(data.user)
      } else {
        const { data, error } = await signUp(email, password, name)
        if (error) throw error
        // Supabase sends a confirmation email; session is null until confirmed
        if (data.session) onSubmit(data.user)
        else setConfirmation(true)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (confirmation) {
    return (
      <Shell onClose={onClose} label="Check your inbox">
        <h2 style={{ margin: 0, fontSize: 30, fontWeight: 400, lineHeight: '36px', letterSpacing: '0.42px', color: INK, textAlign: 'center' }}>
          Check your inbox
        </h2>
        <p style={{ margin: 0, padding: '0 16px', fontSize: 16, lineHeight: '24px', letterSpacing: '-0.32px', color: INK, textAlign: 'center' }}>
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then come back and log in.
        </p>
        <button style={pillButton} onClick={() => { onMode('login'); setConfirmation(false) }}>Go to log in</button>
      </Shell>
    )
  }

  return (
    <Shell onClose={onClose} label={isLogin ? 'Log in' : 'Sign up'}>
      {/* Title + subtitle */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ margin: 0, fontSize: 30, fontWeight: 400, lineHeight: '36px', letterSpacing: '0.42px', color: INK, textAlign: 'center' }}>
          {isLogin ? 'Log in' : 'Sign Up'}
        </h2>
        <p style={{ margin: 0, padding: '0 16px', fontSize: 16, fontWeight: 400, lineHeight: '24px', letterSpacing: '-0.32px', color: INK, textAlign: 'center' }}>
          {subtitle}
        </p>
      </div>

      {/* Continue with Google */}
      <button
        onClick={handleGoogle}
        disabled={googleLoading || loading}
        style={{
          width: '100%', height: 52, minHeight: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          borderRadius: 16777200, border: `1px solid ${BORDER}`, background: '#fff',
          fontSize: 16, fontWeight: 500, letterSpacing: '-0.32px', lineHeight: '24px',
          color: INK, cursor: googleLoading || loading ? 'default' : 'pointer',
          fontFamily: 'inherit', opacity: googleLoading ? 0.7 : 1,
        }}
      >
        {googleLoading
          ? <Spinner dark />
          : <GoogleLogo />}
        Continue with Google
      </button>

      {/* OR divider */}
      <div style={{ padding: '8px 0', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(13,13,13,0.15)' }} />
        <span style={{ padding: '0 24px', fontSize: 13, fontWeight: 500, letterSpacing: '-0.078px', lineHeight: '19.5px', textTransform: 'uppercase', color: INK }}>OR</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(13,13,13,0.15)' }} />
      </div>

      {error && (
        <div style={{ padding: '10px 16px', background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 12, fontSize: 14, color: '#b91c1c' }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {!isLogin && (
            <div style={{ padding: '4px 0' }}>
              <input
                style={pillInput}
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}
          <div style={{ padding: '4px 0' }}>
            <input
              style={pillInput}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div style={{ padding: '4px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              style={pillInput}
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
            {isLogin && (
              <a
                href="#"
                onClick={e => e.preventDefault()}
                style={{ fontSize: 13, fontWeight: 500, letterSpacing: '-0.078px', lineHeight: '19.5px', color: BLUE, textDecoration: 'underline' }}
              >
                Forgot password?
              </a>
            )}
          </div>
        </div>

        <button type="submit" style={{ ...pillButton, opacity: loading ? 0.7 : 1 }} disabled={loading}>
          {loading ? <><Spinner /> {isLogin ? 'Logging in…' : 'Creating account…'}</> : (isLogin ? 'Log in' : 'Sign up free')}
        </button>
      </form>

      {/* Figma's sign-up dialog offers a way back to log in */}
      {!isLogin && (
        <p style={{ margin: 0, textAlign: 'center', fontSize: 14, color: INK }}>
          Already have an account?{' '}
          <a
            href="#"
            onClick={e => { e.preventDefault(); setError(null); onMode('login') }}
            style={{ color: BLUE, fontWeight: 500, textDecoration: 'underline' }}
          >
            Log in
          </a>
        </p>
      )}
    </Shell>
  )
}

function Spinner({ dark }) {
  return (
    <span style={{
      width: 16, height: 16, flexShrink: 0, display: 'inline-block',
      border: `2px solid ${dark ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.35)'}`,
      borderTopColor: dark ? '#333' : '#fff',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}

function GoogleLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" style={{ flexShrink: 0 }} aria-hidden>
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.94v2.32A9 9 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.96H.94A9 9 0 0 0 0 9c0 1.45.35 2.83.94 4.04l3.03-2.32Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.99 8.99 0 0 0 9 0 9 9 0 0 0 .94 4.96l3.03 2.32C4.68 5.16 6.66 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}
