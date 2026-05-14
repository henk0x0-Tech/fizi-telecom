import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Laptop, Monitor, Printer, Keyboard, Filter, ArrowRight, Package
} from 'lucide-react';
import SEO from '../components/SEO';
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
  'Laptops': Laptop,
  'Desktops': Monitor,
  'Printers': Printer,
  'Desktop Accessories': Keyboard,
};

const featured = [
  { icon: Laptop, title: 'Premium Laptops', desc: 'High-performance laptops from top brands like Apple, Dell, and Lenovo.', color: '#0057D9' },
  { icon: Monitor, title: 'Workstation Desktops', desc: 'Powerful desktop computers and all-in-ones for intensive workloads.', color: '#7C3AED' },
  { icon: Printer, title: 'Enterprise Printers', desc: 'Reliable laser and inkjet printers for high-volume office environments.', color: '#0891B2' },
  { icon: Keyboard, title: 'Ergonomic Accessories', desc: 'Premium keyboards, mice, and monitors to maximize productivity.', color: '#059669' },
];

import { defaultProducts } from '../fallbackData';

const categoryImages = {
  'Laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop',
  'Desktops': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop',
  'Printers': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=800&auto=format&fit=crop',
  'Desktop Accessories': 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop',
};

const productNameImages = {
  'Dell UltraSharp 27" Monitor': 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?q=80&w=800&auto=format&fit=crop',
  'Keychron Q1 Pro Keyboard': 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&auto=format&fit=crop',
  'APC Back-UPS Pro 1500VA': 'https://images.unsplash.com/photo-1580828343064-fde4cad202d0?q=80&w=800&auto=format&fit=crop',
  'Sony WH-1000XM5 Headphones': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop',
  'Logitech MX Master 3S': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop',
};

const defaultProductImage = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const [brandFilter, setBrandFilter] = useState('');

  const isDataCenterProduct = (product) => {
    const text = [product.name, product.category, product.description].filter(Boolean).join(' ').toLowerCase();
    return text.includes('data center') || text.includes('data centers');
  };

  useEffect(() => { 
    setBrandFilter(''); // Reset brand filter when category changes
    fetchProducts(); 
  }, [filter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = filter
        ? `http://localhost:5000/api/products?category=${filter}`
        : 'http://localhost:5000/api/products';
      const response = await fetch(url);
      const data = await response.json();
      
      // If DB has old data, fallback to new defaultProducts
      let finalData = Array.isArray(data) ? data : [];
      if (finalData.length > 0 && !['Laptops', 'Desktops', 'Printers', 'Desktop Accessories'].includes(finalData[0].category)) {
        finalData = filter ? defaultProducts.filter(p => p.category === filter) : defaultProducts;
      }

      setProducts(finalData.filter(p => !isDataCenterProduct(p)));
    } catch (error) {
      console.error('Error fetching products, using fallback data:', error);
      setProducts(filter ? defaultProducts.filter(p => p.category === filter && !isDataCenterProduct(p)) : defaultProducts.filter(p => !isDataCenterProduct(p)));
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Laptops', 'Desktops', 'Printers', 'Desktop Accessories'];
  
  // Extract unique brands for the current category
  const availableBrands = filter && filter !== 'All' 
    ? [...new Set(defaultProducts.filter(p => p.category === filter).map(p => p.brand))].filter(Boolean)
    : [];

  const displayedProducts = brandFilter 
    ? products.filter(p => p.brand === brandFilter)
    : products;

  return (
    <div className="page-products">
      <SEO
        title="Premium Technology Hardware & IT Products"
        description="Shop Fizi Telecom's premium hardware catalog: laptops, desktops, monitors, keyboards, UPS systems, wireless headphones, and networking accessories. Quality technology products delivered in Fizi, DRC."
        canonical="/products"
      />
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
          <div className="filter-bar" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
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
            
            {availableBrands.length > 0 && (
              <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '24px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="filter-bar__label" style={{ minWidth: '140px', color: '#00BFFF' }}>Filter by Brand</div>
                <div className="filter-bar__chips">
                  <button 
                    className={`filter-chip ${brandFilter === '' ? 'filter-chip--active' : ''}`}
                    onClick={() => setBrandFilter('')}
                  >All Brands</button>
                  {availableBrands.map(brand => (
                    <button key={brand}
                      className={`filter-chip ${brandFilter === brand ? 'filter-chip--active' : ''}`}
                      onClick={() => setBrandFilter(brand)}
                    >{brand}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {loading ? (
          <div className="loading-state"><div className="loading-spinner" /> Loading products...</div>
        ) : displayedProducts.length > 0 ? (
          <div className="products-grid">
            {displayedProducts.map((product, i) => {
              const IconComp = iconMap[product.category] || Package;
              const imgUrl = product.image || productNameImages[product.name] || categoryImages[product.category] || defaultProductImage;
              return (
                <FadeIn key={product._id || product.id || i} delay={i * 0.04}>
                  <div className="product-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '180px', backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,25,47,0.9), transparent)' }} />
                      <div style={{ position: 'absolute', bottom: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="product-card__icon" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}><IconComp size={20} /></div>
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fff', background: 'rgba(0,191,255,0.2)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(0,191,255,0.3)' }}>{product.category}</span>
                      </div>
                    </div>
                    <div style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 className="product-card__title">{product.name}</h3>
                        {product.brand && (
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-cyan)', background: 'rgba(0, 191, 255, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>{product.brand}</span>
                        )}
                      </div>
                      <p className="product-card__desc">{product.description}</p>
                      <div className="product-card__footer">
                        {product.price && <span className="product-card__price">${product.price} {product.currency}</span>}
                        {product.availability && <span className="product-card__status">{product.availability}</span>}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">No products found for this selection. Try changing the filters.</div>
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
