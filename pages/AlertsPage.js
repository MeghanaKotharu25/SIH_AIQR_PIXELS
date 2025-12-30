import React, { useState, useEffect } from 'react';
import { getAlerts } from '../utils/api';

const AlertsPage = ({ user }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, critical, moderate, minor

  useEffect(() => {
    loadAlerts();
  }, [user]);

  const loadAlerts = async () => {
    try {
      const data = await getAlerts(user?.role);
      setAlerts(data);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.severity.toLowerCase() === filter);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Alerts & Notifications</h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >
              All ({alerts.length})
            </button>
            <button 
              className={`btn ${filter === 'critical' ? 'btn-danger' : 'btn-secondary'}`}
              onClick={() => setFilter('critical')}
            >
              Critical ({alerts.filter(a => a.severity.toLowerCase() === 'critical').length})
            </button>
            <button 
              className={`btn ${filter === 'moderate' ? 'btn-warning' : 'btn-secondary'}`}
              onClick={() => setFilter('moderate')}
            >
              Moderate ({alerts.filter(a => a.severity.toLowerCase() === 'moderate').length})
            </button>
          </div>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#a0a0b0', fontSize: '1.1rem' }}>
              No {filter !== 'all' ? filter : ''} alerts at this time
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredAlerts.map(alert => (
              <div key={alert.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{alert.fitting_id}</h3>
                    <p style={{ color: '#a0a0b0', margin: 0 }}>{alert.date}</p>
                  </div>
                  <span className={`status-badge status-${alert.severity.toLowerCase()}`}>
                    {alert.severity}
                  </span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ color: '#a0a0b0', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Location</p>
                    <p style={{ margin: 0 }}>{alert.location}</p>
                  </div>
                  <div>
                    <p style={{ color: '#a0a0b0', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Fault Type</p>
                    <p style={{ margin: 0 }}>{alert.type}</p>
                  </div>
                  <div>
                    <p style={{ color: '#a0a0b0', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Inspector</p>
                    <p style={{ margin: 0 }}>{alert.inspector}</p>
                  </div>
                </div>
                
                <p style={{ margin: 0, marginBottom: '1rem' }}>{alert.description}</p>
                
                {['supervisor', 'pwi', 'station_master', 'admin'].includes(user?.role) && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary">Approve</button>
                    <button className="btn btn-secondary">View Details</button>
                    <button className="btn btn-danger">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;