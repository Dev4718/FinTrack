import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  PiggyBank, 
  Receipt, 
  FileSpreadsheet, 
  ShieldCheck,
  Target,
  ArrowRight
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useApp } from '../context/AppContext';
import './HelpPage.css';

const FAQ_ITEMS = [
  {
    category: 'Budgets',
    question: 'How do category budget limits work?',
    answer: 'You can assign a monthly spending limit to any expense category. FinTrack automatically calculates your spending progress in real-time. If you reach 70% or 80%, the card turns into a gentle amber warning. Once you exceed 100%, the card indicates the exact over-budget amount.'
  },
  {
    category: 'Privacy',
    question: 'Where is my financial data stored?',
    answer: 'Your financial data is stored locally in your browser storage. We do not sell your personal transaction records to third-party ad networks, and there are zero tracking pixels profiling your habits.'
  },
  {
    category: 'Goals',
    question: 'What are Savings Goals and how do I track them?',
    answer: 'Savings Goals allow you to set milestone targets (e.g. an Emergency Cushion, Goa trip, or new laptop). You can contribute funds anytime, monitor your percentage completion, and receive celebratory congratulations when you achieve 100%!'
  },
  {
    category: 'Export',
    question: 'Can I export my data to Excel or Google Sheets?',
    answer: 'Yes! From the Reports & Analytics page, you can export a clean CSV spreadsheet respecting your selected timeframe (1 month, 3 months, or 6 months). In Profile/Settings, you can also download a complete JSON backup of all your transactions and budgets.'
  },
  {
    category: 'Transactions',
    question: 'Can I attach receipts or bills to transactions?',
    answer: 'Yes. When recording an expense or income entry in the Add Transaction panel, you can click or drag an image of your receipt. An instant preview thumbnail will be generated alongside your note.'
  },
  {
    category: 'General',
    question: 'Why does FinTrack use Indian Rupee (₹) formatting?',
    answer: 'FinTrack natively formats figures using the Indian numbering system (Lakhs and Crores via Intl.NumberFormat en-IN). You can switch between INR, USD, EUR, and GBP anytime in Profile & Settings.'
  }
];

const HelpPage = () => {
  const { navigateTo } = useApp();
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const filteredFaqs = FAQ_ITEMS.filter(item => 
    !search.trim() || 
    item.question.toLowerCase().includes(search.toLowerCase()) ||
    item.answer.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout activeMenu="help">
      <div className="help-page-container">
        
        {/* Header Hero */}
        <div className="help-header-hero">
          <div className="help-icon-bubble">
            <HelpCircle size={32} />
          </div>
          <h1 className="help-title">How can we help you today?</h1>
          <p className="help-sub">
            Browse our frequently asked questions, learn how budgeting works, or reach out to our team.
          </p>

          {/* FAQ Search Bar */}
          <div className="help-search-box">
            <Search size={18} className="help-search-icon" />
            <input 
              type="text" 
              placeholder="Search guides, budgets, privacy, exports..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="help-search-input"
            />
          </div>
        </div>

        {/* Quick Topics Grid */}
        <div className="help-topics-grid">
          <div className="topic-card" onClick={() => navigateTo('budgets')}>
            <div className="topic-icon green"><PiggyBank size={20} /></div>
            <h4>Managing Budgets</h4>
            <p>Set spending caps and get friendly heads-up notices.</p>
          </div>

          <div className="topic-card" onClick={() => navigateTo('goals')}>
            <div className="topic-icon purple"><Target size={20} /></div>
            <h4>Savings Goals</h4>
            <p>Track emergency cushions, vacations, and milestones.</p>
          </div>

          <div className="topic-card" onClick={() => navigateTo('reports')}>
            <div className="topic-icon blue"><FileSpreadsheet size={20} /></div>
            <h4>Exports & Reports</h4>
            <p>Download clean CSV spreadsheets and print statements.</p>
          </div>

          <div className="topic-card" onClick={() => navigateTo('settings')}>
            <div className="topic-icon teal"><ShieldCheck size={20} /></div>
            <h4>Data Ownership</h4>
            <p>Full JSON backups and local browser data privacy.</p>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="help-faq-section">
          <div className="faq-section-head">
            <h3>Frequently Asked Questions</h3>
            <span className="faq-count-pill">{filteredFaqs.length} answers</span>
          </div>

          <div className="faq-accordion-list">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.question} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                  <button 
                    type="button" 
                    className="faq-question-btn"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-q-text">{faq.question}</span>
                    <span className="faq-toggle-icon">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-answer-content">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Still need help callout */}
        <div className="help-contact-card">
          <div className="help-contact-info">
            <Mail size={24} className="text-emerald" />
            <div>
              <h4>Still have a question?</h4>
              <p>We typically respond within 2 hours during normal business hours.</p>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-help-contact"
            onClick={() => navigateTo('landing')}
          >
            <span>Visit Contact Form</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </AppLayout>
  );
};

export default HelpPage;
