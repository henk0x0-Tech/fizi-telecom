import { useState, useEffect } from 'react';
import { Package, Wrench, DollarSign, MessageSquare, Users,
         Activity, TrendingUp, ArrowRight, Globe, Clock } from 'lucide-react';
import { apiGet } from '../../utils/api';

export default function DashboardTab({ siteContent, onNavigate }) {
  const [counts, setCounts] = useState({ products: 0, services: 0 });

  useEffect(() => {
    apiGet('/products').then(d => setCounts(p => ({ ...p, products: Array.isArray(d) ? d.length : 0 }))).catch(() => {});
    apiGet('/services').then(d => setCounts(p => ({ ...p, services: Array.isArray(d) ? d.length : 0 }))).catch(() => {});
  }, []);

  const stats = [
    { label:'Products',      value: counts.products,                       icon:Package,     color:'#0057D9', tab:'products' },
    { label:'Services',      value: counts.services,                       icon:Wrench,      color:'#059669', tab:'services' },
    { label:'Pricing Plans', value: siteContent?.plans?.length ?? 0,       icon:DollarSign,  color:'#D97706', tab:'plans' },
    { label:'Testimonials',  value: siteContent?.testimonials?.length ?? 0, icon:MessageSquare, color:'#7C3AED', tab:'testimonials' },
    { label:'Partners',      value: siteContent?.partners?.length ?? 0,    icon:Users,       color:'#0D9488', tab:'partners' },
  ];

  const quick = [
    { label:'Edit Hero Section',  tab:'hero',      icon:Globe },
    { label:'Manage Products',    tab:'products',  icon:Package },
    { label:'Update Pricing',     tab:'plans',     icon:DollarSign },
    { label:'Contact Settings',   tab:'contact',   icon:Activity },
  ];

  const lastUpdated = siteContent?._lastUpdated
    ? new Date(siteContent._lastUpdated).toLocaleString() : '—';

  return (
    <div className="admin-tab-content">
      <div className="admin-page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Overview of your Fizi Telecom website content</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="admin-stats-grid">
        {stats.map(s => (
          <button key={s.label} className="admin-stat-card" onClick={() => onNavigate(s.tab)}>
            <div className="admin-stat-card__icon" style={{ background:`${s.color}18`, color:s.color }}>
              <s.icon size={22}/>
            </div>
            <div>
              <span className="admin-stat-card__value">{s.value}</span>
              <span className="admin-stat-card__label">{s.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Info + Quick actions */}
      <div className="admin-info-grid">
        <div className="admin-info-card">
          <h3><Activity size={16}/> System Status</h3>
          <div className="admin-info-item"><span>API Server</span><span className="admin-badge-ok">Online</span></div>
          <div className="admin-info-item"><span>Last Updated</span><span>{lastUpdated}</span></div>
          <div className="admin-info-item"><span>Updated By</span><span>{siteContent?._updatedBy || '—'}</span></div>
          <div className="admin-info-item"><span>Environment</span><span>Production</span></div>
        </div>

        <div className="admin-info-card">
          <h3><TrendingUp size={16}/> Quick Actions</h3>
          {quick.map(q => (
            <button key={q.tab} className="admin-quick-action" onClick={() => onNavigate(q.tab)}>
              <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                <q.icon size={14}/> {q.label}
              </span>
              <ArrowRight size={13}/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
