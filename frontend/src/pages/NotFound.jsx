import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: 'clamp(4rem, 10vw, 8rem)',
        fontWeight: 800,
        background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '16px',
        lineHeight: 1
      }}>404</h1>
      
      <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-dark)' }}>
        Page Not Found
      </h2>
      
      <p style={{ color: 'var(--text-gray)', maxWidth: '500px', marginBottom: '32px', lineHeight: 1.6 }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          onClick={() => window.history.back()}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: 'var(--radius-full)',
            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            color: 'var(--text-body)', fontWeight: 600,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--glass-bg)'}
        >
          <ArrowLeft size={18} /> Go Back
        </button>
        
        <Link 
          to="/"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
            color: 'white', fontWeight: 600,
            boxShadow: '0 4px 14px rgba(0,87,217,0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Home size={18} /> Return Home
        </Link>
      </div>
    </div>
  );
}
