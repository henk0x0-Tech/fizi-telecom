import { useState, useEffect } from 'react';
import AdminLogin from '../components/admin/AdminLogin';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardTab from '../components/admin/DashboardTab';
import HeroTab from '../components/admin/HeroTab';
import ListEditorTab from '../components/admin/ListEditorTab';
import ContactTab from '../components/admin/ContactTab';
import { getToken, clearToken, verifyAuth, apiGet, apiPut } from '../utils/api';
import '../styles/Admin.css';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [siteContent, setSiteContent] = useState(null);

  // ── On mount: verify existing token ──────────────────────────────
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setChecking(false);
      return;
    }
    verifyAuth().then(valid => {
      if (valid) {
        // Decode username from token payload
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({ username: payload.username, role: payload.role });
        } catch {
          setUser({ username: 'Admin', role: 'admin' });
        }
      } else {
        clearToken();
      }
      setChecking(false);
    });
  }, []);

  // ── Fetch site content when logged in ────────────────────────────
  useEffect(() => {
    if (!user) return;
    apiGet('/site-content').then(setSiteContent).catch(() => {});
  }, [user]);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => { clearToken(); setUser(null); setActiveTab('dashboard'); };

  const handleSaveContent = async (key, value) => {
    const updated = { ...siteContent, [key]: value };
    try {
      await apiPut('/site-content', updated);
      setSiteContent(updated);
    } catch (err) {
      alert('Failed to save: ' + err.message);
    }
  };

  // ── Loading screen while verifying token ─────────────────────────
  if (checking) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#0a192f', color:'#00BFFF', fontFamily:'Inter,sans-serif' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:40, height:40, border:'3px solid rgba(0,191,255,0.2)', borderTopColor:'#00BFFF', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
          <p>Verifying session...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // ── Login screen ──────────────────────────────────────────────────
  if (!user) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // ── Admin dashboard ───────────────────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab siteContent={siteContent} onNavigate={setActiveTab} />;
      case 'hero':
        return <HeroTab siteContent={siteContent} onSave={handleSaveContent} />;
      case 'services':
        return <ListEditorTab title="Services" apiKey="services" endpoint="/services" />;
      case 'products':
        return <ListEditorTab title="Products" apiKey="products" endpoint="/products" />;
      case 'plans':
        return <ListEditorTab title="Pricing Plans" apiKey="plans" endpoint="/plans" siteContent={siteContent} onSave={handleSaveContent} />;
      case 'testimonials':
        return <ListEditorTab title="Testimonials" apiKey="testimonials" siteContent={siteContent} onSave={handleSaveContent} />;
      case 'partners':
        return <ListEditorTab title="Partners" apiKey="partners" siteContent={siteContent} onSave={handleSaveContent} />;
      case 'contact':
        return <ContactTab siteContent={siteContent} onSave={handleSaveContent} />;
      default:
        return <DashboardTab siteContent={siteContent} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />
      <main className="admin-main">
        {renderTab()}
      </main>
    </div>
  );
}
