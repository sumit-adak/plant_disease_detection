import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Chatbot from './components/Chatbot';
import PlantScanner from './components/PlantScanner';
import History from './components/History';
import Reports from './components/Reports';
import Account from './components/Account';
import Scheduler from './components/Scheduler';
import Trackers from './components/Trackers';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './context/AuthContext';

import './styles/account.css';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Chatbot setActiveTab={setActiveTab} />;
      case 'scanner':
        return <PlantScanner setActiveTab={setActiveTab} />;
      case 'history':
        return <History setActiveTab={setActiveTab} />;
      case 'reports':
        return <Reports setActiveTab={setActiveTab} />;
      case 'scheduler':
        return <Scheduler />;
      case 'trackers':
        return <Trackers />;
      case 'account':
        return <Account />;
      default:
        return <Chatbot setActiveTab={setActiveTab} />;
    }
  };

  const isClayActive = ['account', 'trackers', 'scheduler'].includes(activeTab);

  return (
    <div className={`app-container ${isClayActive ? 'clay-account-active' : ''}`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardContent />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
