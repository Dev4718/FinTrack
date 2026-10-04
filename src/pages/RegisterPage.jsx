import React, { useState } from 'react';
import { Wallet, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './AuthPages.css';

const RegisterPage = () => {
  const { navigateTo, register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await register(name, email, password);
      navigateTo('dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Back to Home Button */}
      <button 
        type="button" 
        className="auth-back-btn" 
        onClick={() => navigateTo('landing')}
        title="Back to Landing Page"
      >
        <ArrowLeft size={18} />
        <span>Back to Home</span>
      </button>

      {/* Left Brand Showcase Column */}
      <div className="auth-brand-side">
        <div className="auth-brand-header">
          <div className="auth-brand-logo" onClick={() => navigateTo('landing')}>
            <div className="brand-icon-box">
              <Wallet size={24} />
            </div>
            <span className="brand-name">Fin<span className="brand-highlight">Track</span></span>
          </div>
        </div>

        <div className="auth-brand-content">
          <h2 className="brand-hero-title">
            Create your account<br />
            and start your journey<br />
            to financial freedom.
          </h2>

          {/* Plant Sprout Growing in Coin Pot Illustration */}
          <div className="auth-illustration">
            <svg viewBox="0 0 280 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="auth-svg">
              {/* Soft radial glow */}
              <circle cx="140" cy="120" r="100" fill="#10B981" fillOpacity="0.15" />
              
              {/* Flower Pot */}
              <path d="M95 140H185L175 205C174 211 169 215 163 215H117C111 215 106 211 105 205L95 140Z" fill="#047857" />
              <rect x="90" y="132" width="100" height="12" rx="4" fill="#059669" />

              {/* Pot Soil */}
              <ellipse cx="140" cy="138" rx="45" ry="6" fill="#064E3B" />

              {/* Plant Stem */}
              <path d="M140 140C140 110 145 90 140 60" stroke="#34D399" strokeWidth="5" strokeLinecap="round" />

              {/* Sprouting Green Leaves */}
              <path d="M140 100C165 85 175 105 160 120C145 130 140 105 140 100Z" fill="#10B981" />
              <path d="M140 80C115 65 105 85 120 100C135 110 140 85 140 80Z" fill="#34D399" />
              <path d="M140 60C155 40 135 30 125 45C120 55 135 58 140 60Z" fill="#059669" />
              <path d="M140 60C125 40 145 30 155 45C160 55 145 58 140 60Z" fill="#10B981" />

              {/* Gold Coins around pot */}
              <g transform="translate(65, 175)">
                <ellipse cx="16" cy="14" rx="16" ry="9" fill="#D97706" />
                <ellipse cx="16" cy="10" rx="16" ry="9" fill="#F59E0B" />
                <ellipse cx="16" cy="8" rx="13" ry="6" fill="#FBBF24" />
                <text x="13" y="11" fill="#78350F" fontSize="9" fontWeight="bold">₹</text>
              </g>
              <g transform="translate(185, 180)">
                <ellipse cx="18" cy="15" rx="18" ry="10" fill="#D97706" />
                <ellipse cx="18" cy="10" rx="18" ry="10" fill="#F59E0B" />
                <ellipse cx="18" cy="8" rx="15" ry="7" fill="#FCD34D" />
                <text x="15" y="12" fill="#78350F" fontSize="10" fontWeight="bold">₹</text>
              </g>
            </svg>
          </div>
        </div>

        <div className="auth-brand-footer">
          <p className="auth-quote">“Small steps today, big dreams tomorrow.”</p>
        </div>
      </div>

      {/* Right Register Form Column */}
      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          <div className="form-header">
            <h1 className="form-title">Create Account</h1>
            <p className="form-subtitle">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Full Name */}
            <div className="auth-field">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Address */}
            <div className="auth-field">
              <label htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="auth-field">
              <label htmlFor="reg-password">Password</label>
              <div className="password-input-box">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="auth-field">
              <label htmlFor="reg-confirm-password">Confirm Password</label>
              <div className="password-input-box">
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.625rem 0.875rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {errorMsg}
              </div>
            )}

            {/* Green Register Button */}
            <button type="submit" className="btn-auth-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Register'}
            </button>

            {/* Switch to Login */}
            <p className="switch-auth-text">
              Already have an account?{' '}
              <button 
                type="button" 
                className="link-highlight"
                onClick={() => navigateTo('login')}
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
