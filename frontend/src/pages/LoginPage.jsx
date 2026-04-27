import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      {/* Top Bar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '56px',
        background: 'var(--surface-container-lowest)',
        borderBottom: '1px solid var(--outline-variant)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--primary-container)', fontSize: '24px' }}>hub</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--on-surface)' }}>Nexus</span>
          </div>
          <nav style={{ display: 'flex', gap: '16px' }}>
            {['Platform', 'Documentation', 'Status'].map(item => (
              <a key={item} href="#" style={{
                fontSize: '14px', color: 'var(--on-surface-variant)',
                padding: '4px 8px', borderRadius: 'var(--radius-default)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-container)'; e.currentTarget.style.color = 'var(--on-surface)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--on-surface-variant)'; }}
              >{item}</a>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="#" style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>Support</a>
          <button className="btn btn-primary" style={{ height: '36px' }}>Request Demo</button>
        </div>
      </header>

      {/* Login Card */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="animate-slide-up" style={{
          width: '100%',
          maxWidth: '420px',
          background: 'var(--surface-container-lowest)',
          border: '1px solid var(--outline-variant)',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px', height: '48px',
              borderRadius: '12px',
              background: 'var(--primary-fixed)',
              marginBottom: '16px',
            }}>
              <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--primary)', fontSize: '28px' }}>hub</span>
            </div>
            <h1 className="text-headline-md" style={{ color: 'var(--on-surface)' }}>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>
              {isSignUp ? 'Get started with Nexus SDLC.' : 'Sign in to continue to Nexus SDLC.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '10px 14px',
              background: 'var(--error-container)',
              color: 'var(--on-error-container)',
              borderRadius: 'var(--radius-lg)',
              fontSize: '13px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isSignUp && (
              <div>
                <label className="text-label-md" style={{ display: 'block', color: 'var(--on-surface)', marginBottom: '4px' }}>Full Name</label>
                <input className="input-field" type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}
            <div>
              <label className="text-label-md" style={{ display: 'block', color: 'var(--on-surface)', marginBottom: '4px' }}>Email or Username</label>
              <input className="input-field" type="text" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="text-label-md" style={{ color: 'var(--on-surface)' }}>Password</label>
                {!isSignUp && <a href="#" className="text-label-md" style={{ color: 'var(--primary)' }}>Forgot password?</a>}
              </div>
              <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{
              width: '100%', height: '40px', marginTop: '8px',
              borderRadius: 'var(--radius-lg)',
              fontSize: '12px',
              opacity: loading ? 0.7 : 1,
            }} disabled={loading}>
              {loading ? (
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: '18px' }}>sync</span>
              ) : (
                isSignUp ? 'Create Account' : 'Login'
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--outline-variant)' }} />
            <span className="text-label-md" style={{ padding: '0 16px', color: 'var(--outline)' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--outline-variant)' }} />
          </div>

          {/* Social Login */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { icon: 'login', label: 'Continue with SSO' },
              { icon: 'code', label: 'Continue with GitHub' },
              { icon: 'public', label: 'Continue with Google' },
            ].map(({ icon, label }) => (
              <button key={label} style={{
                width: '100%', height: '40px',
                border: '1px solid var(--outline-variant)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em',
                color: 'var(--on-surface)',
                background: 'var(--surface-container-lowest)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-container)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-container-lowest)'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Toggle */}
          <p className="text-body-md" style={{ textAlign: 'center', marginTop: '24px', color: 'var(--on-surface-variant)' }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-label-md"
              style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid var(--outline-variant)',
        background: 'var(--surface-container-low)',
        fontSize: '12px',
        color: 'var(--on-surface-variant)',
      }}>
        <div>© 2024 Nexus SDLC Automation. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Privacy Policy', 'Terms of Service', 'Security', 'Status'].map(item => (
            <a key={item} href="#" style={{ color: 'var(--on-surface-variant)', textDecoration: 'underline' }}>{item}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
