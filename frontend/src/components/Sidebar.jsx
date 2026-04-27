import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/intake', label: 'Project Intake', icon: 'add_task' },
  { path: '/dashboard', label: 'Live Agents', icon: 'smart_toy' },
  { path: '/artifacts', label: 'Artifact Hub', icon: 'folder_open' },
  { path: '/architect', label: 'Architect Agent', icon: 'architecture' },
  { path: '/qaqc', label: 'QA/QC Agent', icon: 'fact_check' },
  { path: '/devops', label: 'DevOps Agent', icon: 'terminal' },
  { path: '/tracking', label: 'Taskmaster (Roadmap)', icon: 'account_tree' },
];

const bottomItems = [
  { path: '#', label: 'API Docs', icon: 'api' },
  { path: '#', label: 'Support', icon: 'contact_support' },
];

export default function Sidebar() {
  const linkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    borderRadius: 'var(--radius-default)',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderLeft: isActive ? '4px solid var(--primary-container)' : '4px solid transparent',
    background: isActive ? 'var(--surface-container-lowest)' : 'transparent',
    color: isActive ? 'var(--primary-container)' : 'var(--on-surface-variant)',
    textDecoration: 'none',
  });

  return (
    <nav style={{
      background: 'var(--surface-container-low)',
      width: '256px',
      position: 'fixed',
      left: 0,
      top: '56px',
      height: 'calc(100vh - 56px)',
      borderRight: '1px solid var(--outline-variant)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 0',
      zIndex: 40,
      overflowY: 'auto',
    }}>
      {/* Platform Info */}
      <div style={{ padding: '0 16px 16px', marginBottom: '16px', borderBottom: '1px solid var(--outline-variant)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-default)',
          background: 'var(--primary-container)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--on-primary)', fontSize: '18px' }}>hub</span>
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary-container)' }}>Automation Platform</div>
          <div style={{ fontSize: '10px', color: 'var(--on-surface-variant)' }}>V1.2.4-stable</div>
        </div>
      </div>

      {/* Main Nav */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 8px' }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => linkStyle(isActive)}
          >
            {({ isActive }) => (
              <>
                <span className={`material-symbols-outlined ${isActive ? 'icon-fill' : ''}`} style={{ fontSize: '20px' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={{ padding: '16px 8px 0', borderTop: '1px solid var(--outline-variant)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {bottomItems.map(item => (
          <a
            key={item.label}
            href={item.path}
            style={linkStyle(false)}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-container-highest)'; e.currentTarget.style.color = 'var(--on-surface)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--on-surface-variant)'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}

        <div style={{ padding: '12px 4px 8px' }}>
          <button style={{
            width: '100%',
            height: '32px',
            background: 'var(--surface-container-lowest)',
            border: '1px solid var(--outline)',
            borderRadius: 'var(--radius-default)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--on-surface)',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-container-highest)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-container-lowest)'}
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    </nav>
  );
}
