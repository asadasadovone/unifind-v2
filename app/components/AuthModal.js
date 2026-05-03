'use client'
import { useState } from 'react'
import { Icon, Logo } from './Icons'
import { signIn, signUp, signInWithGoogle } from '../lib/supabase'

export default function AuthModal({ mode, onClose, onMode, onSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(null)
  const [confirmation, setConfirmation] = useState(false)

  const isLogin = mode === 'login'

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
        if (data.session) {
          onSubmit(data.user)
        } else {
          setConfirmation(true)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (confirmation) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
          <h2 className="serif" style={{ fontSize: 28, color: 'var(--green-900)', lineHeight: 1.1 }}>
            Check your <span className="serif-italic">inbox</span>
          </h2>
          <p className="muted" style={{ marginTop: 10, fontSize: 14, lineHeight: 1.6 }}>
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then come back and log in.
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 24, width: '100%' }}
            onClick={() => { onMode('login'); setConfirmation(false) }}
          >
            Go to log in
          </button>
          <button className="btn btn-ghost" style={{ marginTop: 8, width: '100%' }} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <Logo size="sm" />
          <button className="btn btn-ghost" style={{ padding: 6 }} onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>

        <h2 className="serif" style={{ fontSize: 32, color: 'var(--green-900)', marginTop: 18, lineHeight: 1.1 }}>
          {isLogin ? <>Welcome <span className="serif-italic">back</span></> : <>Create your <span className="serif-italic">account</span></>}
        </h2>
        <p className="muted" style={{ marginTop: 6, fontSize: 14 }}>
          {isLogin ? 'Pick up where you left off.' : 'Save searches and unlock your fit score.'}
        </p>

        {error && (
          <div style={{
            marginTop: 16,
            padding: '10px 14px',
            background: '#fff0f0',
            border: '1px solid #fca5a5',
            borderRadius: 'var(--r-md)',
            fontSize: 13,
            color: '#b91c1c',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={submit} className="col gap-3" style={{ marginTop: 24 }}>
          {!isLogin && (
            <div>
              <label className="label">Full name</label>
              <input
                className="input"
                placeholder="Aysel Hüseynova"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            {isLogin && (
              <div style={{ textAlign: 'right', marginTop: 8 }}>
                <a href="#" style={{ fontSize: 13, color: 'var(--green-700)' }}>Forgot password?</a>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-cta"
            style={{ width: '100%', marginTop: 6 }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <span style={{
                  width: 16, height: 16,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }} />
                {isLogin ? 'Logging in…' : 'Creating account…'}
              </span>
            ) : (
              <>{isLogin ? 'Log in' : 'Create account'} <Icon name="arrow" size={14} /></>
            )}
          </button>
        </form>

        <div className="auth-divider"><span>or continue with</span></div>

        <div className="col gap-2">
          <button
            className="auth-social"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            style={googleLoading ? { opacity: 0.7 } : {}}
          >
            {googleLoading ? (
              <span style={{
                width: 18, height: 18,
                border: '2px solid rgba(0,0,0,0.15)',
                borderTopColor: '#333',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
                display: 'inline-block',
                flexShrink: 0,
              }} />
            ) : (
              <GoogleLogo />
            )}
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="auth-switch">
          {isLogin ? (
            <>Don&apos;t have an account? <a href="#" onClick={(e) => { e.preventDefault(); setError(null); onMode('register') }}>Sign up free</a></>
          ) : (
            <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setError(null); onMode('login') }}>Log in</a></>
          )}
        </div>
      </div>
    </div>
  )
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.94v2.32A9 9 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.96H.94A9 9 0 0 0 0 9c0 1.45.35 2.83.94 4.04l3.03-2.32Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.99 8.99 0 0 0 9 0 9 9 0 0 0 .94 4.96l3.03 2.32C4.68 5.16 6.66 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}

function FacebookLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#1877F2" d="M18 9a9 9 0 1 0-10.4 8.9V11.6H5.3V9h2.3V7c0-2.26 1.34-3.5 3.4-3.5 1 0 2 .17 2 .17V6h-1.13c-1.12 0-1.47.7-1.47 1.42V9h2.5l-.4 2.6h-2.1v6.3A9 9 0 0 0 18 9Z"/>
    </svg>
  )
}
