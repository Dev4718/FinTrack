import React, { useState } from 'react';
import { 
  PiggyBank, 
  Plus, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  TrendingUp, 
  Utensils, 
  Car, 
  ShoppingBag, 
  Zap, 
  Film, 
  HeartPulse, 
  Coffee, 
  Home, 
  Gift, 
  Briefcase, 
  Laptop, 
  Layers, 
  Edit2, 
  Trash2, 
  X, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import AppLayout from '../components/layout/AppLayout';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/formatters';
import './BudgetsPage.css';

const ICON_MAP = {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Film,
  HeartPulse,
  Coffee,
  Home,
  Gift,
  Briefcase,
  Laptop,
  TrendingUp,
  Layers
};

const BudgetsPage = () => {
  const { 
    budgets, 
    addBudget, 
    updateBudget, 
    deleteBudget, 
    categories, 
    transactions, 
    navigateTo,
    hideAmounts
  } = useApp();

  const [selectedMonth] = useState('September 2025');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteConfirmBudget, setDeleteConfirmBudget] = useState(null);

  // Form states
  const [formCategory, setFormCategory] = useState('');
  const [formLimit, setFormLimit] = useState('');
  const [formThreshold, setFormThreshold] = useState('80');
  const [formError, setFormError] = useState('');

  // Days left calculation
  const totalDaysInMonth = 30;
  const currentDay = 25;
  const daysRemaining = Math.max(1, totalDaysInMonth - currentDay);

  // Calculate budgeted names for modal filtering
  const budgetedCategoryNames = budgets.map(b => b.category.toLowerCase());
  const unbudgetedExpenseCategories = categories.filter(
    c => c.type === 'Expense' && !budgetedCategoryNames.includes(c.name.toLowerCase())
  );

  // Derive enriched budget metrics with genuine status thresholds
  const enrichedBudgets = budgets.map((bgt) => {
    const matchingCategory = categories.find(c => c.name.toLowerCase() === bgt.category.toLowerCase()) || {
      name: bgt.category,
      icon: 'Layers',
      color: '#10b981'
    };

    const spentAmount = transactions
      .filter(t => t.type === 'Expense' && t.category.toLowerCase() === bgt.category.toLowerCase())
      .reduce((sum, t) => sum + t.amount, 0);

    const percentage = bgt.limit > 0 ? Math.round((spentAmount / bgt.limit) * 100) : 0;
    const remaining = bgt.limit - spentAmount;
    
    // Status colors:
    // Green under 70%
    // Amber at 70-99%
    // Red at 100% and over
    let statusState = 'safe'; // green
    let badgeText = 'On Track';
    let friendlyAdvice = `${formatINR(remaining)} safe to spend`;

    if (percentage >= 100) {
      statusState = 'danger'; // red
      badgeText = `Over budget by ${formatINR(spentAmount - bgt.limit)}`;
      friendlyAdvice = `Limit exceeded by ${percentage - 100}% this month`;
    } else if (percentage >= 70) {
      statusState = 'warning'; // amber
      badgeText = `Heads up: ${percentage}% used`;
      friendlyAdvice = `${formatINR(remaining)} left for the next ${daysRemaining} days`;
    }

    return {
      ...bgt,
      spentAmount,
      percentage,
      remaining,
      statusState,
      badgeText,
      friendlyAdvice,
      categoryMeta: matchingCategory
    };
  });

  // Summary calculations
  const totalBudgeted = enrichedBudgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpentInBudgets = enrichedBudgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const overallRemaining = totalBudgeted - totalSpentInBudgets;
  const overallPercent = totalBudgeted > 0 ? Math.round((totalSpentInBudgets / totalBudgeted) * 100) : 0;
  const safeDailySpend = Math.max(0, Math.round(overallRemaining / daysRemaining));

  // Chart data
  const chartData = enrichedBudgets.map(b => ({
    name: b.category,
    Budget: b.limit,
    Spent: b.spentAmount
  }));

  const handleOpenAddModal = () => {
    setEditingBudget(null);
    if (unbudgetedExpenseCategories.length > 0) {
      setFormCategory(unbudgetedExpenseCategories[0].name);
    } else {
      setFormCategory('');
    }
    setFormLimit('5000');
    setFormThreshold('80');
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (bgt) => {
    setEditingBudget(bgt);
    setFormCategory(bgt.category);
    setFormLimit(bgt.limit.toString());
    setFormThreshold(bgt.alertThreshold ? bgt.alertThreshold.toString() : '80');
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();
    const limitNum = parseFloat(formLimit);
    if (isNaN(limitNum) || limitNum <= 0) {
      setFormError('Please enter a valid budget amount greater than ₹0.');
      return;
    }

    if (!editingBudget) {
      if (!formCategory) {
        setFormError('Please select a category.');
        return;
      }
      addBudget({
        category: formCategory,
        limit: limitNum,
        month: selectedMonth,
        alertThreshold: parseInt(formThreshold, 10)
      });
    } else {
      updateBudget(editingBudget.id, {
        limit: limitNum,
        alertThreshold: parseInt(formThreshold, 10)
      });
    }

    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmBudget) {
      deleteBudget(deleteConfirmBudget.id);
      setDeleteConfirmBudget(null);
    }
  };

  const renderAmount = (amount) => {
    if (hideAmounts) return '••••••';
    return formatINR(amount);
  };

  return (
    <AppLayout activeMenu="budgets">
      <div className="budgets-page-container">
        
        {/* Header */}
        <div className="bgt-page-header">
          <div>
            <h1 className="bgt-page-title">Budget Management</h1>
            <p className="bgt-page-subtitle">
              Set spending limits and keep your finances disciplined with real-time tracking
            </p>
          </div>
          
          <div className="bgt-header-actions">
            <div className="month-pill-selector">
              <Calendar size={16} />
              <span>{selectedMonth}</span>
            </div>
            <button 
              type="button" 
              className="btn-create-budget"
              onClick={handleOpenAddModal}
            >
              <Plus size={18} />
              <span>Create Budget</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="bgt-metrics-grid">
          {/* Total Budget Card */}
          <div className="bgt-stat-card">
            <div className="stat-card-header">
              <span className="stat-title">Total Budget</span>
              <div className="stat-icon-pill green">
                <PiggyBank size={18} />
              </div>
            </div>
            <h2 className="stat-value">{renderAmount(totalBudgeted)}</h2>
            <div className="stat-foot-note">
              <span>Across {enrichedBudgets.length} expense categories</span>
            </div>
          </div>

          {/* Total Spent Card -> Neutral Indigo Icon instead of Red Alarm */}
          <div className="bgt-stat-card">
            <div className="stat-card-header">
              <span className="stat-title">Total Spent</span>
              <div className="stat-icon-pill neutral-indigo">
                <CreditCard size={18} />
              </div>
            </div>
            <h2 className="stat-value">{renderAmount(totalSpentInBudgets)}</h2>
            <div className="stat-progress-summary">
              <div className="summary-bar-bg">
                <div 
                  className={`summary-bar-fill ${overallPercent >= 100 ? 'danger' : overallPercent >= 70 ? 'warning' : 'safe'}`}
                  style={{ width: `${Math.min(100, overallPercent)}%` }}
                ></div>
              </div>
              <span className="summary-percent-text">{overallPercent}% utilized this month</span>
            </div>
          </div>

          {/* Remaining Budget Card */}
          <div className="bgt-stat-card">
            <div className="stat-card-header">
              <span className="stat-title">Remaining Runway</span>
              <div className="stat-icon-pill blue">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <h2 className={`stat-value ${overallRemaining < 0 ? 'text-danger' : ''}`}>
              {renderAmount(overallRemaining)}
              {overallRemaining < 0 && <span className="over-label"> (Deficit)</span>}
            </h2>
            <div className="stat-foot-note">
              <span>{daysRemaining} days left in cycle</span>
            </div>
          </div>

          {/* Safe Daily Spend */}
          <div className="bgt-stat-card highlight-card">
            <div className="stat-card-header">
              <span className="stat-title">Safe Daily Limit</span>
              <div className="stat-icon-pill shield">
                <ShieldCheck size={18} />
              </div>
            </div>
            <h2 className="stat-value">
              {renderAmount(safeDailySpend)} <span className="per-day">/ day</span>
            </h2>
            <div className="stat-foot-note">
              <span>Comfortable pace to finish within limits</span>
            </div>
          </div>
        </div>

        {/* Middle Section: Comparison Chart */}
        <div className="bgt-chart-section">
          <div className="section-head-row">
            <div>
              <h3 className="section-title">Budget Target vs. Actual Spending</h3>
              <p className="section-desc">Comparing your planned budget against real expenditures this month</p>
            </div>
            <div className="chart-legend-badge">
              <span className="legend-dot target"></span> Budget Limit
              <span className="legend-dot spent"></span> Actual Spend
            </div>
          </div>

          <div className="bgt-chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip 
                  formatter={(value) => [formatINR(value), '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="Budget" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={22} />
                <Bar dataKey="Spent" fill="#10b981" radius={[6, 6, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Category Budgets Grid */}
        <div className="bgt-cards-section">
          <div className="section-head-row">
            <div>
              <h3 className="section-title">Active Category Budgets</h3>
              <p className="section-desc">
                Green: under 70% · Amber: 70–99% · Red: 100%+
              </p>
            </div>
            <span className="bgt-counter-badge">{enrichedBudgets.length} Budgets Active</span>
          </div>

          <div className="bgt-cards-grid">
            {enrichedBudgets.map((b) => {
              const IconComponent = ICON_MAP[b.categoryMeta.icon] || Layers;
              const color = b.categoryMeta.color || '#10b981';

              return (
                <div key={b.id} className={`bgt-card ${b.statusState}`}>
                  <div className="bgt-card-top">
                    <div className="bgt-cat-info">
                      <div 
                        className="bgt-icon-bubble"
                        style={{ backgroundColor: `${color}18`, color: color }}
                      >
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <h4 className="bgt-card-cat-name">{b.category}</h4>
                        <span className={`bgt-status-badge ${b.statusState}`}>
                          {b.badgeText}
                        </span>
                      </div>
                    </div>

                    <div className="bgt-card-actions">
                      <button 
                        type="button" 
                        className="bgt-action-btn"
                        onClick={() => handleOpenEditModal(b)}
                        title="Edit Limit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        type="button" 
                        className="bgt-action-btn delete"
                        onClick={() => setDeleteConfirmBudget(b)}
                        title="Delete Budget"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="bgt-numbers-row">
                    <div>
                      <span className="amt-label">Spent</span>
                      <span className="amt-val">{renderAmount(b.spentAmount)}</span>
                    </div>
                    <div className="amt-right">
                      <span className="amt-label">Budget Limit</span>
                      <span className="amt-limit">{renderAmount(b.limit)}</span>
                    </div>
                  </div>

                  {/* Visual Progress Bar with Real Status Colors */}
                  <div className="bgt-progress-container">
                    <div className="bgt-progress-bg">
                      <div 
                        className={`bgt-progress-fill ${b.statusState}`}
                        style={{ width: `${Math.min(100, b.percentage)}%` }}
                      ></div>
                    </div>
                    <div className="bgt-progress-labels">
                      <span className="percent-label">{b.percentage}% used</span>
                      <span className="rem-label">{b.friendlyAdvice}</span>
                    </div>
                  </div>

                  {/* Footer link to view transactions */}
                  <div className="bgt-card-footer">
                    <button 
                      type="button" 
                      className="bgt-view-tx-btn"
                      onClick={() => navigateTo('transactions')}
                    >
                      <span>View transactions</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Quick Add Placeholder Card */}
            <div className="bgt-card create-new-box" onClick={handleOpenAddModal}>
              <div className="create-inner">
                <div className="create-icon-pill">
                  <Plus size={22} />
                </div>
                <h4>Set Another Budget</h4>
                <p>
                  {unbudgetedExpenseCategories.length > 0 
                    ? `Assign a cap for ${unbudgetedExpenseCategories[0].name}`
                    : 'Manage monthly spending caps'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Create or Edit Budget (Only offers categories without budget) */}
        {modalOpen && (
          <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
            <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingBudget ? `Edit ${editingBudget.category} Budget` : 'Create Budget'}</h3>
                <button 
                  type="button" 
                  className="modal-close-btn" 
                  onClick={() => setModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveBudget} className="modal-form">
                {formError && (
                  <div className="form-error-alert">{formError}</div>
                )}

                {/* Category Selection */}
                <div className="form-field">
                  <label htmlFor="bgt-category-select">Category</label>
                  {editingBudget ? (
                    <input 
                      id="bgt-category-select"
                      type="text" 
                      value={editingBudget.category} 
                      disabled 
                      className="disabled-input"
                    />
                  ) : unbudgetedExpenseCategories.length === 0 ? (
                    <div className="no-cat-alert">
                      All expense categories already have active budgets assigned. You can edit an existing budget from the cards.
                    </div>
                  ) : (
                    <select
                      id="bgt-category-select"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="bgt-select"
                    >
                      {unbudgetedExpenseCategories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Monthly Limit */}
                <div className="form-field">
                  <label htmlFor="bgt-limit-input">Monthly Limit (₹)</label>
                  <input 
                    id="bgt-limit-input"
                    type="number" 
                    placeholder="e.g. 8000" 
                    value={formLimit}
                    onChange={(e) => setFormLimit(e.target.value)}
                    required
                    min="1"
                    step="100"
                  />
                </div>

                {/* Alert Threshold */}
                <div className="form-field">
                  <label htmlFor="bgt-alert-threshold">Alert Threshold (%)</label>
                  <select
                    id="bgt-alert-threshold"
                    value={formThreshold}
                    onChange={(e) => setFormThreshold(e.target.value)}
                    className="bgt-select"
                  >
                    <option value="70">Notify at 70% of limit</option>
                    <option value="80">Notify at 80% of limit (Standard)</option>
                    <option value="90">Notify at 90% of limit (Strict)</option>
                    <option value="100">Notify only when exceeded (100%)</option>
                  </select>
                </div>

                <div className="modal-actions-row">
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-save"
                    disabled={!editingBudget && unbudgetedExpenseCategories.length === 0}
                  >
                    {editingBudget ? 'Save Changes' : 'Create Budget'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Confirmation Before Delete */}
        {deleteConfirmBudget && (
          <div className="modal-backdrop" onClick={() => setDeleteConfirmBudget(null)}>
            <div className="modal-dialog-box modal-confirm" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-icon-box">
                <Trash2 size={24} className="text-danger" />
              </div>
              <h3 className="confirm-title">Remove Budget for {deleteConfirmBudget.category}?</h3>
              <p className="confirm-desc">
                Your transactions will not be deleted, but you will no longer receive spending progress or threshold alerts for this category.
              </p>
              <div className="modal-actions-row">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => setDeleteConfirmBudget(null)}
                >
                  Keep Budget
                </button>
                <button 
                  type="button" 
                  className="btn-danger-confirm" 
                  onClick={handleConfirmDelete}
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default BudgetsPage;
