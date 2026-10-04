import React from 'react';
import { ArrowRight, ShieldCheck, Heart, Zap, Sparkles } from 'lucide-react';
import './CallToAction.css';

const CallToAction = ({ onOpenAuth }) => {
  return (
    <section id="cta" className="cta-section">
      <div className="container">
        
        <div className="cta-card">
          {/* Decorative Glow */}
          <div className="cta-glow"></div>

          <div className="cta-content">
            <div className="cta-badge">
              <Zap size={16} />
              <span>Start Managing Your Finances Today</span>
            </div>

            <h2 className="cta-title">
              Take the First Step Toward <br />
              <span className="cta-highlight">Peace of Mind with Money</span>
            </h2>

            <p className="cta-description">
              Join individuals, students, and freelancers who track everyday spending, set friendly budgets, and build healthy money habits with FinTrack.
            </p>

            <div className="cta-actions">
              <button 
                type="button" 
                className="btn-cta-primary"
                onClick={() => onOpenAuth('signup')}
              >
                Get Started Free Now
                <ArrowRight size={18} />
              </button>
              <a href="#features" className="btn-cta-secondary">
                Explore Features
              </a>
            </div>

            {/* CTA Honest Highlights */}
            <div className="cta-metrics">
              <div className="metric-item">
                <div className="metric-icon"><Heart size={16} /></div>
                <span>Designed for Real People</span>
              </div>
              <div className="metric-item">
                <div className="metric-icon"><Sparkles size={16} /></div>
                <span>Free Forever Core Features</span>
              </div>
              <div className="metric-item">
                <div className="metric-icon"><ShieldCheck size={16} /></div>
                <span>Zero Ads or Data Selling</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default CallToAction;
