import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, Wrench, DollarSign, FileText, Users, MessageSquare, Settings, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { clearToken } from '../../utils/api';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'hero', label: 'Hero Section', icon: FileText },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'plans', label: 'Pricing Plans', icon: DollarSign },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { id: 'partners', label: 'Partners', icon: Users },
  { id: 'contact', label: 'Contact Info', icon: Settings },
];

export default function AdminSidebar({ activeTab, setActiveTab, user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 1024) setMobileOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => { clearToken(); onLogout(); };
  const handleNav = (id) => { setActiveTab(id); setMobileOpen(false); };

  return (
    <>
      <button className="admin-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
      </button>
      <aside className={`admin-sidebar ${collapsed ? 'admin-sidebar--collapsed' : ''} ${mobileOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__brand">
            <div className="admin-sidebar__logo">FT</div>
            {!collapsed && <div><h3>Fizi Telecom</h3><span>Admin Panel</span></div>}
          </div>
          <button className="admin-sidebar__collapse" onClick={() => setCollapsed(!collapsed)}>
            <ChevronRight size={16} style={{ transform: collapsed ? 'rotate(0)' : 'rotate(180deg)' }}/>
          </button>
        </div>
        <nav className="admin-sidebar__nav">
          {navItems.map(item => (
            <button key={item.id} className={`admin-sidebar__item ${activeTab === item.id ? 'admin-sidebar__item--active' : ''}`} onClick={() => handleNav(item.id)} title={item.label}>
              <item.icon size={20}/>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">{(user?.username || 'A')[0].toUpperCase()}</div>
            {!collapsed && <div><p>{user?.username || 'Admin'}</p><span>{user?.role || 'Administrator'}</span></div>}
          </div>
          <button className="admin-sidebar__logout" onClick={handleLogout} title="Logout">
            <LogOut size={18}/>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
      {mobileOpen && <div className="admin-sidebar__backdrop" onClick={() => setMobileOpen(false)}/>}
    </>
  );
}
