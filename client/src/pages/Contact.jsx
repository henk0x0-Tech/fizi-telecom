import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Phone, Mail, MapPin, Clock, MessageCircle,
  Send, User, Building, FileText, ArrowRight
} from 'lucide-react';
import '../styles/Services.css';
import '../styles/Contact.css';

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

export default function Contact() {
  const whatsappNumber = '+243 976359001';
  const whatsappLink = 'https://wa.me/243976359001';

  const initialFormData = { name: '', email: '', phone: '', company: '', subject: '', message: '', inquiryType: 'Service Inquiry' };
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to submit form');
      setSubmitted(true);
      setFormData(initialFormData);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: '0976359001', color: '#0057D9' },
    { icon: MessageCircle, label: 'WhatsApp', value: whatsappNumber, link: whatsappLink, color: '#22C55E' },
    { icon: Mail, label: 'Email', value: 'tersatelinfo@gmail.com', link: 'mailto:tersatelinfo@gmail.com', color: '#D97706' },
    { icon: MapPin, label: 'Address', value: 'Baraka Fizi, Av ibase No 38', color: '#7C3AED' },
  ];

  return (
    <div className="page-contact">
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="container page-hero__content">
          <motion.span className="section-label section-label--light"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          ><Mail size={14} /> Contact Us</motion.span>
          <motion.h1 className="page-hero__title"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
          >Get in Touch</motion.h1>
          <motion.p className="page-hero__subtitle"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          >Have a question or need a custom solution? We'd love to hear from you.</motion.p>
        </div>
      </section>

      <div className="container section-padding">
        <div className="contact-layout">
          {/* Form */}
          <FadeIn>
            <div className="contact-form-card">
              <h2 className="contact-form-card__title">Send us a Message</h2>
              <p className="contact-form-card__subtitle">Fill out the form and our team will respond within 24 hours.</p>

              {submitted && (
                <motion.div className="form-alert form-alert--success"
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                >✓ Message sent successfully! We'll be in touch soon.</motion.div>
              )}
              {error && (
                <motion.div className="form-alert form-alert--error"
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                >✗ {error}</motion.div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name"><User size={14} /> Full Name *</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email"><Mail size={14} /> Email *</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@company.com" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone"><Phone size={14} /> Phone</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company"><Building size={14} /> Company</label>
                    <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} placeholder="Your company" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="inquiryType"><FileText size={14} /> Inquiry Type *</label>
                    <select id="inquiryType" name="inquiryType" value={formData.inquiryType} onChange={handleChange} required>
                      <option value="Service Inquiry">Service Inquiry</option>
                      <option value="Product Information">Product Information</option>
                      <option value="Consultation">Consultation</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Support">Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject"><FileText size={14} /> Subject *</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="How can we help?" />
                  </div>
                </div>
                <div className="form-group form-group--full">
                  <label htmlFor="message"><MessageCircle size={14} /> Message *</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder="Tell us about your project..." rows={5}></textarea>
                </div>
                <div className="form-actions">
                  <button type="submit" className="form-submit" disabled={loading}>
                    {loading ? 'Sending...' : (<><Send size={16} /> Send Message</>)}
                  </button>
                  <button type="button" className="form-clear" onClick={() => setFormData(initialFormData)}>Clear</button>
                </div>
              </form>
            </div>
          </FadeIn>

          {/* Sidebar */}
          <div className="contact-sidebar">
            <FadeIn delay={0.1}>
              <div className="contact-info-card">
                <h3 className="contact-info-card__title">Contact Information</h3>
                <div className="contact-info-list">
                  {contactInfo.map(info => (
                    <div key={info.label} className="contact-info-item">
                      <div className="contact-info-item__icon" style={{ background: `${info.color}12`, color: info.color }}>
                        <info.icon size={18} />
                      </div>
                      <div>
                        <div className="contact-info-item__label">{info.label}</div>
                        {info.link ? (
                          <a href={info.link} target="_blank" rel="noopener noreferrer" className="contact-info-item__value contact-info-item__value--link">{info.value}</a>
                        ) : (
                          <div className="contact-info-item__value">{info.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="contact-info-card">
                <h3 className="contact-info-card__title"><Clock size={18} /> Business Hours</h3>
                <div className="hours-list">
                  <div className="hours-item"><span>Monday – Friday</span><span>8:00 AM – 6:00 PM</span></div>
                  <div className="hours-item"><span>Saturday</span><span>9:00 AM – 2:00 PM</span></div>
                  <div className="hours-item hours-item--highlight"><span>Emergency Support</span><span>24/7</span></div>
                </div>
                <div className="response-times">
                  <div className="response-item"><span className="response-dot response-dot--green" /> Standard: 24 hours</div>
                  <div className="response-item"><span className="response-dot response-dot--yellow" /> Urgent: 2 hours</div>
                  <div className="response-item"><span className="response-dot response-dot--red" /> Emergency: 30 min</div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div className="contact-info-card">
                <h3 className="contact-info-card__title"><User size={18} /> Key Partners</h3>
                <div className="hours-list">
                  <div className="hours-item" style={{ padding: '12px 0' }}>
                    <span style={{ fontWeight: 600 }}>Leon Mutambala</span>
                    <a href="tel:+46700749806" style={{ color: 'var(--text-gray)', textDecoration: 'none' }}>+46 700749806</a>
                  </div>
                  <div className="hours-item" style={{ padding: '12px 0' }}>
                    <span style={{ fontWeight: 600 }}>M. Ramazani</span>
                    <a href="tel:+23672475485" style={{ color: 'var(--text-gray)', textDecoration: 'none' }}>+236 72475485</a>
                  </div>
                  <div className="hours-item" style={{ padding: '12px 0' }}>
                    <span style={{ fontWeight: 600 }}>Thierry</span>
                    <a href="tel:+243976359001" style={{ color: 'var(--text-gray)', textDecoration: 'none' }}>+243 976359001</a>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="whatsapp-cta">
                <MessageCircle size={22} />
                <div>
                  <div className="whatsapp-cta__title">Chat on WhatsApp</div>
                  <div className="whatsapp-cta__number">{whatsappNumber}</div>
                </div>
                <ArrowRight size={18} />
              </a>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
