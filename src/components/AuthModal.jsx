import React, { useState } from 'react';
import { X, Wallet, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="modal-success-state">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={48} className="text-green" />
            </div>
            <h3>{mode === 'login' ? 'Welcome Back!' : 'Account Created!'}</h3>
            <p>
              {mode === 'login' 
                ? 'Successfully signed in to FinTrack demo.' 
                : 'Your FinTrack account has been initialized.'}
            </p>
          </div>
        ) : (
          <>
            {/* Header / Tabs */}
            <div className="modal-header">
              <div className="brand-icon-wrapper">
                <Wallet size={22} />
              </div>
              <h3 className="modal-title">
                {mode === 'login' ? 'Login to FinTrack' : 'Get Started with FinTrack'}
              </h3>
              <p className="modal-subtitle">
                {mode === 'login' 
                  ? 'Access your personal finance dashboard' 
                  : 'Start tracking expenses & budgeting free'}
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="modal-tabs">
              <button 
                type="button" 
                className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
              >
                Login
              </button>
              <button 
                type="button" 
                className={`tab-btn ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => setMode('signup')}
              >
                Get Started
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="modal-form">
              {mode === 'signup' && (
                <div className="form-group">
                  <label htmlFor="modal-name">Full Name</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input 
                      id="modal-name"
                      type="text" 
                      placeholder="Alex Morgan" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      required 
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="modal-email">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input 
                    id="modal-email"
                    type="email" 
                    placeholder="alex@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="modal-password">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input 
                    id="modal-password"
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary modal-submit-btn">
                {mode === 'login' ? 'Sign In' : 'Create Free Account'}
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="modal-disclaimer">
              Landing page demo mode. No real credentials required.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
