const API = 'http://localhost:5000/api';

export function getToken() {
  return localStorage.getItem('fizi-admin-token');
}

export function setToken(token) {
  localStorage.setItem('fizi-admin-token', token);
}

export function clearToken() {
  localStorage.removeItem('fizi-admin-token');
}

export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet(path) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(path, body, auth = false) {
  const headers = { 'Content-Type': 'application/json', ...(auth ? authHeaders() : {}) };
  const res = await fetch(`${API}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(data.error || 'Request failed');
  }
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(data.error || 'Request failed');
  }
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(`${API}${path}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error('Delete failed');
  return res.json();
}

export async function login(username, password) {
  return apiPost('/auth/login', { username, password });
}

export async function verifyAuth() {
  const res = await fetch(`${API}/auth/verify`, { headers: authHeaders() });
  return res.ok;
}
