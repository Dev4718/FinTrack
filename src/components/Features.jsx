import React from 'react';
import { 
  Receipt, 
  PiggyBank, 
  BarChart3, 
  Target, 
  ShieldCheck, 
  FileSpreadsheet, 
  Check 
} from 'lucide-react';
import './Features.css';

const featuresData = [
  {
    id: 'track-expenses',
    title: 'Track Everyday Spending',
    icon: Receipt,
    description: 'Easily log your daily income and expenses across food, bills, travel, and shopping with quick notes.',
    highlights: ['Organized categories', 'Optional receipt upload preview', 'Real-time balance updates']
  },
  {
    id: 'set-budgets',
    title: 'Smart Category Budgets',
    icon: PiggyBank,
    description: 'Set realistic monthly spending limits with friendly heads-up notices before you run out of runway.',
    highlights: ['Category spending caps', 'Friendly alerts at 80%', 'Visual progress trackers']
  },
  {
    id: 'get-insights',
    title: 'Visual Money Insights',
    icon: BarChart3,
    description: 'Understand where your hard-earned money goes each month through clear, readable interactive charts.',
    highlights: ['Monthly cash flow trends', 'Category share breakdowns', 'Clear savings calculations']
  },
  {
    id: 'savings-goals',
    title: 'Savings Goals & Milestones',
    icon: Target,
    description: 'Plan for emergency funds, dream vacations, or gadget upgrades, and celebrate your savings progress.',
    highlights: ['Target savings amounts', 'Visual progress bars', 'Celebrates your small wins']
  },
  {
    id: 'csv-export',
    title: 'Clean Statements & Export',
    icon: FileSpreadsheet,
    description: 'Filter by month or category and export clean CSV spreadsheets anytime for your records.',
    highlights: ['Period-specific CSV download', 'Printable statement views', 'You own your data']
  },
  {
    id: 'secure-private',
    title: 'Private & Honest By Design',
    icon: ShieldCheck,
    description: 'No advertisements, no marketing trackers, and zero selling of your personal transaction habits.',
    highlights: ['Zero third-party trackers', 'No account lock-in', 'Responsive across phone & laptop']
  }
];

const Features = () => {
  return (
    <section id="features" className="features-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="section-subtitle">Thoughtful Capabilities</span>
          <h2 className="section-title">
            Everything You Need to <span className="text-green">Understand Your Money</span>
          </h2>
          <p className="section-description">
            FinTrack combines straightforward tracking with gentle, friendly guidance so managing money feels calm, clear, and encouraging.
          </p>
        </div>

        {/* Features Grid - 3 cards top, 3 cards below, no empty slot */}
        <div className="features-grid">
          {featuresData.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={feature.id} 
                className={`feature-card ${idx === 0 ? 'featured-card' : ''}`}
              >
                <div className="feature-icon-box">
                  <IconComponent size={26} />
                </div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-desc">{feature.description}</p>
                <ul className="feature-highlights">
                  {feature.highlights.map((item, i) => (
                    <li key={i}>
                      <Check size={14} className="text-green" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Features;
