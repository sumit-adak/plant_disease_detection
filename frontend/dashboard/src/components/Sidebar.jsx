import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ScanLine, History, FileText, User, 
  LogOut, CalendarClock, BarChart2, LogIn, Sparkles 
} from 'lucide-react';
import WeatherWidget from './WeatherWidget';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, remainingTrials } = useAuth();

  const [userProfile, setUserProfile] = useState({
    fullName: 'Demo Farmer',
    role: 'Pro Agri-Grower',
    avatarUrl: null,
    avatarType: 'preset',
    avatarPreset: '🧑‍🌾'
  });

  const loadProfile = () => {
    const saved = localStorage.getItem('plantGuardUserProfile');
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadProfile();
    const handleUpdate = () => loadProfile();
    window.addEventListener('plantGuardProfileUpdated', handleUpdate);
    return () => window.removeEventListener('plantGuardProfileUpdated', handleUpdate);
  }, [user]);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <div className="sidebar-logo-clay-circle">
          <img src="/assets/logo.svg" alt="PlantCare AI Logo" className="logo-icon" onError={(e) => e.target.src='/assets/logo.png'} />
        </div>
        <h2>PlantCare AI</h2>
      </div>
      
      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'scanner' ? 'active' : ''}`}
          onClick={() => setActiveTab('scanner')}
        >
          <ScanLine size={20} />
          <span>Scan Disease</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={20} />
          <span>History</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <FileText size={20} />
          <span>Diagnosis Reports</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'scheduler' ? 'active' : ''}`}
          onClick={() => setActiveTab('scheduler')}
        >
          <CalendarClock size={20} />
          <span>Scheduler</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'trackers' ? 'active' : ''}`}
          onClick={() => setActiveTab('trackers')}
        >
          <BarChart2 size={20} />
          <span>Trackers</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <User size={20} />
          <span>Account</span>
        </button>
      </nav>
      
      <div className="sidebar-weather-container">
        <WeatherWidget />
      </div>

      {/* Profile or Guest Status Card */}
      {isLoggedIn ? (
        <div 
          className={`sidebar-user-card ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
          title="View & Edit Account"
        >
          <div className="sidebar-user-avatar">
            {userProfile.avatarType === 'upload' && userProfile.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt="Avatar" />
            ) : (
              <span>{userProfile.avatarPreset || '🧑‍🌾'}</span>
            )}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.fullName || userProfile.fullName}</div>
            <div className="sidebar-user-role">{user?.role || userProfile.role}</div>
          </div>
        </div>
      ) : (
        <div 
          className="sidebar-user-card"
          onClick={() => navigate('/login')}
          style={{ background: 'rgba(136, 144, 99, 0.25)', borderColor: 'var(--moss-green)' }}
          title="Sign In for Unlimited Scans"
        >
          <div className="sidebar-user-avatar" style={{ background: 'var(--moss-green)', color: '#fff' }}>
            <Sparkles size={18} />
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Guest Mode</div>
            <div className="sidebar-user-role" style={{ color: remainingTrials > 0 ? 'var(--kombu-green)' : '#dc2626' }}>
              {remainingTrials > 0 ? '1 Free Scan Left' : 'Trial Used • Sign In'}
            </div>
          </div>
        </div>
      )}
      
      <div className="sidebar-footer">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="nav-item" style={{ width: '100%', cursor: 'pointer' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        ) : (
          <button onClick={() => navigate('/login')} className="nav-item" style={{ width: '100%', color: 'var(--kombu-green)', cursor: 'pointer' }}>
            <LogIn size={20} />
            <span>Sign In / Sign Up</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
