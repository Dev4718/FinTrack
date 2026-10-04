import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CreditCard,
  PieChart,
  PiggyBank
} from 'lucide-react';
import {
  LANDING_FINANCIAL_DATA,
  formatCurrency,
  formatCompact
} from '../data/landingData';
import { useCountUp } from '../hooks/useCountUp';
import './FinanceVisual.css';

const FinanceVisual = () => {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // savings = income - expenses, computed in code
  const computedSavings =
    LANDING_FINANCIAL_DATA.monthlyIncome - LANDING_FINANCIAL_DATA.monthlyExpenses;

  // Animated values via useCountUp hook (automatically respects prefers-reduced-motion)
  const animatedNetWorth = useCountUp(LANDING_FINANCIAL_DATA.netWorth, 1400);
  const animatedIncome = useCountUp(LANDING_FINANCIAL_DATA.monthlyIncome, 1200);
  const animatedExpenses = useCountUp(LANDING_FINANCIAL_DATA.monthlyExpenses, 1200);
  const animatedSavings = useCountUp(computedSavings, 1200);

  // Max value for y-axis scaling (e.g. $10,000 ceiling)
  const maxChartValue = 10000;
  const yAxisTicks = [10000, 5000, 0];

  useEffect(() => {
    // Trigger bar grow-in transition on load
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="finance-visual-container">
      {/* Background Ambient Faint Emerald Glow */}
      <div className="visual-glow" aria-hidden="true"></div>

      {/* Floating Chip 1 - Top Right: Goal Reached (Anchored to card outer edge) */}
      <div className="floating-badge badge-top-right">
        <div className="floating-icon green">
          <ShieldCheck size={18} />
        </div>
        <div className="floating-badge-text">
          <div className="badge-text-primary">
            {LANDING_FINANCIAL_DATA.goalProgress.title}
          </div>
          <div className="badge-text-secondary">
            {LANDING_FINANCIAL_DATA.goalProgress.subtitle}
          </div>
        </div>
      </div>

      {/* Main White Card Preview */}
      <div className="dashboard-glass-card">
        {/* Card Header: Net Worth */}
        <div className="card-header">
          <div>
            <span className="card-subtitle">Total Net Worth</span>
            <h3 className="card-balance">
              {formatCurrency(animatedNetWorth)}
            </h3>
          </div>
          <div className="trend-badge positive">
            <TrendingUp size={15} />
            <span>{LANDING_FINANCIAL_DATA.netWorthGrowth}</span>
          </div>
        </div>

        {/* Stats Row: Income (Emerald), Expenses (Coral), Savings (Blue) */}
        <div className="stats-row">
          {/* Income Stat */}
          <div className="stat-pill income">
            <div className="stat-icon-bg green">
              <ArrowUpRight size={15} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Income</span>
              <span className="stat-val income-val">
                {formatCurrency(animatedIncome)}
              </span>
            </div>
          </div>

          {/* Expenses Stat (Coral) */}
          <div className="stat-pill expense">
            <div className="stat-icon-bg coral">
              <ArrowDownRight size={15} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Expenses</span>
              <span className="stat-val expense-val">
                {formatCurrency(animatedExpenses)}
              </span>
            </div>
          </div>

          {/* Savings Stat (Blue) - savings = income - expenses computed in code */}
          <div className="stat-pill savings">
            <div className="stat-icon-bg blue">
              <PiggyBank size={15} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Savings</span>
              <span className="stat-val savings-val">
                {formatCurrency(animatedSavings)}
              </span>
            </div>
          </div>
        </div>

        {/* Cashflow Chart Section: 6 Months, Y-Axis, Faint Gridlines, Tooltips */}
        <div className="visual-chart-section">
          <div className="chart-header">
            <div className="chart-title-box">
              <span className="chart-title">Monthly Cashflow</span>
              <span className="chart-subtitle">Income vs Expenses</span>
            </div>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot income-dot"></span> Income
              </span>
              <span className="legend-item">
                <span className="legend-dot expense-dot"></span> Expenses
              </span>
            </div>
          </div>

          <div className="chart-body">
            {/* Y-Axis Column */}
            <div className="chart-y-axis">
              {yAxisTicks.map((tick) => (
                <span key={tick} className="y-axis-label">
                  {formatCompact(tick)}
                </span>
              ))}
            </div>

            {/* Gridlines & Bars Area */}
            <div className="chart-plot-area">
              {/* Faint Horizontal Gridlines */}
              <div className="chart-gridlines" aria-hidden="true">
                <div className="gridline gridline-top"></div>
                <div className="gridline gridline-mid"></div>
                <div className="gridline gridline-base"></div>
              </div>

              {/* 6 Months Bar Groups with Hover Tooltips */}
              <div className="bars-container">
                {LANDING_FINANCIAL_DATA.monthlyCashflow.map((data, index) => {
                  const incomeHeightPct = (data.income / maxChartValue) * 100;
                  const expenseHeightPct = (data.expense / maxChartValue) * 100;

                  return (
                    <div
                      key={data.month}
                      className={`bar-group ${data.isLatest ? 'is-latest' : ''}`}
                      onMouseEnter={() => setActiveTooltip(index)}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onFocus={() => setActiveTooltip(index)}
                      onBlur={() => setActiveTooltip(null)}
                      tabIndex={0}
                      aria-label={`${data.month}: Income ${formatCurrency(data.income, 0)}, Expenses ${formatCurrency(data.expense, 0)}`}
                    >
                      {/* Interactive Hover Tooltip */}
                      {activeTooltip === index && (
                        <div className="chart-tooltip">
                          <div className="tooltip-month">{data.month}</div>
                          <div className="tooltip-row green-text">
                            <span>Income:</span>
                            <strong>{formatCurrency(data.income, 0)}</strong>
                          </div>
                          <div className="tooltip-row coral-text">
                            <span>Expense:</span>
                            <strong>{formatCurrency(data.expense, 0)}</strong>
                          </div>
                        </div>
                      )}

                      {/* Bar Wrapper with grow-in transition on load */}
                      <div className="bar-wrapper">
                        <div
                          className="bar income-bar"
                          style={{
                            height: isLoaded ? `${incomeHeightPct}%` : '0%'
                          }}
                        ></div>
                        <div
                          className="bar expense-bar"
                          style={{
                            height: isLoaded ? `${expenseHeightPct}%` : '0%'
                          }}
                        ></div>
                      </div>

                      {/* Month Label with Latest Month Highlighted */}
                      <div className="bar-label-wrapper">
                        <span className="bar-label">{data.month}</span>
                        {data.isLatest && (
                          <span className="latest-indicator">Latest</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Snippet */}
        <div className="recent-transactions">
          {LANDING_FINANCIAL_DATA.transactions.map((tx) => {
            const isIncome = tx.type === 'income';
            // "The savings transfer row is neutral gray, not red."
            const isSavingsTransfer = tx.type === 'savings-transfer';

            return (
              <div
                key={tx.id}
                className={`tx-item ${isSavingsTransfer ? 'tx-savings-transfer' : ''}`}
              >
                <div
                  className={`tx-icon ${
                    isIncome ? 'icon-income' : 'icon-neutral-gray'
                  }`}
                >
                  {isIncome ? (
                    <CreditCard size={17} />
                  ) : (
                    <PieChart size={17} />
                  )}
                </div>
                <div className="tx-info">
                  <span className="tx-title">{tx.title}</span>
                  <span className="tx-date">{tx.date}</span>
                </div>
                {/* Neutral gray for savings transfer, emerald positive for salary */}
                <span
                  className={`tx-amount ${
                    isIncome
                      ? 'amount-positive'
                      : 'amount-neutral-gray'
                  }`}
                >
                  {tx.formattedAmount}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Chip 2 - Bottom Left: Auto-Tracked (Anchored to card outer edge) */}
      <div className="floating-badge badge-bottom-left">
        <div className="floating-icon blue-tint">
          <PiggyBank size={18} />
        </div>
        <div className="floating-badge-text">
          <div className="badge-text-primary">
            {LANDING_FINANCIAL_DATA.autoTracked.title}
          </div>
          <div className="badge-text-secondary">
            +{formatCurrency(computedSavings, 0)} {LANDING_FINANCIAL_DATA.autoTracked.label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceVisual;
