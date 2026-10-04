import React, { useState } from 'react';
import { 
  Plus, 
  Layers, 
  Utensils, 
  Briefcase, 
  Car, 
  ShoppingBag, 
  Zap, 
  Laptop, 
  Film, 
  HeartPulse, 
  TrendingUp, 
  Coffee, 
  Home, 
  Gift, 
  GraduationCap, 
  Plane, 
  Camera,
  Shield,
  Music,
  Dumbbell,
  Edit3, 
  Trash2, 
  X, 
  Check, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  AlertTriangle,
  MoveRight
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useApp } from '../context/AppContext';
import { formatINR, pluralize } from '../utils/formatters';
import './CategoriesPage.css';

// Rich icon registry for categories
const AVAILABLE_ICONS = [
  { name: 'Utensils', component: Utensils, label: 'Dining / Food' },
  { name: 'Car', component: Car, label: 'Transport / Cab' },
  { name: 'ShoppingBag', component: ShoppingBag, label: 'Shopping / Retail' },
  { name: 'Zap', component: Zap, label: 'Bills / Utilities' },
  { name: 'Film', component: Film, label: 'Entertainment / Media' },
  { name: 'HeartPulse', component: HeartPulse, label: 'Health / Medical' },
  { name: 'Coffee', component: Coffee, label: 'Café / Coffee' },
  { name: 'Home', component: Home, label: 'Housing / Rent' },
  { name: 'Gift', component: Gift, label: 'Gifts & Festive' },
  { name: 'Plane', component: Plane, label: 'Travel / Trips' },
  { name: 'GraduationCap', component: GraduationCap, label: 'Education / Learning' },
  { name: 'Briefcase', component: Briefcase, label: 'Salary / Employment' },
  { name: 'Laptop', component: Laptop, label: 'Freelance / Tech' },
  { name: 'TrendingUp', component: TrendingUp, label: 'Investments / Returns' },
  { name: 'Camera', component: Camera, label: 'Hobby / Photo' },
  { name: 'Dumbbell', component: Dumbbell, label: 'Fitness / Gym' },
  { name: 'Music', component: Music, label: 'Music & Audio' },
  { name: 'Shield', component: Shield, label: 'Insurance / Safety' }
];

const PRESET_COLORS = [
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#ef4444', // Rose/Red
  '#f59e0b', // Amber
  '#14b8a6', // Teal
  '#6366f1', // Indigo
  '#d97706', // Ochre
  '#059669', // Dark Emerald
  '#64748b'  // Slate
];

const getIconComponent = (iconName) => {
  const found = AVAILABLE_ICONS.find(i => i.name === iconName);
  return found ? found.component : Layers;
};

