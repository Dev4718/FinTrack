import React, { useState, useEffect } from 'react';
import { Wallet, Menu, X, Home, Sparkles, Info, Mail, ArrowRight } from 'lucide-react';
import userAvatar from '../assets/user-avatar.png';
import './Navbar.css';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '#home', icon: Home },
  { id: 'features', label: 'Features', href: '#features', icon: Sparkles },
  { id: 'about', label: 'About', href: '#about', icon: Info },
  { id: 'contact', label: 'Contact', href: '#contact', icon: Mail },
];

const Navbar = ({ onOpenAuth }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [avatarActive, setAvatarActive] = useState(false);
  const [loginActive, setLoginActive] = useState(false);

  // Sync active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Bottom of page check
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveNav('contact');
        return;
      }

      if (window.scrollY < 120) {
        setActiveNav('home');
        return;
      }

      const scrollPos = window.scrollY + 140;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const section = document.querySelector(item.href);
        if (section) {
          const top = section.getBoundingClientRect().top + window.scrollY;
          if (scrollPos >= top) {
            setActiveNav(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Close mobile menu on screen resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 880 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleNavClick = (e, id, href) => {
    if (e) e.preventDefault();
    setActiveNav(id);
    setMobileMenuOpen(false);

    if (href) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', href);
      }
    }
  };

  const handleAvatarClick = () => {
    setAvatarActive(true);
    setTimeout(() => setAvatarActive(false), 350);
    onOpenAuth?.('login');
  };

  const handleLoginClick = () => {
    setLoginActive(true);
    setTimeout(() => setLoginActive(false), 350);
    onOpenAuth?.('login');
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* FinTrack Logo/Name */}
        <a 
          href="#home" 
          className="navbar-brand" 
          onClick={(e) => handleNavClick(e, 'home', '#home')}
        >
          <div className="brand-icon-wrapper">
            <Wallet className="brand-icon" size={24} />
          </div>
          <span className="brand-name">Fin<span className="text-green">Track</span></span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav desktop-only">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`nav-link ${activeNav === item.id ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, item.id, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Action Buttons: Avatar icon + Login button */}
        <div className="navbar-actions desktop-only">
          <div 
            className={`navbar-avatar-btn ${avatarActive ? 'is-active' : ''}`}
            onClick={handleAvatarClick}
            role="button"
            tabIndex={0}
            title="User Profile"
            aria-label="User Profile"
          >
            <img 
              src={userAvatar} 
              alt="User Profile" 
              className="navbar-user-avatar" 
            />
          </div>
          <button 
            type="button" 
            className={`btn-login ${loginActive ? 'is-active' : ''}`}
            onClick={handleLoginClick}
          >
            Login
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          type="button"
          className="mobile-toggle-btn mobile-only" 
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-backdrop mobile-only" 
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu mobile-only" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <div className="mobile-menu-header">
            <div className="mobile-menu-brand">
              <div className="brand-icon-wrapper mini">
                <Wallet className="brand-icon" size={18} />
              </div>
              <span className="brand-name">Fin<span className="text-green">Track</span></span>
            </div>
            <button 
              type="button" 
              className="mobile-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="mobile-nav">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, item.id, item.href)}
                >
                  <div className="mobile-nav-icon">
                    <Icon size={20} />
                  </div>
                  <span>{item.label}</span>
                  {isActive && <div className="active-dot" />}
                </a>
              );
            })}
          </nav>

          <div className="mobile-actions">
            <div 
              className="mobile-avatar-row"
              onClick={() => { 
                setMobileMenuOpen(false); 
                onOpenAuth?.('login'); 
              }}
            >
              <img 
                src={userAvatar} 
                alt="User Profile" 
                className="navbar-user-avatar" 
              />
              <div className="mobile-user-info">
                <span className="mobile-user-name">Welcome Back</span>
                <span className="mobile-user-hint">Click to manage account</span>
              </div>
            </div>

            <div className="mobile-buttons-col">
              <button 
                type="button" 
                className="btn-login mobile-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth?.('login');
                }}
              >
                Log In
              </button>
              <button 
                type="button" 
                className="btn-mobile-signup"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth?.('signup');
                }}
              >
                <span>Get Started Free</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
