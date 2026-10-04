import React from 'react';
import { 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowRight,
  TrendingUp,
  DollarSign,
  CreditCard,
  PiggyBank,
  Plus,
  Eye,
  EyeOff,
  Utensils,
  Briefcase,
  Car,
  ShoppingBag,
  Zap,
  Film,
  HeartPulse,
  Laptop,
  Home,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useApp } from '../context/AppContext';
import { CATEGORIES_BREAKDOWN, MONTHLY_CASHFLOW } from '../data/mockData';
import { formatINR, getTimeAwareGreeting } from '../utils/formatters';
import './DashboardPage.css';

const iconMap = {
  Utensils,
  Briefcase,
  Car,
  ShoppingBag,
  Zap,
  Film,
  HeartPulse,
  Laptop,
  Home,
  Layers
};

const DashboardPage = () => {
  const { 
    user, 
    stats, 
    transactions, 
    budgets, 
    categories, 
    navigateTo, 
    setQuickAddOpen,
    hideAmounts,
    toggleHideAmounts,
    resetAllData
  } = useApp();

  const greetingInfo = getTimeAwareGreeting(user.name.split(' ')[0]);
  const recentTransactions = transactions.slice(0, 5);

  // Derive budget status for the quick status strip
  const budgetStripItems = budgets.map(b => {
    const spent = transactions
      .filter(t => t.type === 'Expense' && t.category.toLowerCase() === b.category.toLowerCase())
      .reduce((sum, t) => sum + t.amount, 0);
    const pct = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;
    const catMeta = categories.find(c => c.name.toLowerCase() === b.category.toLowerCase());
    
    let statusClass = 'safe';
    if (pct >= 100) statusClass = 'danger';
    else if (pct >= 70) statusClass = 'warning';

    return {
      category: b.category,
      spent,
      limit: b.limit,
      pct,
      color: catMeta?.color || '#10b981',
      statusClass
    };
  });

  const renderAmount = (amount, prefix = '') => {
    if (hideAmounts) {
      return `${prefix}••••••`;
    }
    return `${prefix}${formatINR(amount)}`;
  };

  return (
    <AppLayout activeMenu="dashboard">
      <div className="dashboard-content">
        
        {/* Top Greeting, Quick Controls & Privacy Eye */}
        <div className="dashboard-header-row">
          <div>
            <div className="greeting-pill-row">
              <h1 className="dash-greeting">{greetingInfo.title}</h1>
              <button 
                type="button" 
                className={`privacy-toggle-btn ${hideAmounts ? 'active' : ''}`}
                onClick={toggleHideAmounts}
                title={hideAmounts ? "Show amounts" : "Hide amounts for privacy"}
                aria-label="Toggle amounts visibility"
              >
                {hideAmounts ? <EyeOff size={18} /> : <Eye size={18} />}
                <span>{hideAmounts ? 'Amounts hidden' : 'Hide amounts'}</span>
              </button>
            </div>
            <p className="dash-subtext">{greetingInfo.subtitle}</p>
          </div>

          <div className="dash-header-actions">
            <button 
              type="button" 
              className="btn-quick-add"
              onClick={() => setQuickAddOpen(true)}
            >
              <Plus size={18} />
              <span>+ Add</span>
            </button>

            <div className="date-picker-pill">
              <Calendar size={16} />
              <span>September 2025</span>
            </div>
          </div>
        </div>

        {/* Budget Status Strip */}
        {budgets.length > 0 && transactions.length > 0 && (
          <div className="budget-status-strip-card" onClick={() => navigateTo('budgets')} role="button" tabIndex={0}>
            <div className="strip-header">
              <div className="strip-title-group">
                <span className="strip-badge">Monthly Budget Pulse</span>
                <span className="strip-subtext">Click to manage limits</span>
              </div>
              <div className="strip-view-link">
                <span>View all budgets</span>
                <ChevronRight size={14} />
              </div>
            </div>

            <div className="strip-items-grid">
              {budgetStripItems.slice(0, 4).map(item => (
                <div key={item.category} className={`strip-item ${item.statusClass}`}>
                  <div className="strip-item-top">
                    <span className="strip-cat-name" style={{ color: item.color }}>{item.category}</span>
                    <span className={`strip-pct-badge ${item.statusClass}`}>{item.pct}% used</span>
                  </div>
                  <div className="strip-progress-track">
                    <div 
                      className={`strip-progress-fill ${item.statusClass}`} 
                      style={{ width: `${Math.min(100, item.pct)}%` }}
                    />
                  </div>
                  <div className="strip-item-footer">
                    <span>{renderAmount(item.spent)} of {renderAmount(item.limit)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State when no transactions exist */}
        {transactions.length === 0 ? (
          <div className="dashboard-empty-card">
            <div className="empty-sparkle-circle">
              <Sparkles size={36} className="text-emerald" />
            </div>
            <h2 className="empty-title">Add your first transaction to see your story here</h2>
            <p className="empty-description">
              FinTrack helps you see where every rupee goes, from morning coffees to salary credits. Start logging or load realistic sample data.
            </p>
            <div className="empty-actions">
              <button 
                type="button" 
                className="btn-empty-primary"
                onClick={() => setQuickAddOpen(true)}
              >
                <Plus size={18} />
                <span>Add First Transaction</span>
              </button>
              <button 
                type="button" 
                className="btn-empty-secondary"
                onClick={resetAllData}
              >
                <span>Load Sample Data</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 3 Clickable Metric Summary Cards */}
            <div className="metrics-grid">
              {/* Income Card -> Clicks to Transactions (Income) */}
              <div 
                className="metric-card income-card clickable-card"
                onClick={() => navigateTo('transactions')}
                role="button"
                tabIndex={0}
                title="Click to view income transactions"
              >
                <div className="metric-top">
                  <div className="metric-icon-bg green">
                    <DollarSign size={20} />
                  </div>
                  <span className="metric-label">Total Income</span>
                  <div className="card-click-hint">View list →</div>
                </div>
                <div className="metric-val-row">
                  <h2 className="metric-amount">{renderAmount(stats.totalIncome)}</h2>
                </div>
                <div className="metric-trend positive">
                  <ArrowUpRight size={15} />
                  <span>Money coming in this month</span>
                </div>
              </div>

              {/* Expenses Card -> Clicks to Budgets */}
              <div 
                className="metric-card expense-card clickable-card"
                onClick={() => navigateTo('budgets')}
                role="button"
                tabIndex={0}
                title="Click to view budget allocations"
              >
                <div className="metric-top">
                  <div className="metric-icon-bg neutral-expense">
                    <CreditCard size={20} />
                  </div>
                  <span className="metric-label">Money Going Out</span>
                  <div className="card-click-hint">Budgets →</div>
                </div>
                <div className="metric-val-row">
                  <h2 className="metric-amount">{renderAmount(stats.totalExpenses)}</h2>
                </div>
                <div className="metric-trend neutral-trend">
                  <ArrowDownRight size={15} />
                  <span>Normal spending across active categories</span>
                </div>
              </div>

              {/* Savings Card -> Clicks to Goals */}
              <div 
                className="metric-card savings-card clickable-card"
                onClick={() => navigateTo('goals')}
                role="button"
                tabIndex={0}
                title="Click to view savings goals"
              >
                <div className="metric-top">
                  <div className="metric-icon-bg blue">
                    <PiggyBank size={20} />
                  </div>
                  <span className="metric-label">Money Left Over</span>
                  <div className="card-click-hint">Goals →</div>
                </div>
                <div className="metric-val-row">
                  <h2 className="metric-amount">{renderAmount(stats.savings)}</h2>
                </div>
                <div className="metric-trend blue-trend">
                  <TrendingUp size={15} />
                  <span>
                    {stats.totalIncome > 0 
                      ? `You kept ${formatINR(Math.round((stats.savings / stats.totalIncome) * 100), false)} of every ₹100 earned`
                      : 'Added to your reserve'}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Row: Clickable Charts Grid */}
            <div className="dash-charts-grid">
              {/* Expense Overview Card -> Clicks to Categories */}
              <div 
                className="chart-card clickable-card"
                onClick={() => navigateTo('categories')}
                role="button"
                tabIndex={0}
                title="Click to manage categories"
              >
                <div className="chart-header-row">
                  <h3 className="chart-card-title">Where Your Money Goes</h3>
                  <div className="card-click-hint">Categories →</div>
                </div>

                <div className="donut-chart-container">
                  <div className="donut-svg-wrapper">
                    <svg viewBox="0 0 160 160" className="donut-chart-svg">
                      <circle cx="80" cy="80" r="54" fill="transparent" stroke="#e2e8f0" strokeWidth="22" />
                      <circle cx="80" cy="80" r="54" fill="transparent" stroke="#ef4444" strokeWidth="22"
                        strokeDasharray="186.6 152.7" strokeDashoffset="0" strokeLinecap="round" />
                      <circle cx="80" cy="80" r="54" fill="transparent" stroke="#10b981" strokeWidth="22"
                        strokeDasharray="54.3 285" strokeDashoffset="-187" strokeLinecap="round" />
                      <circle cx="80" cy="80" r="54" fill="transparent" stroke="#8b5cf6" strokeWidth="22"
                        strokeDasharray="40.7 298.6" strokeDashoffset="-242" strokeLinecap="round" />
                      <circle cx="80" cy="80" r="54" fill="transparent" stroke="#f59e0b" strokeWidth="22"
                        strokeDasharray="23.7 315.6" strokeDashoffset="-283" strokeLinecap="round" />
                      <circle cx="80" cy="80" r="54" fill="transparent" stroke="#ec4899" strokeWidth="22"
                        strokeDasharray="13.5 325.8" strokeDashoffset="-307" strokeLinecap="round" />
                      <circle cx="80" cy="80" r="54" fill="transparent" stroke="#64748b" strokeWidth="22"
                        strokeDasharray="20.3 319" strokeDashoffset="-321" strokeLinecap="round" />
                    </svg>
                    <div className="donut-center-text">
                      <span className="center-amount">{renderAmount(stats.totalExpenses)}</span>
                      <span className="center-label">Total Spent</span>
                    </div>
                  </div>

                  <div className="donut-legend-list">
                    {CATEGORIES_BREAKDOWN.map((cat) => (
                      <div key={cat.name} className="legend-row">
                        <div className="legend-name-col">
                          <span className="legend-dot" style={{ backgroundColor: cat.color }}></span>
                          <span className="legend-name">{cat.name}</span>
                        </div>
                        <span className="legend-pct">{cat.percentage}%</span>
                        <span className="legend-amount">{renderAmount(cat.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Income vs Expenses Card -> Clicks to Reports */}
              <div 
                className="chart-card clickable-card"
                onClick={() => navigateTo('reports')}
                role="button"
                tabIndex={0}
                title="Click to view detailed reports"
              >
                <div className="chart-header-row">
                  <h3 className="chart-card-title">Money In vs Money Out</h3>
                  <div className="card-click-hint">Reports →</div>
                </div>

                <div className="bar-chart-visual">
                  <div className="y-axis">
                    <span>₹60k</span>
                    <span>₹40k</span>
                    <span>₹20k</span>
                    <span>0</span>
                  </div>

                  <div className="bars-area">
                    <div className="chart-grid-lines">
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                    </div>

                    <div className="monthly-bars-row">
                      {MONTHLY_CASHFLOW.map((item) => {
                        const incHeight = (item.income / 70000) * 100;
                        const expHeight = (item.expense / 70000) * 100;
                        return (
                          <div key={item.month} className="month-group">
                            <div className="bar-pair">
                              <div 
                                className="chart-bar income" 
                                style={{ height: `${incHeight}%` }}
                                title={`Income: ${formatINR(item.income)}`}
                              ></div>
                              <div 
                                className="chart-bar expense" 
                                style={{ height: `${expHeight}%` }}
                                title={`Expense: ${formatINR(item.expense)}`}
                              ></div>
                            </div>
                            <span className="month-label">{item.month}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card: Recent Transactions Table -> Clicks to Transactions */}
            <div className="recent-tx-card">
              <div className="tx-card-header">
                <div>
                  <h3 className="chart-card-title">Recent Transactions</h3>
                  <p className="tx-header-hint">Showing your latest recorded entries</p>
                </div>
                <button 
                  type="button" 
                  className="view-all-link"
                  onClick={() => navigateTo('transactions')}
                >
                  <span>View all transactions</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="tx-table-container">
                <table className="tx-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx) => {
                      const IconC = iconMap[tx.icon] || Utensils;
                      const isIncome = tx.type === 'Income';
                      return (
                        <tr 
                          key={tx.id} 
                          className="clickable-table-row"
                          onClick={() => navigateTo('transactions')}
                          title="Click to view in transactions"
                        >
                          <td className="tx-date-cell">{tx.date}</td>
                          <td>
                            <div className="tx-desc-cell">
                              <div className="tx-avatar-box" style={{ backgroundColor: `${tx.categoryColor}18`, color: tx.categoryColor }}>
                                <IconC size={16} />
                              </div>
                              <span className="tx-desc-name">{tx.description}</span>
                            </div>
                          </td>
                          <td>
                            <span className="category-pill" style={{ color: tx.categoryColor }}>
                              {tx.category}
                            </span>
                          </td>
                          <td>
                            <span className={`type-badge ${isIncome ? 'income' : 'expense'}`}>
                              {isIncome ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                              {tx.type}
                            </span>
                          </td>
                          <td className={`text-right tx-amount-cell ${isIncome ? 'positive' : 'neutral-spend'}`}>
                            {isIncome ? `+ ${renderAmount(tx.amount)}` : `- ${renderAmount(tx.amount)}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>
    </AppLayout>
  );
};

export default DashboardPage;
