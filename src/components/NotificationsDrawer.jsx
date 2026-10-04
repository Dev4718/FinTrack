import React from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Info,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './NotificationsDrawer.css';

const NotificationsDrawer = () => {
  const { 
    notificationsDrawerOpen, 
    setNotificationsDrawerOpen, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    unreadNotificationCount,
    navigateTo 
  } = useApp();

  if (!notificationsDrawerOpen) return null;

  const handleNotificationClick = (item) => {
    markNotificationAsRead(item.id);
    setNotificationsDrawerOpen(false);

    if (item.title.toLowerCase().includes('budget') || item.title.toLowerCase().includes('shopping')) {
      navigateTo('budgets');
    } else if (item.title.toLowerCase().includes('goal')) {
      navigateTo('goals');
    } else if (item.title.toLowerCase().includes('salary')) {
      navigateTo('transactions');
    }
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={18} className="notif-icon-amber" />;
      case 'celebration':
        return <Sparkles size={18} className="notif-icon-purple" />;
      case 'success':
        return <CheckCircle2 size={18} className="notif-icon-green" />;
      case 'info':
      default:
        return <Info size={18} className="notif-icon-blue" />;
    }
  };

  return (
    <div className="notif-backdrop" onClick={() => setNotificationsDrawerOpen(false)}>
      <div 
        className="notif-drawer-panel" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Notifications Panel"
      >
        {/* Drawer Header */}
        <div className="notif-drawer-header">
          <div className="notif-header-title">
            <Bell size={20} />
            <h3>Notifications</h3>
            {unreadNotificationCount > 0 && (
              <span className="notif-count-badge">{unreadNotificationCount} new</span>
            )}
          </div>
          
          <div className="notif-header-actions">
            {unreadNotificationCount > 0 && (
              <button 
                type="button" 
                className="btn-mark-all"
                onClick={markAllNotificationsAsRead}
                title="Mark all as read"
              >
                <CheckCheck size={16} />
                <span>Mark read</span>
              </button>
            )}
            <button 
              type="button" 
              className="notif-close-btn"
              onClick={() => setNotificationsDrawerOpen(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="notif-drawer-body">
          {notifications.length === 0 ? (
            <div className="notif-empty-box">
              <Bell size={36} className="text-muted" />
              <h4>All caught up!</h4>
              <p>You have no notifications right now.</p>
            </div>
          ) : (
            <div className="notif-items-list">
              {notifications.map((item) => (
                <div 
                  key={item.id} 
                  className={`notif-item ${!item.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(item)}
                >
                  <div className="notif-icon-box">
                    {renderIcon(item.type)}
                  </div>
                  
                  <div className="notif-content-col">
                    <div className="notif-title-row">
                      <span className="notif-item-title">{item.title}</span>
                      {!item.read && <span className="notif-unread-dot" />}
                    </div>
                    <p className="notif-item-msg">{item.message}</p>
                    <div className="notif-item-foot">
                      <span className="notif-item-time">{item.time}</span>
                      <span className="notif-action-hint">
                        <span>View</span>
                        <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NotificationsDrawer;