const CategoriesPage = () => {
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    transactions, 
    stats,
    navigateTo,
    hideAmounts
  } = useApp();

  const [activeTab, setActiveTab] = useState('Expense');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('Expense');
  const [formIcon, setFormIcon] = useState('Utensils');
  const [formColor, setFormColor] = useState('#10b981');
  const [formDesc, setFormDesc] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Delete & Reassign Warning Modal State
  const [deleteWarningModal, setDeleteWarningModal] = useState(null); // { cat, linkedTxCount }
  const [reassignTargetCat, setReassignTargetCat] = useState('');

  // Filter categories by type
  const displayedCategories = categories.filter(c => c.type === activeTab);

  // Calculate live category metrics from transactions
  const getCategoryMetrics = (categoryName, type) => {
    const matchingTx = transactions.filter(
      t => t.category.toLowerCase() === categoryName.toLowerCase() && t.type === type
    );
    const totalAmount = matchingTx.reduce((sum, t) => sum + t.amount, 0);
    const txCount = matchingTx.length;
    const baseTotal = type === 'Expense' ? (stats.totalExpenses || 1) : (stats.totalIncome || 1);
    const percentage = baseTotal > 0 ? Math.min(100, Math.round((totalAmount / baseTotal) * 100)) : 0;

    return { totalAmount, txCount, percentage };
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormType(activeTab);
    setFormIcon(activeTab === 'Income' ? 'Briefcase' : 'Utensils');
    setFormColor(activeTab === 'Income' ? '#3b82f6' : '#10b981');
    setFormDesc('');
    setErrorMessage('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormType(cat.type);
    setFormIcon(cat.icon || 'Layers');
    setFormColor(cat.color || '#10b981');
    setFormDesc(cat.description || '');
    setErrorMessage('');
    setModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    const trimmed = formName.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a category name.');
      return;
    }

    // Block duplicate names (case-insensitive across same type)
    const isDuplicate = categories.some(
      c => c.name.toLowerCase() === trimmed.toLowerCase() && 
           c.type === formType && 
           (!editingCategory || c.id !== editingCategory.id)
    );

    if (isDuplicate) {
      setErrorMessage(`A category named "${trimmed}" already exists under ${formType}s.`);
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: trimmed,
        type: formType,
        icon: formIcon,
        color: formColor,
        description: formDesc.trim()
      });
    } else {
      addCategory({
        name: trimmed,
        type: formType,
        icon: formIcon,
        color: formColor,
        description: formDesc.trim()
      });
    }

    setModalOpen(false);
  };

  const handleRequestDelete = (cat) => {
    const linkedTx = transactions.filter(
      t => t.category.toLowerCase() === cat.name.toLowerCase()
    );

    if (linkedTx.length > 0) {
      // Find other categories of the same type to offer as reassignment options
      const alternativeCategories = categories.filter(
        c => c.id !== cat.id && c.type === cat.type
      );
      setReassignTargetCat(alternativeCategories[0]?.name || 'Bills');
      setDeleteWarningModal({
        cat,
        linkedTxCount: linkedTx.length,
        alternatives: alternativeCategories
      });
    } else {
      // Direct simple confirmation
      if (window.confirm(`Are you sure you want to delete "${cat.name}"?`)) {
        deleteCategory(cat.id);
      }
    }
  };

  const handleConfirmReassignAndDelete = () => {
    if (!deleteWarningModal) return;
    deleteCategory(deleteWarningModal.cat.id, reassignTargetCat);
    setDeleteWarningModal(null);
  };

  const renderAmount = (amount) => {
    if (hideAmounts) return '••••••';
    return formatINR(amount);
  };

  return (
    <AppLayout activeMenu="categories">
      <div className="categories-page-container">
        
        {/* Header Section */}
        <div className="cat-page-header">
          <div>
            <h1 className="cat-page-title">Category Management</h1>
            <p className="cat-page-subtitle">
              Organize, customize icons and colors, and track spending buckets
            </p>
          </div>
          <button 
            type="button" 
            className="btn-create-category" 
            onClick={handleOpenAddModal}
          >
            <Plus size={18} />
            <span>Add Category</span>
          </button>
        </div>

        {/* Top Summary Stats Bar */}
        <div className="cat-summary-grid">
          <div className="cat-stat-card">
            <span className="cat-stat-label">Total Categories</span>
            <div className="cat-stat-val-row">
              <span className="cat-stat-number">{categories.length}</span>
              <span className="cat-stat-badge neutral">
                {categories.filter(c => c.type === 'Expense').length} Expense · {categories.filter(c => c.type === 'Income').length} Income
              </span>
            </div>
          </div>

          <div className="cat-stat-card">
            <span className="cat-stat-label">Tagged Transactions</span>
            <div className="cat-stat-val-row">
              <span className="cat-stat-number">{transactions.length}</span>
              <span className="cat-stat-badge green">100% Categorized</span>
            </div>
          </div>

          <div className="cat-stat-card">
            <span className="cat-stat-label">Customizable Icons</span>
            <div className="cat-stat-val-row">
              <span className="cat-stat-number">{AVAILABLE_ICONS.length}</span>
              <span className="cat-stat-badge neutral">Personalized Colors</span>
            </div>
          </div>
        </div>

        {/* Category Tabs: Expense vs Income */}
        <div className="cat-tabs-row">
          <div className="cat-tabs-pills">
            <button 
              type="button" 
              className={`cat-tab-btn ${activeTab === 'Expense' ? 'active' : ''}`}
              onClick={() => setActiveTab('Expense')}
            >
              <ArrowDownRight size={17} className="tab-icon-red" />
              <span>Expense Categories ({categories.filter(c => c.type === 'Expense').length})</span>
            </button>
            <button 
              type="button" 
              className={`cat-tab-btn ${activeTab === 'Income' ? 'active' : ''}`}
              onClick={() => setActiveTab('Income')}
            >
              <ArrowUpRight size={17} className="tab-icon-green" />
              <span>Income Categories ({categories.filter(c => c.type === 'Income').length})</span>
            </button>
          </div>

          <div className="cat-tab-note">
            <Sparkles size={15} className="sparkle-icon" />
            <span>Choose distinct colors and icons so your dashboard charts are easy to read</span>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {displayedCategories.map((cat) => {
            const IconComp = getIconComponent(cat.icon);
            const { totalAmount, txCount, percentage } = getCategoryMetrics(cat.name, cat.type);

            return (
              <div key={cat.id} className="cat-card">
                <div className="cat-card-header">
                  <div 
                    className="cat-icon-avatar"
                    style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
                  >
                    <IconComp size={22} />
                  </div>
                  
                  <div className="cat-card-actions">
                    <button 
                      type="button" 
                      className="cat-action-btn edit" 
                      onClick={() => handleOpenEditModal(cat)}
                      title={`Edit ${cat.name}`}
                      aria-label={`Edit ${cat.name}`}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button 
                      type="button" 
                      className="cat-action-btn delete" 
                      onClick={() => handleRequestDelete(cat)}
                      title={`Delete ${cat.name}`}
                      aria-label={`Delete ${cat.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="cat-card-body">
                  <h3 className="cat-card-name">{cat.name}</h3>
                  <p className="cat-card-desc">{cat.description || 'General category allocation'}</p>
                </div>

                <div className="cat-card-metrics">
                  <div className="cat-metrics-row">
                    <span className="metric-caption">This Month</span>
                    <span className="metric-val">{renderAmount(totalAmount)}</span>
                  </div>
                  <div className="cat-metrics-row">
                    <span className="metric-caption">Activity</span>
                    <span className="metric-sub">{pluralize(txCount, 'transaction')}</span>
                  </div>

                  {/* Share Progress Bar */}
                  <div className="cat-share-bar-container">
                    <div className="cat-share-bar-bg">
                      <div 
                        className="cat-share-bar-fill" 
                        style={{ width: `${percentage}%`, backgroundColor: cat.color }}
                      ></div>
                    </div>
                    <span className="cat-share-percent">{percentage}% of {cat.type.toLowerCase()}s</span>
                  </div>
                </div>

                <div className="cat-card-footer">
                  <button 
                    type="button" 
                    className="cat-view-tx-link"
                    onClick={() => navigateTo('transactions')}
                  >
                    View transactions →
                  </button>
                </div>
              </div>
            );
          })}

          {/* Quick Add Placeholder Card */}
          <div className="cat-card add-new-card" onClick={handleOpenAddModal}>
            <div className="add-card-inner">
              <div className="add-icon-circle">
                <Plus size={24} />
              </div>
              <h4>Create New Category</h4>
              <p>Add a dedicated bucket for {activeTab.toLowerCase()} tracking</p>
            </div>
          </div>
        </div>

        {/* Modal: Add or Edit Category */}
        {modalOpen && (
          <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
            <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingCategory ? 'Edit Category' : 'Create New Category'}</h3>
                <button 
                  type="button" 
                  className="modal-close-btn" 
                  onClick={() => setModalOpen(false)}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="modal-form">
                {errorMessage && (
                  <div className="form-error-alert">{errorMessage}</div>
                )}

                {/* Name */}
                <div className="form-field">
                  <label htmlFor="cat-name-input">Category Name *</label>
                  <input 
                    id="cat-name-input"
                    type="text" 
                    placeholder="e.g. Groceries, Gym, Streaming, Travel" 
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    required
                  />
                </div>

                {/* Type Switcher */}
                <div className="form-field">
                  <label>Type</label>
                  <div className="type-toggle-pills">
                    <button 
                      type="button"
                      className={`type-btn ${formType === 'Expense' ? 'active expense' : ''}`}
                      onClick={() => setFormType('Expense')}
                    >
                      Expense
                    </button>
                    <button 
                      type="button"
                      className={`type-btn ${formType === 'Income' ? 'active income' : ''}`}
                      onClick={() => setFormType('Income')}
                    >
                      Income
                    </button>
                  </div>
                </div>

                {/* Pick Icon */}
                <div className="form-field">
                  <label>Choose Icon</label>
                  <div className="icons-picker-grid">
                    {AVAILABLE_ICONS.map((item) => {
                      const Icon = item.component;
                      const isSelected = formIcon === item.name;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          className={`icon-picker-btn ${isSelected ? 'selected' : ''}`}
                          style={{
                            borderColor: isSelected ? formColor : undefined,
                            backgroundColor: isSelected ? `${formColor}20` : undefined,
                            color: isSelected ? formColor : undefined
                          }}
                          onClick={() => setFormIcon(item.name)}
                          title={item.label}
                        >
                          <Icon size={18} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pick Color */}
                <div className="form-field">
                  <label>Accent Color</label>
                  <div className="colors-picker-row">
                    {PRESET_COLORS.map((hex) => {
                      const isSelected = formColor === hex;
                      return (
                        <button
                          key={hex}
                          type="button"
                          className={`color-picker-bubble ${isSelected ? 'selected' : ''}`}
                          style={{ backgroundColor: hex }}
                          onClick={() => setFormColor(hex)}
                          aria-label={`Select color ${hex}`}
                        >
                          {isSelected && <Check size={14} color="#ffffff" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div className="form-field">
                  <label htmlFor="cat-desc-input">Description (Optional)</label>
                  <input 
                    id="cat-desc-input"
                    type="text" 
                    placeholder="Short description of this category" 
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                  />
                </div>

                {/* Modal Actions */}
                <div className="modal-actions-row">
                  <button 
                    type="button" 
                    className="btn-cancel" 
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Warn before delete with option to move transactions */}
        {deleteWarningModal && (
          <div className="modal-backdrop" onClick={() => setDeleteWarningModal(null)}>
            <div className="modal-dialog-box modal-reassign" onClick={(e) => e.stopPropagation()}>
              <div className="reassign-icon-circle">
                <AlertTriangle size={28} className="text-amber" />
              </div>
              
              <h3 className="reassign-title">
                Category "{deleteWarningModal.cat.name}" has {pluralize(deleteWarningModal.linkedTxCount, 'transaction')}
              </h3>
              
              <p className="reassign-desc">
                To prevent orphaned data, choose where you would like to move these existing transactions before removing this category.
              </p>

              <div className="reassign-field">
                <label htmlFor="target-category-select">Move transactions to:</label>
                <div className="reassign-select-row">
                  <select
                    id="target-category-select"
                    value={reassignTargetCat}
                    onChange={(e) => setReassignTargetCat(e.target.value)}
                    className="bgt-select"
                  >
                    {deleteWarningModal.alternatives.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-actions-row">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => setDeleteWarningModal(null)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-reassign-confirm"
                  onClick={handleConfirmReassignAndDelete}
                >
                  <MoveRight size={16} />
                  <span>Move & Delete Category</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default CategoriesPage;
