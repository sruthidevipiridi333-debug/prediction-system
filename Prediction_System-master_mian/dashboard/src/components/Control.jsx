import React, { useState } from 'react';

function Toggle({ label, initial = true, color = '#10b981' }) {
  const [on, setOn] = useState(initial);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
      <button
        onClick={() => setOn(!on)}
        style={{
          width: 52,
          height: 26,
          borderRadius: 13,
          border: 'none',
          background: on ? color : '#e2e8f0',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        <span style={{
          position: 'absolute',
          top: 3,
          left: on ? 26 : 3,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.2s',
        }} />
        <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', fontSize: 9, fontWeight: 700, color: on ? '#fff' : '#94a3b8', left: on ? 6 : 'auto', right: on ? 'auto' : 6 }}>
          {on ? 'ON' : 'OFF'}
        </span>
      </button>
    </div>
  );
}

export default function Control({ data }) {
  const [cmdLog, setCmdLog] = useState([]);

  function sendCommand(cmd) {
    const entry = `[${new Date().toLocaleTimeString()}] ${cmd}`;
    setCmdLog(prev => [entry, ...prev].slice(0, 8));
  }

  const devices = [
    { id: 'Node-021', location: 'Zone A', status: 'online' },
    { id: 'Node-105', location: 'Zone B', status: data.nodes?.['Node-105']?.status || 'offline' },
    { id: 'Node-342', location: 'Zone C', status: 'online' },
  ];

  return (
    <div>
      <h2 className="page-heading">Control Panel</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <div className="card">
          <div className="card-title">Device List</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Device ID</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map(d => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600 }}>{d.id}</td>
                  <td>{d.location}</td>
                  <td>
                    <span className="status-dot" style={{ background: d.status === 'online' ? '#10b981' : '#ef4444' }} />
                    <span style={{ textTransform: 'capitalize' }}>{d.status}</span>
                  </td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => sendCommand(`Update sent to ${d.id}`)}>Update</button>
                    <button className="btn btn-sm" style={{ background: '#fef3c7', color: '#d97706', border: 'none' }} onClick={() => sendCommand(`Restart triggered: ${d.id}`)}>Restart</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => sendCommand(`Configure: ${d.id}`)}>Configure</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {cmdLog.length > 0 && (
            <div style={{ marginTop: 16, background: '#0f172a', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Command Log</div>
              {cmdLog.map((c, i) => (
                <div key={i} style={{ fontSize: 12, color: '#10b981', fontFamily: 'monospace', lineHeight: 1.8 }}>› {c}</div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-title">Automated Rules</div>
            <Toggle label="Load Balancing" initial={true} color="#10b981" />
            <Toggle label="Peak Hours Optimization" initial={true} color="#10b981" />
            <Toggle label="Backup Power" initial={false} color="#f59e0b" />
            <Toggle label="Demand Response" initial={true} color="#3b82f6" />
          </div>

          <div className="card">
            <div className="card-title">Quick Commands</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Emergency Shutdown – Zone A', color: '#ef4444' },
                { label: 'Enable All Backup Systems', color: '#f59e0b' },
                { label: 'Reset All Alerts', color: '#10b981' },
                { label: 'Force Synchronize All Nodes', color: '#3b82f6' },
              ].map((c, i) => (
                <button
                  key={i}
                  className="btn"
                  style={{ background: c.color + '15', color: c.color, border: `1px solid ${c.color}30`, textAlign: 'left', padding: '9px 12px' }}
                  onClick={() => sendCommand(c.label)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Firmware</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>
              Current Version: <strong>v1.2.3</strong>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => sendCommand('Firmware upload initiated')}>
              Upload New Firmware
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
