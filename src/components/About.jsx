import React from 'react';
import { ShieldCheck, Zap, HeartHandshake, EyeOff, Sparkles, Smartphone, Lock } from 'lucide-react';
import './About.css';

const statsData = [
  { value: '100%', label: 'Free to Use', icon: Sparkles },
  { value: 'Zero', label: 'Third-Party Ads', icon: EyeOff },
  { value: '100%', label: 'In-Browser Privacy', icon: Lock },
  { value: 'Instant', label: 'Fast & Responsive', icon: Smartphone }
];

const pillarsData = [
  {
    icon: ShieldCheck,
    title: 'Privacy By Default',
    description: 'We believe your financial life is strictly personal. FinTrack does not sell your details, does not profile you for ads, and stores your data safely in your browser.'
  },
  {
    icon: Zap,
    title: 'Clarity, Not Jargon',
    description: 'We replace confusing financial jargon like "cashflow velocity" and "outflow retention" with simple, human explanations like "money left over" and "ways to save".'
  },
  {
    icon: HeartHandshake,
    title: 'Built for Real People',
    description: 'Real lives have rent, messy weekend plans, and sudden repair bills. FinTrack stays non-judgmental, warm, and helpful no matter what your numbers look like.'
  }
];

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="section-subtitle">Our Purpose</span>
          <h2 className="section-title">
            Making Money Simple, <span className="text-green">Calm, and Human</span>
          </h2>
          <p className="section-description">
            FinTrack was created to remove anxiety from personal finance. We replace clumsy spreadsheets and intimidating accounting tools with a warm, friendly financial companion.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="about-stats-grid">
          {statsData.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="about-stat-card">
                <div className="about-stat-icon-wrapper">
                  <Icon size={22} />
                </div>
                <div className="about-stat-value">{stat.value}</div>
                <div className="about-stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Core Pillars Grid */}
        <div className="about-pillars-grid">
          {pillarsData.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="about-pillar-card">
                <div className="about-pillar-icon-box">
                  <Icon size={26} />
                </div>
                <h3 className="about-pillar-title">{pillar.title}</h3>
                <p className="about-pillar-desc">{pillar.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default About;
