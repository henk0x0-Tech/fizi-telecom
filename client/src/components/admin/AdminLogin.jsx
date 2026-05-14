import { useState } from 'react';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { login, setToken } from '../../utils/api';

export default function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(form.username, form.password);
      setToken(data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg" />
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <div className="admin-login-icon"><Shield size={32} /></div>
          <h1>Admin Portal</h1>
          <p>Fizi Telecom Control Panel</p>
        </div>
        {error && <div className="admin-login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label>Username</label>
            <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="Enter username" required autoFocus />
          </div>
          <div className="admin-field">
            <label>Password</label>
            <div className="admin-pass-wrap">
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Enter password" required />
              <button type="button" className="admin-pass-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
            </div>
          </div>
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? <><Loader2 size={18} className="spin" /> Authenticating...</> : 'Sign In'}
          </button>
        </form>
        <p className="admin-login-hint">Protected area. Unauthorized access is prohibited.</p>
      </div>
    </div>
  );
}
