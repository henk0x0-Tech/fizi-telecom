import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';

function LockoutTimer({ until }) {
  const [secs, setSecs] = useState(Math.max(0, Math.ceil((until - Date.now()) / 1000)));
  useEffect(() => {
    if (secs <= 0) return;
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [until]);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return <span>{m}:{String(s).padStart(2, '0')}</span>;
}

export default function AdminLogin() {
  const { login, lockout } = useAdminAuth();
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [remaining, setRemaining] = useState(null); // attempts left

  // Clear error when user types
  const onUser = v => { setUsername(v); setError(''); };
  const onPass = v => { setPassword(v); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lockout) return;
    if (!username.trim() || !password.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    setError('');
    // Artificial delay — prevents timing-based brute-force
    await new Promise(r => setTimeout(r, 700));
    const result = login(username.trim(), password);
    setLoading(false);

    if (!result.ok) {
      if (result.locked) {
        setError('');
      } else {
        setRemaining(result.remaining);
        setError(
          result.remaining === 1
            ? 'Invalid credentials. 1 attempt remaining before lockout.'
            : `Invalid credentials. ${result.remaining} attempts remaining.`
        );
      }
    }
  };

  const isLocked = !!lockout;

  return (
    <div className="adm-login-page">
      {/* Animated background blobs */}
      <div className="adm-login-blob adm-login-blob--1" />
      <div className="adm-login-blob adm-login-blob--2" />

      <div className="adm-login-card">
        {/* Brand */}
        <div className="adm-login-brand">
          <div className="adm-login-logo-ring">
            <div className="adm-login-logo-icon">F</div>
          </div>
          <div>
            <h1 className="adm-login-title">Owner Portal</h1>
            <p className="adm-login-sub">Fizi Telecom · Secure Access</p>
          </div>
        </div>

        {/* Lockout banner */}
        {isLocked && (
          <div className="adm-login-lockout">
            <span className="adm-login-lockout__icon">🔒</span>
            <div>
              <strong>Access Locked</strong>
              <p>Too many failed attempts. Try again in <LockoutTimer until={lockout.until} />.</p>
            </div>
          </div>
        )}

        {/* Form */}
        {!isLocked && (
          <form className="adm-login-form" onSubmit={handleSubmit} autoComplete="off">
            {error && (
              <div className="adm-login-error" role="alert">
                <span>⚠️</span> {error}
              </div>
            )}

            <div className="adm-login-field">
              <label className="adm-login-label" htmlFor="adm-username">Username</label>
              <div className="adm-login-input-wrap">
                <span className="adm-login-input-icon">👤</span>
                <input
                  id="adm-username"
                  className="adm-login-input"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => onUser(e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="off"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="adm-login-field">
              <label className="adm-login-label" htmlFor="adm-password">Password</label>
              <div className="adm-login-input-wrap">
                <span className="adm-login-input-icon">🔑</span>
                <input
                  id="adm-password"
                  className="adm-login-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => onPass(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <button
              className="adm-login-btn"
              type="submit"
              disabled={loading || isLocked}
            >
              {loading
                ? <><span className="adm-spinner adm-spinner--sm" /> Verifying…</>
                : <><span>🔐</span> Sign In to Dashboard</>
              }
            </button>

            {remaining !== null && !error.includes('Invalid') && (
              <p style={{ textAlign:'center', fontSize:'0.72rem', color:'rgba(239,68,68,0.7)', marginTop:8 }}>
                {remaining} attempt{remaining !== 1 ? 's' : ''} remaining
              </p>
            )}
          </form>
        )}

        <p className="adm-login-footer-note">
          🛡️ Protected · Session expires after 8 hours
        </p>
      </div>
    </div>
  );
}
