import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import Overview from './components/Overview';
import RealTimeMonitoring from './components/RealTimeMonitoring';
import Analytics from './components/Analytics';
import DeviceManagement from './components/DeviceManagement';
import Control from './components/Control';
import Reports from './components/Reports';
import { useIotData } from './useIotData';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { data, history, connected } = useIotData();

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const sharedProps = { data, history };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Header connected={connected} onLogout={() => setIsLoggedIn(false)} />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<Overview {...sharedProps} />} />
            <Route path="/realtime" element={<RealTimeMonitoring {...sharedProps} />} />
            <Route path="/analytics" element={<Analytics {...sharedProps} />} />
            <Route path="/devices" element={<DeviceManagement {...sharedProps} />} />
            <Route path="/control" element={<Control {...sharedProps} />} />
            <Route path="/reports" element={<Reports {...sharedProps} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
