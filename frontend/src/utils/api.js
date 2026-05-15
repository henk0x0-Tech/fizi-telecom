/**
 * api.js — Fizi Telecom API client
 *
 * In development:  uses VITE_API_URL from .env (http://localhost:5000/api)
 * In production:   uses /api (Netlify proxy rewrites to backend)
 *
 * Set in Netlify dashboard:
 *   VITE_API_URL = (leave empty or omit — /api proxy handles it)
 *   VITE_API_BASE_URL = https://your-backend.onrender.com  (for netlify.toml proxy)
 */
const API = import.meta.env.VITE_API_URL || '/api';

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
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `GET ${path} failed (${res.status})`);
  }
  return res.json();
}

export async function apiPost(path, body, auth = false) {
  const headers = {
    'Content-Type': 'application/json',
    ...(auth ? authHeaders() : {}),
  };
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(data.error || `POST ${path} failed (${res.status})`);
  }
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(data.error || `PUT ${path} failed (${res.status})`);
  }
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(`${API}${path}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Delete failed' }));
    throw new Error(data.error || `DELETE ${path} failed (${res.status})`);
  }
  return res.json();
}

export async function login(username, password) {
  return apiPost('/auth/login', { username, password });
}

export async function verifyAuth() {
  try {
    const res = await fetch(`${API}/auth/verify`, { headers: authHeaders() });
    return res.ok;
  } catch {
    return false;
  }
}
