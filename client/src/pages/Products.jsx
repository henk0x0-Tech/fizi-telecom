import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Globe, Radio, ToggleRight as SwitchIcon, Server,
  Camera, Laptop, Filter, ArrowRight, Package
} from 'lucide-react';
import '../styles/Services.css';
import '../styles/Products.css';

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
  'Networking Equipment': Globe,
  'Infrastructure': SwitchIcon,
  'Security': Camera,
  'Computing Hardware': Laptop,
  'Smart Devices': Server,
};

const featured = [
  { icon: Globe, title: 'Enterprise Routers', desc: 'High-performance enterprise-grade routers with advanced security and networking capabilities.', color: '#0057D9' },
  { icon: Radio, title: 'WiFi Systems & Access Points', desc: 'Mesh WiFi systems and professional-grade wireless infrastructure for enterprise environments.', color: '#7C3AED' },
  { icon: SwitchIcon, title: 'Network Switches', desc: 'Managed switches, fiber optical equipment, and telecommunications infrastructure components.', color: '#0891B2' },
  { icon: Server, title: 'Servers & Storage', desc: 'Physical servers, storage arrays, NAS systems, and enterprise storage solutions.', color: '#059669' },
  { icon: Camera, title: 'Surveillance Systems', desc: 'IP cameras, thermal cameras, NVRs, and integrated security management systems.', color: '#DC2626' },
  { icon: Laptop, title: 'Computing Hardware', desc: 'Desktop computers, laptops, workstations, and enterprise computing solutions.', color: '#D97706' },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const isDataCenterProduct = (product) => {
    const text = [product.name, product.category, product.description].filter(Boolean).join(' ').toLowerCase();
    return text.includes('data center') || text.includes('data centers');
  };

  useEffect(() => { fetchProducts(); }, [filter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = filter
        ? `http://localhost:5000/api/products?category=${filter}`
        : 'http://localhost:5000/api/products';
      const response = await fetch(url);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data.filter(p => !isDataCenterProduct(p)) : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Networking Equipment', 'Infrastructure', 'Security', 'Computing Hardware', 'Smart Devices'];

  return (
    <div className="page-products">
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="container page-hero__content">
          <motion.span className="section-label section-label--light"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          ><Package size={14} /> Product Catalog</motion.span>
          <motion.h1 className="page-hero__title"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
          >Premium Technology Hardware</motion.h1>
          <motion.p className="page-hero__subtitle"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          >Enterprise-grade equipment and hardware solutions from leading manufacturers.</motion.p>
        </div>
      </section>

      <div className="container section-padding">
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

        {loading ? (
          <div className="loading-state"><div className="loading-spinner" /> Loading products...</div>
        ) : products.length > 0 ? (
          <div className="products-grid">
            {products.map((product, i) => {
              const IconComp = iconMap[product.category] || Package;
              return (
                <FadeIn key={product._id || product.id || i} delay={i * 0.04}>
                  <div className="product-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div className="product-card__icon"><IconComp size={22} /></div>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-gray)', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>{product.category}</span>
                    </div>
                    <h3 className="product-card__title">{product.name}</h3>
                    <p className="product-card__desc">{product.description}</p>
                    <div className="product-card__footer">
                      {product.price && <span className="product-card__price">${product.price} {product.currency}</span>}
                      {product.availability && <span className="product-card__status">{product.availability}</span>}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">No products found. Check back soon!</div>
        )}

        <FadeIn>
          <div className="section-header" style={{ marginTop: 80 }}>
            <span className="section-label">Featured</span>
            <h2 className="section-title">Core Product Lines</h2>
          </div>
        </FadeIn>
        <div className="featured-grid">
          {featured.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.06}>
              <div className="service-card">
                <div className="service-card__icon" style={{ background: `${s.color}12`, color: s.color }}>
                  <s.icon size={24} />
                </div>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__desc">{s.desc}</p>
                <Link to="/contact" className="service-card__link">Inquire <ArrowRight size={14} /></Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
