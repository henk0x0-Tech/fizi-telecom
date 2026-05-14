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
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
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
              return (
                <FadeIn key={service._id || service.id || i} delay={i * 0.04}>
                  <div className="service-api-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div className="service-api-card__icon" style={{ margin: 0 }}><IconComp size={22} /></div>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-gray)', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>{service.category}</span>
                    </div>
                    <h3 className="service-api-card__title">{service.name}</h3>
                    <p className="service-api-card__desc">{service.description}</p>
                    {service.pricing && (
                      <div className="service-api-card__price">From ${service.pricing.startingPrice}</div>
                    )}
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
