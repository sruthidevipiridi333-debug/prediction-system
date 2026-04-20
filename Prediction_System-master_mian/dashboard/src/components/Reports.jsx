import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function generateReportData(zone) {
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(Date.now() - (6 - i) * 86400000);
    const label = day.toLocaleDateString('en-IN', { weekday: 'short' });
    if (zone === 'All Zones') {
      return { day: label, zoneA: +(2.5 + Math.random()).toFixed(2), zoneB: +(2 + Math.random() * 0.8).toFixed(2), zoneC: +(1.5 + Math.random() * 0.5).toFixed(2) };
    }
    return { day: label, consumption: +(2 + Math.random() * 1.5).toFixed(2) };
  });
}

export default function Reports({ data }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [zone, setZone] = useState('All Zones');
  const [reportData, setReportData] = useState(null);
  const [generated, setGenerated] = useState(false);

  function handleGenerate(e) {
    e.preventDefault();
    setReportData(generateReportData(zone));
    setGenerated(true);
  }

  function handleDownload(type) {
    alert(`${type} download would trigger here in a production system.`);
  }

  return (
    <div>
      <h2 className="page-heading">Reports</h2>

      {/* Summary cards */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="metric-card metric-blue">
          <div className="label">Total Load Today</div>
          <div className="value">{data.power?.total ?? '--'} <span style={{ fontSize: 16 }}>MW</span></div>
          <div className="sub">Live reading</div>
        </div>
        <div className="metric-card metric-green">
          <div className="label">Current Supply</div>
          <div className="value">{data.supply ?? '--'} <span style={{ fontSize: 16 }}>MW</span></div>
          <div className="sub">Grid output</div>
        </div>
        <div className="metric-card metric-orange">
          <div className="label">Peak Load</div>
          <div className="value">{data.peakLoad ?? '--'} <span style={{ fontSize: 16 }}>MW</span></div>
          <div className="sub">Today's peak</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Energy Usage Report */}
        <div className="card">
          <div className="card-title">Energy Usage Report</div>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
            Summary of energy consumption and trends across all zones.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" onClick={() => handleDownload('PDF')}>Download PDF</button>
            <button className="btn btn-secondary" onClick={() => handleDownload('CSV')}>Export CSV</button>
          </div>
        </div>

        {/* Performance Report */}
        <div className="card">
          <div className="card-title">Performance Report</div>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
            System efficiency, uptime, and operational metrics for all nodes.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" onClick={() => handleDownload('PDF')}>Download PDF</button>
            <button className="btn btn-secondary" onClick={() => handleDownload('CSV')}>Export CSV</button>
          </div>
        </div>
      </div>

      {/* Custom report generator */}
      <div className="card">
        <div className="card-title">Custom Report Generator</div>
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>From</label>
            <input
              type="date"
              style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13 }}
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>To</label>
            <input
              type="date"
              style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13 }}
              value={toDate}
              onChange={e => setToDate(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>Zone Filter</label>
            <select
              style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13 }}
              value={zone}
              onChange={e => setZone(e.target.value)}
            >
              <option>All Zones</option>
              <option>Zone A</option>
              <option>Zone B</option>
              <option>Zone C</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Generate Report</button>
        </form>

        {generated && reportData && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12 }}>
              Report: {zone} · {fromDate || 'Last 7 days'} {toDate ? `→ ${toDate}` : ''}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit=" MW" />
                <Tooltip formatter={(v) => v + ' MW'} />
                <Legend />
                {zone === 'All Zones' ? (
                  <>
                    <Bar dataKey="zoneA" name="Zone A" fill="#3b82f6" radius={[4,4,0,0]} />
                    <Bar dataKey="zoneB" name="Zone B" fill="#10b981" radius={[4,4,0,0]} />
                    <Bar dataKey="zoneC" name="Zone C" fill="#f59e0b" radius={[4,4,0,0]} />
                  </>
                ) : (
                  <Bar dataKey="consumption" name={`${zone} Consumption`} fill="#3b82f6" radius={[4,4,0,0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
              <button className="btn btn-primary btn-sm" onClick={() => handleDownload('PDF')}>Download PDF</button>
              <button className="btn btn-secondary btn-sm" onClick={() => handleDownload('CSV')}>Export CSV</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
