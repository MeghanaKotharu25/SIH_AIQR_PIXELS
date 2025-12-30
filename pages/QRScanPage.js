import React, { useState, useRef } from 'react';
import { scanQRCode, getFittingDetails } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './QRScanPage.css';

const QRScanPage = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [manualId, setManualId] = useState('');
  const [reconstructed, setReconstructed] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScanning(true);
    setError('');
    setResult(null);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64Image = event.target.result;
          
          // Send to backend
          const scanResult = await scanQRCode(base64Image);
          
          if (scanResult.success) {
            setReconstructed(scanResult.reconstructed);
            setConfidence(scanResult.confidence);
            
            // Fetch fitting details
            const fittingId = scanResult.data;
            const details = await getFittingDetails(fittingId);
            setResult(details);
          } else {
            setError(scanResult.error || 'Failed to scan QR code');
          }
        } catch (err) {
          setError(err.message || 'Error processing QR code');
        } finally {
          setScanning(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Error reading file');
      setScanning(false);
    }
  };

  const handleManualEntry = async () => {
    if (!manualId.trim()) {
      setError('Please enter a fitting ID');
      return;
    }

    setScanning(true);
    setError('');

    try {
      const details = await getFittingDetails(manualId.trim());
      setResult(details);
      setReconstructed(false);
    } catch (err) {
      setError('Fitting not found');
    } finally {
      setScanning(false);
    }
  };

  const viewFullDetails = () => {
    if (result) {
      navigate(`/fitting/${result.fitting_id}`);
    }
  };

  return (
    <div className="page qr-scan-page">
      <div className="container">
        <h1>Scan QR Code</h1>

        <div className="scan-container card">
          <div className="scan-methods">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-primary btn-lg scan-btn"
              disabled={scanning}
            >
              📷 Upload QR Image
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>

          {scanning && (
            <div className="scanning-status">
              <div className="spinner"></div>
              <p>Processing QR code...</p>
              {reconstructed && <p className="ai-status">🤖 AI Reconstruction in progress</p>}
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {result && (
            <div className="scan-result">
              {reconstructed && (
                <div className="alert alert-info">
                  ✨ QR code reconstructed using AI (Confidence: {(confidence * 100).toFixed(1)}%)
                </div>
              )}
              
              <div className="result-card">
                <h2>Fitting Information</h2>
                
                <div className="result-grid">
                  <div className="result-item">
                    <span className="label">Fitting ID:</span>
                    <span className="value">{result.fitting_id}</span>
                  </div>
                  
                  <div className="result-item">
                    <span className="label">Type:</span>
                    <span className="value">{result.fitting_type}</span>
                  </div>
                  
                  <div className="result-item">
                    <span className="label">Material:</span>
                    <span className="value">{result.material}</span>
                  </div>
                  
                  <div className="result-item">
                    <span className="label">Vendor:</span>
                    <span className="value">{result.vendor_name}</span>
                  </div>
                  
                  <div className="result-item">
                    <span className="label">Batch ID:</span>
                    <span className="value">{result.batch_id}</span>
                  </div>
                  
                  <div className="result-item">
                    <span className="label">Supply Date:</span>
                    <span className="value">{result.supply_date}</span>
                  </div>
                  
                  <div className="result-item">
                    <span className="label">Warranty:</span>
                    <span className="value">{result.warranty_months} months</span>
                  </div>
                  
                  <div className="result-item">
                    <span className="label">Status:</span>
                    <span className={`status-badge status-${result.status.toLowerCase()}`}>
                      {result.status}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={viewFullDetails}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  View Full Details & History
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="manual-entry card">
          <h3>Manual Entry</h3>
          <p>Enter Fitting ID if QR code cannot be scanned</p>
          
          <div className="manual-form">
            <input
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder="Enter Fitting ID (e.g., FIT-2024-001)"
            />
            <button
              onClick={handleManualEntry}
              className="btn btn-secondary"
              disabled={scanning}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanPage;
