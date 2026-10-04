import React from 'react';
import { Wallet, Globe, Share2, Mail, MessageSquare } from 'lucide-react';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        
        <div className="footer-top">
          {/* Column 1: Branding */}
          <div className="footer-brand-col">
            <a href="#home" className="footer-brand">
              <div className="brand-icon-wrapper">
                <Wallet className="brand-icon" size={22} />
              </div>
              <span className="brand-name">Fin<span className="text-green">Track</span></span>
            </a>
            <p className="footer-description">
              Empowering individuals and businesses to master personal finance through smart expense tracking, custom budgets, and actionable cash flow insights.
            </p>
            <div className="footer-socials">
              <a href="#home" className="social-icon" aria-label="Global Web">
                <Globe size={18} />
              </a>
              <a href="#home" className="social-icon" aria-label="Share">
                <Share2 size={18} />
              </a>
              <a href="#home" className="social-icon" aria-label="Contact Email">
                <Mail size={18} />
              </a>
              <a href="#home" className="social-icon" aria-label="Community Chat">
                <MessageSquare size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="footer-links-col">
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div className="footer-links-col">
            <h4 className="footer-title">Product</h4>
            <ul className="footer-links">
              <li><a href="#features">Expense Tracker</a></li>
              <li><a href="#features">Budget Planner</a></li>
              <li><a href="#features">Cashflow Analytics</a></li>
              <li><a href="#features">Mobile App Ready</a></li>
            </ul>
          </div>

          {/* Column 4: Legal & Security */}
          <div className="footer-links-col">
            <h4 className="footer-title">Legal & Security</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#security">Security Overview</a></li>
              <li><a href="#cookie">Cookie Preferences</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom / Copyright */}
        <div className="footer-bottom">
          <p className="copyright-text">
            &copy; {CURRENT_YEAR} FinTrack. All rights reserved. Built for modern financial control.
          </p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy</a>
            <span className="dot">•</span>
            <a href="#terms">Terms</a>
            <span className="dot">•</span>
            <a href="#security">Security</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
