import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import FinanceVisual from './FinanceVisual';
import './Hero.css';

const Hero = ({ onOpenAuth }) => {
  return (
    <section id="home" className="hero-section">
      <div className="container hero-container">
        
        {/* Left Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} className="badge-icon" />
            <span>Simple Personal Money Management</span>
          </div>

          <h1 className="hero-title">
            Take Control of <span className="hero-title-nowrap gradient-text">Your Finances</span>
          </h1>

          <p className="hero-description">
            Effortlessly track daily expenses, establish smart budgets, understand your spending habits, and build savings with intuitive, clutter-free tracking.
          </p>

          <div className="hero-actions">
            <button 
              type="button" 
              className="btn-hero-primary"
              onClick={() => onOpenAuth('signup')}
            >
              Get Started Free
              <ArrowRight size={18} />
            </button>
            <a href="#features" className="btn-hero-secondary">
              Learn More
            </a>
          </div>

          {/* Honest Proof / Key Highlights */}
          <div className="hero-highlights">
            <div className="highlight-item">
              <CheckCircle2 size={18} className="text-green" />
              <span>Free Forever</span>
            </div>
            <div className="highlight-item">
              <Shield size={18} className="text-green" />
              <span>Private & In Your Control</span>
            </div>
            <div className="highlight-item">
              <CheckCircle2 size={18} className="text-green" />
              <span>No Credit Card Needed</span>
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="hero-visual-wrapper">
          <FinanceVisual />
        </div>

      </div>
    </section>
  );
};

export default Hero;
