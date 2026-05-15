import { useState, useEffect } from 'react';
import AdminLogin from '../components/admin/AdminLogin';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardTab from '../components/admin/DashboardTab';
import HeroTab from '../components/admin/HeroTab';
import ListEditorTab from '../components/admin/ListEditorTab';
import ApiListTab from '../components/admin/ApiListTab';
import ContactTab from '../components/admin/ContactTab';
import { getToken, clearToken, verifyAuth, apiGet, apiPut } from '../utils/api';
import '../styles/Admin.css';

const TAB_LABELS = {
  dashboard: 'Dashboard', hero: 'Hero Section', services: 'Services',
  products: 'Products', plans: 'Pricing Plans', testimonials: 'Testimonials',
  partners: 'Partners', contact: 'Contact Info',
};

// Field definitions for each list tab
const FIELDS = {
  services: [
    { key:'title',    label:'Title',       type:'text' },
    { key:'desc',     label:'Description', type:'textarea' },
    { key:'color',    label:'Color',       type:'color' },
    { key:'gradient', label:'Gradient CSS',type:'text' },
  ],
  products: [
    { key:'name',     label:'Name',        type:'text' },
    { key:'desc',     label:'Description', type:'textarea' },
    { key:'image',    label:'Image URL',   type:'text', hideInTable:true },
    { key:'price',    label:'Price',       type:'text' },
    { key:'category', label:'Category',    type:'text' },
  ],
  plans: [
    { key:'name',     label:'Plan Name',   type:'text' },
    { key:'price',    label:'Price (USD)', type:'number' },
    { key:'desc',     label:'Description', type:'text' },
    { key:'features', label:'Features',    type:'array' },
    { key:'popular',  label:'Popular',     type:'boolean', checkLabel:'Mark as Popular' },
  ],
  testimonials: [
    { key:'name',   label:'Name',   type:'text' },
    { key:'role',   label:'Role',   type:'text' },
    { key:'quote',  label:'Quote',  type:'textarea' },
    { key:'avatar', label:'Avatar URL', type:'text', hideInTable:true },
    { key:'rating', label:'Rating (1–5)', type:'number' },
  ],
  partners: [
    { key:'name',  label:'Partner Name', type:'text' },
    { key:'title', label:'Title/Role',   type:'text' },
    { key:'phone', label:'Phone',        type:'text' },
  ],
};

export default function Admin() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [siteContent, setSiteContent] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) { setChecking(false); return; }
    verifyAuth().then(valid => {
      if (valid) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({ username: payload.username, role: payload.role });
        } catch { setUser({ username: 'Admin', role: 'admin' }); }
      } else { clearToken(); }
      setChecking(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    apiGet('/site-content').then(setSiteContent).catch(() => {});
  }, [user]);

  const handleLogin = (u) => setUser(u);
  const handleLogout = () => { clearToken(); setUser(null); setActiveTab('dashboard'); };

  const handleSaveContent = async (key, value) => {
    const updated = { ...siteContent, [key]: value };
    try { await apiPut('/site-content', updated); setSiteContent(updated); }
    catch (err) { alert('Save failed: ' + err.message); }
  };

  // Loading
  if (checking) return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',
      gap:16,minHeight:'100vh',background:'linear-gradient(160deg,#020712,#050d1e,#061128)',
      color:'rgba(77,184,255,0.8)',fontFamily:'Inter,sans-serif' }}>
      <div style={{ width:40,height:40,border:'2px solid rgba(0,150,255,0.12)',
        borderTopColor:'#0096ff',borderRadius:'50%',animation:'s 0.9s linear infinite' }}/>
      <p style={{ fontSize:'0.78rem',letterSpacing:'0.1em',color:'rgba(100,160,220,0.5)' }}>VERIFYING SESSION…</p>
      <style>{`@keyframes s{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!user) return <AdminLogin onLogin={handleLogin}/>;

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':    return <DashboardTab siteContent={siteContent} onNavigate={setActiveTab}/>;
      case 'hero':         return <HeroTab data={siteContent?.hero} onSave={handleSaveContent}/>;
      case 'services':     return <ApiListTab
        title="Services" subtitle="Manage your service offerings"
        endpoint="/services"
        fields={[
          { key:'name',        label:'Name',              type:'text',     required:true },
          { key:'category',    label:'Category',          type:'select', options:['Connectivity','WiFi & Smart Solutions','Enterprise Networking','Support & Maintenance','Security','IT Infrastructure'] },
          { key:'description', label:'Description',       type:'textarea' },
          { key:'pricing',     label:'Starting Price ($)', type:'nested', nestedKey:'startingPrice', nestedType:'number', placeholder:'49' },
          { key:'image',       label:'Image URL',         type:'image', hideInTable:true },
        ]}
      />;
      case 'products':     return <ApiListTab
        title="Products" subtitle="Manage hardware & product catalog"
        endpoint="/products"
        fields={[
          { key:'name',         label:'Name',         type:'text',   required:true },
          { key:'brand',        label:'Brand',        type:'text',   placeholder:'HP, Dell, Lenovo…' },
          { key:'category',     label:'Category',     type:'select', options:['Laptops','Desktops','Printers','Desktop Accessories','Networking','CCTV & Security','Other'] },
          { key:'price',        label:'Price (USD)',  type:'number', placeholder:'0' },
          { key:'availability', label:'Availability', type:'select', options:['In Stock','Low Stock','Out of Stock','Pre-Order'] },
          { key:'description',  label:'Description',  type:'textarea' },
          { key:'image',        label:'Image URL',    type:'image',  hideInTable:true },
        ]}
      />;
      case 'plans':        return <ListEditorTab title="Pricing Plans" subtitle="Manage subscription pricing" data={siteContent?.plans || []} fields={FIELDS.plans} sectionKey="plans" onSave={handleSaveContent}/>;
      case 'testimonials': return <ListEditorTab title="Testimonials"  subtitle="Manage client testimonials" data={siteContent?.testimonials || []} fields={FIELDS.testimonials} sectionKey="testimonials" onSave={handleSaveContent}/>;
      case 'partners':     return <ListEditorTab title="Partners"      subtitle="Manage key partners" data={siteContent?.partners || []} fields={FIELDS.partners} sectionKey="partners" onSave={handleSaveContent}/>;
      case 'contact':      return <ContactTab data={siteContent?.contact} onSave={handleSaveContent}/>;
      default:             return <DashboardTab siteContent={siteContent} onNavigate={setActiveTab}/>;
    }
  };

  return (
    <div className={`admin-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <AdminSidebar
        activeTab={activeTab} setActiveTab={setActiveTab}
        user={user} onLogout={handleLogout}
        collapsed={collapsed} setCollapsed={setCollapsed}
      />
      <main className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <span className="admin-topbar__title">{TAB_LABELS[activeTab] || 'Dashboard'}</span>
          <div className="admin-topbar__right">
            <div className="admin-topbar__badge">
              <span className="admin-topbar__badge-dot"/>
              LIVE
            </div>
            <span style={{ fontSize:'0.78rem', color:'rgba(160,185,220,0.5)' }}>
              {user?.username}
            </span>
          </div>
        </header>
        {renderTab()}
      </main>
    </div>
  );
}
