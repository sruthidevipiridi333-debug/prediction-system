import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

function generateLast30Days(history) {
  // Group history into buckets to simulate 30-day view
  const days = Array.from({ length: 15 }, (_, i) => ({
    day: `${i * 2 + 1}d`,
    zoneA: parseFloat((2.5 + Math.random() * 1.2).toFixed(2)),
    zoneB: parseFloat((1.8 + Math.random() * 0.8).toFixed(2)),
    zoneC: parseFloat((1.5 + Math.random() * 0.6).toFixed(2)),
  }));
  return days;
}

function generateForecast() {
  const hours = ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
  return hours.map((h, i) => ({
    hour: h,
    forecast: parseFloat((4 + Math.sin(i * 0.8) * 2 + Math.random() * 0.5).toFixed(2)),
    actual: i < 5 ? parseFloat((4 + Math.sin(i * 0.8) * 2 + (Math.random() - 0.5) * 0.8).toFixed(2)) : null,
  }));
}

export default function Analytics({ data, history }) {
  const last30Days = useMemo(generateLast30Days, []);
  const forecast = useMemo(generateForecast, []);

  return (
    <div>
      <h2 className="page-heading">Analytics</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-title">Consumption Trends – Last 30 Days</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={last30Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit=" MW" />
                <Tooltip formatter={(v) => v + ' MW'} />
                <Legend />
                <Bar dataKey="zoneA" name="Zone A" stackId="a" fill="#3b82f6" />
                <Bar dataKey="zoneB" name="Zone B" stackId="a" fill="#10b981" />
                <Bar dataKey="zoneC" name="Zone C" stackId="a" fill="#60a5fa" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-title">Demand Forecasting</div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={forecast}>
                <defs>
                  <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit=" MW" />
                <Tooltip formatter={(v) => v ? v + ' MW' : 'N/A'} />
                <Legend />
                <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#10b981" fill="url(#gradForecast)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Area type="monotone" dataKey="actual" name="Actual" stroke="#3b82f6" fill="none" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} connectNulls={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-title">Zone Load Breakdown (Live)</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { label: 'Zone A', value: data.power?.zoneA, color: '#ef4444', status: data.zones?.zoneA },
                { label: 'Zone B', value: data.power?.zoneB, color: '#f59e0b', status: data.zones?.zoneB },
                { label: 'Zone C', value: data.power?.zoneC, color: '#10b981', status: data.zones?.zoneC },
              ].map(z => (
                <div key={z.label} style={{ flex: 1, textAlign: 'center', padding: '14px 10px', background: z.color + '11', borderRadius: 8, border: `1.5px solid ${z.color}30` }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: z.color }}>{z.value} MW</div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{z.label}</div>
                  <span className={`badge badge-${z.status}`} style={{ marginTop: 6, display: 'inline-flex' }}>{z.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-title">Optimization Suggestions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '⚡', text: 'Redistribute Load to Zone C', color: '#3b82f6' },
                { icon: '🔧', text: 'Schedule Maintenance – Node 105', color: '#f59e0b' },
                { icon: '📉', text: 'Adjust Non-Critical Loads', color: '#10b981' },
                { icon: '🔋', text: 'Activate Backup Power – Zone B', color: '#8b5cf6' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px', background: '#f8fafc', borderRadius: 8, borderLeft: `3px solid ${s.color}` }}>
                  <span>{s.icon}</span>
                  <span style={{ fontSize: 13, color: '#374151' }}>{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Anomaly Detection</div>
            {data.alerts && data.alerts.length > 0 ? (
              data.alerts.map((a, i) => (
                <div key={i} className="alert-row">
                  <span style={{ fontSize: 13 }}>{a.message}</span>
                  <span className={`badge badge-${a.type}`}>{a.type}</span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 13, color: '#10b981', padding: '8px 0' }}>✓ No anomalies detected</div>
            )}
          </div>

          <div className="card">
            <div className="card-title">System Health</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Grid Efficiency', value: '94%', color: '#10b981' },
                { label: 'Load Factor', value: '78%', color: '#3b82f6' },
                { label: 'Power Quality', value: '96%', color: '#10b981' },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: '#64748b' }}>{m.label}</span>
                    <span style={{ fontWeight: 600, color: m.color }}>{m.value}</span>
                  </div>
                  <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: m.value, background: m.color, borderRadius: 3, transition: 'width 0.5s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
