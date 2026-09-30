import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Camera, Upload, Trash2, Shield, Bell, Sprout, 
  Key, Smartphone, Download, MapPin, Mail, Sliders, 
  Save, CheckCircle2, Award, Sparkles, Activity
} from 'lucide-react';
import '../styles/account.css';

const PRESET_AVATARS = [
  { id: 'farmer', emoji: '🧑‍🌾', label: 'Master Farmer' },
  { id: 'botanist', emoji: '🌿', label: 'Botanist' },
  { id: 'pathologist', emoji: '🔬', label: 'Plant Pathologist' },
  { id: 'sprout', emoji: '🌱', label: 'Green Thumb' },
  { id: 'flora', emoji: '🌻', label: 'Flora Specialist' },
  { id: 'tractor', emoji: '🚜', label: 'Agri-Technician' },
  { id: 'organic', emoji: '🥑', label: 'Organic Grower' },
  { id: 'indoor', emoji: '🪴', label: 'Hydroponics Pro' }
];

const DEFAULT_PROFILE = {
  fullName: 'Demo Farmer',
  email: 'farmer@example.com',
  phone: '+1 (555) 234-5678',
  role: 'Pro Agri-Grower',
  avatarUrl: null,
  avatarType: 'preset',
  avatarPreset: '🧑‍🌾',
  farmName: 'Green Horizon Eco Farm',
  location: 'California Valley, USA',
  farmType: 'Organic Greenhouse & Orchard',
  farmSize: '12.5 Acres',
  soilType: 'Loamy with High Organic Matter',
  climateZone: 'Zone 9b - Subtropical Mediterranean',
  experienceYears: '7+ Years',
  crops: ['Tomatoes', 'Bell Peppers', 'Strawberries', 'Potatoes', 'Lettuce', 'Basil'],
  bio: 'Passionate sustainable grower utilizing AI diagnostics, precision irrigation, and organic pest control to cultivate high-yield crop varieties.',
  memberSince: 'March 2024'
};

const DEFAULT_PREFERENCES = {
  diseaseSensitivity: 'High (Early Detection)',
  unitSystem: 'Metric (°C, Hectares, Liters)',
  autoWeatherSync: true,
  aiModelMode: 'Ensemble Deep Vision (Highest Accuracy)',
  language: 'English (US)',
  autoBackup: true
};

const DEFAULT_NOTIFICATIONS = {
  emailAlerts: true,
  smsCriticalAlerts: false,
  pushDiseaseOutbreak: true,
  wateringReminders: true,
  weeklyDigest: true,
  severeWeatherAlerts: true
};

