import React, { useState } from 'react';
import { 
  Wallet, 
  LayoutDashboard, 
  Receipt, 
  PiggyBank, 
  BarChart3, 
  Layers, 
  User, 
  Search, 
  Bell, 
  ChevronDown, 
  HelpCircle,
  Menu,
  X,
  LogOut,
  Home,
  Target,
  Settings,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AddTransactionSlideOver from '../AddTransactionSlideOver';
import NotificationsDrawer from '../NotificationsDrawer';
import './AppLayout.css';

const AppLayout = ({ children, activeMenu = 'dashboard' }) => {
  const { 
    navigateTo, 
    user, 
    unreadNotificationCount, 
    setNotificationsDrawerOpen,
    toast
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [topSearch, setTopSearch] = useState('');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
    { id: 'transactions', label: 'Transactions', icon: Receipt, page: 'transactions' },
    { id: 'budgets', label: 'Budgets', icon: PiggyBank, page: 'budgets' },
    { id: 'goals', label: 'Savings Goals', icon: Target, page: 'goals' },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, page: 'reports' },
    { id: 'categories', label: 'Categories', icon: Layers, page: 'categories' },
    { id: 'profile', label: 'Profile & Settings', icon: Settings, page: 'settings' }
  ];

  const handleMenuClick = (item) => {
    setMobileSidebarOpen(false);
    navigateTo(item.page);
  };

  const handleTopSearchSubmit = (e) => {
    e.preventDefault();
    if (topSearch.trim()) {
      navigateTo('transactions');
    }
  };

  return (
    <div className="app-shell">
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`global-toast-banner ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <Info size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Global Slide-Over Panel for Adding Transactions */}
      <AddTransactionSlideOver />

      {/* Global Slide-Over Drawer for Notifications */}
      <NotificationsDrawer />

      {/* Mobile Top Nav Toggle */}
      <div className="mobile-app-header">
        <button 
          className="mobile-menu-trigger" 
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Wallet size={20} />
          </div>
          <span className="sidebar-logo-text">Fin<span className="text-emerald">Track</span></span>
        </div>
        <div 
          className="user-avatar-circle small"
          onClick={() => navigateTo('settings')}
          title="Profile & Settings"
        >
          {user.initials}
        </div>
      </div>

      {/* Dark Forest Green Left Sidebar */}
      <aside className={`app-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Wallet size={22} />
            </div>
            <span className="sidebar-logo-text">Fin<span className="text-emerald">Track</span></span>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item)}
                >
                  <IconComp size={18} className="nav-item-icon" />
                  <span className="nav-item-label">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Help Card */}
        <div className="sidebar-bottom">
          <div className="sidebar-help-card">
            <div className="help-icon-box">
              <HelpCircle size={20} />
            </div>
            <h4 className="help-title">Need guidance?</h4>
            <p className="help-desc">Guides, budgeting tips, and FAQ.</p>
            <button 
              type="button" 
              className="btn-help-center"
              onClick={() => {
                setMobileSidebarOpen(false);
                navigateTo('help');
              }}
            >
              Help Center
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-main-viewport">
        {/* Top Header Bar */}
        <header className="app-topbar">
          {/* Search Box */}
          <form className="topbar-search-box" onSubmit={handleTopSearchSubmit}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search transactions, budgets, notes..." 
              value={topSearch}
              onChange={(e) => setTopSearch(e.target.value)}
              className="topbar-search-input"
            />
          </form>

          {/* Right Header Actions */}
          <div className="topbar-right-actions">
            {/* Notification Bell */}
            <button 
              type="button" 
              className="topbar-icon-btn" 
              aria-label="Open notifications"
              onClick={() => setNotificationsDrawerOpen(true)}
              title="Notifications"
            >
              <Bell size={19} />
              {unreadNotificationCount > 0 && (
                <span className="notification-dot" />
              )}
            </button>

            {/* User Profile Pill */}
            <div className="profile-pill-wrapper">
              <button 
                type="button" 
                className="user-profile-pill"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-expanded={profileDropdownOpen}
              >
                <div className="user-avatar-circle">{user.initials}</div>
                <span className="user-name-text">{user.name}</span>
                <ChevronDown size={16} className={`chevron-icon ${profileDropdownOpen ? 'rotated' : ''}`} />
              </button>

              {profileDropdownOpen && (
                <div className="profile-dropdown-menu">
                  <div className="profile-dropdown-header">
                    <span className="pd-name">{user.name}</span>
                    <span className="pd-email">{user.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    type="button" 
                    className="dropdown-item" 
                    onClick={() => { setProfileDropdownOpen(false); navigateTo('settings'); }}
                  >
                    <Settings size={16} />
                    <span>Profile & Settings</span>
                  </button>

                  <button 
                    type="button" 
                    className="dropdown-item" 
                    onClick={() => { setProfileDropdownOpen(false); navigateTo('help'); }}
                  >
                    <HelpCircle size={16} />
                    <span>Help Center</span>
                  </button>

                  <button 
                    type="button" 
                    className="dropdown-item" 
                    onClick={() => { setProfileDropdownOpen(false); navigateTo('landing'); }}
                  >
                    <Home size={16} />
                    <span>View Landing Page</span>
                  </button>

                  <div className="dropdown-divider"></div>

                  <button 
                    type="button" 
                    className="dropdown-item logout" 
                    onClick={() => { setProfileDropdownOpen(false); navigateTo('landing'); }}
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Children */}
        <main className="app-content-container">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
