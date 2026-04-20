const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
  keyPath: './private.key',
  certPath: './certificate.pem',
  caPath: './AmazonRootCA1.pem',
  clientId: 'ecovolt-simulator-' + Math.floor(Math.random() * 10000),
  host: 'a2m3t46mxbxk20-ats.iot.ap-southeast-2.amazonaws.com'
});

const TOPIC = 'dt/xmerion/t104/metrics';

// Simulate fluctuating zone loads
let baseLoad = { zoneA: 2.8, zoneB: 2.1, zoneC: 1.8 };
let alertActive = true;

function fluctuate(base, range) {
  return parseFloat((base + (Math.random() - 0.5) * range).toFixed(2));
}

function generateData() {
  const zoneA = fluctuate(baseLoad.zoneA, 0.4);
  const zoneB = fluctuate(baseLoad.zoneB, 0.3);
  const zoneC = fluctuate(baseLoad.zoneC, 0.2);
  const totalLoad = parseFloat((zoneA + zoneB + zoneC).toFixed(2));
  const voltage = fluctuate(230, 5);
  const frequency = fluctuate(50.0, 0.2);
  const current = parseFloat((totalLoad * 1000 / (voltage * Math.sqrt(3))).toFixed(2));
  const temperature = fluctuate(27, 3);
  const signal = Math.floor(fluctuate(80, 20));

  // Randomly vary device counts slightly
  const online = Math.floor(fluctuate(245, 4));
  const offline = Math.floor(fluctuate(9, 2));
  const faulty = Math.floor(fluctuate(2, 1));

  // Zone status based on load
  const zoneAStatus = zoneA > 3.0 ? 'high' : zoneA > 2.5 ? 'moderate' : 'normal';
  const zoneBStatus = zoneB > 2.4 ? 'high' : zoneB > 1.8 ? 'moderate' : 'normal';
  const zoneCStatus = zoneC > 2.0 ? 'high' : zoneC > 1.5 ? 'moderate' : 'normal';

  const alerts = [];
  if (zoneAStatus === 'high') alerts.push({ type: 'critical', message: 'Zone A Overload', zone: 'Zone A' });
  if (zoneBStatus !== 'normal') alerts.push({ type: 'warning', message: 'Node Failure in Zone B', zone: 'Zone B' });
  if (voltage < 227 || voltage > 233) alerts.push({ type: 'alert', message: 'Voltage Fluctuation in Zone C', zone: 'Zone C' });

  return {
    timestamp: new Date().toISOString(),
    // Raw sensor values (original fields kept)
    temperature: parseFloat(temperature.toFixed(2)),
    voltage: parseFloat(voltage.toFixed(1)),
    current: parseFloat(current.toFixed(2)),
    signal: signal,
    frequency: parseFloat(frequency.toFixed(2)),
    // Energy data
    power: {
      total: totalLoad,
      zoneA: zoneA,
      zoneB: zoneB,
      zoneC: zoneC
    },
    supply: parseFloat((totalLoad + fluctuate(1.5, 0.5)).toFixed(2)),
    peakLoad: parseFloat((totalLoad + fluctuate(2.5, 0.5)).toFixed(2)),
    // Device status
    devices: {
      online: Math.max(0, online),
      offline: Math.max(0, offline),
      faulty: Math.max(0, faulty)
    },
    // Zone status
    zones: {
      zoneA: zoneAStatus,
      zoneB: zoneBStatus,
      zoneC: zoneCStatus
    },
    // Active alerts
    alerts: alerts,
    // System info
    nodes: {
      total: online + offline + faulty,
      'Node-021': { location: 'Zone A', status: 'online' },
      'Node-105': { location: 'Zone B', status: offline > 10 ? 'offline' : 'online' },
      'Node-342': { location: 'Zone C', status: 'online' }
    }
  };
}

device.on('connect', () => {
  console.log('✅ Connected to AWS IoT Core');
  console.log(`📡 Publishing to topic: ${TOPIC} every 3 seconds\n`);

  setInterval(() => {
    const data = generateData();
    device.publish(TOPIC, JSON.stringify(data));
    console.log(`[${new Date().toLocaleTimeString()}] Sent:`, {
      load: data.power.total + ' MW',
      voltage: data.voltage + ' V',
      frequency: data.frequency + ' Hz',
      alerts: data.alerts.length
    });
  }, 3000);
});

device.on('error', (err) => {
  console.error('❌ IoT Error:', err.message || err);
  if (err.message && err.message.includes('certificate')) {
    console.error('   → Certificate issue: check if certificate is ACTIVE in AWS Console');
  }
  if (err.message && err.message.includes('policy')) {
    console.error('   → Policy issue: attach an IoT policy to your certificate in AWS Console');
  }
});

device.on('offline', () => {
  console.warn('⚠️  Device went offline — AWS IoT connection failed.');
  console.warn('   Possible causes:');
  console.warn('   1. Certificate NOT activated in AWS Console');
  console.warn('   2. No IoT Policy attached to the certificate');
  console.warn('   3. Wrong endpoint in device.js');
  console.warn('   → Dashboard will continue running with mock data.');
});
