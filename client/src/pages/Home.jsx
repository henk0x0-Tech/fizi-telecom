import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Wifi, Shield, Cloud, Camera, Server, Cpu,
  Headphones, Radio, ArrowRight, CheckCircle2,
  Globe, Building2, Lock, Database, Home as HomeIcon,
  Star, ChevronRight, Zap, TrendingUp, Users, Clock,
  ToggleLeft, ToggleRight, Sparkles, Activity, User
} from 'lucide-react';
import heroBg from '../assets/hero-bg.jpeg';
import '../styles/Home.css';

/* ── Fade-in wrapper ── */
function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Animated Counter ── */
function Counter({ end, suffix = '', prefix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(end / (duration * 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ── Network Background Canvas ── */
function NetworkCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    const createParticles = () => {
      particles = [];
      const count = Math.min(70, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 10000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 2 + 0.8,
        });
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 191, 255, ${0.1 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 191, 255, 0.3)';
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw);
    };
    resize(); createParticles(); draw();
    window.addEventListener('resize', () => { resize(); createParticles(); });
    return () => { cancelAnimationFrame(animationId); };
  }, []);
  return <canvas ref={canvasRef} className="hero__canvas" />;
}

/* ── Data ── */
const services = [
  { icon: Wifi, title: 'Fiber Internet (FTTH)', desc: 'Ultra-fast fiber-optic connectivity with symmetric gigabit speeds and guaranteed bandwidth for homes and businesses.', color: '#0057D9', gradient: 'linear-gradient(135deg, #0057D9, #3b82f6)' },
  { icon: Radio, title: 'Wireless Connectivity', desc: 'Point-to-point and WISP solutions providing coverage in underserved and remote areas with carrier-grade reliability.', color: '#0D9488', gradient: 'linear-gradient(135deg, #0D9488, #5eead4)' },
  { icon: Building2, title: 'Enterprise Networking', desc: 'Custom-designed network architectures including SD-WAN, MPLS, and multi-site connectivity for large organizations.', color: '#7C3AED', gradient: 'linear-gradient(135deg, #7C3AED, #a78bfa)' },
  { icon: Headphones, title: 'Managed IT Services', desc: 'Proactive monitoring, help desk support, patch management, and complete IT operations outsourcing.', color: '#9333EA', gradient: 'linear-gradient(135deg, #9333EA, #c084fc)' },
  { icon: Camera, title: 'CCTV & Surveillance', desc: 'Professional IP surveillance networks with AI-powered analytics, cloud-based monitoring, and thermal imaging.', color: '#059669', gradient: 'linear-gradient(135deg, #059669, #34d399)' },
  { icon: Cpu, title: 'Smart Automation', desc: 'IoT integration, smart building systems, intelligent automation, and connected device ecosystems.', color: '#D97706', gradient: 'linear-gradient(135deg, #D97706, #fbbf24)' },
];

const stats = [
  { value: 99.99, suffix: '%', label: 'Network Uptime', icon: TrendingUp, desc: 'Redundant infrastructure' },
  { value: 50, suffix: '+', label: 'Enterprise Clients', icon: Users, desc: 'Across all sectors' },
  { value: 24, suffix: '/7', label: 'Expert Support', icon: Clock, desc: 'Always available' },
  { value: 3, suffix: '+', label: 'Years Experience', icon: Zap, desc: 'Proven track record' },
];

const solutions = [
  { icon: Building2, title: 'Business Connectivity', desc: 'Enterprise-grade connectivity solutions with dedicated fiber links, SD-WAN orchestration, and multi-site networking for mission-critical operations.', features: ['Dedicated Fiber', 'SD-WAN', 'Multi-Site VPN', 'QoS Management'] },
  { icon: HomeIcon, title: 'Smart Home Integration', desc: 'Seamless home automation platforms connecting lighting, security, climate, entertainment, and energy management into a unified ecosystem.', features: ['Home Automation', 'Smart Security', 'Voice Control', 'Energy Management'] },
  { icon: Globe, title: 'Smart City Infrastructure', desc: 'End-to-end smart city deployments integrating IoT sensors, intelligent traffic management, environmental monitoring, and connected public services.', features: ['IoT Sensor Networks', 'Traffic Management', 'Environmental Monitoring', 'Public Wi-Fi'] },
];

