import React from 'react';
import { UserPlus, PlusCircle, LineChart, Target, ArrowRight } from 'lucide-react';
import './HowItWorks.css';

const stepsData = [
  {
    step: '01',
    title: 'Create an Account',
    icon: UserPlus,
    description: 'Get started in under 30 seconds with your email or jump straight into the demo.'
  },
  {
    step: '02',
    title: 'Add Transactions',
    icon: PlusCircle,
    description: 'Log your daily spending and income with categories, payment methods, and receipt notes.'
  },
  {
    step: '03',
    title: 'Track & Understand',
    icon: LineChart,
    description: 'See clear category breakdowns and cash flow charts that explain your numbers like a friend.'
  },
  {
    step: '04',
    title: 'Achieve Your Goals',
    icon: Target,
    description: 'Set custom targets for trips or rainy days, stay within your budget, and celebrate small wins.'
  }
];

const HowItWorks = ({ onOpenAuth }) => {
  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="section-subtitle">Simple 4-Step Process</span>
          <h2 className="section-title">
            How <span className="text-green">FinTrack Works</span>
          </h2>
          <p className="section-description">
            Get complete clarity over your money with our effortless step-by-step workflow designed for everyone.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="steps-container">
          {stepsData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={item.step} className="step-card">
                <div className="step-badge">{item.step}</div>
                <div className="step-icon-wrapper">
                  <IconComponent size={28} />
                </div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-description">{item.description}</p>
                {index < stepsData.length - 1 && (
                  <div className="step-connector desktop-only">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Callout in How It Works */}
        <div className="how-it-works-cta text-center">
          <button 
            type="button" 
            className="btn-journey-cta"
            onClick={() => onOpenAuth('signup')}
          >
            <span>Start Your Financial Journey Today</span>
            <ArrowRight size={18} className="cta-arrow-icon" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
