import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, Wrench, DollarSign,
  FileText, Users, MessageSquare, Settings,
  LogOut, Menu, X, ChevronLeft, Wifi
} from 'lucide-react';

const NAV = [
  { group: 'Overview',  items: [{ id:'dashboard', label:'Dashboard', icon:LayoutDashboard }] },
  { group: 'Content',   items: [
    { id:'hero',         label:'Hero Section',   icon:FileText },
    { id:'services',     label:'Services',        icon:Wrench },
    { id:'products',     label:'Products',        icon:Package },
  ]},
  { group: 'Marketing', items: [
    { id:'plans',        label:'Pricing Plans',   icon:DollarSign },
    { id:'testimonials', label:'Testimonials',    icon:MessageSquare },
    { id:'partners',     label:'Partners',        icon:Users },
  ]},
  { group: 'Settings',  items: [{ id:'contact', label:'Contact Info', icon:Settings }] },
];

export default function AdminSidebar({ activeTab, setActiveTab, user, onLogout, collapsed, setCollapsed }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => { if (window.innerWidth > 1024) setMobileOpen(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const nav = (id) => { setActiveTab(id); setMobileOpen(false); };

  return (
    <>
      <button className="admin-mobile-toggle" onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu">
        {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
      </button>

      <aside className={`admin-sidebar ${collapsed ? 'admin-sidebar--collapsed' : ''} ${mobileOpen ? 'admin-sidebar--open' : ''}`}>
        {/* Brand */}
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__brand">
            <div className="admin-sidebar__logo"><Wifi size={16}/></div>
            {!collapsed && (
              <div className="admin-sidebar__brand-text">
                <h3>Fizi Telecom</h3>
                <span>Admin Panel</span>
              </div>
            )}
          </div>
          <button className="admin-sidebar__collapse" onClick={() => setCollapsed(v => !v)} title={collapsed ? 'Expand' : 'Collapse'}>
            <ChevronLeft size={16} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s' }}/>
          </button>
        </div>

        {/* Nav */}
        <nav className="admin-sidebar__nav">
          {NAV.map(group => (
            <div key={group.group}>
              {!collapsed && <div className="admin-sidebar__group-label">{group.group}</div>}
              {group.items.map(item => (
                <button
                  key={item.id}
                  className={`admin-sidebar__item ${activeTab === item.id ? 'admin-sidebar__item--active' : ''}`}
                  onClick={() => nav(item.id)}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18}/>
                  {!collapsed && <span>{item.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">{(user?.username || 'A')[0].toUpperCase()}</div>
            {!collapsed && (
              <div className="admin-sidebar__user-info">
                <p>{user?.username || 'Admin'}</p>
                <span>{user?.role || 'Administrator'}</span>
              </div>
            )}
          </div>
          <button className="admin-sidebar__logout" onClick={onLogout} title="Logout">
            <LogOut size={16}/>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="admin-sidebar__backdrop" onClick={() => setMobileOpen(false)}/>}
    </>
  );
}
