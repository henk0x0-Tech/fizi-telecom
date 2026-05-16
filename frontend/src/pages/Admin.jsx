import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAdminAuth } from '../context/AdminAuthContext';
import AdminLogin from '../components/admin/AdminLogin';
import { ImageManager, ContentManager, useToast, ToastWrap } from '../components/admin/AdminPanels';
import '../styles/Admin.css';

const NAV = [
  { key: 'overview', icon: '📊', label: 'Dashboard' },
  { key: 'images',   icon: '🖼️', label: 'Image Manager' },
  { key: 'content',  icon: '📝', label: 'Content Manager' },
];

function OverviewPanel() {
  return (
    <div className="adm-panel">
      <div className="adm-panel__header">
        <h2 className="adm-panel__title">Welcome back, Owner 👋</h2>
        <p className="adm-panel__sub">Manage your Fizi Telecom website content from this secure dashboard.</p>
      </div>

      <div className="adm-overview-grid">
        {[
          { icon: '🌐', label: 'Website',  value: 'Live',   color: '#22c55e', desc: 'fizitelecom.com' },
          { icon: '🔒', label: 'Session',  value: '8h',     color: '#00bfff', desc: 'Auto-expires' },
          { icon: '🖼️', label: 'Images',   value: 'WebP',   color: '#7c3aed', desc: 'Auto-optimized' },
          { icon: '📡', label: 'API',      value: 'Active', color: '#f59e0b', desc: 'Backend connected' },
        ].map(c => (
          <div key={c.label} className="adm-overview-card">
            <div className="adm-overview-card__icon" style={{ background: `${c.color}18` }}>{c.icon}</div>
            <div className="adm-overview-card__body">
              <div className="adm-overview-card__value" style={{ color: c.color }}>{c.value}</div>
              <div className="adm-overview-card__label">{c.label}</div>
              <div className="adm-overview-card__desc">{c.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-quickstart">
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 16, color: 'var(--adm-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Actions</h3>
        <div className="adm-quickstart-grid">
          {[
            { icon: '🖼️', title: 'Upload Images', desc: 'Add new website images with drag & drop. Auto-converts to WebP.', tab: 'images' },
            { icon: '📝', title: 'Edit Content',  desc: 'Add, edit, or delete services and products on the website.',  tab: 'content' },
          ].map(q => (
            <div key={q.tab} className="adm-quickstart-card">
              <span className="adm-quickstart-card__icon">{q.icon}</span>
              <div>
                <div className="adm-quickstart-card__title">{q.title}</div>
                <div className="adm-quickstart-card__desc">{q.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const { authed, checking, logout } = useAdminAuth();
  const [tab, setTab]               = useState('overview');
  const [sidebarOpen, setSidebar]   = useState(false);
  const { toasts, add: toast }      = useToast();

  /* ── Full-page loading while checking session ── */
  if (checking) {
    return (
      <div className="adm-boot">
        <div className="adm-spinner adm-spinner--lg" />
        <p className="adm-boot__label">Verifying session…</p>
      </div>
    );
  }

  /* ── Show login if not authenticated ── */
  if (!authed) return <AdminLogin />;

  const activeNav = NAV.find(n => n.key === tab) || NAV[0];

  const navigate = key => { setTab(key); setSidebar(false); };

  return (
    <>
      {/* Prevent search engine indexing of the dashboard */}
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Owner Dashboard · Fizi Telecom</title>
      </Helmet>

      <div className="adm-shell">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="adm-sidebar-overlay" onClick={() => setSidebar(false)} />
        )}

        {/* ── SIDEBAR ── */}
        <aside className={`adm-sidebar${sidebarOpen ? ' adm-sidebar--open' : ''}`} role="navigation" aria-label="Admin navigation">
          <div className="adm-sidebar__brand">
            <div className="adm-sidebar__logo">F</div>
            <div>
              <div className="adm-sidebar__name">Fizi Telecom</div>
              <div className="adm-sidebar__role">Owner Dashboard</div>
            </div>
          </div>

          <nav className="adm-sidebar__nav">
            {NAV.map(n => (
              <button
                key={n.key}
                className={`adm-nav-item${tab === n.key ? ' adm-nav-item--active' : ''}`}
                onClick={() => navigate(n.key)}
              >
                <span className="adm-nav-item__icon">{n.icon}</span>
                <span>{n.label}</span>
                {tab === n.key && <span className="adm-nav-item__dot" />}
              </button>
            ))}
          </nav>

          <div className="adm-sidebar__footer">
            <div className="adm-sidebar__user">
              <div className="adm-sidebar__avatar">👤</div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Owner</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--adm-muted)' }}>Authenticated</div>
              </div>
            </div>
            <button className="adm-logout-btn" onClick={logout} aria-label="Sign out">
              🚪 Sign Out
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="adm-main">
          {/* Topbar */}
          <header className="adm-topbar" role="banner">
            <div className="adm-topbar__left">
              <button
                className="adm-hamburger"
                onClick={() => setSidebar(o => !o)}
                aria-label="Toggle sidebar"
                aria-expanded={sidebarOpen}
              >
                {sidebarOpen ? '✕' : '☰'}
              </button>
              <div>
                <span className="adm-topbar__page-icon">{activeNav.icon}</span>
                <span className="adm-topbar__title">{activeNav.label}</span>
              </div>
            </div>
            <div className="adm-topbar__right">
              <span className="adm-live-badge">● LIVE</span>
              <a
                href="https://fizitelecom.com"
                target="_blank"
                rel="noopener noreferrer"
                className="adm-btn adm-btn--ghost adm-btn--sm"
                title="View live website"
              >
                🌐 View Site
              </a>
            </div>
          </header>

          {/* Content */}
          <main className="adm-content" role="main">
            {tab === 'images'  && <ImageManager  toast={toast} />}
            {tab === 'content' && <ContentManager toast={toast} />}
            {tab === 'overview' && <OverviewPanel />}
          </main>
        </div>
      </div>

      <ToastWrap toasts={toasts} />
    </>
  );
}
