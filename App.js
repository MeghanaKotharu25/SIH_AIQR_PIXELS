import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import QRScanPage from './pages/QRScanPage';
import FittingDetailPage from './pages/FittingDetailPage';
import FaultReportPage from './pages/FaultReportPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import AuditLogsPage from './pages/AuditLogsPage';

// Components
import Navigation from './components/Navigation';

// Utils
import { verifyToken, getUserFromToken } from './utils/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en'); // en, hi

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('authToken');
    if (token && verifyToken(token)) {
      setIsAuthenticated(true);
      setUser(getUserFromToken(token));
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navigation user={user} onLogout={handleLogout} />}
        
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <LoginPage onLogin={handleLogin} language={language} setLanguage={setLanguage} />
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <DashboardPage user={user} /> : 
              <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/scan" 
            element={
              isAuthenticated ? 
              <QRScanPage user={user} /> : 
              <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/fitting/:id" 
            element={
              isAuthenticated ? 
              <FittingDetailPage user={user} /> : 
              <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/report-fault" 
            element={
              isAuthenticated ? 
              <FaultReportPage user={user} /> : 
              <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/alerts" 
            element={
              isAuthenticated ? 
              <AlertsPage user={user} /> : 
              <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/reports" 
            element={
              isAuthenticated ? 
              <ReportsPage user={user} /> : 
              <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/audit" 
            element={
              isAuthenticated && user?.role === 'admin' ? 
              <AuditLogsPage user={user} /> : 
              <Navigate to="/dashboard" />
            } 
          />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
