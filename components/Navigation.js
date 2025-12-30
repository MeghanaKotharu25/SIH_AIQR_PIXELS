import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ user, onLogout }) => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path ? 'active' : '';
  
  const canAccess = (requiredRoles) => {
    if (!requiredRoles) return true;
    return requiredRoles.includes(user?.role);
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>Railway Track System</h2>
        <span className="user-info">{user?.username} ({user?.role})</span>
      </div>
      
      <div className="nav-links">
        <Link to="/dashboard" className={isActive('/dashboard')}>
          Dashboard
        </Link>
        
        <Link to="/scan" className={isActive('/scan')}>
          Scan QR
        </Link>
        
        {canAccess(['worker', 'supervisor', 'pwi', 'admin']) && (
          <Link to="/report-fault" className={isActive('/report-fault')}>
            Report Fault
          </Link>
        )}
        
        {canAccess(['supervisor', 'pwi', 'station_master', 'admin']) && (
          <Link to="/alerts" className={isActive('/alerts')}>
            Alerts
          </Link>
        )}
        
        <Link to="/reports" className={isActive('/reports')}>
          Reports
        </Link>
        
        {canAccess(['admin']) && (
          <Link to="/audit" className={isActive('/audit')}>
            Audit Logs
          </Link>
        )}
        
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
