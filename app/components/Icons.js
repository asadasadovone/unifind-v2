'use client'
import { useState, useEffect } from 'react'

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
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>,
    heartFilled: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" fill="currentColor"/>,
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
    paperclip: <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></>,
    feedback: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    doc: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  };
  return <svg {...props}>{paths[name]}</svg>;
}

export function Logo({ size = 'md', onClick, color = 'white' }) {
  const scale = size === 'sm' ? 0.72 : 1;
  const w = Math.round(127 * scale);
  const h = Math.round(36 * scale);
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: onClick ? 'pointer' : 'default', padding: 0, display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
      <svg width={w} height={h} viewBox="0 0 127 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.9961 4L16.0024 4.00313C15.9918 5.06102 16.0833 6.11749 16.2764 7.15777C16.8127 10.0127 18.0895 12.4621 20.5198 14.1227C19.0638 14.6656 17.9091 15.2138 16.6546 16.1397C15.4092 14.9316 14.8867 14.2313 13.9965 12.7594C12.6132 15.1565 11.1235 16.6209 8.74198 18.0021C11.2408 19.4661 12.5182 20.7801 14.0038 23.2416C14.7059 22.0502 15.2328 21.2912 16.2075 20.2994C18.7286 17.7336 22.138 16.441 25.6731 16.0849C26.4576 16.0059 27.2111 16.0002 27.9985 15.9963L28 20.0053C27.4349 20.0056 26.8697 20.0265 26.306 20.0679C23.6698 20.3421 21.1017 21.1474 19.144 23.0126C16.6517 25.3867 16.0741 28.7018 16.0038 31.9997L11.9972 31.9983C11.9772 28.8008 11.2618 25.5393 8.98713 23.1381C6.63516 20.6553 3.28659 20.0718 0 20.0096L0.00338929 15.9898C4.31105 16.0674 8.88533 14.4395 10.7787 10.2907C11.7305 8.20503 11.9259 6.26028 11.9961 4Z" fill={color}/>
        <path d="M24.6622 26.2548C26.2459 26.0066 27.7289 27.0949 27.9673 28.6799C28.2058 30.2654 27.1084 31.7415 25.5219 31.9702C23.949 32.1967 22.488 31.1113 22.2518 29.5396C22.0155 27.9682 23.0923 26.5008 24.6622 26.2548Z" fill={color}/>
        <path d="M49.716 28.448C48.148 28.448 46.776 28.1493 45.6 27.552C44.4427 26.936 43.5467 26.068 42.912 24.948C42.296 23.828 41.988 22.5027 41.988 20.972V8.092H45.012V20.972C45.012 22.484 45.4227 23.6507 46.244 24.472C47.0653 25.2747 48.2227 25.676 49.716 25.676C51.2093 25.676 52.3667 25.2747 53.188 24.472C54.0093 23.6507 54.42 22.484 54.42 20.972V8.092H57.444V20.972C57.444 22.5027 57.1267 23.828 56.492 24.948C55.876 26.068 54.9893 26.936 53.832 27.552C52.6747 28.1493 51.3027 28.448 49.716 28.448ZM60.1414 28V13.104H62.8574L62.9694 17.08L62.6054 16.884C62.7734 15.9133 63.0907 15.1293 63.5574 14.532C64.0241 13.9347 64.5934 13.496 65.2654 13.216C65.9374 12.9173 66.6654 12.768 67.4494 12.768C68.5694 12.768 69.4934 13.02 70.2214 13.524C70.9681 14.0093 71.5281 14.6813 71.9014 15.54C72.2934 16.38 72.4894 17.3413 72.4894 18.424V28H69.5214V19.32C69.5214 18.4427 69.4281 17.7053 69.2414 17.108C69.0547 16.5107 68.7467 16.0533 68.3174 15.736C67.8881 15.4187 67.3281 15.26 66.6374 15.26C65.5921 15.26 64.7427 15.6053 64.0894 16.296C63.4361 16.9867 63.1094 17.9947 63.1094 19.32V28H60.1414ZM75.0109 28V13.104H77.9789V28H75.0109ZM74.9549 10.948V7.98H78.0349V10.948H74.9549ZM78.9616 28L86.1296 8.12H89.9656L97.1336 28H93.9136L92.0936 22.82H83.9736L82.1816 28H78.9616ZM84.9256 20.076H91.1696L88.0336 11.004L84.9256 20.076ZM103.599 28.336C102.199 28.336 101.014 28.1213 100.043 27.692C99.0914 27.2627 98.354 26.6747 97.8314 25.928C97.3087 25.1627 97.01 24.2853 96.9354 23.296L99.9874 23.156C100.137 23.9773 100.491 24.6307 101.051 25.116C101.611 25.6013 102.461 25.844 103.599 25.844C104.533 25.844 105.27 25.6947 105.811 25.396C106.353 25.0973 106.623 24.6213 106.623 23.968C106.623 23.6133 106.53 23.3147 106.343 23.072C106.175 22.8107 105.839 22.596 105.335 22.428C104.831 22.2413 104.085 22.064 103.095 21.896C101.621 21.616 100.463 21.2893 99.6234 20.916C98.7834 20.5427 98.186 20.0667 97.8314 19.488C97.4767 18.9093 97.2994 18.2093 97.2994 17.388C97.2994 16.0253 97.8034 14.9147 98.8114 14.056C99.838 13.1973 101.313 12.768 103.235 12.768C104.523 12.768 105.606 12.992 106.483 13.44C107.361 13.8693 108.042 14.4573 108.527 15.204C109.031 15.932 109.349 16.7533 109.479 17.668L106.427 17.836C106.334 17.3133 106.147 16.8653 105.867 16.492C105.606 16.1 105.251 15.8013 104.803 15.596C104.355 15.372 103.823 15.26 103.207 15.26C102.255 15.26 101.546 15.4467 101.079 15.82C100.613 16.1933 100.379 16.6787 100.379 17.276C100.379 17.724 100.482 18.088 100.687 18.368C100.911 18.648 101.266 18.8813 101.751 19.068C102.237 19.236 102.881 19.3853 103.683 19.516C105.233 19.7773 106.446 20.104 107.323 20.496C108.201 20.8693 108.817 21.336 109.171 21.896C109.526 22.456 109.703 23.1373 109.703 23.94C109.703 24.8733 109.442 25.6667 108.919 26.32C108.397 26.9733 107.678 27.4773 106.763 27.832C105.849 28.168 104.794 28.336 103.599 28.336ZM111.307 28V8.12H114.275V20.468L120.967 13.104H124.719L118.895 19.376L124.943 28H121.527L116.907 21.224L114.275 24.024V28H111.307Z" fill={color}/>
      </svg>
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

  const [loStr, setLoStr] = useState(String(lo));
  const [hiStr, setHiStr] = useState(String(hi));

  // Sync string states when value changes externally (e.g. slider drag)
  useEffect(() => { setLoStr(String(lo)); }, [lo]);
  useEffect(() => { setHiStr(String(hi)); }, [hi]);

  const applyLo = (raw) => {
    const n = Math.max(min, Math.min(Number(raw) || min, hi - step));
    onChange([n, hi]);
    setLoStr(String(n));
  };
  const applyHi = (raw) => {
    const n = Math.min(max, Math.max(Number(raw) || min, lo + step));
    onChange([lo, n]);
    setHiStr(String(n));
  };

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
          <input className="input" type="number" value={loStr}
            onChange={(e) => setLoStr(e.target.value)}
            onBlur={(e) => applyLo(e.target.value)} />
          <span className="muted">to</span>
          <input className="input" type="number" value={hiStr}
            onChange={(e) => setHiStr(e.target.value)}
            onBlur={(e) => applyHi(e.target.value)} />
        </div>
      )}
    </div>
  );
}
