'use client'
import { Icon, Logo } from './Icons'

export default function MyProgramsScreen({ user, savedPrograms = [], onBack, onOpenUni }) {
  return (
    <div className="results-screen">
      <header className="results-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Logo size="sm" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="user-pill">
            <div className="user-avatar">
              {(user?.user_metadata?.full_name || user?.email || 'U')[0].toUpperCase()}
            </div>
            <span style={{ fontSize: 13 }}>
              {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}
            </span>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 32px' }}>
        <button
          className="btn btn-ghost"
          onClick={onBack}
          style={{ marginBottom: 24, padding: '8px 0', color: 'var(--ink-500)', fontSize: 13 }}
        >
          <Icon name="chevronLeft" size={16} /> Back to results
        </button>

        <h2 className="serif" style={{ fontSize: 36, color: 'var(--green-900)', lineHeight: 1.1 }}>
          My <span className="serif-italic">Programs</span>
        </h2>
        <p className="muted" style={{ marginTop: 8, fontSize: 14 }}>
          Programs you've saved across all your searches.
        </p>

        <div style={{ marginTop: 32 }}>
          {savedPrograms.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '80px 32px', gap: 16, textAlign: 'center',
              background: 'var(--white)', borderRadius: 'var(--r-lg)',
              border: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: 48 }}>🎓</div>
              <div className="serif" style={{ fontSize: 24, color: 'var(--green-900)' }}>
                No saved programs <span className="serif-italic">yet</span>
              </div>
              <p className="muted" style={{ fontSize: 14, maxWidth: 320, lineHeight: 1.6 }}>
                When you save a program from the search results, it will appear here.
              </p>
              <button className="btn btn-primary" onClick={onBack} style={{ marginTop: 8 }}>
                <Icon name="search" size={14} /> Browse programs
              </button>
            </div>
          ) : (
            <div className="cards-list">
              {savedPrograms.map((uni) => {
                const tuitionLabel = uni.tuition === 0 ? 'Free tuition' : `${uni.tuition.toLocaleString()} USD/yr`
                return (
                  <article key={uni.id} className="uni-card" onClick={() => onOpenUni?.(uni)}>
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
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
