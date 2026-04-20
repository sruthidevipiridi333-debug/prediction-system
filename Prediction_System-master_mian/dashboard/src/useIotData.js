import { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = 'ws://localhost:8080';

// Fallback mock data when not connected to server
function generateMockData() {
  const r = (base, range) => parseFloat((base + (Math.random() - 0.5) * range).toFixed(2));
  const zoneA = r(2.8, 0.4);
  const zoneB = r(2.1, 0.3);
  const zoneC = r(1.8, 0.2);
  const total = parseFloat((zoneA + zoneB + zoneC).toFixed(2));
  const voltage = r(230, 5);
  const frequency = r(50.0, 0.2);
  const alerts = [];
  if (zoneA > 3.0) alerts.push({ type: 'critical', message: 'Zone A Overload', zone: 'Zone A' });
  if (zoneB > 2.3) alerts.push({ type: 'warning', message: 'Node Failure in Zone B', zone: 'Zone B' });
  if (voltage < 227 || voltage > 233) alerts.push({ type: 'alert', message: 'Voltage Fluctuation in Zone C', zone: 'Zone C' });

  return {
    timestamp: new Date().toISOString(),
    temperature: r(27, 3),
    voltage: parseFloat(voltage.toFixed(1)),
    current: parseFloat((total * 1000 / (voltage * 1.732)).toFixed(2)),
    signal: Math.floor(r(80, 20)),
    frequency: parseFloat(frequency.toFixed(2)),
    power: { total, zoneA, zoneB, zoneC },
    supply: parseFloat((total + r(1.5, 0.5)).toFixed(2)),
    peakLoad: parseFloat((total + r(2.5, 0.5)).toFixed(2)),
    devices: {
      online: Math.floor(r(245, 4)),
      offline: Math.floor(r(9, 2)),
      faulty: Math.floor(r(2, 1))
    },
    zones: {
      zoneA: zoneA > 3.0 ? 'high' : zoneA > 2.5 ? 'moderate' : 'normal',
      zoneB: zoneB > 2.4 ? 'high' : zoneB > 1.8 ? 'moderate' : 'normal',
      zoneC: zoneC > 2.0 ? 'high' : zoneC > 1.5 ? 'moderate' : 'normal',
    },
    alerts,
    nodes: {
      total: 256,
      'Node-021': { location: 'Zone A', status: 'online' },
      'Node-105': { location: 'Zone B', status: 'offline' },
      'Node-342': { location: 'Zone C', status: 'online' }
    }
  };
}

export function useIotData() {
  const [data, setData] = useState(generateMockData());
  const [connected, setConnected] = useState(false);
  const [history, setHistory] = useState(() => {
    // Pre-fill with 20 mock points for charts
    return Array.from({ length: 20 }, (_, i) => {
      const d = generateMockData();
      return { ...d, time: new Date(Date.now() - (20 - i) * 3000).toLocaleTimeString() };
    });
  });
  const wsRef = useRef(null);
  const mockIntervalRef = useRef(null);
  const reconnectRef = useRef(null);

  const addToHistory = useCallback((newData) => {
    setHistory(prev => {
      const entry = { ...newData, time: new Date(newData.timestamp).toLocaleTimeString() };
      const updated = [...prev, entry];
      return updated.slice(-30); // keep last 30 points
    });
  }, []);

  const startMockMode = useCallback(() => {
    if (mockIntervalRef.current) return;
    mockIntervalRef.current = setInterval(() => {
      const d = generateMockData();
      setData(d);
      addToHistory(d);
    }, 3000);
  }, [addToHistory]);

  const stopMockMode = useCallback(() => {
    if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current);
      mockIntervalRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        stopMockMode();
        console.log('✅ Connected to Ecovolt server');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'iot_data' && msg.data) {
            setData(msg.data);
            addToHistory(msg.data);
          }
        } catch (e) {
          console.error('WS parse error', e);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        startMockMode();
        // Try to reconnect after 5s
        reconnectRef.current = setTimeout(connect, 5000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      startMockMode();
    }
  }, [addToHistory, startMockMode, stopMockMode]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectRef.current);
      clearInterval(mockIntervalRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  return { data, history, connected };
}
