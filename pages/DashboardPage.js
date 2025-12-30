import React, { useState, useEffect } from 'react';
import { getDashboardStats, getAlerts } from '../utils/api';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DashboardPage.css';

const DashboardPage = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, alertsData] = await Promise.all([
        getDashboardStats(),
        getAlerts(user?.role)
      ]);
      setStats(statsData);
      setAlerts(alertsData.slice(0, 5)); // Top 5 alerts
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page"><div className="spinner"></div></div>;
  }

  const chartData = [
    { name: 'Active', count: stats?.activeFittings || 0, fill: '#10b981' },
    { name: 'Attention', count: stats?.attentionFittings || 0, fill: '#f59e0b' },
    { name: 'Critical', count: stats?.criticalFittings || 0, fill: '#ef4444' }
  ];

  return (
    <div className="page dashboard-page">
      <div className="container">
        <h1>Dashboard</h1>
        <p className="welcome-text">Welcome, {user?.username}</p>

        <div className="stats-grid grid grid-4">
          <div className="stat-card card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats?.totalFittings || 0}</h3>
              <p>Total Fittings</p>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <h3>{stats?.openFaults || 0}</h3>
              <p>Open Faults</p>
            </div>
          </div>

          <div className="stat-card card critical">
            <div className="stat-icon">🚨</div>
            <div className="stat-content">
              <h3>{stats?.criticalFittings || 0}</h3>
              <p>Critical Alerts</p>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3>{stats?.warrantyExpired || 0}</h3>
              <p>Warranty Expired</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content grid grid-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Fitting Status Overview</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a4a5e" />
                <XAxis dataKey="name" stroke="#a0a0b0" />
                <YAxis stroke="#a0a0b0" />
                <Tooltip 
                  contentStyle={{ background: '#2a2a3e', border: '1px solid #4a4a5e' }}
                  labelStyle={{ color: '#e5e5e5' }}
                />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Alerts</h3>
              <Link to="/alerts" className="btn btn-secondary btn-sm">View All</Link>
            </div>
            <div className="alerts-list">
              {alerts.length === 0 ? (
                <p className="no-data">No pending alerts</p>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="alert-item">
                    <div className="alert-header">
                      <span className={`status-badge status-${alert.severity.toLowerCase()}`}>
                        {alert.severity}
                      </span>
                      <span className="alert-date">{alert.date}</span>
                    </div>
                    <p className="alert-fitting">{alert.fitting_id}</p>
                    <p className="alert-location">{alert.location}</p>
                    <p className="alert-type">{alert.type}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <Link to="/scan" className="btn btn-primary btn-lg">
            📷 Scan QR Code
          </Link>
          <Link to="/report-fault" className="btn btn-warning btn-lg">
            ⚠️ Report Fault
          </Link>
          <Link to="/reports" className="btn btn-secondary btn-lg">
            📋 View Reports
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
