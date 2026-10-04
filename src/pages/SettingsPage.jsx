import React, { useState } from 'react';
import { 
  User, 
  DollarSign, 
  Moon, 
  Sun, 
  Bell, 
  Download, 
  Trash2, 
  RefreshCw, 
  ShieldCheck, 
  Check, 
  Save,
  AlertTriangle
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useApp } from '../context/AppContext';
import './SettingsPage.css';

const SettingsPage = () => {
  const { 
    user, 
    setUser, 
    transactions, 
    budgets, 
    categories, 
    goals, 
    resetAllData, 
    clearAllData,
    showToast 
  } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currency, setCurrency] = useState(user.currency || 'INR');
  const [theme, setTheme] = useState(user.theme || 'light');
  const [notifBudget, setNotifBudget] = useState(true);
  const [notifGoals, setNotifGoals] = useState(true);
  const [notifMonthly, setNotifMonthly] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const initials = name
      .split(' ')
      .filter(Boolean)
      .map(part => part[0].toUpperCase())
      .slice(0, 2)
      .join('') || 'U';

    setUser(prev => ({
      ...prev,
      name,
      email,
      initials,
      currency,
      theme
    }));

    showToast('Settings saved successfully.');
  };

  // Full JSON Export of entire app state
  const handleExportBackup = () => {
    const backupData = {
      user,
      transactions,
      budgets,
      categories,
      goals,
      exportedAt: new Date().toISOString()
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `FinTrack_Complete_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Complete financial backup downloaded.');
  };

  return (
    <AppLayout activeMenu="profile">
      <div className="settings-page-container">
        
        {/* Header */}
        <div className="settings-page-header">
          <div>
            <h1 className="settings-page-title">Profile & Preferences</h1>
            <p className="settings-page-subtitle">
              Manage your personal information, currency formatting, notification settings, and data ownership
            </p>
          </div>
        </div>

        <div className="settings-grid">
          {/* Left Column: Profile & Display Preferences */}
          <div className="settings-col">
            {/* User Profile Card */}
            <div className="settings-card">
              <div className="settings-card-head">
                <User size={20} className="text-emerald" />
                <h3>Personal Profile</h3>
              </div>

              <form onSubmit={handleSaveProfile} className="settings-form">
                <div className="profile-avatar-row">
                  <div className="avatar-preview-circle">{user.initials}</div>
                  <div>
                    <h4 className="avatar-name">{name || 'User'}</h4>
                    <span className="avatar-hint">Initials automatically derived from your full name</span>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="settings-name">Full Name</label>
                  <input 
                    id="settings-name"
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="settings-email">Email Address</label>
                  <input 
                    id="settings-email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Currency Preference */}
                <div className="form-field">
                  <label htmlFor="settings-currency">Preferred Currency Format</label>
                  <select
                    id="settings-currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bgt-select"
                  >
                    <option value="INR">₹ INR (Indian Rupee - en-IN lakh/crore formatting)</option>
                    <option value="USD">$ USD (US Dollar)</option>
                    <option value="EUR">€ EUR (Euro)</option>
                    <option value="GBP">£ GBP (British Pound)</option>
                  </select>
                </div>

                {/* Theme Selector */}
                <div className="form-field">
                  <label>Interface Appearance</label>
                  <div className="theme-toggle-grid">
                    <button
                      type="button"
                      className={`theme-pill ${theme === 'light' ? 'active' : ''}`}
                      onClick={() => setTheme('light')}
                    >
                      <Sun size={16} />
                      <span>Light Theme</span>
                    </button>
                    <button
                      type="button"
                      className={`theme-pill ${theme === 'dark' ? 'active' : ''}`}
                      onClick={() => setTheme('dark')}
                    >
                      <Moon size={16} />
                      <span>Dark Theme (Soft)</span>
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-save-settings">
                  <Save size={16} />
                  <span>Save Profile Changes</span>
                </button>
              </form>
            </div>

            {/* Notification Preferences */}
            <div className="settings-card">
              <div className="settings-card-head">
                <Bell size={20} className="text-emerald" />
                <h3>Gentle Alerts & Notifications</h3>
              </div>

              <div className="notif-pref-list">
                <label className="pref-row">
                  <div className="pref-info">
                    <strong>Budget Limit Notices</strong>
                    <span>Gentle heads-up when an expense category crosses 80% of limit</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifBudget} 
                    onChange={(e) => setNotifBudget(e.target.checked)}
                    className="pref-checkbox"
                  />
                </label>

                <label className="pref-row">
                  <div className="pref-info">
                    <strong>Goal Milestone Celebrations</strong>
                    <span>Get notified when you hit 50%, 75%, and 100% of a savings goal</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifGoals} 
                    onChange={(e) => setNotifGoals(e.target.checked)}
                    className="pref-checkbox"
                  />
                </label>

                <label className="pref-row">
                  <div className="pref-info">
                    <strong>Monthly Recap Summary</strong>
                    <span>End-of-month review comparing your savings against past months</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifMonthly} 
                    onChange={(e) => setNotifMonthly(e.target.checked)}
                    className="pref-checkbox"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Data Ownership, Export & Danger Zone */}
          <div className="settings-col">
            {/* Data Ownership & Export */}
            <div className="settings-card">
              <div className="settings-card-head">
                <Download size={20} className="text-emerald" />
                <h3>Your Data, Your Ownership</h3>
              </div>

              <p className="card-sub-info">
                FinTrack stores your transaction records locally in your browser storage. You can export a full JSON snapshot of all your transactions, budgets, and savings goals anytime.
              </p>

              <div className="backup-stats-box">
                <div className="backup-stat-line">
                  <span>Transactions logged:</span>
                  <strong>{transactions.length}</strong>
                </div>
                <div className="backup-stat-line">
                  <span>Active budgets:</span>
                  <strong>{budgets.length}</strong>
                </div>
                <div className="backup-stat-line">
                  <span>Savings goals:</span>
                  <strong>{goals.length}</strong>
                </div>
              </div>

              <button 
                type="button" 
                className="btn-download-backup"
                onClick={handleExportBackup}
              >
                <Download size={16} />
                <span>Export Complete JSON Backup</span>
              </button>
            </div>

            {/* Danger & Reset Zone */}
            <div className="settings-card danger-zone-card">
              <div className="settings-card-head text-danger">
                <AlertTriangle size={20} />
                <h3>Data Management & Reset</h3>
              </div>

              <p className="card-sub-info">
                Need to reset your demo data or start over completely? These controls allow you to reset to sample data or clear all entries.
              </p>

              <div className="danger-actions-list">
                <div className="danger-action-row">
                  <div>
                    <strong>Reset to Sample Data</strong>
                    <p>Restores realistic Indian expense and budget test dataset.</p>
                  </div>
                  <button 
                    type="button" 
                    className="btn-reset-sample"
                    onClick={() => setResetConfirmOpen(true)}
                  >
                    <RefreshCw size={14} />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="danger-action-row">
                  <div>
                    <strong>Clear All Financial Data</strong>
                    <p>Removes all transactions, custom budgets, and goals.</p>
                  </div>
                  <button 
                    type="button" 
                    className="btn-clear-all"
                    onClick={() => setClearConfirmOpen(true)}
                  >
                    <Trash2 size={14} />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Confirm Reset to Sample */}
        {resetConfirmOpen && (
          <div className="modal-backdrop" onClick={() => setResetConfirmOpen(false)}>
            <div className="modal-dialog-box modal-confirm" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-icon-box">
                <RefreshCw size={24} className="text-emerald" />
              </div>
              <h3 className="confirm-title">Reset to Sample Data?</h3>
              <p className="confirm-desc">
                This will overwrite your current entries and load the default realistic personal finance test data.
              </p>
              <div className="modal-actions-row">
                <button type="button" className="btn-cancel" onClick={() => setResetConfirmOpen(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-save"
                  onClick={() => {
                    resetAllData();
                    setResetConfirmOpen(false);
                  }}
                >
                  Yes, Reset Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Confirm Clear All */}
        {clearConfirmOpen && (
          <div className="modal-backdrop" onClick={() => setClearConfirmOpen(false)}>
            <div className="modal-dialog-box modal-confirm" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-icon-box">
                <Trash2 size={24} className="text-danger" />
              </div>
              <h3 className="confirm-title">Clear All Data?</h3>
              <p className="confirm-desc">
                This will permanently delete all transactions, budgets, and savings goals from your browser storage. You can start fresh or reload sample data anytime.
              </p>
              <div className="modal-actions-row">
                <button type="button" className="btn-cancel" onClick={() => setClearConfirmOpen(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-danger-confirm"
                  onClick={() => {
                    clearAllData();
                    setClearConfirmOpen(false);
                  }}
                >
                  Yes, Clear Everything
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default SettingsPage;
