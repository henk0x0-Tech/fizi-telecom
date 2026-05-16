import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AdminAuthContext = createContext(null);

const SESSION_KEY   = 'fizi_owner_sess';
const ATTEMPTS_KEY  = 'fizi_login_attempts';
const MAX_ATTEMPTS  = 5;
const LOCKOUT_MS    = 15 * 60 * 1000; // 15 minutes
const SESSION_TTL   = 8 * 60 * 60 * 1000; // 8 hours

function getAttemptData() {
  try { return JSON.parse(sessionStorage.getItem(ATTEMPTS_KEY) || '{}'); }
  catch { return {}; }
}

function saveAttemptData(d) {
  sessionStorage.setItem(ATTEMPTS_KEY, JSON.stringify(d));
}

export function AdminAuthProvider({ children }) {
  const [authed, setAuthed]     = useState(false);
  const [checking, setChecking] = useState(true);
  const [lockout, setLockout]   = useState(null); // null or { until: timestamp }

  // Restore session and lockout state on mount
  useEffect(() => {
    try {
      const sess = sessionStorage.getItem(SESSION_KEY);
      if (sess) {
        const { ts } = JSON.parse(sess);
        if (Date.now() - ts < SESSION_TTL) setAuthed(true);
        else sessionStorage.removeItem(SESSION_KEY);
      }
      const att = getAttemptData();
      if (att.lockUntil && Date.now() < att.lockUntil) {
        setLockout({ until: att.lockUntil });
      }
    } catch { /* ignore */ }
    setChecking(false);
  }, []);

  // Live lockout countdown — clears lockout state when timer expires
  useEffect(() => {
    if (!lockout) return;
    const remaining = lockout.until - Date.now();
    if (remaining <= 0) { setLockout(null); return; }
    const tid = setTimeout(() => setLockout(null), remaining);
    return () => clearTimeout(tid);
  }, [lockout]);

  const login = useCallback((username, password) => {
    // Check lockout
    const att = getAttemptData();
    if (att.lockUntil && Date.now() < att.lockUntil) {
      return { ok: false, locked: true, until: att.lockUntil };
    }

    const envUser = import.meta.env.VITE_ADMIN_USERNAME;
    const envPass = import.meta.env.VITE_ADMIN_PASSWORD;

    // Determine valid credentials
    const validUser = envUser || 'owner';
    const validPass = envPass || 'FiziAdmin2026!';

    if (username === validUser && password === validPass) {
      // Reset attempts on success
      sessionStorage.removeItem(ATTEMPTS_KEY);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ts: Date.now() }));
      setAuthed(true);
      setLockout(null);
      return { ok: true };
    }

    // Track failed attempt
    const count = (att.count || 0) + 1;
    const remaining = MAX_ATTEMPTS - count;

    if (count >= MAX_ATTEMPTS) {
      const lockUntil = Date.now() + LOCKOUT_MS;
      saveAttemptData({ count, lockUntil });
      setLockout({ until: lockUntil });
      return { ok: false, locked: true, until: lockUntil };
    }

    saveAttemptData({ count });
    return { ok: false, locked: false, remaining };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ authed, checking, lockout, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
