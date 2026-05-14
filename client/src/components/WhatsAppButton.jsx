import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import '../styles/WhatsAppButton.css';

export default function WhatsAppButton() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="whatsapp-fab">
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="whatsapp-fab__popup"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="whatsapp-fab__popup-header">
              <MessageCircle size={18} />
              <div>
                <div className="whatsapp-fab__popup-title">Fizi Telecom</div>
                <div className="whatsapp-fab__popup-status">● Online now</div>
              </div>
              <button className="whatsapp-fab__close" onClick={() => setExpanded(false)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div className="whatsapp-fab__popup-body">
              <p>Hi there! 👋 How can we help you today?</p>
            </div>
            <a
              href="https://wa.me/243976359001"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-fab__popup-cta"
            >
              Start Chat <MessageCircle size={14} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="whatsapp-fab__btn"
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat with us on WhatsApp"
      >
        {expanded ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
}
