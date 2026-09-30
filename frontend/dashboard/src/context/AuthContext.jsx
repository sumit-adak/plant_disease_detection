import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_GUEST_USER = {
  fullName: 'Guest Farmer',
  email: 'guest@plantcare.ai',
  role: 'Guest Visitor',
  avatarUrl: null,
  avatarType: 'preset',
  avatarPreset: '🌱'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [trialCount, setTrialCount] = useState(0); // 0 = unused, 1 = trial used
  const [loading, setLoading] = useState(true);

  // Initialize auth & trial state from localStorage
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('plantGuardAuth');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        if (parsed.isLoggedIn && parsed.user) {
          setUser(parsed.user);
          setIsLoggedIn(true);
        }
      }

      const storedTrial = localStorage.getItem('plantGuardTrialScans');
      if (storedTrial) {
        setTrialCount(parseInt(storedTrial, 10) || 0);
      }
    } catch (err) {
      console.error('Error loading auth state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login handler
  const login = (email, password) => {
    // Check saved users or create standard session
    const savedUsers = JSON.parse(localStorage.getItem('plantGuardRegisteredUsers') || '[]');
    const existingUser = savedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    const loggedUser = existingUser || {
      fullName: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Demo Farmer',
      email: email,
      role: 'Pro Agri-Grower',
      avatarUrl: null,
      avatarType: 'preset',
      avatarPreset: '🧑‍🌾',
      farmName: 'Green Horizon Eco Farm',
      location: 'California Valley, USA',
      farmType: 'Organic Greenhouse & Orchard',
      crops: ['Tomatoes', 'Bell Peppers', 'Strawberries', 'Potatoes', 'Lettuce'],
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    setUser(loggedUser);
    setIsLoggedIn(true);

    localStorage.setItem('plantGuardAuth', JSON.stringify({ isLoggedIn: true, user: loggedUser }));
    localStorage.setItem('plantGuardUserProfile', JSON.stringify(loggedUser));
    window.dispatchEvent(new Event('plantGuardProfileUpdated'));

    return { success: true, user: loggedUser };
  };

  // Sign up handler
  const signup = (userData) => {
    const newUser = {
      fullName: userData.fullName || 'New Farmer',
      email: userData.email,
      role: userData.role || 'Pro Agri-Grower',
      farmName: userData.farmName || 'My Family Farm',
      avatarUrl: null,
      avatarType: 'preset',
      avatarPreset: '🧑‍🌾',
      location: userData.location || 'Local Region',
      farmType: 'Organic Greenhouse',
      crops: ['Tomatoes', 'Potatoes', 'Corn'],
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    // Save to registered users list
    const savedUsers = JSON.parse(localStorage.getItem('plantGuardRegisteredUsers') || '[]');
    savedUsers.push({ ...newUser, password: userData.password });
    localStorage.setItem('plantGuardRegisteredUsers', JSON.stringify(savedUsers));

    // Log user in
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('plantGuardAuth', JSON.stringify({ isLoggedIn: true, user: newUser }));
    localStorage.setItem('plantGuardUserProfile', JSON.stringify(newUser));
    window.dispatchEvent(new Event('plantGuardProfileUpdated'));

    return { success: true, user: newUser };
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('plantGuardAuth');
    window.dispatchEvent(new Event('plantGuardProfileUpdated'));
  };

  // Free trial consumption
  const consumeTrialScan = () => {
    if (isLoggedIn) return true; // Logged-in users have unlimited scans
    if (trialCount < 1) {
      const nextCount = trialCount + 1;
      setTrialCount(nextCount);
      localStorage.setItem('plantGuardTrialScans', nextCount.toString());
      return true; // Scan allowed
    }
    return false; // Trial exceeded!
  };

  const canPerformDiagnosis = isLoggedIn || trialCount < 1;
  const remainingTrials = isLoggedIn ? Infinity : Math.max(0, 1 - trialCount);

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      loading,
      trialCount,
      remainingTrials,
      canPerformDiagnosis,
      login,
      signup,
      logout,
      consumeTrialScan,
      useTrialScan: consumeTrialScan
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
