import React from 'react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

function GaugeCard({ label, value, unit, max, color }) {
  const pct = Math.min(100, (value / max) * 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDash = (pct / 100) * circumference;

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <svg width="120" height="80" viewBox="0 0 120 80" style={{ overflow: 'visible', margin: '0 auto', display: 'block' }}>
        {/* Background arc */}
        <path
          d="M 10 70 A 50 50 0 0 1 110 70"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d="M 10 70 A 50 50 0 0 1 110 70"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * 157} 157`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        <text x="60" y="68" textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>
          {value}
        </text>
        <text x="60" y="82" textAnchor="middle" fontSize="10" fill="#94a3b8">
          {unit}
        </text>
      </svg>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginTop: 8 }}>{label}</div>
    </div>
  );
}

export default function RealTimeMonitoring({ data, history }) {
  const chartData = history.slice(-20);

  return (
    <div>
      <h2 className="page-heading">Real-Time Monitoring</h2>

      {/* Live metric cards */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="metric-card metric-green">
          <div className="label">Current Load</div>
          <div className="value">{data.power?.total ?? '--'} <span style={{ fontSize: 18 }}>MW</span></div>
          <div className="sub">System demand right now</div>
        </div>
        <div className="metric-card metric-blue">
          <div className="label">Voltage</div>
          <div className="value">{data.voltage ?? '--'} <span style={{ fontSize: 18 }}>V</span></div>
          <div className="sub">Nominal: 230 V</div>
        </div>
        <div className="metric-card metric-orange">
          <div className="label">Frequency</div>
          <div className="value">{data.frequency ?? '--'} <span style={{ fontSize: 18 }}>Hz</span></div>
          <div className="sub">Nominal: 50 Hz</div>
        </div>
      </div>

      {/* Gauges + Device status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-title">Locality Gauges</div>
          <div className="grid-3">
            <GaugeCard label="Load" value={data.power?.total ?? 0} unit="MW" max={12} color="#10b981" />
            <GaugeCard label="Voltage" value={data.voltage ?? 0} unit="V" max={250} color="#3b82f6" />
            <GaugeCard label="Frequency" value={data.frequency ?? 0} unit="Hz" max={52} color="#f59e0b" />
          </div>
          <div className="card-title" style={{ marginTop: 20 }}>Additional Sensors</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#ef4444' }}>{data.temperature ?? '--'}°C</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Temperature</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#8b5cf6' }}>{data.current ?? '--'} A</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Current</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#0891b2' }}>{data.signal ?? '--'}%</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Signal</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-title">Device Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <span className="status-dot dot-green" />
                <span>{data.devices?.online ?? '--'} Online Units</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <span className="status-dot dot-red" />
                <span>{data.devices?.offline ?? '--'} Offline Units</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <span className="status-dot dot-orange" />
                <span>{data.devices?.faulty ?? '--'} Faulty Units</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Active Alerts</div>
            {data.alerts && data.alerts.length > 0 ? (
              data.alerts.map((a, i) => (
                <div key={i} className="alert-row">
                  <span style={{ fontSize: 12 }}>{a.message}</span>
                  <span className={`badge badge-${a.type}`} style={{ fontSize: 10 }}>{a.type}</span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 13, color: '#10b981' }}>✓ All systems normal</div>
            )}
          </div>
        </div>
      </div>

      {/* Live chart */}
      <div className="card">
        <div className="card-title">Live Sensor Feed</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="power.total" name="Load (MW)" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="voltage" name="Voltage (V)" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="frequency" name="Freq (Hz)" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
