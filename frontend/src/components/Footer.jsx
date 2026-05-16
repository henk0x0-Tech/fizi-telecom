import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.webp';
import '../styles/Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappLink = 'https://wa.me/243976359001';

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Products', path: '/products' },
    { label: 'Contact', path: '/contact' },
  ];

  const serviceLinks = [
    'Fiber Internet (FTTH)',
    'Enterprise Networking',
    'CCTV & Surveillance',
    'Managed IT Services',
  ];

  return (
    <footer className="footer">
      <div className="footer__gradient-line" />
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <img className="footer__logo-img" src={logo} alt="Fizi Telecom" />
            </div>
            <p className="footer__tagline">
              Connecting Communities. Empowering Businesses. Building Tomorrow.
            </p>
            <p className="footer__desc">
              Advanced technology and infrastructure solutions for the digital age.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Quick Links</h4>
            <ul className="footer__links">
              {quickLinks.map(link => (
                <li key={link.path}><Link to={link.path}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer__col">
            <h4 className="footer__col-title">Services</h4>
            <ul className="footer__links">
              {serviceLinks.map(s => (
                <li key={s}><Link to="/services">{s}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">Contact</h4>
            <div className="footer__contact-list">
              <div className="footer__contact-item">
                <Phone size={14} />
                <span>0976359001</span>
              </div>
              <div className="footer__contact-item">
                <Mail size={14} />
                <span>tersatelinfo@gmail.com</span>
              </div>
              <div className="footer__contact-item">
                <MapPin size={14} />
                <span>Baraka Fizi, Av ibase No 38</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="footer__newsletter">
              <h4 className="footer__col-title" style={{ marginTop: 24 }}>Newsletter</h4>
              <form className="footer__newsletter-form" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="Enter your email" aria-label="Newsletter email" />
                <button type="submit" aria-label="Subscribe"><ArrowRight size={16} /></button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p>&copy; {currentYear} Fizi Telecom. All rights reserved.</p>
          <p className="footer__bottom-tagline">Advanced Technology & Infrastructure Solutions</p>
        </div>
      </div>
    </footer>
  );
}
