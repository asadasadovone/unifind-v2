'use client'
import { useState } from 'react'
import { signIn, signUp, signInWithGoogle, sendPasswordReset, updatePassword } from '../lib/supabase'

/* Figma 619:1263 (Log in) and 444:768 (Sign Up) */
const BORDER = 'rgba(0,0,0,0.15)'
const INK = '#0d0d0d'
const BLUE = '#0162e3'
const RED = '#ea4335'

/* Figma 83:496 — inline error: red field border, then a 14px info glyph
   and a 13px message beneath. */
function FieldError({ children }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} role="alert">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }} aria-hidden>
        <path
          d="M7 4.66667H7.00467M7 9.33333V6.41667M12.8333 7C12.8333 10.2217 10.2217 12.8333 7 12.8333C3.77825 12.8333 1.16667 10.2217 1.16667 7C1.16667 3.77825 3.77825 1.16667 7 1.16667C10.2217 1.16667 12.8333 3.77825 12.8333 7Z"
          stroke={RED} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
      <span style={{ fontSize: 13, fontWeight: 500, color: RED, letterSpacing: '-0.078px', lineHeight: '19.5px' }}>
        {children}
      </span>
    </div>
  )
}

const errored = base => ({ ...base, border: `1px solid ${RED}` })

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

/* 20px eye toggle shown inside each password field (Figma 90:580). */
function EyeButton({ shown, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={shown ? 'Hide password' : 'Show password'}
      style={{
        position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)',
        width: 20, height: 20, padding: 0, border: 'none', background: 'none',
        cursor: 'pointer', color: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {shown ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <line x1="2" y1="2" x2="22" y2="22" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  )
}

/* Supabase returns one flat message; put it on the field it concerns so the
   error renders where Figma shows it. */
function toFieldErrors(msg = '') {
  const m = msg.toLowerCase()
  if (m.includes('already registered') || m.includes('already exists')) return { email: 'That email is already registered.' }
  if (m.includes('invalid login credentials')) return { password: 'Email or password is incorrect.' }
  if (m.includes('email not confirmed')) return { email: 'Please confirm your email first.' }
  if (m.includes('password')) return { password: msg }
  if (m.includes('email')) return { email: msg }
  return { general: msg }
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
  const [errors, setErrors] = useState({})
  const [confirmation, setConfirmation] = useState(false)
  const [view, setView] = useState('form') // 'form' | 'forgot' | 'reset-sent'
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  const isLogin = mode === 'login'
  const subtitle = isLogin
    ? 'Welcome back. Your programs and chats are waiting for you.'
    : mode === 'save-programs' ? 'Create your account to save your programs.'
    : mode === 'save-chats'    ? 'Create your account to save your chats.'
    : 'Save your favorite programs and continue your AI conversations anytime.'

  const handleGoogle = async () => {
    setErrors({})
    setGoogleLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) throw error
      // Redirect happens automatically — Supabase takes over
    } catch (err) {
      setErrors({ general: err.message })
      setGoogleLoading(false)
    }
  }

  const saveNewPassword = async (e) => {
    e?.preventDefault()
    const next = {}
    if (newPassword.length < 6) next.newPassword = 'Password must be at least 6 characters.'
    else if (newPassword !== confirmPassword) next.confirmPassword = 'Passwords do not match.'
    if (Object.keys(next).length) { setErrors(next); return }

    setErrors({})
    setLoading(true)
    try {
      const { error } = await updatePassword(newPassword)
      if (error) throw error
      setResetDone(true)
    } catch (err) {
      setErrors(toFieldErrors(err.message))
    } finally {
      setLoading(false)
    }
  }

  const sendReset = async (e) => {
    e?.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrors({ email: 'Email is not valid.' })
      return
    }
    setErrors({})
    setLoading(true)
    try {
      const { error } = await sendPasswordReset(email.trim())
      if (error) throw error
      setView('reset-sent')
    } catch (err) {
      setErrors(toFieldErrors(err.message))
    } finally {
      setLoading(false)
    }
  }

  const submit = async (e) => {
    e?.preventDefault()

    // Validate before hitting the network so the message lands on the field.
    const next = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Email is not valid.'
    if (password.length < 6) next.password = 'Password must be at least 6 characters.'
    if (!isLogin && !name.trim()) next.name = 'Please enter your name.'
    if (Object.keys(next).length) { setErrors(next); return }

    setErrors({})
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
      setErrors(toFieldErrors(err.message))
    } finally {
      setLoading(false)
    }
  }

  /* Figma 90:580 — Reset your password */
  if (mode === 'reset') {
    return (
      <Shell onClose={onClose} label="Reset your password">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ margin: 0, fontSize: 30, fontWeight: 400, lineHeight: '36px', letterSpacing: '0.42px', color: INK, textAlign: 'center' }}>
            {resetDone ? 'Password updated' : 'Reset your password'}
          </h2>
          <p style={{ margin: 0, padding: '0 16px', fontSize: 16, fontWeight: 400, lineHeight: '24px', letterSpacing: '-0.32px', color: INK, textAlign: 'center' }}>
            {resetDone
              ? 'Your password has been changed. You can use it to log in from now on.'
              : 'Choose a new password for your account.'}
          </p>
        </div>

        {resetDone ? (
          <button type="button" style={pillButton} onClick={onClose}>Continue</button>
        ) : (
          <form noValidate onSubmit={saveNewPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ padding: '4px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ position: 'relative' }}>
                  <input
                    style={{ ...(errors.newPassword ? errored(pillInput) : pillInput), paddingRight: 48 }}
                    type={showNew ? 'text' : 'password'}
                    placeholder="New password"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); if (errors.newPassword) setErrors(p => ({ ...p, newPassword: null })) }}
                    aria-invalid={!!errors.newPassword}
                    autoComplete="new-password"
                    autoFocus
                  />
                  <EyeButton shown={showNew} onClick={() => setShowNew(v => !v)} />
                </div>
                {errors.newPassword && <FieldError>{errors.newPassword}</FieldError>}
              </div>
              <div style={{ padding: '4px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ position: 'relative' }}>
                  <input
                    style={{ ...(errors.confirmPassword ? errored(pillInput) : pillInput), paddingRight: 48 }}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(p => ({ ...p, confirmPassword: null })) }}
                    aria-invalid={!!errors.confirmPassword}
                    autoComplete="new-password"
                  />
                  <EyeButton shown={showConfirm} onClick={() => setShowConfirm(v => !v)} />
                </div>
                {errors.confirmPassword && <FieldError>{errors.confirmPassword}</FieldError>}
              </div>
            </div>
            {errors.general && <FieldError>{errors.general}</FieldError>}
            <button type="submit" style={{ ...pillButton, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? <><Spinner /> Saving…</> : 'Set your new password'}
            </button>
          </form>
        )}

        <p style={{ margin: 0, textAlign: 'center', fontSize: 16, letterSpacing: '-0.32px', lineHeight: '24px', color: INK }}>
          Need help? Go to the{' '}
          <a href="#" onClick={e => e.preventDefault()} style={{ color: INK, textDecoration: 'underline' }}>Help Centre.</a>
        </p>
      </Shell>
    )
  }

  /* Figma 83:320 — Forgot password?
     Shell, input and button reuse the values measured on the sibling dialogs
     (83:496 / 619:1263); this frame's own spec could not be pulled because the
     Figma MCP hit its plan rate limit. */
  if (view === 'forgot' || view === 'reset-sent') {
    const sent = view === 'reset-sent'
    return (
      <Shell onClose={onClose} label="Forgot password">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ margin: 0, fontSize: 30, fontWeight: 400, lineHeight: '36px', letterSpacing: '0.42px', color: INK, textAlign: 'center' }}>
            {sent ? 'Check your inbox' : 'Forgot password?'}
          </h2>
          <p style={{ margin: 0, padding: '0 16px', fontSize: 16, fontWeight: 400, lineHeight: '24px', letterSpacing: '-0.32px', color: INK, textAlign: 'center' }}>
            {sent
              ? <>We sent a password reset link to <strong style={{ fontWeight: 500 }}>{email}</strong>. Follow it to choose a new password.</>
              : "Enter your email and we'll send you a link to reset your password."}
          </p>
        </div>

        {sent ? (
          <button type="button" style={pillButton} onClick={() => { setView('form'); onMode('login') }}>
            Back to log in
          </button>
        ) : (
          <form noValidate onSubmit={sendReset} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: '4px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input
                style={errors.email ? errored(pillInput) : pillInput}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: null })) }}
                aria-invalid={!!errors.email}
                autoComplete="email"
                autoFocus
              />
              {errors.email && <FieldError>{errors.email}</FieldError>}
            </div>
            {errors.general && <FieldError>{errors.general}</FieldError>}
            <button type="submit" style={{ ...pillButton, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? <><Spinner /> Sending…</> : 'Send reset link'}
            </button>
          </form>
        )}

        <p style={{ margin: 0, textAlign: 'center', fontSize: 16, letterSpacing: '-0.32px', lineHeight: '24px', color: INK }}>
          Need help? Go to the{' '}
          <a href="#" onClick={e => e.preventDefault()} style={{ color: INK, textDecoration: 'underline' }}>Help Centre.</a>
        </p>
      </Shell>
    )
  }

  if (confirmation) {
    return (
      <Shell onClose={onClose} label="Check your inbox">
        <h2 style={{ margin: 0, fontSize: 30, fontWeight: 400, lineHeight: '36px', letterSpacing: '0.42px', color: INK, textAlign: 'center' }}>
          Check your inbox
        </h2>
        <p style={{ margin: 0, padding: '0 16px', fontSize: 16, lineHeight: '24px', letterSpacing: '-0.32px', color: INK, textAlign: 'center' }}>
          We sent a confirmation link to <strong>{email}</strong>. Open it in this browser and you'll be signed in automatically — elsewhere, come back here and log in.
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

      {/* Form */}
      {/* noValidate: we render Figma's inline messages ourselves, otherwise the
          browser's native bubble fires first and blocks submit. */}
      <form noValidate onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {!isLogin && (
            <div style={{ padding: '4px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input
                style={errors.name ? errored(pillInput) : pillInput}
                placeholder="Full Name"
                value={name}
                onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: null })) }}
                aria-invalid={!!errors.name}
                autoComplete="name"
              />
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </div>
          )}
          <div style={{ padding: '4px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <input
              style={errors.email ? errored(pillInput) : pillInput}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: null })) }}
              aria-invalid={!!errors.email}
              autoComplete="email"
            />
            {errors.email && <FieldError>{errors.email}</FieldError>}
          </div>
          <div style={{ padding: '4px 0', display: 'flex', flexDirection: 'column', gap: errors.password ? 6 : 8 }}>
            <input
              style={errors.password ? errored(pillInput) : pillInput}
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: null })) }}
              aria-invalid={!!errors.password}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
            {errors.password && <FieldError>{errors.password}</FieldError>}
            {isLogin && (
              <a
                href="#"
                onClick={e => { e.preventDefault(); setErrors({}); setView('forgot') }}
                style={{ fontSize: 13, fontWeight: 500, letterSpacing: '-0.078px', lineHeight: '19.5px', color: BLUE, textDecoration: 'underline' }}
              >
                Forgot password?
              </a>
            )}
          </div>
        </div>

        {errors.general && <FieldError>{errors.general}</FieldError>}

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
            onClick={e => { e.preventDefault(); setErrors({}); onMode('login') }}
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
