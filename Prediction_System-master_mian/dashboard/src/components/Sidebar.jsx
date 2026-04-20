import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/overview',  icon: '⊞', label: 'Overview' },
  { to: '/realtime',  icon: '◎', label: 'Real-Time Monitoring' },
  { to: '/analytics', icon: '▣', label: 'Analytics' },
  { to: '/devices',   icon: '⊡', label: 'Device Management' },
  { to: '/control',   icon: '⊕', label: 'Control' },
  { to: '/reports',   icon: '≡', label: 'Reports' },
];

export default function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>⚡</div>
        <div>
          <div style={styles.logoName}>Ecovolt</div>
          <div style={styles.logoTagline}>Power where it matters</div>
        </div>
      </div>

      <nav style={styles.nav}>
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              ...styles.navItem,
              background: isActive ? 'rgba(59,130,246,0.2)' : 'transparent',
              color: isActive ? '#60a5fa' : '#94a3b8',
              borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
            })}
          >
            <span style={styles.navIcon}>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 220,
    minWidth: 220,
    background: '#1a2332',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '20px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    flexShrink: 0,
  },
  logoName: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 1.2,
  },
  logoTagline: {
    color: '#64748b',
    fontSize: 10,
    lineHeight: 1.4,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 0',
    gap: 2,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    fontSize: 13,
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.15s',
    borderRadius: '0 6px 6px 0',
    marginRight: 8,
  },
  navIcon: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
};
