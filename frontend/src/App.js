import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import MainApp from './components/MainApp'; // This now refers to MainApp
import { getCurrentUser } from './services/api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    console.log('App: Checking authentication status...');
    const checkAuthStatus = async () => {
      // Prevent multiple simultaneous auth checks
      if (authChecked) return;
      
      try {
        setLoading(true);
        const response = await getCurrentUser();
        console.log('App: Auth response:', response);
        if (response.data && response.data.id) {
          console.log('App: User authenticated:', response.data);
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          console.log('App: No user data in response');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Not authenticated, which is fine
        console.log('App: User not authenticated:', error.message);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        console.log('App: Finished authentication check');
        setLoading(false);
        setAuthChecked(true);
      }
    };

    checkAuthStatus();
  }, [authChecked]);

  const handleLoginSuccess = (userData) => {
    console.log('App: Login successful, user:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    setAuthChecked(true);
    setLoading(false);
  };

  const handleLogout = () => {
    console.log('App: Logout requested');
    setUser(null);
    setIsAuthenticated(false);
    setAuthChecked(false); // Reset auth check so it runs again
    setLoading(false);
  };

  console.log('App: Rendering with state - loading:', loading, 'isAuthenticated:', isAuthenticated);

  // Show loading screen while checking authentication
  if (loading) {
    console.log('App: Showing loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    console.log('App: Showing login screen');
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Show main app if authenticated
  console.log('App: Showing main application');
  return <MainApp onLogout={handleLogout} user={user} />;
}

export default App;