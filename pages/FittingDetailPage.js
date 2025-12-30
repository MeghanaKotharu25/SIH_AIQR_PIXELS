import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFittingDetails } from '../utils/api';

const FittingDetailPage = ({ user }) => {
  const { fittingId } = useParams();
  const navigate = useNavigate();
  const [fitting, setFitting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFittingDetails();
  }, [fittingId]);

  const loadFittingDetails = async () => {
    try {
      const data = await getFittingDetails(fittingId);
      setFitting(data);
    } catch (err) {
      setError('Fitting not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !fitting) {
    return (
      <div className="page">
        <div className="container">
          <div className="alert alert-danger">{error || 'Fitting not found'}</div>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const warrantyExpiry = new Date(fitting.supply_date);
  warrantyExpiry.setMonth(warrantyExpiry.getMonth() + fitting.warranty_months);
  const isWarrantyValid = warrantyExpiry > new Date();
  const warrantyStatus = isWarrantyValid ? 'Valid' : 'Expired';

  return (
    <div className="page" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            ← Back
          </button>
          <h1 style={{ margin: 0 }}>{fitting.fitting_id}</h1>
          <span className={`status-badge status-${fitting.status.toLowerCase()}`}>
            {fitting.status}
          </span>
        </div>

        {/* Main Details Card */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 className="card-title">Fitting Information</h2>
          <div className="grid grid-3" style={{ gap: '2rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#a0a0b0', marginBottom: '0.5rem' }}>Type</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{fitting.fitting_type}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#a0a0b0', marginBottom: '0.5rem' }}>Material</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{fitting.material}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#a0a0b0', marginBottom: '0.5rem' }}>Specifications</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{fitting.specifications}</p>
            </div>
          </div>
        </div>

        {/* Vendor & Supply Info */}
        <div className="grid grid-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card">
            <h3 className="card-title">Vendor Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#a0a0b0' }}>Vendor Name</p>
                <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{fitting.vendor_name}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#a0a0b0' }}>Vendor Code</p>
                <p style={{ fontSize: '1rem' }}>{fitting.vendor_code}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#a0a0b0' }}>Batch ID</p>
                <p style={{ fontSize: '1rem' }}>{fitting.batch_id}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Supply & Warranty</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#a0a0b0' }}>Manufacture Date</p>
                <p style={{ fontSize: '1rem' }}>{fitting.manufacture_date}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#a0a0b0' }}>Supply Date</p>
                <p style={{ fontSize: '1rem' }}>{fitting.supply_date}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#a0a0b0' }}>Warranty</p>
                <p style={{ fontSize: '1rem' }}>
                  {fitting.warranty_months} months - 
                  <span style={{ 
                    marginLeft: '0.5rem',
                    color: isWarrantyValid ? '#10b981' : '#ef4444',
                    fontWeight: '600'
                  }}>
                    {warrantyStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Inspection History */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 className="card-title">Inspection History</h3>
          {fitting.inspections && fitting.inspections.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #4a4a5e' }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Inspector</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Location</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Fault Type</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Severity</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fitting.inspections.map((inspection, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #4a4a5e' }}>
                      <td style={{ padding: '1rem' }}>{inspection.inspection_date}</td>
                      <td style={{ padding: '1rem' }}>{inspection.inspector_name}</td>
                      <td style={{ padding: '1rem' }}>{inspection.section} KM {inspection.km_location}</td>
                      <td style={{ padding: '1rem' }}>{inspection.fault_type || 'None'}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`status-badge status-${inspection.severity.toLowerCase()}`}>
                          {inspection.severity}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`status-badge status-${inspection.status.toLowerCase()}`}>
                          {inspection.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#a0a0b0', textAlign: 'center', padding: '2rem' }}>
              No inspection records available
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/report-fault" className="btn btn-warning">
            ⚠️ Report Fault
          </Link>
          <button onClick={() => window.print()} className="btn btn-secondary">
            🖨️ Print Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default FittingDetailPage;