const Account = () => {
  // Tabs: 'profile' | 'farm' | 'preferences' | 'notifications' | 'security' | 'activity'
  const [activeTab, setActiveTab] = useState('profile');
  
  // State
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  
  // Avatar custom modal/presets selector visibility
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const fileInputRef = useRef(null);

  // New crop input
  const [newCropInput, setNewCropInput] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Sessions list
  const [sessions, setSessions] = useState([
    { id: '1', device: 'Windows 11 • Chrome 128', location: 'Current Session (Local)', lastActive: 'Active Now', isCurrent: true },
    { id: '2', device: 'iPhone 15 Pro • PlantGuard Mobile', location: 'California, US', lastActive: '3 hours ago', isCurrent: false },
    { id: '3', device: 'iPad Air • Safari Browser', location: 'California, US', lastActive: '2 days ago', isCurrent: false }
  ]);

  // Activity Log
  const [activities] = useState([
    { id: 1, text: 'Logged in from Windows Chrome', time: 'Just now' },
    { id: 2, text: 'Performed AI Diagnosis on Tomato Leaf Blight', time: 'Yesterday at 3:45 PM' },
    { id: 3, text: 'Updated Water Schedule for Greenhouse Sector B', time: '2 days ago' },
    { id: 4, text: 'Downloaded Disease Management PDF Report', time: '3 days ago' },
    { id: 5, text: 'Connected Soil Moisture & Weather Tracker', time: '5 days ago' }
  ]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load from local storage
  useEffect(() => {
    const savedProfile = localStorage.getItem('plantGuardUserProfile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }

    const savedPrefs = localStorage.getItem('plantGuardUserPrefs');
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (e) {
        console.error('Failed to parse user prefs', e);
      }
    }

    const savedNotifs = localStorage.getItem('plantGuardUserNotifs');
    if (savedNotifs) {
      try {
        setNotifications(JSON.parse(savedNotifs));
      } catch (e) {
        console.error('Failed to parse user notifs', e);
      }
    }

    const saved2FA = localStorage.getItem('plantGuard2FA');
    if (saved2FA) {
      setTwoFactorEnabled(saved2FA === 'true');
    }
  }, []);

  // Save changes to localStorage and dispatch event for header/sidebar sync
  const saveProfileData = (updatedProfile) => {
    const dataToSave = updatedProfile || profile;
    localStorage.setItem('plantGuardUserProfile', JSON.stringify(dataToSave));
    window.dispatchEvent(new Event('plantGuardProfileUpdated'));
    showToast('Profile information saved successfully!');
  };

  const savePreferencesData = () => {
    localStorage.setItem('plantGuardUserPrefs', JSON.stringify(preferences));
    showToast('Preferences updated successfully!');
  };

  const saveNotificationsData = () => {
    localStorage.setItem('plantGuardUserNotifs', JSON.stringify(notifications));
    showToast('Notification settings updated!');
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result;
      const updated = {
        ...profile,
        avatarUrl: base64Url,
        avatarType: 'upload'
      };
      setProfile(updated);
      saveProfileData(updated);
      showToast('Profile photo updated successfully!');
    };
    reader.readAsDataURL(file);
  };

  // Handle Preset Avatar selection
  const handleSelectPreset = (emoji) => {
    const updated = {
      ...profile,
      avatarUrl: null,
      avatarType: 'preset',
      avatarPreset: emoji
    };
    setProfile(updated);
    saveProfileData(updated);
    setShowPresetPicker(false);
    showToast(`Avatar updated to ${emoji}`);
  };

  // Reset / Remove Avatar
  const handleRemoveAvatar = () => {
    const updated = {
      ...profile,
      avatarUrl: null,
      avatarType: 'preset',
      avatarPreset: '🧑‍🌾'
    };
    setProfile(updated);
    saveProfileData(updated);
    showToast('Profile photo reset to default.');
  };

  // Add Crop Tag
  const handleAddCrop = (e) => {
    e.preventDefault();
    const trimmed = newCropInput.trim();
    if (!trimmed) return;
    if (profile.crops.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      showToast('This crop is already listed!');
      return;
    }
    const updated = {
      ...profile,
      crops: [...profile.crops, trimmed]
    };
    setProfile(updated);
    setNewCropInput('');
    showToast(`Added ${trimmed} to monitored crops`);
  };

  // Remove Crop Tag
  const handleRemoveCrop = (cropToRemove) => {
    const updated = {
      ...profile,
      crops: profile.crops.filter(c => c !== cropToRemove)
    };
    setProfile(updated);
  };

  // Password Strength Calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: '#D9534F' };
      case 2:
        return { score: 50, label: 'Fair', color: '#E8A854' };
      case 3:
        return { score: 75, label: 'Good', color: '#8FA683' };
      case 4:
        return { score: 100, label: 'Strong', color: '#5A704D' };
      default:
        return { score: 15, label: 'Very Weak', color: '#D9534F' };
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // Handle Password Submit
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password changed successfully!');
  };

  // 2FA Toggle
  const toggle2FA = () => {
    const nextState = !twoFactorEnabled;
    setTwoFactorEnabled(nextState);
    localStorage.setItem('plantGuard2FA', String(nextState));
    showToast(nextState ? 'Two-Factor Authentication enabled!' : '2FA disabled.');
  };

  // Revoke session
  const revokeSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id));
    showToast('Device session revoked.');
  };

  // Export Account & Farm Data
  const handleExportData = () => {
    const fullData = {
      profile,
      preferences,
      notifications,
      trackers: JSON.parse(localStorage.getItem('plantTrackers') || '[]'),
      schedules: JSON.parse(localStorage.getItem('plantCareTasks') || '[]'),
      exportDate: new Date().toISOString()
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `plantguard_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Full account & farm data exported successfully!');
  };

  // Clear Local Data
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to reset all profile and farm data? This cannot be undone.')) {
      localStorage.clear();
      setProfile(DEFAULT_PROFILE);
      setPreferences(DEFAULT_PREFERENCES);
      setNotifications(DEFAULT_NOTIFICATIONS);
      setTwoFactorEnabled(false);
      window.dispatchEvent(new Event('plantGuardProfileUpdated'));
      showToast('All local application data has been reset.');
    }
  };

  // Profile completeness score
  const calculateCompleteness = () => {
    let fields = [
      profile.fullName, profile.email, profile.phone, profile.farmName,
      profile.location, profile.farmType, profile.farmSize, profile.soilType,
      profile.bio, (profile.crops && profile.crops.length > 0)
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completeness = calculateCompleteness();

  return (
    <div className="account-container clay-account-wrapper">
      {/* Decorative Organic Clay Background Shapes */}
      <div className="clay-bg-decorations" aria-hidden="true">
        <div className="clay-blob clay-blob-1"></div>
        <div className="clay-blob clay-blob-2"></div>
        <div className="clay-blob clay-blob-3"></div>
      </div>

      {/* Clay Toast Alert Notification */}
      {toastMessage && (
        <div className="clay-toast">
          <CheckCircle2 size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Clay Header Banner */}
      <div className="clay-header-banner">
        <div className="clay-header-leaf-icon" title="PlantCare AI Farmer Profile">
          <Sprout size={28} />
        </div>
        <div className="clay-header-text">
          <h1>Account & Farm Profile</h1>
          <p>Manage your farmer identity, crop configurations, system alerts, and security settings.</p>
        </div>
      </div>

      {/* Main Scrollable Clay Content Canvas */}
      <div className="clay-scrollable-content">
        {/* ==========================================================================
            Profile Hero Card — Elevated Molded Clay Object
            ========================================================================== */}
        <div className="clay-card clay-profile-hero-card">
          <div className="clay-profile-hero-top">
            <div className="clay-profile-hero-main">
              {/* Molded Clay Avatar Container */}
              <div 
                className="clay-avatar-container"
                onClick={() => fileInputRef.current?.click()}
                title="Click to upload custom photo"
              >
                <div className="clay-avatar-inner">
                  {profile.avatarType === 'upload' && profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.fullName} className="clay-avatar-img" />
                  ) : (
                    <span className="clay-avatar-emoji">
                      {profile.avatarPreset || profile.fullName.charAt(0)}
                    </span>
                  )}

                  <div className="clay-avatar-overlay">
                    <Camera size={18} />
                    <span>Upload</span>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="clay-profile-info">
                <div className="clay-profile-name-row">
                  <h2>{profile.fullName}</h2>
                  <span className="clay-badge clay-badge-pro">
                    <Award size={13} /> {profile.role}
                  </span>
                </div>
                <div className="clay-profile-meta-row">
                  <span className="clay-meta-pill">
                    <Mail size={14} /> {profile.email}
                  </span>
                  <span className="clay-meta-pill">
                    <MapPin size={14} /> {profile.location}
                  </span>
                  <span className="clay-meta-pill">
                    <Sprout size={14} /> {profile.farmName}
                  </span>
                </div>
              </div>
            </div>

            {/* Clay Avatar Action Buttons */}
            <div className="clay-avatar-actions">
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              <button 
                type="button"
                className="clay-btn clay-btn-secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={15} /> Upload Photo
              </button>
              <button 
                type="button"
                className="clay-btn clay-btn-secondary"
                onClick={() => setShowPresetPicker(!showPresetPicker)}
              >
                <Sparkles size={15} /> Choose Preset
              </button>
              {(profile.avatarUrl || profile.avatarPreset !== '🧑‍🌾') && (
                <button 
                  type="button"
                  className="clay-btn clay-btn-danger-outline"
                  onClick={handleRemoveAvatar}
                  title="Reset Avatar"
                >
                  <Trash2 size={15} /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Preset Avatars Drawer */}
          {showPresetPicker && (
            <div className="clay-preset-box">
              <p className="clay-preset-title">Choose an Agricultural Persona Avatar:</p>
              <div className="clay-preset-grid">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    className={`clay-preset-avatar-btn ${profile.avatarPreset === av.emoji && profile.avatarType === 'preset' ? 'selected' : ''}`}
                    onClick={() => handleSelectPreset(av.emoji)}
                    title={av.label}
                  >
                    <span className="clay-preset-emoji">{av.emoji}</span>
                    <span className="clay-preset-label">{av.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Molded Clay Profile Completeness Bar */}
          <div className="clay-progress-section">
            <div className="clay-progress-header">
              <span className="clay-progress-title">
                <CheckCircle2 size={16} /> Profile Completeness
              </span>
              <span className="clay-progress-percent">{completeness}%</span>
            </div>
            <div className="clay-progress-track">
              <div className="clay-progress-layer" style={{ width: `${completeness}%` }}></div>
            </div>
          </div>
        </div>

        {/* ==========================================================================
            4 Separate Molded Clay Statistic Cards
            ========================================================================== */}
        <div className="clay-stats-grid">
          {/* Card 1: Total Scans */}
          <div className="clay-stat-card clay-stat-mint">
            <div className="clay-stat-icon-wrap">
              <Activity size={24} />
            </div>
            <div className="clay-stat-details">
              <h4>34</h4>
              <p>Total Scans Performed</p>
            </div>
          </div>

          {/* Card 2: Monitored Crops */}
          <div className="clay-stat-card clay-stat-blue">
            <div className="clay-stat-icon-wrap">
              <Sprout size={24} />
            </div>
            <div className="clay-stat-details">
              <h4>{profile.crops.length}</h4>
              <p>Monitored Crops</p>
            </div>
          </div>

          {/* Card 3: Crop Health Rate */}
          <div className="clay-stat-card clay-stat-turquoise">
            <div className="clay-stat-icon-wrap">
              <CheckCircle2 size={24} />
            </div>
            <div className="clay-stat-details">
              <h4>94.8%</h4>
              <p>Crop Health Rate</p>
            </div>
          </div>

          {/* Card 4: Pro Tier */}
          <div className="clay-stat-card clay-stat-peach">
            <div className="clay-stat-icon-wrap">
              <Shield size={24} />
            </div>
            <div className="clay-stat-details">
              <h4>Pro Tier</h4>
              <p>Since {profile.memberSince}</p>
            </div>
          </div>
        </div>

        {/* ==========================================================================
            Clay Navigation Tabs Bar
            ========================================================================== */}
        <div className="clay-tabs-bar">
          <button 
            type="button"
            className={`clay-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> Personal Profile
          </button>
          <button 
            type="button"
            className={`clay-tab ${activeTab === 'farm' ? 'active' : ''}`}
            onClick={() => setActiveTab('farm')}
          >
            <Sprout size={18} /> Farm & Crops
          </button>
          <button 
            type="button"
            className={`clay-tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <Sliders size={18} /> AI & Preferences
          </button>
          <button 
            type="button"
            className={`clay-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} /> Notifications
          </button>
          <button 
            type="button"
            className={`clay-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={18} /> Security & Privacy
          </button>
          <button 
            type="button"
            className={`clay-tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <Activity size={18} /> Activity & Data
          </button>
        </div>

        {/* ==========================================================================
            TAB 1: PERSONAL INFORMATION
            ========================================================================== */}
        {activeTab === 'profile' && (
          <div className="clay-card clay-tab-card">
            <div className="clay-section-header">
              <h3><User size={22} /> Personal Information</h3>
              <p>Update your grower details and contact information.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); saveProfileData(); }}>
              <div className="clay-form-grid">
                <div className="clay-form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    className="clay-input" 
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    placeholder="e.g. Demo Farmer"
                    required
                  />
                </div>

                <div className="clay-form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="clay-input" 
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="farmer@example.com"
                    required
                  />
                </div>

                <div className="clay-form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    className="clay-input" 
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 (555) 234-5678"
                  />
                </div>

                <div className="clay-form-group">
                  <label>Farmer Role / Title</label>
                  <select 
                    className="clay-select"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  >
                    <option value="Pro Agri-Grower">Pro Agri-Grower</option>
                    <option value="Organic Farmer">Organic Farmer</option>
                    <option value="Urban Gardener">Urban Gardener</option>
                    <option value="Botanical Researcher">Botanical Researcher</option>
                    <option value="Hydroponics Specialist">Hydroponics Specialist</option>
                    <option value="Hobbyist Gardener">Hobbyist Gardener</option>
                  </select>
                </div>

                <div className="clay-form-group">
                  <label>Farming Experience</label>
                  <input 
                    type="text" 
                    className="clay-input" 
                    value={profile.experienceYears}
                    onChange={(e) => setProfile({ ...profile, experienceYears: e.target.value })}
                    placeholder="e.g. 7+ Years"
                  />
                </div>

                <div className="clay-form-group">
                  <label>Location / Region</label>
                  <input 
                    type="text" 
                    className="clay-input" 
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="California Valley, USA"
                  />
                </div>

                <div className="clay-form-group full-width">
                  <label>Grower Bio & Notes</label>
                  <textarea 
                    className="clay-textarea" 
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Write a brief overview of your farm, goals, or practices..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="clay-tab-card-actions">
                <button type="submit" className="clay-btn clay-btn-primary">
                  <Save size={18} /> Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==========================================================================
            TAB 2: FARM & CROPS
            ========================================================================== */}
        {activeTab === 'farm' && (
          <div className="clay-card clay-tab-card">
            <div className="clay-section-header">
              <h3><Sprout size={22} /> Farm Setup & Monitored Crops</h3>
              <p>Customize your field specifications, soil types, and monitored plants.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); saveProfileData(); }}>
              <div className="clay-form-grid">
                <div className="clay-form-group">
                  <label>Farm / Greenhouse Name</label>
                  <input 
                    type="text" 
                    className="clay-input" 
                    value={profile.farmName}
                    onChange={(e) => setProfile({ ...profile, farmName: e.target.value })}
                    placeholder="e.g. Green Horizon Eco Farm"
                  />
                </div>

                <div className="clay-form-group">
                  <label>Farm Type</label>
                  <select 
                    className="clay-select"
                    value={profile.farmType}
                    onChange={(e) => setProfile({ ...profile, farmType: e.target.value })}
                  >
                    <option value="Organic Greenhouse & Orchard">Organic Greenhouse & Orchard</option>
                    <option value="Commercial Open-Field Farm">Commercial Open-Field Farm</option>
                    <option value="Hydroponics / Vertical Farm">Hydroponics / Vertical Farm</option>
                    <option value="Home & Kitchen Garden">Home & Kitchen Garden</option>
                    <option value="Vineyard & Berry Plantation">Vineyard & Berry Plantation</option>
                  </select>
                </div>

                <div className="clay-form-group">
                  <label>Farm Size</label>
                  <input 
                    type="text" 
                    className="clay-input" 
                    value={profile.farmSize}
                    onChange={(e) => setProfile({ ...profile, farmSize: e.target.value })}
                    placeholder="e.g. 12.5 Acres / 5 Hectares"
                  />
                </div>

                <div className="clay-form-group">
                  <label>Primary Soil Type</label>
                  <select 
                    className="clay-select"
                    value={profile.soilType}
                    onChange={(e) => setProfile({ ...profile, soilType: e.target.value })}
                  >
                    <option value="Loamy with High Organic Matter">Loamy (High Organic Matter)</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Clay Soil (Nutrient Dense)">Clay Soil (Nutrient Dense)</option>
                    <option value="Silty Loam">Silty Loam</option>
                    <option value="Hydroponic Medium (Rockwool/Coco Coir)">Hydroponic (Rockwool/Coco Coir)</option>
                    <option value="Peat Moss & Perlite Mix">Peat Moss & Perlite Mix</option>
                  </select>
                </div>

                <div className="clay-form-group full-width">
                  <label>Climate Hardiness Zone</label>
                  <input 
                    type="text" 
                    className="clay-input" 
                    value={profile.climateZone}
                    onChange={(e) => setProfile({ ...profile, climateZone: e.target.value })}
                    placeholder="e.g. Zone 9b - Subtropical Mediterranean"
                  />
                </div>

                {/* Crop Tags Manager */}
                <div className="clay-form-group full-width">
                  <label>Currently Monitored Crops ({profile.crops.length})</label>
                  <p style={{ fontSize: '0.84rem', color: 'var(--clay-text-secondary)', marginBottom: '0.4rem' }}>
                    These plant varieties receive specialized neural leaf analysis and targeted pathogen alerts.
                  </p>

                  <div className="clay-add-crop-row">
                    <input 
                      type="text"
                      className="clay-input"
                      placeholder="Add crop (e.g. Tomatoes, Lettuce, Corn)..."
                      value={newCropInput}
                      onChange={(e) => setNewCropInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCrop(e);
                        }
                      }}
                    />
                    <button type="button" className="clay-btn clay-btn-primary" onClick={handleAddCrop}>
                      Add
                    </button>
                  </div>

                  <div className="clay-crop-tags-wrap">
                    {profile.crops.map((crop, idx) => (
                      <span key={idx} className="clay-crop-pill">
                        <Sprout size={15} />
                        {crop}
                        <button 
                          type="button" 
                          className="clay-crop-remove-btn"
                          onClick={() => handleRemoveCrop(crop)}
                          title={`Remove ${crop}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="clay-tab-card-actions">
                <button type="submit" className="clay-btn clay-btn-primary">
                  <Save size={18} /> Update Farm Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==========================================================================
            TAB 3: AI & PREFERENCES
            ========================================================================== */}
        {activeTab === 'preferences' && (
          <div className="clay-card clay-tab-card">
            <div className="clay-section-header">
              <h3><Sliders size={22} /> AI Diagnostics & App Preferences</h3>
              <p>Fine-tune diagnosis sensitivity, unit systems, and automatic sync features.</p>
            </div>

            <div className="clay-settings-list">
              <div className="clay-setting-tile">
                <div className="clay-setting-info">
                  <h4>Disease Detection Sensitivity</h4>
                  <p>High sensitivity flags potential fungal infections in early microscopic stages.</p>
                </div>
                <select 
                  className="clay-select" 
                  style={{ width: 'auto', minWidth: '230px' }}
                  value={preferences.diseaseSensitivity}
                  onChange={(e) => setPreferences({ ...preferences, diseaseSensitivity: e.target.value })}
                >
                  <option value="High (Early Detection)">High (Early Detection)</option>
                  <option value="Balanced (Recommended)">Balanced (Recommended)</option>
                  <option value="Low (Confirmed Symptoms Only)">Low (Confirmed Only)</option>
                </select>
              </div>

              <div className="clay-setting-tile">
                <div className="clay-setting-info">
                  <h4>Diagnostic AI Engine Mode</h4>
                  <p>Choose between maximum accuracy multi-model ensemble or lightweight fast prediction.</p>
                </div>
                <select 
                  className="clay-select" 
                  style={{ width: 'auto', minWidth: '230px' }}
                  value={preferences.aiModelMode}
                  onChange={(e) => setPreferences({ ...preferences, aiModelMode: e.target.value })}
                >
                  <option value="Ensemble Deep Vision (Highest Accuracy)">Ensemble Deep Vision (Highest Accuracy)</option>
                  <option value="Standard MobileNet (Balanced)">Standard MobileNet (Balanced)</option>
                  <option value="Fast Edge Mode (Offline Capable)">Fast Edge Mode (Offline Capable)</option>
                </select>
              </div>

              <div className="clay-setting-tile">
                <div className="clay-setting-info">
                  <h4>Measurement Units</h4>
                  <p>Toggle between metric system (°C, ha, mm) and imperial units (°F, acres, in).</p>
                </div>
                <select 
                  className="clay-select" 
                  style={{ width: 'auto', minWidth: '230px' }}
                  value={preferences.unitSystem}
                  onChange={(e) => setPreferences({ ...preferences, unitSystem: e.target.value })}
                >
                  <option value="Metric (°C, Hectares, Liters)">Metric (°C, Hectares, Liters)</option>
                  <option value="Imperial (°F, Acres, Gallons)">Imperial (°F, Acres, Gallons)</option>
                </select>
              </div>

              <div className="clay-setting-tile">
                <div className="clay-setting-info">
                  <h4>Auto Weather Geolocation Sync</h4>
                  <p>Automatically update humidity and temperature risk analysis based on real-time sensors.</p>
                </div>
                <label className="clay-switch">
                  <input 
                    type="checkbox" 
                    checked={preferences.autoWeatherSync}
                    onChange={(e) => setPreferences({ ...preferences, autoWeatherSync: e.target.checked })}
                  />
                  <span className="clay-slider"></span>
                </label>
              </div>

              <div className="clay-setting-tile">
                <div className="clay-setting-info">
                  <h4>Automatic Local Cloud Backup</h4>
                  <p>Store scheduled tracker history and crop scans in encrypted local storage.</p>
                </div>
                <label className="clay-switch">
                  <input 
                    type="checkbox" 
                    checked={preferences.autoBackup}
                    onChange={(e) => setPreferences({ ...preferences, autoBackup: e.target.checked })}
                  />
                  <span className="clay-slider"></span>
                </label>
              </div>
            </div>

            <div className="clay-tab-card-actions">
              <button type="button" className="clay-btn clay-btn-primary" onClick={savePreferencesData}>
                <Save size={18} /> Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* ==========================================================================
            TAB 4: NOTIFICATIONS & ALERTS
            ========================================================================== */}
        {activeTab === 'notifications' && (
          <div className="clay-card clay-tab-card">
            <div className="clay-section-header">
              <h3><Bell size={22} /> Notification & Alert Dispatch</h3>
              <p>Control what plant alerts you receive and via which channels.</p>
            </div>

            <div className="clay-settings-list">
              <div className="clay-setting-tile">
                <div className="clay-setting-info">
                  <h4>Critical Pathogen & Pest Alerts</h4>
                  <p>Receive immediate alerts when a contagious blight, rust, or mildew is detected.</p>
                </div>
                <label className="clay-switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.pushDiseaseOutbreak}
                    onChange={(e) => setNotifications({ ...notifications, pushDiseaseOutbreak: e.target.checked })}
                  />
                  <span className="clay-slider"></span>
                </label>
              </div>

              <div className="clay-setting-tile">
                <div className="clay-setting-info">
                  <h4>Severe Weather & Frost Warnings</h4>
                  <p>Get notified of sudden temperature drops, heatwaves, or high-humidity spore conditions.</p>
                </div>
                <label className="clay-switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.severeWeatherAlerts}
                    onChange={(e) => setNotifications({ ...notifications, severeWeatherAlerts: e.target.checked })}
                  />
                  <span className="clay-slider"></span>
                </label>
              </div>

              <div className="clay-setting-tile">
                <div className="clay-setting-info">
                  <h4>Watering & Care Schedule Reminders</h4>
                  <p>Daily notifications for upcoming irrigation, organic spray, or fertilization routines.</p>
                </div>
                <label className="clay-switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.wateringReminders}
                    onChange={(e) => setNotifications({ ...notifications, wateringReminders: e.target.checked })}
                  />
                  <span className="clay-slider"></span>
                </label>
              </div>

              <div className="clay-setting-tile">
                <div className="clay-setting-info">
                  <h4>Weekly Crop Health Digest (Email)</h4>
                  <p>A summary email detailing farm health trends, soil metrics, and treated areas.</p>
                </div>
                <label className="clay-switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.weeklyDigest}
                    onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
                  />
                  <span className="clay-slider"></span>
                </label>
              </div>

              <div className="clay-setting-tile">
                <div className="clay-setting-info">
                  <h4>SMS Urgent Notifications</h4>
                  <p>Send text message notifications to {profile.phone} for emergency crop risks.</p>
                </div>
                <label className="clay-switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.smsCriticalAlerts}
                    onChange={(e) => setNotifications({ ...notifications, smsCriticalAlerts: e.target.checked })}
                  />
                  <span className="clay-slider"></span>
                </label>
              </div>
            </div>

            <div className="clay-tab-card-actions">
              <button type="button" className="clay-btn clay-btn-primary" onClick={saveNotificationsData}>
                <Save size={18} /> Save Notification Settings
              </button>
            </div>
          </div>
        )}

        {/* ==========================================================================
            TAB 5: SECURITY & PRIVACY
            ========================================================================== */}
        {activeTab === 'security' && (
          <div className="clay-card clay-tab-card">
            <div className="clay-section-header">
              <h3><Shield size={22} /> Account Security & Active Sessions</h3>
              <p>Manage your password, two-factor authentication, and connected devices.</p>
            </div>

            {/* Password Change Form */}
            <form onSubmit={handlePasswordUpdate}>
              <h4 style={{ color: 'var(--clay-text-primary)', marginBottom: '1.15rem', fontSize: '1.1rem', fontWeight: 700 }}>
                Change Password
              </h4>
              
              <div className="clay-form-grid">
                <div className="clay-form-group">
                  <label>Current Password</label>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    className="clay-input" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="clay-form-group">
                  <label>New Password</label>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    className="clay-input" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                  />
                  {newPassword && (
                    <div className="clay-password-meter-wrap">
                      <div className="clay-password-meter-track">
                        <div 
                          className="clay-password-meter-fill" 
                          style={{ width: `${passwordStrength.score}%`, backgroundColor: passwordStrength.color }}
                        ></div>
                      </div>
                      <span className="clay-password-meter-text" style={{ color: passwordStrength.color }}>
                        Strength: {passwordStrength.label}
                      </span>
                    </div>
                  )}
                </div>

                <div className="clay-form-group">
                  <label>Confirm New Password</label>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    className="clay-input" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                  />
                </div>

                <div className="clay-form-group" style={{ justifyContent: 'center' }}>
                  <label style={{ cursor: 'pointer', marginTop: '1.6rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                    <input 
                      type="checkbox" 
                      checked={showPassword} 
                      onChange={(e) => setShowPassword(e.target.checked)} 
                      style={{ width: '18px', height: '18px', accentColor: 'var(--clay-sage)', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--clay-text-primary)' }}>
                      Show Passwords
                    </span>
                  </label>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <button type="submit" className="clay-btn clay-btn-primary">
                  <Key size={18} /> Update Password
                </button>
              </div>
            </form>

            {/* 2FA Section */}
            <div style={{ borderTop: '1.5px solid rgba(143, 166, 131, 0.18)', paddingTop: '1.5rem' }}>
              <div className="clay-setting-tile">
                <div className="clay-setting-info">
                  <h4>Two-Factor Authentication (2FA)</h4>
                  <p>Add an extra layer of molded security using an authenticator app (Google Authenticator, Authy).</p>
                </div>
                <button 
                  type="button" 
                  className={twoFactorEnabled ? 'clay-btn clay-btn-danger-outline' : 'clay-btn clay-btn-secondary'}
                  onClick={toggle2FA}
                >
                  {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </button>
              </div>
            </div>

            {/* Active Devices */}
            <div style={{ borderTop: '1.5px solid rgba(143, 166, 131, 0.18)', paddingTop: '1.5rem' }}>
              <h4 style={{ color: 'var(--clay-text-primary)', marginBottom: '1.15rem', fontSize: '1.1rem', fontWeight: 700 }}>
                Active Signed-in Devices
              </h4>
              <div className="clay-sessions-list">
                {sessions.map((sess) => (
                  <div key={sess.id} className="clay-session-card">
                    <div className="clay-session-main">
                      <div className="clay-session-icon">
                        <Smartphone size={22} />
                      </div>
                      <div className="clay-session-meta">
                        <h5>
                          {sess.device} {sess.isCurrent && <span style={{ color: 'var(--clay-olive)', fontSize: '0.78rem', fontWeight: 700 }}>(This Device)</span>}
                        </h5>
                        <p>{sess.location} • {sess.lastActive}</p>
                      </div>
                    </div>
                    {!sess.isCurrent && (
                      <button 
                        type="button" 
                        className="clay-btn clay-btn-danger-outline"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.84rem' }}
                        onClick={() => revokeSession(sess.id)}
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================================
            TAB 6: ACTIVITY & DATA BACKUP
            ========================================================================== */}
        {activeTab === 'activity' && (
          <div className="clay-card clay-tab-card">
            <div className="clay-section-header">
              <h3><Activity size={22} /> Activity Audit & Data Portability</h3>
              <p>Review your recent system activities and export or reset your local farm database.</p>
            </div>

            {/* Activity Timeline */}
            <div>
              <h4 style={{ color: 'var(--clay-text-primary)', marginBottom: '1.15rem', fontSize: '1.1rem', fontWeight: 700 }}>
                Recent Account Timeline
              </h4>
              <div className="clay-activity-timeline">
                {activities.map((act) => (
                  <div key={act.id} className="clay-activity-item">
                    <div className="clay-activity-dot"></div>
                    <div className="clay-activity-content">
                      <p>{act.text}</p>
                      <span className="clay-activity-time">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Portability */}
            <div style={{ borderTop: '1.5px solid rgba(143, 166, 131, 0.18)', paddingTop: '1.5rem' }}>
              <h4 style={{ color: 'var(--clay-text-primary)', marginBottom: '0.4rem', fontSize: '1.1rem', fontWeight: 700 }}>
                Data Export & Migration
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--clay-text-secondary)', marginBottom: '1.35rem' }}>
                Download a complete JSON snapshot of your profile, crop configurations, treatment schedules, and logs.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  className="clay-btn clay-btn-secondary"
                  onClick={handleExportData}
                >
                  <Download size={18} /> Export Full Farm Data (.json)
                </button>

                <button 
                  type="button" 
                  className="clay-btn clay-btn-danger-outline"
                  onClick={handleClearData}
                >
                  <Trash2 size={18} /> Reset All Local Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
