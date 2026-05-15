import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Loader2, User, Lock, Shield, Wifi } from 'lucide-react';
import { login, setToken } from '../../utils/api';
import './AdminLogin.css';

/* ── Animated particle canvas background ── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      particles = [];
      const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 18000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.4,
          opacity: Math.random() * 0.4 + 0.1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* Grid lines */
      ctx.strokeStyle = 'rgba(0,150,255,0.03)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      /* Particles */
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,180,255,${p.opacity})`;
        ctx.fill();
      });

      /* Connections */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,140,255,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    resize(); init(); draw();
    window.addEventListener('resize', () => { resize(); init(); });
    return () => { cancelAnimationFrame(rafId); };
  }, []);

  return <canvas ref={canvasRef} className="aln-canvas" aria-hidden="true" />;
}

/* ── Floating label input ── */
function FloatingInput({ id, type, value, onChange, label, icon: Icon, rightSlot, autoFocus }) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  return (
    <div className={`aln-field ${focused ? 'aln-field--focused' : ''}`}>
      <div className="aln-field__icon"><Icon size={17} /></div>
      <div className="aln-field__inner">
        <label htmlFor={id} className={`aln-field__label ${lifted ? 'aln-field__label--lifted' : ''}`}>
          {label}
        </label>
        <input
          id={id}
          type={type}
          value={value}
          autoFocus={autoFocus}
          autoComplete={type === 'password' ? 'current-password' : 'username'}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="aln-field__input"
          required
        />
      </div>
      {rightSlot && <div className="aln-field__right">{rightSlot}</div>}
    </div>
  );
}

export default function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(form.username, form.password);
      setToken(data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aln-root">
      {/* ── Animated background ── */}
      <ParticleCanvas />

      {/* ── Gradient orbs ── */}
      <div className="aln-orb aln-orb--1" aria-hidden="true" />
      <div className="aln-orb aln-orb--2" aria-hidden="true" />
      <div className="aln-orb aln-orb--3" aria-hidden="true" />

      {/* ── Login card ── */}
      <div className={`aln-card ${mounted ? 'aln-card--in' : ''}`} role="main">

        {/* Top bar */}
        <div className="aln-card__topbar">
          <div className="aln-topbar__dot aln-topbar__dot--red" />
          <div className="aln-topbar__dot aln-topbar__dot--yellow" />
          <div className="aln-topbar__dot aln-topbar__dot--green" />
          <span className="aln-topbar__label">
            <Wifi size={11} /> SECURE CONNECTION
          </span>
        </div>

        {/* Shield icon + branding */}
        <div className="aln-header">
          <div className="aln-shield-wrap">
            <div className="aln-shield-ring aln-shield-ring--outer" />
            <div className="aln-shield-ring aln-shield-ring--inner" />
            <div className="aln-shield-icon">
              <Shield size={30} strokeWidth={1.5} />
            </div>
          </div>
          <div className="aln-brand">
            <h1 className="aln-brand__title">Admin Portal</h1>
            <p className="aln-brand__sub">Fizi Telecom · Control Panel</p>
          </div>
        </div>

        {/* Divider */}
        <div className="aln-divider">
          <span>AUTHENTICATION REQUIRED</span>
        </div>

        {/* Error message */}
        {error && (
          <div className="aln-error" role="alert">
            <span className="aln-error__dot" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="aln-form" noValidate>
          <FloatingInput
            id="aln-username"
            type="text"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            label="Username"
            icon={User}
            autoFocus
          />

          <FloatingInput
            id="aln-password"
            type={showPass ? 'text' : 'password'}
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            label="Password"
            icon={Lock}
            rightSlot={
              <button
                type="button"
                className="aln-toggle-pass"
                onClick={() => setShowPass(v => !v)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            }
          />

          {/* Forgot password */}
          <div className="aln-forgot-row">
            <button type="button" className="aln-forgot-btn">Forgot Password?</button>
          </div>

          {/* Sign In button */}
          <button
            type="submit"
            className={`aln-submit ${loading ? 'aln-submit--loading' : ''}`}
            disabled={loading}
          >
            <span className="aln-submit__bg" />
            <span className="aln-submit__content">
              {loading ? (
                <><Loader2 size={18} className="aln-spinner" /> Authenticating…</>
              ) : (
                <>Sign In &nbsp;→</>
              )}
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="aln-footer">
          <div className="aln-footer__badge">
            <Shield size={12} />
            <span>Secure Admin Access &nbsp;·&nbsp; SSL Encrypted</span>
          </div>
          <p className="aln-footer__legal">
            Unauthorized access is strictly prohibited and may be prosecuted.
          </p>
        </div>
      </div>
    </div>
  );
}
