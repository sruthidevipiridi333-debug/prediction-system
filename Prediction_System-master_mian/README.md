# Ecovolt – Energy Management Dashboard

A real-time energy monitoring dashboard connected to AWS IoT Core.  
Dummy sensor data flows from an IoT device simulator → AWS IoT Core → WebSocket server → React dashboard.

---

## Project Structure

```
Prediction_system/
├── simulator/        # IoT device simulator (publishes data to AWS IoT)
│   ├── device.js
│   ├── package.json
│   ├── certificate.pem      ← Place your AWS IoT certificate here
│   ├── private.key          ← Place your AWS IoT private key here
│   └── AmazonRootCA1.pem    ← Place your Amazon Root CA here
│
├── server/           # Node.js WebSocket bridge server
│   ├── server.js     # Subscribes to AWS IoT, forwards via WebSocket
│   └── package.json
│
├── dashboard/        # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Overview.jsx
│   │   │   ├── RealTimeMonitoring.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── DeviceManagement.jsx
│   │   │   ├── Control.jsx
│   │   │   └── Reports.jsx
│   │   ├── useIotData.js    # WebSocket hook (auto-falls back to mock data)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Data Flow

```
[ device.js simulator ]
        │  publishes JSON every 3s
        ▼
[ AWS IoT Core ]  (topic: dt/xmerion/t104/metrics)
        │  MQTT subscription
        ▼
[ server/server.js ]  (port 8080)
        │  WebSocket broadcast
        ▼
[ React Dashboard ]  (port 3000)
```

---

## Prerequisites

- Node.js v18+
- AWS IoT certificates (certificate.pem, private.key, AmazonRootCA1.pem)
- AWS IoT endpoint configured

---

## Setup & Running

### Step 1 – Place your certificates

Copy your AWS IoT certificates into `simulator/`:
```
simulator/
├── certificate.pem
├── private.key
└── AmazonRootCA1.pem
```

### Step 2 – Configure the endpoint (if different)

In both `simulator/device.js` and `server/server.js`, check the `host` field:
```js
host: 'ajn6olmvk0maf-ats.iot.ap-south-1.amazonaws.com'
```
Replace with your own AWS IoT endpoint if needed  
(found in: AWS Console → IoT Core → Settings → Device data endpoint).

### Step 3 – Start the IoT simulator

```powershell
cd simulator
npm start
```

You should see:
```
✅ Connected to AWS IoT Core
📡 Publishing to topic: dt/xmerion/t104/metrics every 3 seconds
[10:30:00] Sent: { load: '6.7 MW', voltage: '230.1 V', ... }
```

### Step 4 – Start the backend server

Open a new terminal:
```powershell
cd server
npm start
```

You should see:
```
✅ Server connected to AWS IoT Core
📥 Subscribed to topic: dt/xmerion/t104/metrics
🚀 Ecovolt Server running on http://localhost:8080
```

### Step 5 – Start the dashboard

Open another terminal:
```powershell
cd dashboard
npm run dev
```

Open in browser: **http://localhost:3000**

---

## Login Credentials

```
Email:    admin@ecovolt.com
Password: admin123
```

---

## Dashboard Pages

| Page | Description |
|------|-------------|
| **Overview** | Total load, active nodes, alerts, demand vs supply chart, zone status |
| **Real-Time Monitoring** | Live gauges (load, voltage, frequency), sensor values, live chart |
| **Analytics** | 30-day consumption bar chart, demand forecasting, optimization suggestions |
| **Device Management** | Node list, register devices, firmware update |
| **Control Panel** | Device actions, automated rules toggles, quick commands |
| **Reports** | Energy/performance reports, custom report generator with charts |

---

## Mock Data Mode

If the server is not running (or AWS IoT is not connected), the dashboard **automatically falls back to mock data** — it generates realistic fluctuating values locally every 3 seconds.

The connection status is shown in the top-right header:
- 🟢 **AWS IoT Live** – receiving real data from AWS IoT
- 🟡 **Mock Data** – server not connected, using simulated data

---

## AWS IoT Topic

**Topic:** `dt/xmerion/t104/metrics`

**Payload format:**
```json
{
  "timestamp": "2026-04-16T10:30:00.000Z",
  "temperature": 27.3,
  "voltage": 230.1,
  "current": 15.2,
  "signal": 82,
  "frequency": 50.02,
  "power": { "total": 6.7, "zoneA": 2.8, "zoneB": 2.1, "zoneC": 1.8 },
  "supply": 8.2,
  "peakLoad": 9.1,
  "devices": { "online": 245, "offline": 9, "faulty": 2 },
  "zones": { "zoneA": "high", "zoneB": "moderate", "zoneC": "normal" },
  "alerts": [{ "type": "critical", "message": "Zone A Overload", "zone": "Zone A" }],
  "nodes": {
    "Node-021": { "location": "Zone A", "status": "online" },
    "Node-105": { "location": "Zone B", "status": "offline" },
    "Node-342": { "location": "Zone C", "status": "online" }
  }
}
```

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Dashboard | React 18 + Vite + Recharts |
| Routing | React Router v6 |
| Backend Server | Node.js + Express + ws (WebSocket) |
| IoT Simulator | Node.js + aws-iot-device-sdk |
| IoT Cloud | AWS IoT Core (MQTT) |
| Database | Not required (live data only) |
