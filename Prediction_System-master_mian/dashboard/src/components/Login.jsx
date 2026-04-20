import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (email === 'admin@ecovolt.com' && password === 'admin123') {
      onLogin();
    } else {
      setError('Invalid credentials. Use admin@ecovolt.com / admin123');
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.overlay} />
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <div style={styles.logoBox}>⚡</div>
          <div>
            <div style={styles.logoName}>Ecovolt</div>
            <div style={styles.logoSub}>Power where it matters</div>
          </div>
        </div>

        <h2 style={styles.heading}>Welcome Back</h2>
        <p style={styles.sub}>Sign in to your dashboard</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="admin@ecovolt.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.btn}>Log In</button>
        </form>

        <p style={styles.hint}>Use: admin@ecovolt.com / admin123</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a2332 0%, #2d4a6e 50%, #1e3a5f 100%)',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 60%),
                      radial-gradient(circle at 80% 20%, rgba(16,185,129,0.1) 0%, transparent 50%)`,
  },
  card: {
    position: 'relative',
    background: '#fff',
    borderRadius: 16,
    padding: '40px 36px',
    width: 400,
    boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 28,
  },
  logoBox: {
    width: 44,
    height: 44,
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    color: '#fff',
  },
  logoName: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1e2a3a',
  },
  logoSub: {
    fontSize: 11,
    color: '#94a3b8',
  },
  heading: {
    fontSize: 22,
    fontWeight: 700,
    textAlign: 'center',
    color: '#1e2a3a',
    marginBottom: 4,
  },
  sub: {
    textAlign: 'center',
    fontSize: 13,
    color: '#64748b',
    marginBottom: 24,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: '#475569',
  },
  input: {
    padding: '10px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  btn: {
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '12px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 4,
    boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
  },
  error: {
    color: '#dc2626',
    fontSize: 12,
    textAlign: 'center',
    background: '#fee2e2',
    borderRadius: 6,
    padding: '8px 12px',
  },
  hint: {
    textAlign: 'center',
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 16,
  },
};
