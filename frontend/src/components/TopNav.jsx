import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{
      background: 'var(--surface-container-lowest)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '56px',
      padding: '0 24px',
      width: '100%',
      position: 'fixed',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid var(--outline-variant)',
    }}>
      {/* Left: Brand + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--primary-container)', fontSize: '24px' }}>hub</span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>Nexus SDLC</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--surface-container-low)',
          border: '1px solid var(--outline-variant)',
          borderRadius: 'var(--radius-default)',
          padding: '4px 12px',
          marginLeft: '16px',
          width: '280px',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--outline)', marginRight: '8px' }}>search</span>
          <input
            type="text"
            placeholder="Search projects, agents, tasks..."
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '14px',
              color: 'var(--on-surface)',
              width: '100%',
            }}
          />
        </div>
      </div>

      {/* Right: Actions + User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button className="btn btn-primary" style={{ height: '32px', fontSize: '12px' }} onClick={() => navigate('/intake')}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
          Create Project
        </button>
        <div style={{ width: '1px', height: '20px', background: 'var(--outline-variant)', margin: '0 8px' }} />
        {['notifications', 'help', 'settings'].map(icon => (
          <button key={icon} style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--on-surface-variant)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-container)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{icon}</span>
          </button>
        ))}
        {/* User Avatar Dropdown */}
        <div style={{ position: 'relative', marginLeft: '8px' }}>
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--primary-container)',
              color: 'var(--on-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              border: '2px solid var(--outline-variant)',
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </button>
        </div>
      </div>
    </header>
  );
}
