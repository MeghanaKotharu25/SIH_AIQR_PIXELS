import React, { useState } from 'react';
import { login } from '../utils/api';
import './LoginPage.css';

const LoginPage = ({ onLogin, language, setLanguage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('worker');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { value: 'worker', label: 'Field Worker', icon: '👷' },
    { value: 'supervisor', label: 'Supervisor', icon: '👔' },
    { value: 'pwi', label: 'PWI', icon: '🔧' },
    { value: 'station_master', label: 'Station Master', icon: '🚉' },
    { value: 'admin', label: 'Administrator', icon: '⚙️' }
  ];

  const languages = [
    { value: 'en', label: 'English', icon: '🇬🇧' },
    { value: 'hi', label: 'हिंदी', icon: '🇮🇳' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password, role);
      onLogin(result.token, result.user);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Railway Track System</h1>
          <p>Track Fitting Identification & Maintenance</p>
        </div>

        <div className="language-selector">
          {languages.map(lang => (
            <button
              key={lang.value}
              className={`lang-btn ${language === lang.value ? 'active' : ''}`}
              onClick={() => setLanguage(lang.value)}
            >
              <span className="lang-icon">{lang.icon}</span>
              {lang.label}
            </button>
          ))}
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Your Role</label>
            <div className="role-selector">
              {roles.map(r => (
                <button
                  key={r.value}
                  type="button"
                  className={`role-btn ${role === r.value ? 'active' : ''}`}
                  onClick={() => setRole(r.value)}
                >
                  <span className="role-icon">{r.icon}</span>
                  <span className="role-label">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary btn-login"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="demo-info">
          <p>Demo System - Use any username/password</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
