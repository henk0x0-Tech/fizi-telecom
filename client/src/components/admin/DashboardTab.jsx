import { useState, useEffect } from 'react';
import { Package, Wrench, DollarSign, MessageSquare, Users, TrendingUp, Activity, Clock, RefreshCw } from 'lucide-react';
import { apiGet } from '../../utils/api';

export default function DashboardTab({ siteContent, onNavigate }) {
  const [productCount, setProductCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);

  useEffect(() => {
    apiGet('/products').then(d => setProductCount(Array.isArray(d) ? d.length : 0)).catch(() => {});
    apiGet('/services').then(d => setServiceCount(Array.isArray(d) ? d.length : 0)).catch(() => {});
  }, []);

  const stats = [
    { label: 'Products', value: productCount, icon: Package, color: '#0057D9', tab: 'products' },
    { label: 'Services', value: serviceCount, icon: Wrench, color: '#059669', tab: 'services' },
    { label: 'Pricing Plans', value: siteContent?.plans?.length || 3, icon: DollarSign, color: '#D97706', tab: 'plans' },
    { label: 'Testimonials', value: siteContent?.testimonials?.length || 3, icon: MessageSquare, color: '#7C3AED', tab: 'testimonials' },
    { label: 'Partners', value: siteContent?.partners?.length || 3, icon: Users, color: '#0D9488', tab: 'partners' },
  ];

  const lastUpdated = siteContent?._lastUpdated ? new Date(siteContent._lastUpdated).toLocaleString() : 'Never';

  return (
    <div className="admin-tab-content">
      <div className="admin-page-header">
        <div><h2>Dashboard</h2><p>Overview of your website content</p></div>
      </div>

      <div className="admin-stats-grid">
        {stats.map(s => (
          <button key={s.label} className="admin-stat-card" onClick={() => onNavigate(s.tab)}>
            <div className="admin-stat-card__icon" style={{ background: `${s.color}15`, color: s.color }}><s.icon size={24}/></div>
            <div className="admin-stat-card__info">
              <span className="admin-stat-card__value">{s.value}</span>
              <span className="admin-stat-card__label">{s.label}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="admin-info-grid">
        <div className="admin-info-card">
          <h3><Activity size={18}/> System Status</h3>
          <div className="admin-info-item"><span>API Server</span><span className="admin-badge-ok">Online</span></div>
          <div className="admin-info-item"><span>Last Updated</span><span>{lastUpdated}</span></div>
          <div className="admin-info-item"><span>Updated By</span><span>{siteContent?._updatedBy || '—'}</span></div>
        </div>
        <div className="admin-info-card">
          <h3><TrendingUp size={18}/> Quick Actions</h3>
          <button className="admin-quick-action" onClick={() => onNavigate('hero')}>Edit Hero Section</button>
          <button className="admin-quick-action" onClick={() => onNavigate('products')}>Manage Products</button>
          <button className="admin-quick-action" onClick={() => onNavigate('plans')}>Update Pricing</button>
          <button className="admin-quick-action" onClick={() => onNavigate('contact')}>Edit Contact Info</button>
        </div>
      </div>
    </div>
  );
}
