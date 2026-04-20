import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function ZoneMap({ zones }) {
  const colors = { high: '#ef4444', moderate: '#f59e0b', normal: '#10b981' };
  const labels = { high: 'High Demand', moderate: 'Moderate', normal: 'Normal' };
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {['zoneA', 'zoneB', 'zoneC'].map((z, i) => (
        <div
          key={z}
          style={{
            flex: 1,
            minWidth: 80,
            padding: '16px 12px',
            borderRadius: 8,
            background: colors[zones[z]] + '22',
            border: `2px solid ${colors[zones[z]]}`,
            textAlign: 'center',
          }}
        >
          <div style={{ fontWeight: 700, color: colors[zones[z]], fontSize: 15 }}>
            Zone {['A','B','C'][i]}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{labels[zones[z]]}</div>
        </div>
      ))}
    </div>
  );
}

export default function Overview({ data, history }) {
  const alertCount = data.alerts?.length || 0;
  const chartData = history.slice(-15);

  return (
    <div>
      <h2 className="page-heading">Overview</h2>

      {/* Metric cards */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="metric-card metric-green">
          <div className="label">Total Consumption</div>
          <div className="value">{data.power?.total ?? '--'} <span style={{ fontSize: 18 }}>MW</span></div>
          <div className="sub">Current load across all zones</div>
        </div>
        <div className="metric-card metric-blue">
          <div className="label">Active Nodes</div>
          <div className="value">{data.devices?.online ?? '--'} <span style={{ fontSize: 18 }}>Online</span></div>
          <div className="sub">{data.devices?.offline ?? 0} offline · {data.devices?.faulty ?? 0} faulty</div>
        </div>
        <div className="metric-card metric-orange">
          <div className="label">Active Alerts</div>
          <div className="value">{alertCount} <span style={{ fontSize: 18 }}>Alert{alertCount !== 1 ? 's' : ''}</span></div>
          <div className="sub">Across all zones</div>
        </div>
      </div>

      {/* Charts + right panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-title">Energy Demand vs Supply (Live)</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="demand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="supply" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} unit=" MW" />
              <Tooltip formatter={(v) => v + ' MW'} />
              <Legend />
              <Area type="monotone" dataKey="power.total" name="Demand" stroke="#10b981" fill="url(#demand)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="supply" name="Supply" stroke="#3b82f6" fill="url(#supply)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-title">Key Metrics</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Peak Load', `${data.peakLoad} MW`],
                ['Current Supply', `${data.supply} MW`],
                ['Voltage', `${data.voltage} V`],
                ['Frequency', `${data.frequency} Hz`],
                ['Offline Devices', `${data.devices?.offline} Units`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                  <span style={{ color: '#64748b' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Zone map + Alerts */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Zone Status</div>
          <ZoneMap zones={data.zones || { zoneA: 'normal', zoneB: 'normal', zoneC: 'normal' }} />
        </div>
        <div className="card">
          <div className="card-title">Active Alerts</div>
          {data.alerts && data.alerts.length > 0 ? (
            data.alerts.map((a, i) => (
              <div key={i} className="alert-row">
                <span style={{ color: '#1e2a3a', fontWeight: 500 }}>{a.message}</span>
                <span className={`badge badge-${a.type}`}>{a.type.charAt(0).toUpperCase() + a.type.slice(1)}</span>
              </div>
            ))
          ) : (
            <div style={{ color: '#10b981', fontSize: 13, padding: '8px 0' }}>✓ No active alerts</div>
          )}
        </div>
      </div>
    </div>
  );
}
