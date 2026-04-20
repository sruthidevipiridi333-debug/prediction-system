import React, { useState } from 'react';

const INITIAL_DEVICES = [
  { id: 'Node-021', location: 'Zone A', status: 'online' },
  { id: 'Node-105', location: 'Zone B', status: 'offline' },
  { id: 'Node-342', location: 'Zone C', status: 'online' },
];

export default function DeviceManagement({ data }) {
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [newId, setNewId] = useState('');
  const [newLoc, setNewLoc] = useState('Zone A');
  const [msg, setMsg] = useState('');

  // Sync Node-105 status from live data
  const enriched = devices.map(d => {
    if (d.id === 'Node-105' && data.nodes?.['Node-105']) {
      return { ...d, status: data.nodes['Node-105'].status };
    }
    return d;
  });

  function handleRegister(e) {
    e.preventDefault();
    if (!newId.trim()) return;
    if (devices.find(d => d.id === newId.trim())) {
      setMsg('Device ID already exists.');
      return;
    }
    setDevices(prev => [...prev, { id: newId.trim(), location: newLoc, status: 'online' }]);
    setMsg(`✓ Device "${newId.trim()}" registered successfully.`);
    setNewId('');
    setTimeout(() => setMsg(''), 3000);
  }

  function handleAction(id, action) {
    if (action === 'Restart') {
      setDevices(prev => prev.map(d => d.id === id ? { ...d, status: 'online' } : d));
      setMsg(`✓ ${id} restarted successfully.`);
    } else {
      setMsg(`✓ ${action} triggered for ${id}.`);
    }
    setTimeout(() => setMsg(''), 3000);
  }

  return (
    <div>
      <h2 className="page-heading">Device Management</h2>

      {/* Summary cards */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="metric-card metric-green">
          <div className="label">Online</div>
          <div className="value">{data.devices?.online ?? '--'}</div>
          <div className="sub">Active nodes</div>
        </div>
        <div className="metric-card metric-red">
          <div className="label">Offline</div>
          <div className="value">{data.devices?.offline ?? '--'}</div>
          <div className="sub">Need attention</div>
        </div>
        <div className="metric-card metric-orange">
          <div className="label">Faulty</div>
          <div className="value">{data.devices?.faulty ?? '--'}</div>
          <div className="sub">Require repair</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
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
              {enriched.map(d => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600 }}>{d.id}</td>
                  <td>{d.location}</td>
                  <td>
                    <span className="status-dot" style={{ background: d.status === 'online' ? '#10b981' : '#ef4444' }} />
                    <span style={{ textTransform: 'capitalize' }}>{d.status}</span>
                  </td>
                  <td>
                    {d.status === 'online'
                      ? <button className="btn btn-primary btn-sm" onClick={() => handleAction(d.id, 'Update')}>Update</button>
                      : <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#dc2626', border: 'none' }} onClick={() => handleAction(d.id, 'Restart')}>Restart</button>
                    }
                    {' '}
                    <button className="btn btn-secondary btn-sm" onClick={() => handleAction(d.id, 'Configure')}>Configure</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-title">Add New Device</div>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13 }}
                placeholder="Device ID (e.g. Node-099)"
                value={newId}
                onChange={e => setNewId(e.target.value)}
              />
              <select
                style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13 }}
                value={newLoc}
                onChange={e => setNewLoc(e.target.value)}
              >
                <option>Zone A</option>
                <option>Zone B</option>
                <option>Zone C</option>
              </select>
              <button type="submit" className="btn btn-primary">Register Device</button>
            </form>
            {msg && <p style={{ fontSize: 12, color: '#10b981', marginTop: 8 }}>{msg}</p>}
          </div>

          <div className="card">
            <div className="card-title">Firmware Update</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <span className="status-dot dot-green" />
              <span style={{ fontSize: 13 }}>Current Version: v1.2.3</span>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => setMsg('✓ Firmware upload started...')}
            >
              Upload New Firmware
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
