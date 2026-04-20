const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const awsIot = require('aws-iot-device-sdk');
const path = require('path');
const http = require('http');

const PORT = 8080;
const TOPIC = 'dt/xmerion/t104/metrics';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Store latest data for new connections
let latestData = null;

// ─── AWS IoT Subscriber ─────────────────────────────────────────────────────
const iotDevice = awsIot.device({
  keyPath: path.join(__dirname, '../simulator/private.key'),
  certPath: path.join(__dirname, '../simulator/certificate.pem'),
  caPath: path.join(__dirname, '../simulator/AmazonRootCA1.pem'),
  clientId: 'ecovolt-dashboard-server-' + Math.floor(Math.random() * 10000),
  host: 'a2m3t46mxbxk20-ats.iot.ap-southeast-2.amazonaws.com'
});

iotDevice.on('connect', () => {
  console.log('✅ Server connected to AWS IoT Core');
  iotDevice.subscribe(TOPIC, (err) => {
    if (err) {
      console.error('❌ Subscribe error:', err);
    } else {
      console.log(`📥 Subscribed to topic: ${TOPIC}`);
    }
  });
});

iotDevice.on('message', (topic, payload) => {
  try {
    const data = JSON.parse(payload.toString());
    latestData = data;
    broadcast(data);
    console.log(`[${new Date().toLocaleTimeString()}] Received & forwarded IoT data`);
  } catch (e) {
    console.error('Parse error:', e.message);
  }
});

iotDevice.on('error', (err) => {
  console.error('IoT Error:', err.message);
});

// ─── WebSocket Server ────────────────────────────────────────────────────────
function broadcast(data) {
  const message = JSON.stringify({ type: 'iot_data', data });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(message);
    }
  });
}

wss.on('connection', (ws) => {
  console.log(`🔌 Dashboard client connected (total: ${wss.clients.size})`);

  // Send latest data immediately on connect
  if (latestData) {
    ws.send(JSON.stringify({ type: 'iot_data', data: latestData }));
  }

  ws.on('close', () => {
    console.log(`🔌 Client disconnected (total: ${wss.clients.size})`);
  });
});

// ─── REST endpoint for health check ─────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    connectedClients: wss.clients.size,
    lastDataReceived: latestData ? latestData.timestamp : null
  });
});

app.get('/latest', (req, res) => {
  res.json(latestData || { message: 'No data received yet' });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Ecovolt Server running on http://localhost:${PORT}`);
  console.log(`   WebSocket: ws://localhost:${PORT}`);
  console.log(`   Health:    http://localhost:${PORT}/health\n`);
});
