import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Wifi, Building2, Shield, Camera, Cloud, Cpu,
  Headphones, Radio, ArrowRight, Filter
} from 'lucide-react';
import '../styles/Services.css';

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >{children}</motion.div>
  );
}

const iconMap = {
  'Connectivity': Wifi,
  'Enterprise Networking': Building2,
  'IT Infrastructure': Cloud,
  'Security': Shield,
  'WiFi & Smart Solutions': Cpu,
  'Support & Maintenance': Headphones,
};

const featuredServices = [
  { icon: Wifi, title: 'Fiber Internet (FTTH)', desc: 'High-speed fiber-optic internet delivering gigabit connectivity with guaranteed bandwidth and symmetric speeds.', color: '#0057D9' },
  { icon: Radio, title: 'Wireless Internet (WISP)', desc: 'Point-to-point and point-to-multipoint wireless solutions for underserved areas.', color: '#D97706' },
  { icon: Building2, title: 'Enterprise Networking', desc: 'Custom-designed network architectures for large organizations including SD-WAN and multi-site connectivity.', color: '#7C3AED' },
  { icon: Camera, title: 'CCTV Installation', desc: 'Professional security camera systems, IP surveillance networks, and cloud-based monitoring solutions.', color: '#059669' },
];

import { defaultServices } from '../fallbackData';

const serviceCategoryImages = {
  'Connectivity': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
  'WiFi & Smart Solutions': 'https://images.unsplash.com/photo-1563770660309-8d19760775d7?q=80&w=800&auto=format&fit=crop',
  'Enterprise Networking': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
  'Support & Maintenance': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop',
  'Security': 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop',
  'IT Infrastructure': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
};
const defaultServiceImage = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchServices(); }, [filter]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const url = filter
        ? `http://localhost:5000/api/services?category=${filter}`
        : 'http://localhost:5000/api/services';
      const response = await fetch(url);
      const data = await response.json();
      setServices(Array.isArray(data) ? data : (filter ? defaultServices.filter(s => s.category === filter) : defaultServices));
    } catch (error) {
      console.error('Error fetching services, using fallback data:', error);
      setServices(filter ? defaultServices.filter(s => s.category === filter) : defaultServices);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Connectivity', 'Enterprise Networking', 'IT Infrastructure', 'Security', 'WiFi & Smart Solutions', 'Support & Maintenance'];

  return (
    <div className="page-services">
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="container page-hero__content">
          <motion.span className="section-label section-label--light"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >Our Services</motion.span>
          <motion.h1 className="page-hero__title"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
          >Comprehensive Technology Solutions</motion.h1>
          <motion.p className="page-hero__subtitle"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          >From fiber-optic connectivity to enterprise cybersecurity — everything your business needs under one roof.</motion.p>
        </div>
      </section>

      <div className="container section-padding">
        {/* Filter */}
        <FadeIn>
          <div className="filter-bar">
            <div className="filter-bar__label"><Filter size={16} /> Filter by Category</div>
            <div className="filter-bar__chips">
              {categories.map(cat => (
                <button key={cat}
                  className={`filter-chip ${filter === (cat === 'All' ? '' : cat) ? 'filter-chip--active' : ''}`}
                  onClick={() => setFilter(cat === 'All' ? '' : cat)}
                >{cat}</button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* API Services */}
        {loading ? (
          <div className="loading-state"><div className="loading-spinner" /> Loading services...</div>
        ) : services.length > 0 ? (
          <div className="services-api-grid">
            {services.map((service, i) => {
              const IconComp = iconMap[service.category] || Cloud;
              const imgUrl = service.image || serviceCategoryImages[service.category] || defaultServiceImage;
              return (
                <FadeIn key={service._id || service.id || i} delay={i * 0.04}>
                  <div className="service-api-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '180px', backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,25,47,0.9), transparent)' }} />
                      <div style={{ position: 'absolute', bottom: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="service-api-card__icon" style={{ margin: 0, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}><IconComp size={20} /></div>
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fff', background: 'rgba(0,191,255,0.2)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(0,191,255,0.3)' }}>{service.category}</span>
                      </div>
                    </div>
                    <div style={{ padding: '24px' }}>
                      <h3 className="service-api-card__title">{service.name}</h3>
                      <p className="service-api-card__desc">{service.description}</p>
                      {service.pricing && (
                        <div className="service-api-card__price" style={{ marginTop: '16px', color: '#00BFFF', fontWeight: 600 }}>
                          From ${service.pricing.startingPrice} {service.pricing.currency}
                        </div>
                      )}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">No services found for this category.</div>
        )}

        {/* Featured */}
        <FadeIn>
          <div className="section-header" style={{ marginTop: 80 }}>
            <span className="section-label">Featured</span>
            <h2 className="section-title">Our Core Services</h2>
          </div>
        </FadeIn>
        <div className="featured-grid">
          {featuredServices.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.06}>
              <div className="service-card">
                <div className="service-card__icon" style={{ background: `${s.color}12`, color: s.color }}>
                  <s.icon size={24} />
                </div>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__desc">{s.desc}</p>
                <Link to="/contact" className="service-card__link">Get a Quote <ArrowRight size={14} /></Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
