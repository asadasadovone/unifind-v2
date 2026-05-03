'use client'

export function Icon({ name, size = 18, stroke = 1.6 }) {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round"
  };
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></>,
    chevron: <path d="m6 9 6 6 6-6"/>,
    chevronUp: <path d="m18 15-6-6-6 6"/>,
    chevronLeft: <path d="m15 18-6-6 6-6"/>,
    pin: <><path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>,
    cap: <><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5a8 4 0 0 0 12 0v-5"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></>,
    money: <><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 6v2"/><path d="M12 16v2"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20"/><path d="M12 2a15 15 0 0 0 0 20"/></>,
    sparkle: <path d="M12 3 9.5 9.5 3 12l6.5 2.5L12 21l2.5-6.5L21 12l-6.5-2.5Z"/>,
    send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
    star: <path d="m12 2 3.1 6.3L22 9.3l-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1Z"/>,
    sliders: <><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>,
    close: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    check: <path d="M20 6 9 17l-5-5"/>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    crown: <path d="m2 17 5-13 5 8 5-8 5 13H2Z"/>,
    clock: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
    language: <><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></>,
    sort: <><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></>,
    bot: <><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 8V4"/><path d="M8 4h8"/><circle cx="9" cy="14" r="1" fill="currentColor"/><circle cx="15" cy="14" r="1" fill="currentColor"/></>,
    paper: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>,
    menu: <><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></>,
    person: <><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    signout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    help: <><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    tag: <><path d="M12 2H2v10l9.3 9.3a1 1 0 0 0 1.4 0l8.3-8.3a1 1 0 0 0 0-1.4L12 2Z"/><circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none"/></>,
  };
  return <svg {...props}>{paths[name]}</svg>;
}

export function Logo({ size = 'md', onClick }) {
  const sizes = { sm: { mark: 26, font: 20 }, md: { mark: 32, font: 26 } };
  const s = sizes[size] || sizes.md;
  return (
    <button className="uf-logo" onClick={onClick} style={{ fontSize: s.font }}>
      <div className="uf-logo-mark" style={{ width: s.mark, height: s.mark, fontSize: s.mark * 0.62 }}>U</div>
      <span>UniFind</span>
    </button>
  );
}

export function ChipGroup({ options, value, onChange }) {
  const toggle = (opt) => {
    const set = new Set(value);
    set.has(opt) ? set.delete(opt) : set.add(opt);
    onChange([...set]);
  };
  return (
    <div className="chip-group">
      {options.map(opt => (
        <button key={opt} className={`chip ${value.includes(opt) ? 'active' : ''}`} onClick={() => toggle(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
}

export function RangeSlider({ min, max, step, value, onChange, hideInputs = false }) {
  const [lo, hi] = value;
  const pctLo = ((lo - min) / (max - min)) * 100;
  const pctHi = ((hi - min) / (max - min)) * 100;

  const handleDrag = (which) => (e) => {
    e.preventDefault();
    const track = e.currentTarget.parentElement;
    const rect = track.getBoundingClientRect();
    const move = (ev) => {
      const x = (ev.touches ? ev.touches[0].clientX : ev.clientX) - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      const raw = min + pct * (max - min);
      const snapped = Math.round(raw / step) * step;
      if (which === 'lo') onChange([Math.min(snapped, hi - step), hi]);
      else onChange([lo, Math.max(snapped, lo + step)]);
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  return (
    <div>
      <div className="range-track">
        <div className="range-fill" style={{ left: `${pctLo}%`, width: `${pctHi - pctLo}%` }} />
        <div className="range-thumb" style={{ left: `${pctLo}%` }} onMouseDown={handleDrag('lo')} />
        <div className="range-thumb" style={{ left: `${pctHi}%` }} onMouseDown={handleDrag('hi')} />
      </div>
      {!hideInputs && (
        <div className="range-inputs">
          <input className="input" type="number" value={lo}
            onChange={(e) => onChange([Math.max(min, Math.min(+e.target.value, hi - step)), hi])} />
          <span className="muted">to</span>
          <input className="input" type="number" value={hi}
            onChange={(e) => onChange([lo, Math.min(max, Math.max(+e.target.value, lo + step))])} />
        </div>
      )}
    </div>
  );
}
