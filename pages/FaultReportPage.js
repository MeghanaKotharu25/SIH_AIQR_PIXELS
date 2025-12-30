import React, { useState } from 'react';
import { submitFaultReport } from '../utils/api';

const FaultReportPage = ({ user }) => {
  const [formData, setFormData] = useState({
    fittingId: '',
    faultType: '',
    severity: 'moderate',
    description: '',
    location: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const faultTypes = [
    'Loosening',
    'Crack',
    'Wear',
    'Corrosion',
    'Deformation',
    'Missing Component',
    'Improper Installation',
    'Material Failure',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await submitFaultReport({
        ...formData,
        reportedBy: user?.username,
        reportedDate: new Date().toISOString().split('T')[0]
      });
      setSuccess(true);
      // Reset form
      setFormData({
        fittingId: '',
        faultType: '',
        severity: 'moderate',
        description: '',
        location: ''
      });
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="container">
        <h1>Report Fault</h1>
        <p style={{ color: '#a0a0b0', marginBottom: '2rem' }}>
          Submit a detailed fault report for track fittings
        </p>

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '2rem' }}>
            ✅ Fault report submitted successfully! Report ID: #{Math.floor(Math.random() * 10000)}
          </div>
        )}

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Fitting ID *</label>
              <input
                type="text"
                name="fittingId"
                value={formData.fittingId}
                onChange={handleChange}
                placeholder="e.g., FIT-2024-001"
                required
              />
              <small style={{ color: '#a0a0b0' }}>
                Enter the fitting ID from the QR code or tag
              </small>
            </div>

            <div className="form-group">
              <label>Fault Type *</label>
              <select
                name="faultType"
                value={formData.faultType}
                onChange={handleChange}
                required
              >
                <option value="">Select fault type</option>
                {faultTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Severity Level *</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="severity"
                    value="minor"
                    checked={formData.severity === 'minor'}
                    onChange={handleChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span className="status-badge status-minor">Minor</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="severity"
                    value="moderate"
                    checked={formData.severity === 'moderate'}
                    onChange={handleChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span className="status-badge status-moderate">Moderate</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="severity"
                    value="critical"
                    checked={formData.severity === 'critical'}
                    onChange={handleChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span className="status-badge status-critical">Critical</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Delhi-Agra KM 45.2"
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Provide detailed description of the fault..."
                required
              />
            </div>

            <div style={{ 
              background: '#2a2a3e', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1.5rem' 
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#a0a0b0' }}>
                <strong>Reported by:</strong> {user?.username} ({user?.role})
                <br />
                <strong>Date:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={submitting}
                style={{ flex: 1 }}
              >
                {submitting ? 'Submitting...' : 'Submit Fault Report'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-lg"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="card" style={{ marginTop: '2rem', background: '#2a2a3e' }}>
          <h3 style={{ marginBottom: '1rem' }}>📋 Severity Guidelines</h3>
          <ul style={{ paddingLeft: '1.5rem', color: '#a0a0b0' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: '#10b981' }}>Minor:</strong> Cosmetic issues, no safety impact
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: '#f59e0b' }}>Moderate:</strong> Functional issues, requires monitoring
            </li>
            <li>
              <strong style={{ color: '#ef4444' }}>Critical:</strong> Safety risk, immediate action required
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FaultReportPage;