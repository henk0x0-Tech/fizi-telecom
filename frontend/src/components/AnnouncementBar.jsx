import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Tag, Zap, Star } from 'lucide-react';
import './AnnouncementBar.css';

/* Offer items that scroll across the bar */
const OFFERS = [
  { icon: Tag,  label: 'SPECIAL OFFER',  text: 'HP Spectre x360 — Starting at',  price: '$1,199',   tag: 'Save 14%',  link: '/products' },
  { icon: Zap,  label: 'FLASH SALE',     text: 'Dell XPS 15 Now Only',           price: '$1,699',   tag: 'Limited',   link: '/products' },
  { icon: Star, label: 'BEST VALUE',     text: 'Lenovo ThinkPad X1 Carbon from', price: '$1,399',   tag: 'In Stock',  link: '/products' },
  { icon: Tag,  label: 'DEAL',           text: 'HP LaserJet Pro MFP — Just',     price: '$399',     tag: 'Save $51',  link: '/products' },
  { icon: Zap,  label: 'HOT DEAL',       text: 'Fiber Internet Setup from',      price: '$49/mo',   tag: 'New',       link: '/services' },
  { icon: Star, label: 'OFFER',          text: 'CCTV Installation Package from', price: '$120',     tag: 'Popular',   link: '/services' },
  { icon: Tag,  label: 'PROMO',          text: 'Dell OptiPlex 7000 Micro at',    price: '$749',     tag: 'Save 6%',   link: '/products' },
  { icon: Zap,  label: 'SALE',           text: 'ASUS ROG Zephyrus G14 from',     price: '$1,299',   tag: 'Gaming',    link: '/products' },
];

function OfferChip({ offer }) {
  const Icon = offer.icon;
  return (
    <Link to={offer.link} className="ann-chip" aria-label={`${offer.label}: ${offer.text} ${offer.price}`}>
      <span className="ann-chip__label">
        <Icon size={11} aria-hidden="true" />
        {offer.label}
      </span>
      <span className="ann-chip__text">{offer.text}</span>
      <span className="ann-chip__price">{offer.price}</span>
      <span className="ann-chip__tag">{offer.tag}</span>
    </Link>
  );
}

/* Separator dot between items */
function Dot() {
  return <span className="ann-sep" aria-hidden="true">✦</span>;
}

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  // Duplicate items enough times to fill wide screens seamlessly
  const repeated = [...OFFERS, ...OFFERS, ...OFFERS];

  return (
    <div className="ann-bar" role="marquee" aria-label="Special offers announcement">
      {/* Left glow fade */}
      <div className="ann-bar__fade ann-bar__fade--left" aria-hidden="true" />

      {/* Scrolling track */}
      <div className="ann-bar__track-wrap">
        <div className="ann-bar__track">
          {repeated.map((offer, i) => (
            <span key={i} className="ann-bar__item">
              <OfferChip offer={offer} />
              <Dot />
            </span>
          ))}
        </div>
      </div>

      {/* Right glow fade */}
      <div className="ann-bar__fade ann-bar__fade--right" aria-hidden="true" />

      {/* Dismiss button */}
      <button
        className="ann-bar__close"
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement bar"
      >
        <X size={13} />
      </button>
    </div>
  );
}