const testimonials = [
  { name: 'Marcel Kabongo', role: 'CTO, East Africa Digital', quote: 'Fizi Telecom transformed our entire network infrastructure. The uptime and speed improvements have been remarkable for our business operations.', rating: 5 },
  { name: 'Sarah Mutoni', role: 'Director, Lakeside Hospitality Group', quote: 'Their CCTV and surveillance solutions gave us complete peace of mind. The advanced monitoring and rapid response times are exactly what we needed.', rating: 5 },
  { name: 'Jean-Pierre Amani', role: 'CEO, Amani Industries', quote: 'From fiber installation to managed services, Fizi Telecom has been our single trusted partner for all technology needs. Exceptional quality.', rating: 5 },
];

const plans = [
  { name: 'Starter', price: 49, desc: 'Perfect for small businesses', features: ['50 Mbps Fiber Internet', 'Basic Firewall', 'Email Support', 'Standard SLA', '1 Static IP'], popular: false },
  { name: 'Business', price: 149, desc: 'For growing companies', features: ['500 Mbps Fiber Internet', 'Advanced Security Suite', '24/7 Priority Support', 'Enterprise SLA', '5 Static IPs', 'Cloud Backup 1TB', 'SD-WAN Ready'], popular: true },
  { name: 'Enterprise', price: null, desc: 'Custom enterprise solutions', features: ['Dedicated Fiber (1Gbps+)', 'Full SOC & SIEM', 'Dedicated Account Manager', '99.99% SLA', 'Unlimited Static IPs', 'Multi-Site Networking', 'Custom Integrations'], popular: false },
];

