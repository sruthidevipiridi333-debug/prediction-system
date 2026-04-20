import React from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/overview':  'Overview Dashboard',
  '/realtime':  'Real-Time Monitoring',
  '/analytics': 'Analytics',
  '/devices':   'Device Management',
  '/control':   'Control Panel',
  '/reports':   'Reports',
};

export default function Header({ connected, onLogout }) {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'Ecovolt';

  return (
    <header style={styles.header}>
      <h1 style={styles.title}>{title}</h1>
      <div style={styles.right}>
        <div style={styles.connStatus}>
          <span
            style={{
              ...styles.dot,
              background: connected ? '#10b981' : '#f59e0b',
              boxShadow: connected ? '0 0 6px #10b981' : '0 0 6px #f59e0b',
            }}
          />
          <span style={styles.connText}>
            {connected ? 'AWS IoT Live' : 'Mock Data'}
          </span>
        </div>
        <div style={styles.divider} />
        <span style={styles.user}>Admin</span>
        <button style={styles.logout} onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 24px',
    background: '#fff',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: '#1e2a3a',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  connStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 20,
    padding: '4px 12px',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  connText: {
    fontSize: 12,
    fontWeight: 500,
    color: '#475569',
  },
  divider: {
    width: 1,
    height: 20,
    background: '#e2e8f0',
  },
  user: {
    fontSize: 13,
    fontWeight: 500,
    color: '#475569',
  },
  logout: {
    background: 'none',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    padding: '5px 12px',
    fontSize: 13,
    color: '#475569',
    cursor: 'pointer',
  },
};
