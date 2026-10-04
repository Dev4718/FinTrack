import React from 'react';
import { Home, Compass, ArrowLeft, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const { navigateTo } = useApp();

  return (
    <div className="not-found-wrapper">
      <div className="not-found-card">
        <div className="not-found-logo" onClick={() => navigateTo('landing')}>
          <div className="not-found-logo-icon">
            <Wallet size={24} />
          </div>
          <span className="not-found-logo-text">Fin<span className="text-green">Track</span></span>
        </div>

        <div className="not-found-code-badge">404 Error</div>

        <h1 className="not-found-title">Page Not Found</h1>

        <p className="not-found-desc">
          It looks like this link drifted off your financial balance sheet. The page you requested doesn't exist or may have moved.
        </p>

        <div className="not-found-actions">
          <button 
            type="button" 
            className="btn-404-primary"
            onClick={() => navigateTo('dashboard')}
          >
            <Compass size={18} />
            <span>Go to Dashboard</span>
          </button>
          <button 
            type="button" 
            className="btn-404-secondary"
            onClick={() => navigateTo('landing')}
          >
            <Home size={18} />
            <span>Return to Landing Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