export default function Home() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div className="home-page">

      {/* ═══ HERO ═══ */}
      <section className="hero" id="hero">
        <div className="hero__bg-image" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="hero__bg-overlay" />
        <NetworkCanvas />
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
        <div className="hero__grid-overlay" />

        <div className="hero__content container">
          <motion.div className="hero__badge"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Sparkles size={14} /> Next-Gen Telecom Infrastructure
          </motion.div>

          <motion.h1 className="hero__title"
            initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            Advanced Telecom &<br />
            <span className="hero__title-accent">Infrastructure Solutions</span><br />
            for the Digital Future
          </motion.h1>

          <motion.p className="hero__subtitle"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            Delivering fiber internet, enterprise networking, cybersecurity, cloud solutions,
            and smart infrastructure with unmatched reliability and innovation.
          </motion.p>

          <motion.div className="hero__actions"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/services" className="hero__btn hero__btn--primary">
              Explore Services <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="hero__btn hero__btn--glass">
              Contact Us
            </Link>
          </motion.div>

          {/* Floating Glassmorphism Cards */}
          <div className="hero__metrics">
            <motion.div className="hero__metric-card"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85 }}
            >
              <div className="hero__metric-icon" style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>
                <TrendingUp size={20} />
              </div>
              <div className="hero__metric-info">
                <div className="hero__metric-value">99.99%</div>
                <div className="hero__metric-label">Uptime SLA</div>
              </div>
              <div className="hero__metric-badge">Live</div>
            </motion.div>

            <motion.div className="hero__metric-card"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.0 }}
            >
              <div className="hero__metric-icon" style={{ background: 'rgba(0,191,255,0.12)', color: '#00BFFF' }}>
                <Activity size={20} />
              </div>
              <div className="hero__metric-info">
                <div className="hero__metric-value">10 Gbps</div>
                <div className="hero__metric-label">Backbone Capacity</div>
              </div>
            </motion.div>

            <motion.div className="hero__metric-card"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.15 }}
            >
              <div className="hero__metric-icon" style={{ background: 'rgba(124,58,237,0.12)', color: '#7C3AED' }}>
                <Users size={20} />
              </div>
              <div className="hero__metric-info">
                <div className="hero__metric-value">50+</div>
                <div className="hero__metric-label">Enterprise Clients</div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="hero__scroll-cue">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}>
            <ChevronRight size={20} style={{ transform: 'rotate(90deg)' }} />
          </motion.div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section className="services-section section-padding" id="services">
        <div className="container">
          <FadeIn>
            <div className="section-header section-header--center">
              <span className="section-label">Our Services</span>
              <h2 className="section-title">Comprehensive Technology Solutions</h2>
              <p className="section-subtitle">From high-speed fiber to enterprise security, we deliver end-to-end infrastructure solutions tailored to your needs.</p>
            </div>
          </FadeIn>
          <div className="services-grid">
            {services.map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.05}>
                <div className="svc-card" id={`service-${i}`}>
                  <div className="svc-card__glow" style={{ background: s.gradient }} />
                  <div className="svc-card__icon" style={{ background: `${s.color}0D`, color: s.color }}>
                    <s.icon size={24} strokeWidth={1.8} />
                  </div>
                  <h3 className="svc-card__title">{s.title}</h3>
                  <p className="svc-card__desc">{s.desc}</p>
                  <Link to="/services" className="svc-card__link">
                    Learn more <ArrowRight size={14} />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS / WHY CHOOSE US ═══ */}
      <section className="stats-section" id="why-us">
        <div className="stats-section__bg" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <FadeIn>
            <div className="section-header section-header--center">
              <span className="section-label section-label--light">Why Fizi Telecom</span>
              <h2 className="section-title" style={{ color: 'white' }}>Trusted by Enterprises Across the Region</h2>
              <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.6)', margin: '0 auto' }}>Our commitment to reliability, innovation, and excellence sets us apart.</p>
            </div>
          </FadeIn>

          <div className="stats-grid">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.08}>
                <div className="stat-card">
                  <div className="stat-card__icon"><stat.icon size={24} /></div>
                  <div className="stat-card__value"><Counter end={stat.value} suffix={stat.suffix} /></div>
                  <div className="stat-card__label">{stat.label}</div>
                  <div className="stat-card__desc">{stat.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div className="trust-badges">
              {['Redundant Infrastructure', 'SLA Guaranteed', 'ISO 27001 Certified', 'Scalable Architecture', 'Dedicated Support'].map(f => (
                <div className="trust-badge" key={f}><CheckCircle2 size={15} /><span>{f}</span></div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ SOLUTIONS ═══ */}
      <section className="solutions-section section-padding" id="solutions">
        <div className="container">
          <FadeIn>
            <div className="section-header section-header--center">
              <span className="section-label">Enterprise Solutions</span>
              <h2 className="section-title">Tailored for Every Industry</h2>
              <p className="section-subtitle">We design and deploy solutions that scale with your business.</p>
            </div>
          </FadeIn>
          <div className="solutions-list">
            {solutions.map((sol, i) => (
              <FadeIn key={sol.title} delay={i * 0.06}>
                <div className={`sol-card ${i % 2 !== 0 ? 'sol-card--reverse' : ''}`}>
                  <div className="sol-card__body">
                    <div className="sol-card__icon-wrap"><sol.icon size={26} strokeWidth={1.5} /></div>
                    <h3 className="sol-card__title">{sol.title}</h3>
                    <p className="sol-card__desc">{sol.desc}</p>
                    <div className="sol-card__tags">
                      {sol.features.map(f => (
                        <span key={f} className="sol-card__tag"><CheckCircle2 size={12} /> {f}</span>
                      ))}
                    </div>
                    <Link to="/services" className="sol-card__link">Explore Solution <ArrowRight size={15} /></Link>
                  </div>
                  <div className="sol-card__visual">
                    <div className="sol-card__visual-ring">
                      <sol.icon size={56} strokeWidth={0.8} />
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="testimonials-section section-padding" id="testimonials">
        <div className="container">
          <FadeIn>
            <div className="section-header section-header--center">
              <span className="section-label">Testimonials</span>
              <h2 className="section-title">What Our Clients Say</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>Hear from the businesses that trust Fizi Telecom.</p>
            </div>
          </FadeIn>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.08}>
                <div className="testi-card">
                  <div className="testi-card__stars">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} size={15} fill="#F59E0B" color="#F59E0B" />)}
                  </div>
                  <p className="testi-card__quote">"{t.quote}"</p>
                  <div className="testi-card__author">
                    <div className="testi-card__avatar">{t.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <div className="testi-card__name">{t.name}</div>
                      <div className="testi-card__role">{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="pricing-section section-padding" id="pricing">
        <div className="container">
          <FadeIn>
            <div className="section-header section-header--center">
              <span className="section-label">Pricing</span>
              <h2 className="section-title">Simple, Transparent Pricing</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>All plans include professional installation and setup.</p>
              <div className="pricing-toggle">
                <span className={billingCycle === 'monthly' ? 'pricing-toggle__active' : ''}>Monthly</span>
                <button className="pricing-toggle__switch" onClick={() => setBillingCycle(p => p === 'monthly' ? 'yearly' : 'monthly')} aria-label="Toggle billing">
                  {billingCycle === 'monthly' ? <ToggleLeft size={36} /> : <ToggleRight size={36} />}
                </button>
                <span className={billingCycle === 'yearly' ? 'pricing-toggle__active' : ''}>Yearly <span className="pricing-toggle__save">Save 20%</span></span>
              </div>
            </div>
          </FadeIn>
          <div className="pricing-grid">
            {plans.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.08}>
                <div className={`price-card ${plan.popular ? 'price-card--popular' : ''}`}>
                  {plan.popular && <div className="price-card__badge">Most Popular</div>}
                  <h3 className="price-card__name">{plan.name}</h3>
                  <p className="price-card__desc">{plan.desc}</p>
                  <div className="price-card__price">
                    {plan.price ? (
                      <><span className="price-card__currency">$</span><span className="price-card__amount">{billingCycle === 'yearly' ? Math.round(plan.price * 0.8) : plan.price}</span><span className="price-card__period">/mo</span></>
                    ) : (
                      <span className="price-card__custom">Custom</span>
                    )}
                  </div>
                  <ul className="price-card__features">
                    {plan.features.map(f => <li key={f}><CheckCircle2 size={16} />{f}</li>)}
                  </ul>
                  <Link to="/contact" className={`price-card__cta ${plan.popular ? 'price-card__cta--primary' : ''}`}>
                    {plan.price ? 'Get Started' : 'Contact Sales'}
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PARTNERS ═══ */}
      <section className="partners-section section-padding" style={{ background: 'var(--bg-white)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="container">
          <FadeIn>
            <div className="section-header section-header--center">
              <span className="section-label">Leadership</span>
              <h2 className="section-title">Key Partners</h2>
            </div>
          </FadeIn>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', textAlign: 'center' }}>
            <FadeIn delay={0.1}>
              <div className="stat-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="stat-card__icon" style={{ background: 'rgba(124,58,237,0.1)', color: '#7C3AED', marginBottom: '16px' }}><User size={24} /></div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-main)' }}>Leon Mutambala</h3>
                <a href="tel:+46700749806" style={{ color: 'var(--text-gray)', textDecoration: 'none', fontSize: '1.05rem' }}>+46 700749806</a>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="stat-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="stat-card__icon" style={{ background: 'rgba(0,87,217,0.1)', color: '#0057D9', marginBottom: '16px' }}><User size={24} /></div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-main)' }}>M. Ramazani</h3>
                <a href="tel:+23672475485" style={{ color: 'var(--text-gray)', textDecoration: 'none', fontSize: '1.05rem' }}>+236 72475485</a>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="stat-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="stat-card__icon" style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', marginBottom: '16px' }}><User size={24} /></div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-main)' }}>Thierry</h3>
                <a href="tel:+243976359001" style={{ color: 'var(--text-gray)', textDecoration: 'none', fontSize: '1.05rem' }}>+243 976359001</a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="cta-section">
        <div className="cta-section__bg" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <FadeIn>
            <div className="cta-section__content">
              <h2 className="cta-section__title">Ready to Transform Your Infrastructure?</h2>
              <p className="cta-section__subtitle">Get a free consultation and discover how Fizi Telecom can power your business with enterprise-grade technology solutions.</p>
              <div className="cta-section__actions">
                <Link to="/contact" className="hero__btn hero__btn--primary">Get Free Consultation <ArrowRight size={18} /></Link>
                <a href="https://wa.me/243976359001" target="_blank" rel="noopener noreferrer" className="hero__btn hero__btn--glass">WhatsApp Us</a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
