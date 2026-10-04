import React, { useState } from 'react';
import { 
  Printer, 
  ArrowUpRight, 
  Sparkles, 
  FileSpreadsheet
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import AppLayout from '../components/layout/AppLayout';
import { useApp } from '../context/AppContext';
import { MONTHLY_ANALYTICS_DATA } from '../data/mockData';
import { formatINR, pluralize } from '../utils/formatters';
import './ReportsPage.css';

const ReportsPage = () => {
  const { transactions, stats, categories, hideAmounts, showToast } = useApp();
  const [timeRange, setTimeRange] = useState('6M'); // '1M', '3M', '6M'
  const [loading, setLoading] = useState(false);

  // Simulate loading skeleton briefly when switching timeframe
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 350);
  };

  // Filter monthly data based on selected timeframe
  const getFilteredCashflowData = () => {
    if (timeRange === '1M') {
      return MONTHLY_ANALYTICS_DATA.slice(-1);
    } else if (timeRange === '3M') {
      return MONTHLY_ANALYTICS_DATA.slice(-3);
    }
    return MONTHLY_ANALYTICS_DATA; // 6M
  };

  const cashflowData = getFilteredCashflowData();

  // Dynamic Category breakdown from transactions
  const expenseTransactions = transactions.filter(t => t.type === 'Expense');
  const categorySpendMap = {};
  expenseTransactions.forEach(t => {
    categorySpendMap[t.category] = (categorySpendMap[t.category] || 0) + t.amount;
  });

  const categoryPieData = Object.entries(categorySpendMap).map(([catName, amount]) => {
    const meta = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
    return {
      name: catName,
      value: amount,
      color: meta?.color || '#64748b'
    };
  }).sort((a, b) => b.value - a.value);

  // Top Merchants / Outflows
  const merchantMap = {};
  expenseTransactions.forEach(t => {
    if (!merchantMap[t.description]) {
      merchantMap[t.description] = {
        name: t.description,
        category: t.category,
        count: 0,
        amount: 0,
        color: t.categoryColor || '#10b981'
      };
    }
    merchantMap[t.description].count += 1;
    merchantMap[t.description].amount += t.amount;
  });

  const topMerchants = Object.values(merchantMap)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Financial Health Metrics (using human phrasing)
  const savingsRate = stats.totalIncome > 0 
    ? Math.round((stats.savings / stats.totalIncome) * 100) 
    : 0;
  
  const dailyAverageExpense = Math.round(stats.totalExpenses / 30);
  const topExpenseCategory = categoryPieData[0] || { name: 'None', value: 0 };

  // Period-aware CSV Export
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Description', 'Category', 'Type', 'Amount (INR)'];
    
    // Filter transactions by timeframe approximation
    let txToExport = transactions;
    if (timeRange === '1M') {
      txToExport = transactions.slice(0, 15);
    } else if (timeRange === '3M') {
      txToExport = transactions.slice(0, 30);
    }

    const rows = txToExport.map(t => [
      t.id,
      `"${t.date}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.type,
      t.amount
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinTrack_${timeRange}_Statement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Downloaded CSV statement for ${timeRange} period.`);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderAmount = (amount) => {
    if (hideAmounts) return '••••••';
    return formatINR(amount);
  };

  return (
    <AppLayout activeMenu="reports">
      <div className="reports-page-container">
        
        {/* Header and Filter Controls */}
        <div className="reports-page-header no-print">
          <div>
            <h1 className="reports-page-title">Reports & Analytics</h1>
            <p className="reports-page-subtitle">
              Clear breakdown of money in, money going out, and monthly savings
            </p>
          </div>

          <div className="reports-top-controls">
            {/* Timeframe Pills */}
            <div className="timeframe-pill-group">
              <button 
                type="button" 
                className={`time-btn ${timeRange === '1M' ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange('1M')}
              >
                1 Month
              </button>
              <button 
                type="button" 
                className={`time-btn ${timeRange === '3M' ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange('3M')}
              >
                3 Months
              </button>
              <button 
                type="button" 
                className={`time-btn ${timeRange === '6M' ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange('6M')}
              >
                6 Months
              </button>
            </div>

            {/* Action Buttons */}
            <div className="export-action-btns">
              <button 
                type="button" 
                className="btn-export-csv" 
                onClick={handleExportCSV}
                title="Download CSV Statement for selected period"
              >
                <FileSpreadsheet size={16} />
                <span>Export CSV ({timeRange})</span>
              </button>
              <button 
                type="button" 
                className="btn-print-report" 
                onClick={handlePrint}
                title="Print or Save as clean PDF"
              >
                <Printer size={16} />
                <span>Print Statement</span>
              </button>
            </div>
          </div>
        </div>

        {/* Print Only Header */}
        <div className="print-only print-header">
          <h2>FinTrack Financial Statement</h2>
          <p>Reporting Period: {timeRange === '1M' ? 'Last Month' : `${timeRange} Historical`} · Generated on {new Date().toLocaleDateString('en-IN')}</p>
        </div>

        {loading ? (
          /* Loading Skeleton */
          <div className="reports-skeleton-grid">
            <div className="skeleton-card skeleton-metric"></div>
            <div className="skeleton-card skeleton-metric"></div>
            <div className="skeleton-card skeleton-metric"></div>
            <div className="skeleton-card skeleton-metric"></div>
            <div className="skeleton-card skeleton-chart-big"></div>
            <div className="skeleton-card skeleton-chart-small"></div>
          </div>
        ) : (
          <>
            {/* 4 Financial Performance Metric Cards with Human Copy */}
            <div className="reports-metrics-grid">
              {/* Savings Rate Card */}
              <div className="rep-stat-card">
                <span className="rep-stat-label">Savings Rate</span>
                <div className="rep-stat-main-row">
                  <h2 className="rep-stat-value">{savingsRate}%</h2>
                  <span className={`rep-trend-pill ${savingsRate >= 20 ? 'positive' : 'neutral'}`}>
                    {savingsRate >= 20 ? 'Strong reserve' : 'Target: 20%'}
                  </span>
                </div>
                <p className="rep-stat-hint">
                  You kept {formatINR(Math.round(savingsRate), false)} of every ₹100 you earned
                </p>
              </div>

              {/* Average Daily Expense */}
              <div className="rep-stat-card">
                <span className="rep-stat-label">Daily Spending Pace</span>
                <div className="rep-stat-main-row">
                  <h2 className="rep-stat-value">{renderAmount(dailyAverageExpense)}</h2>
                  <span className="rep-trend-pill neutral">30-day average</span>
                </div>
                <p className="rep-stat-hint">Average daily expenditure this month</p>
              </div>

              {/* Top Expense Bucket */}
              <div className="rep-stat-card">
                <span className="rep-stat-label">Where Most Goes</span>
                <div className="rep-stat-main-row">
                  <h2 className="rep-stat-value highlight-category">{topExpenseCategory.name}</h2>
                  <span className="rep-trend-pill red">{renderAmount(topExpenseCategory.value)}</span>
                </div>
                <p className="rep-stat-hint">
                  {stats.totalExpenses > 0 ? Math.round((topExpenseCategory.value / stats.totalExpenses) * 100) : 0}% of all spending
                </p>
              </div>

              {/* Money Left Over */}
              <div className="rep-stat-card">
                <span className="rep-stat-label">Money Left Over</span>
                <div className="rep-stat-main-row">
                  <h2 className={`rep-stat-value ${stats.savings >= 0 ? 'text-emerald' : 'text-danger'}`}>
                    {renderAmount(stats.savings)}
                  </h2>
                  <span className="rep-trend-pill positive">
                    <ArrowUpRight size={13} />
                    <span>In your pocket</span>
                  </span>
                </div>
                <p className="rep-stat-hint">What is left after all monthly expenses</p>
              </div>
            </div>

            {/* Charts Section: Row 1 */}
            <div className="reports-charts-row">
              {/* Money In vs Money Out Area Chart */}
              <div className="rep-chart-card flex-2">
                <div className="rep-chart-head">
                  <div>
                    <h3 className="rep-chart-title">Money In vs Money Out Trend</h3>
                    <p className="rep-chart-subtitle">Monthly trajectory comparing inflows vs. expenditures ({timeRange})</p>
                  </div>
                  <div className="cashflow-legend">
                    <span className="cf-dot income"></span> Money In
                    <span className="cf-dot expense"></span> Money Out
                  </div>
                </div>

                <div className="rep-chart-container">
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={cashflowData} margin={{ top: 15, right: 15, left: -5, bottom: 5 }}>
                      <defs>
                        <linearGradient id="incomeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="expenseAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                      <Tooltip 
                        formatter={(val, name) => [
                          formatINR(val), 
                          name === 'income' ? 'Money In' : 'Money Out'
                        ]}
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="income" 
                        stroke="#10b981" 
                        strokeWidth={2.5}
                        fillOpacity={1} 
                        fill="url(#incomeAreaGrad)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="expense" 
                        stroke="#3b82f6" 
                        strokeWidth={2.5}
                        fillOpacity={1} 
                        fill="url(#expenseAreaGrad)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Expense Donut Chart */}
              <div className="rep-chart-card flex-1">
                <div className="rep-chart-head">
                  <div>
                    <h3 className="rep-chart-title">Spending by Category</h3>
                    <p className="rep-chart-subtitle">Share of total expenditures</p>
                  </div>
                </div>

                <div className="donut-and-legend-wrapper">
                  <div className="donut-chart-box">
                    <ResponsiveContainer width="100%" height={210}>
                      <PieChart>
                        <Tooltip 
                          formatter={(val) => [formatINR(val), 'Spent']}
                          contentStyle={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                        />
                        <Pie
                          data={categoryPieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={4}
                        >
                          {categoryPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center-metric">
                      <span className="donut-center-label">Total Spent</span>
                      <span className="donut-center-val">{renderAmount(stats.totalExpenses)}</span>
                    </div>
                  </div>

                  {/* Legend List */}
                  <div className="rep-pie-legend-list">
                    {categoryPieData.slice(0, 4).map((item) => {
                      const share = stats.totalExpenses > 0 ? Math.round((item.value / stats.totalExpenses) * 100) : 0;
                      return (
                        <div key={item.name} className="legend-list-item">
                          <div className="item-name-group">
                            <span className="item-dot" style={{ backgroundColor: item.color }}></span>
                            <span className="item-name">{item.name}</span>
                          </div>
                          <span className="item-share">{share}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section: Row 2 (Monthly Savings Growth & Top Payees) */}
            <div className="reports-charts-row">
              {/* Monthly Net Savings Growth Bar Chart */}
              <div className="rep-chart-card flex-1">
                <div className="rep-chart-head">
                  <div>
                    <h3 className="rep-chart-title">Money You Saved Each Month</h3>
                    <p className="rep-chart-subtitle">Net savings left over after expenses</p>
                  </div>
                </div>

                <div className="rep-chart-container">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={cashflowData} margin={{ top: 15, right: 15, left: -5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                      <Tooltip 
                        formatter={(val) => [formatINR(val), 'Saved']}
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                      />
                      <Bar dataKey="savings" fill="#10b981" radius={[6, 6, 0, 0]} barSize={26} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Payees & Merchants */}
              <div className="rep-chart-card flex-1">
                <div className="rep-chart-head">
                  <div>
                    <h3 className="rep-chart-title">Where Your Money Goes the Most</h3>
                    <p className="rep-chart-subtitle">Top payees and merchants</p>
                  </div>
                </div>

                <div className="merchant-table-wrapper">
                  <table className="merchant-table">
                    <thead>
                      <tr>
                        <th>Payee</th>
                        <th>Category</th>
                        <th>Frequency</th>
                        <th className="text-right">Total Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topMerchants.map((m) => (
                        <tr key={m.name}>
                          <td className="merchant-name-cell">
                            <span className="merchant-avatar" style={{ backgroundColor: `${m.color}15`, color: m.color }}>
                              {m.name.charAt(0)}
                            </span>
                            <span className="m-name">{m.name}</span>
                          </td>
                          <td>
                            <span className="m-cat-badge">{m.category}</span>
                          </td>
                          <td className="m-count">{pluralize(m.count, 'transaction')}</td>
                          <td className="m-amount text-right">{renderAmount(m.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Smart Financial Insights Section (Friendly tone) */}
            <div className="rep-insights-box">
              <div className="insights-head">
                <div className="insights-icon-circle">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="insights-title">FinTrack Friendly Observations</h3>
                  <p className="insights-sub">Gentle takeaways based on your recent spending habits</p>
                </div>
              </div>

              <div className="insights-cards-grid">
                <div className="insight-card">
                  <div className="insight-top">
                    <span className="insight-tag positive">Good Progress</span>
                  </div>
                  <h4>Healthy Savings Pace</h4>
                  <p>
                    You are saving about <strong>{savingsRate}%</strong> of your earnings right now. You kept {formatINR(Math.round(savingsRate), false)} of every ₹100 earned. Great job staying disciplined!
                  </p>
                </div>

                <div className="insight-card">
                  <div className="insight-top">
                    <span className="insight-tag warning">Ways to Save</span>
                  </div>
                  <h4>Food & Delivery Insights</h4>
                  <p>
                    Dining & food delivery is your second highest category. Cooking dinner one extra night a week could save around <strong>₹ 2,400</strong> every month without feeling restrictive.
                  </p>
                </div>

                <div className="insight-card">
                  <div className="insight-top">
                    <span className="insight-tag goal">Next Milestone</span>
                  </div>
                  <h4>Emergency Reserve</h4>
                  <p>
                    At your current monthly savings pace of <strong>{renderAmount(stats.savings)}</strong>, you are well on track to reach your emergency cushion goal by year end.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </AppLayout>
  );
};

export default ReportsPage;
