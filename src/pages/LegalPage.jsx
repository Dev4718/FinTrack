import React, { useState } from 'react';
import { ShieldCheck, FileText, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './LegalPage.css';

const LegalPage = () => {
  const { navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState('privacy'); // 'privacy' or 'terms'

  return (
    <div className="legal-page-wrapper">
      <div className="legal-container">
        
        {/* Top Navigation */}
        <div className="legal-nav-bar">
          <button 
            type="button" 
            className="btn-back-legal" 
            onClick={() => navigateTo('landing')}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>

          <div className="legal-tabs-pills">
            <button 
              type="button" 
              className={`legal-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <ShieldCheck size={16} />
              <span>Privacy Policy</span>
            </button>
            <button 
              type="button" 
              className={`legal-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
              onClick={() => setActiveTab('terms')}
            >
              <FileText size={16} />
              <span>Terms of Service</span>
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div className="legal-card">
          {activeTab === 'privacy' ? (
            <div className="legal-content-body">
              <span className="legal-badge">Plain English Privacy Policy</span>
              <h1 className="legal-heading">Your Financial Privacy Comes First</h1>
              <p className="legal-lead">
                Last updated: October 2025. We believe personal financial data should remain strictly private. Here is an honest, plain-English explanation of how FinTrack handles your data.
              </p>

              <div className="legal-section">
                <h3>1. What Data FinTrack Stores</h3>
                <p>
                  FinTrack is designed to store your transactions, category budgets, savings targets, and preferences directly in your browser's local storage (LocalStorage). When you log a Swiggy order or salary credit, that information stays on your device.
                </p>
              </div>

              <div className="legal-section">
                <h3>2. What We Never Do</h3>
                <ul className="legal-list">
                  <li>
                    <CheckCircle2 size={16} className="text-green" />
                    <span><strong>We never sell your data:</strong> We do not monetize or share your financial records with advertising brokers or data aggregators.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-green" />
                    <span><strong>No third-party ad tracking:</strong> There are zero advertising tracking pixels profiling your habits.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-green" />
                    <span><strong>No forced account locking:</strong> You are not locked into our platform.</span>
                  </li>
                </ul>
              </div>

              <div className="legal-section">
                <h3>3. Data Ownership & Deletion</h3>
                <p>
                  You hold 100% ownership over your financial records. From the <strong>Profile & Preferences</strong> screen, you can click "Export Complete JSON Backup" to download a local file of your entire database, or click "Clear All Financial Data" to erase all stored entries instantly.
                </p>
              </div>

              <div className="legal-section">
                <h3>4. Contact Regarding Privacy</h3>
                <p>
                  If you have any questions or suggestions regarding privacy practices, please contact us at <a href="mailto:privacy@fintrack.app">privacy@fintrack.app</a>.
                </p>
              </div>
            </div>
          ) : (
            <div className="legal-content-body">
              <span className="legal-badge">Simple & Fair Terms</span>
              <h1 className="legal-heading">Terms of Service</h1>
              <p className="legal-lead">
                Last updated: October 2025. By using FinTrack, you agree to these simple terms designed to protect both you and the application.
              </p>

              <div className="legal-section">
                <h3>1. Permitted Personal Use</h3>
                <p>
                  FinTrack is provided for personal budgeting, expense tracking, and financial visualization. You are welcome to use it for your household finances, student budgets, or freelance tracking.
                </p>
              </div>

              <div className="legal-section">
                <h3>2. Financial Disclaimer</h3>
                <p>
                  FinTrack is a money management tool and does not provide regulated legal, tax, or investment advice. While we help you visualize cash flow and budget targets, all financial decisions remain yours.
                </p>
              </div>

              <div className="legal-section">
                <h3>3. Data Availability & Responsibility</h3>
                <p>
                  Because your data is stored locally in your browser storage, clearing your browser cache or site data will remove your saved records. We recommend downloading an occasional JSON or CSV backup from the Reports page for long-term records.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LegalPage;
