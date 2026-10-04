import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Sparkles, 
  Shield, 
  Plane, 
  Laptop, 
  Gift, 
  Car, 
  Home, 
  TrendingUp, 
  Edit2, 
  Trash2, 
  X,
  Calendar,
  Layers
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/formatters';
import './GoalsPage.css';

const ICON_MAP = {
  Target,
  Shield,
  Plane,
  Laptop,
  Gift,
  Car,
  Home,
  TrendingUp,
  Layers
};

const GoalsPage = () => {
  const { 
    goals, 
    addGoal, 
    updateGoal, 
    contributeToGoal, 
    deleteGoal,
    hideAmounts 
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [contributeGoalItem, setContributeGoalItem] = useState(null);
  const [contributeAmount, setContributeAmount] = useState('2000');

  // Form State
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('Dec 2025');
  const [category, setCategory] = useState('Safety');
  const [color, setColor] = useState('#10b981');
  const [icon, setIcon] = useState('Shield');
  const [formError, setFormError] = useState('');

  // Total metrics
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const completedCount = goals.filter(g => g.currentAmount >= g.targetAmount).length;
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const handleOpenAdd = () => {
    setEditingGoal(null);
    setTitle('');
    setTargetAmount('50000');
    setCurrentAmount('10000');
    setTargetDate('Dec 2025');
    setCategory('General');
    setColor('#10b981');
    setIcon('Target');
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setTargetAmount(goal.targetAmount.toString());
    setCurrentAmount(goal.currentAmount.toString());
    setTargetDate(goal.targetDate);
    setCategory(goal.category);
    setColor(goal.color || '#10b981');
    setIcon(goal.icon || 'Target');
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    const tVal = parseFloat(targetAmount);
    const cVal = parseFloat(currentAmount) || 0;

    if (!title.trim()) {
      setFormError('Please enter a goal title.');
      return;
    }
    if (isNaN(tVal) || tVal <= 0) {
      setFormError('Please enter a valid target amount.');
      return;
    }

    if (editingGoal) {
      updateGoal(editingGoal.id, {
        title: title.trim(),
        targetAmount: tVal,
        currentAmount: cVal,
        targetDate,
        category,
        color,
        icon
      });
    } else {
      addGoal({
        title: title.trim(),
        targetAmount: tVal,
        currentAmount: cVal,
        targetDate,
        category,
        color,
        icon
      });
    }

    setModalOpen(false);
  };

  const handleContributeSubmit = (e) => {
    e.preventDefault();
    if (!contributeGoalItem) return;
    const addVal = parseFloat(contributeAmount);
    if (!isNaN(addVal) && addVal > 0) {
      contributeToGoal(contributeGoalItem.id, addVal);
    }
    setContributeGoalItem(null);
  };

  const renderAmount = (amount) => {
    if (hideAmounts) return '••••••';
    return formatINR(amount);
  };

  return (
    <AppLayout activeMenu="goals">
      <div className="goals-page-container">
        
        {/* Header */}
        <div className="goals-page-header">
          <div>
            <h1 className="goals-page-title">Savings Goals</h1>
            <p className="goals-page-subtitle">
              Set dedicated targets for emergency funds, vacations, or gadget upgrades and track your progress
            </p>
          </div>
          <button 
            type="button" 
            className="btn-create-goal"
            onClick={handleOpenAdd}
          >
            <Plus size={18} />
            <span>Create New Goal</span>
          </button>
        </div>

        {/* Executive Summary Cards */}
        <div className="goals-metrics-grid">
          <div className="goal-stat-card">
            <span className="goal-stat-label">Total Saved in Goals</span>
            <div className="goal-stat-val-row">
              <span className="goal-stat-num">{renderAmount(totalSaved)}</span>
              <span className="goal-stat-pill green">{overallProgress}% funded</span>
            </div>
            <div className="goal-stat-sub">Across {goals.length} target pots</div>
          </div>

          <div className="goal-stat-card">
            <span className="goal-stat-label">Total Target Value</span>
            <div className="goal-stat-val-row">
              <span className="goal-stat-num">{renderAmount(totalTarget)}</span>
              <span className="goal-stat-pill neutral">{renderAmount(totalTarget - totalSaved)} left</span>
            </div>
            <div className="goal-stat-sub">Combined savings milestones</div>
          </div>

          <div className="goal-stat-card">
            <span className="goal-stat-label">Milestones Reached</span>
            <div className="goal-stat-val-row">
              <span className="goal-stat-num">{completedCount} of {goals.length}</span>
              <span className="goal-stat-pill celebration">🎉 Celebrating</span>
            </div>
            <div className="goal-stat-sub">100% reached goals</div>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="goals-grid">
          {goals.map((g) => {
            const IconComponent = ICON_MAP[g.icon] || Target;
            const pct = g.targetAmount > 0 ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) : 0;
            const isCompleted = g.currentAmount >= g.targetAmount;
            const remainingToSave = Math.max(0, g.targetAmount - g.currentAmount);

            return (
              <div key={g.id} className={`goal-card ${isCompleted ? 'completed-card' : ''}`}>
                <div className="goal-card-top">
                  <div className="goal-icon-bubble" style={{ backgroundColor: `${g.color}18`, color: g.color }}>
                    <IconComponent size={22} />
                  </div>

                  <div className="goal-card-actions">
                    <button 
                      type="button" 
                      className="goal-action-btn"
                      onClick={() => handleOpenEdit(g)}
                      title="Edit Goal"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      type="button" 
                      className="goal-action-btn delete"
                      onClick={() => {
                        if (window.confirm(`Delete savings goal "${g.title}"?`)) {
                          deleteGoal(g.id);
                        }
                      }}
                      title="Delete Goal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="goal-card-body">
                  <div className="goal-title-row">
                    <h3 className="goal-card-title">{g.title}</h3>
                    {isCompleted && (
                      <span className="goal-achieved-badge">
                        <Sparkles size={12} />
                        <span>Goal Reached!</span>
                      </span>
                    )}
                  </div>
                  <span className="goal-date-pill">
                    <Calendar size={13} />
                    <span>Target: {g.targetDate}</span>
                  </span>
                </div>

                {/* Progress Visual */}
                <div className="goal-progress-box">
                  <div className="goal-amounts-row">
                    <span className="goal-current-val">{renderAmount(g.currentAmount)}</span>
                    <span className="goal-target-val">of {renderAmount(g.targetAmount)}</span>
                  </div>

                  <div className="goal-track-bg">
                    <div 
                      className={`goal-track-fill ${isCompleted ? 'finished' : ''}`}
                      style={{ width: `${pct}%`, backgroundColor: isCompleted ? '#10b981' : g.color }}
                    />
                  </div>

                  <div className="goal-track-footer">
                    <span className="goal-pct-text">{pct}% reached</span>
                    <span className="goal-rem-text">
                      {isCompleted ? 'Goal fully achieved!' : `${renderAmount(remainingToSave)} left`}
                    </span>
                  </div>
                </div>

                {/* Contribute Button */}
                <div className="goal-card-footer">
                  <button 
                    type="button" 
                    className="btn-goal-contribute"
                    onClick={() => {
                      setContributeGoalItem(g);
                      setContributeAmount('2000');
                    }}
                  >
                    <Plus size={16} />
                    <span>Add Funds to Goal</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Quick Add Placeholder */}
          <div className="goal-card create-goal-card" onClick={handleOpenAdd}>
            <div className="create-goal-inner">
              <div className="create-goal-icon-circle">
                <Plus size={26} />
              </div>
              <h4>Start a New Savings Goal</h4>
              <p>Set a target amount and track your discipline step-by-step</p>
            </div>
          </div>
        </div>

        {/* Modal: Create or Edit Goal */}
        {modalOpen && (
          <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
            <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingGoal ? 'Edit Savings Goal' : 'Create Savings Goal'}</h3>
                <button type="button" className="modal-close-btn" onClick={() => setModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveGoal} className="modal-form">
                {formError && (
                  <div className="form-error-alert">{formError}</div>
                )}

                <div className="form-field">
                  <label htmlFor="goal-title">Goal Name *</label>
                  <input 
                    id="goal-title"
                    type="text" 
                    placeholder="e.g. Emergency Cushion, Trip to Ladakh, Down Payment"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row-split">
                  <div className="form-field">
                    <label htmlFor="goal-target">Target Amount (₹) *</label>
                    <input 
                      id="goal-target"
                      type="number"
                      step="500" 
                      placeholder="e.g. 50000"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="goal-current">Already Saved (₹)</label>
                    <input 
                      id="goal-current"
                      type="number" 
                      step="500"
                      placeholder="0"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row-split">
                  <div className="form-field">
                    <label htmlFor="goal-date">Target Date</label>
                    <input 
                      id="goal-date"
                      type="text" 
                      placeholder="e.g. Dec 2025"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="goal-icon">Icon</label>
                    <select
                      id="goal-icon"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="bgt-select"
                    >
                      <option value="Target">Target Flag</option>
                      <option value="Shield">Emergency / Safety</option>
                      <option value="Plane">Travel / Trip</option>
                      <option value="Laptop">Tech / Gadget</option>
                      <option value="Gift">Celebration / Festive</option>
                      <option value="Car">Vehicle</option>
                      <option value="Home">Home / Property</option>
                    </select>
                  </div>
                </div>

                <div className="modal-actions-row">
                  <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    {editingGoal ? 'Save Changes' : 'Create Goal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Contribute to Goal */}
        {contributeGoalItem && (
          <div className="modal-backdrop" onClick={() => setContributeGoalItem(null)}>
            <div className="modal-dialog-box modal-contribute" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add Funds to "{contributeGoalItem.title}"</h3>
                <button type="button" className="modal-close-btn" onClick={() => setContributeGoalItem(null)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleContributeSubmit} className="modal-form">
                <p className="contribute-hint">
                  Currently saved: <strong>{renderAmount(contributeGoalItem.currentAmount)}</strong> of {renderAmount(contributeGoalItem.targetAmount)}.
                </p>

                <div className="form-field">
                  <label htmlFor="contribute-val">Amount to Deposit (₹)</label>
                  <input 
                    id="contribute-val"
                    type="number"
                    step="100" 
                    value={contributeAmount}
                    onChange={(e) => setContributeAmount(e.target.value)}
                    required
                    min="1"
                    autoFocus
                  />
                </div>

                <div className="quick-chip-row">
                  {['1000', '2500', '5000', '10000'].map(val => (
                    <button 
                      key={val} 
                      type="button" 
                      className="quick-chip"
                      onClick={() => setContributeAmount(val)}
                    >
                      +₹{parseInt(val, 10).toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="modal-actions-row">
                  <button type="button" className="btn-cancel" onClick={() => setContributeGoalItem(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    Deposit to Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default GoalsPage;
