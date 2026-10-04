import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Calendar, 
  ChevronDown, 
  MoreVertical, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Copy,
  Trash2,
  X,
  FileQuestion,
  Utensils,
  Briefcase,
  Car,
  ShoppingBag,
  Zap,
  Laptop,
  Film,
  HeartPulse,
  Home,
  Gift
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useApp } from '../context/AppContext';
import { formatINR, pluralize } from '../utils/formatters';
import './TransactionsPage.css';

const iconMap = {
  Utensils,
  Briefcase,
  Car,
  ShoppingBag,
  Zap,
  Laptop,
  Film,
  HeartPulse,
  Home,
  Gift
};

const TransactionsPage = () => {
  const { 
    transactions, 
    categories, 
    deleteTransaction, 
    duplicateTransaction,
    updateTransaction,
    setQuickAddOpen,
    hideAmounts
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All', 'Income', 'Expense'
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);

  // Sorting state
  const [sortField, setSortField] = useState('date'); // 'date', 'description', 'category', 'amount'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc', 'desc'

  // Edit Modal State
  const [editingTx, setEditingTx] = useState(null);
  const [editForm, setEditForm] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'Expense',
    date: ''
  });

  // Delete Confirmation Modal State
  const [txToDelete, setTxToDelete] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort transactions
  const processedTransactions = useMemo(() => {
    let result = transactions.filter((tx) => {
      const matchesType = filterType === 'All' || 
        (filterType === 'Expenses' ? tx.type === 'Expense' : tx.type === filterType);
      
      const matchesCategory = selectedCategory === 'All Categories' || tx.category === selectedCategory;
      
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        tx.description.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        tx.amount.toString().includes(q);

      return matchesType && matchesCategory && matchesSearch;
    });

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortField === 'description') {
        comparison = a.description.localeCompare(b.description);
      } else if (sortField === 'category') {
        comparison = a.category.localeCompare(b.category);
      } else {
        // Date sort fallback
        comparison = a.id.localeCompare(b.id);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [transactions, filterType, selectedCategory, searchQuery, sortField, sortDirection]);

  // Pagination (10 per page)
  const pageSize = 10;
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const totalPages = Math.max(1, Math.ceil(processedTransactions.length / pageSize));
  const paginatedTransactions = processedTransactions.slice(
    (currentPageNum - 1) * pageSize,
    currentPageNum * pageSize
  );

  const handleOpenEdit = (tx) => {
    setActiveActionMenuId(null);
    setEditingTx(tx);
    setEditForm({
      description: tx.description,
      amount: tx.amount.toString(),
      category: tx.category,
      type: tx.type,
      date: tx.date
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTx) return;
    updateTransaction(editingTx.id, {
      description: editForm.description,
      amount: parseFloat(editForm.amount) || 0,
      category: editForm.category,
      type: editForm.type,
      date: editForm.date
    });
    setEditingTx(null);
  };

  const handleDuplicate = (tx) => {
    setActiveActionMenuId(null);
    duplicateTransaction(tx);
  };

  const handleRequestDelete = (tx) => {
    setActiveActionMenuId(null);
    setTxToDelete(tx);
  };

  const handleConfirmDelete = () => {
    if (txToDelete) {
      deleteTransaction(txToDelete.id);
      setTxToDelete(null);
    }
  };

  const renderSortIndicator = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="sort-icon inactive" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="sort-icon active" />
      : <ArrowDown size={14} className="sort-icon active" />;
  };

  return (
    <AppLayout activeMenu="transactions">
      <div className="transactions-content">
        
        {/* Page Header */}
        <div className="tx-page-header">
          <div>
            <h1 className="tx-main-title">Transactions</h1>
            <p className="tx-main-subtitle">
              {pluralize(transactions.length, 'transaction')} recorded across all categories
            </p>
          </div>
          <button 
            type="button" 
            className="btn-add-tx"
            onClick={() => setQuickAddOpen(true)}
          >
            <Plus size={18} />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Filter and Control Bar */}
        <div className="tx-controls-card">
          <div className="tx-search-and-tabs">
            {/* Real-time Search Input */}
            <div className="tx-search-bar">
              <Search size={16} className="tx-search-icon" />
              <input 
                type="text" 
                placeholder="Search by note, category, or amount..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPageNum(1);
                }}
                className="tx-search-input-field"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="tx-search-clear-btn" 
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="tx-filter-tabs">
              {['All', 'Income', 'Expenses'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`filter-tab-btn ${filterType === tab ? 'active' : ''}`}
                  onClick={() => {
                    setFilterType(tab);
                    setCurrentPageNum(1);
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="tx-right-filters">
            {/* Date Range Selector Pill */}
            <div className="tx-filter-pill">
              <Calendar size={15} />
              <span>Sep 1, 2025 – Sep 30, 2025</span>
            </div>

            {/* Category Dropdown */}
            <div className="tx-category-dropdown-wrapper">
              <button 
                type="button" 
                className="tx-filter-pill dropdown-trigger"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              >
                <span>{selectedCategory === 'All Categories' ? 'Category: All' : selectedCategory}</span>
                <ChevronDown size={14} />
              </button>

              {categoryDropdownOpen && (
                <div className="category-select-menu">
                  <button
                    type="button"
                    className={`cat-menu-item ${selectedCategory === 'All Categories' ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory('All Categories');
                      setCategoryDropdownOpen(false);
                      setCurrentPageNum(1);
                    }}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`cat-menu-item ${selectedCategory === cat.name ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setCategoryDropdownOpen(false);
                        setCurrentPageNum(1);
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transactions Table Card */}
        <div className="tx-table-wrapper-card">
          {processedTransactions.length === 0 ? (
            /* Friendly Empty State */
            <div className="tx-empty-state-view">
              <div className="empty-icon-circle">
                <FileQuestion size={36} className="text-muted" />
              </div>
              <h3 className="empty-heading">No expenses in this period yet</h3>
              <p className="empty-sub">
                {searchQuery 
                  ? `No transactions match your search for "${searchQuery}".`
                  : 'You have no transactions matching the selected filters.'}
              </p>
              <div className="empty-btn-row">
                {(searchQuery || filterType !== 'All' || selectedCategory !== 'All Categories') && (
                  <button 
                    type="button" 
                    className="btn-clear-filters"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterType('All');
                      setSelectedCategory('All Categories');
                    }}
                  >
                    Reset Filters
                  </button>
                )}
                <button 
                  type="button" 
                  className="btn-add-empty-tx"
                  onClick={() => setQuickAddOpen(true)}
                >
                  <Plus size={16} />
                  <span>Add Transaction</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="tx-table-responsive">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('date')} className="sortable-th">
                        <div className="th-content">
                          <span>Date</span>
                          {renderSortIndicator('date')}
                        </div>
                      </th>
                      <th onClick={() => handleSort('description')} className="sortable-th">
                        <div className="th-content">
                          <span>Description</span>
                          {renderSortIndicator('description')}
                        </div>
                      </th>
                      <th onClick={() => handleSort('category')} className="sortable-th">
                        <div className="th-content">
                          <span>Category</span>
                          {renderSortIndicator('category')}
                        </div>
                      </th>
                      <th>Type</th>
                      <th onClick={() => handleSort('amount')} className="sortable-th text-right">
                        <div className="th-content justify-end">
                          <span>Amount</span>
                          {renderSortIndicator('amount')}
                        </div>
                      </th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.map((tx) => {
                      const IconC = iconMap[tx.icon] || Utensils;
                      const isIncome = tx.type === 'Income';
                      return (
                        <tr key={tx.id}>
                          <td className="tx-date-text">{tx.date}</td>
                          <td>
                            <div className="tx-description-cell">
                              <div 
                                className="tx-category-icon-box"
                                style={{ 
                                  backgroundColor: `${tx.categoryColor}18`,
                                  color: tx.categoryColor 
                                }}
                              >
                                <IconC size={16} />
                              </div>
                              <span className="tx-item-title">{tx.description}</span>
                            </div>
                          </td>
                          <td>
                            <span className="tx-category-tag" style={{ color: tx.categoryColor }}>
                              {tx.category}
                            </span>
                          </td>
                          <td>
                            <span className={`type-tag ${isIncome ? 'income' : 'expense'}`}>
                              {isIncome ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                              {tx.type}
                            </span>
                          </td>
                          <td className={`text-right tx-amount-val ${isIncome ? 'income' : 'expense'}`}>
                            {hideAmounts 
                              ? '••••••' 
                              : (isIncome ? `+ ${formatINR(tx.amount)}` : `- ${formatINR(tx.amount)}`)}
                          </td>
                          <td className="text-center action-col">
                            <button 
                              type="button" 
                              className="action-menu-btn"
                              onClick={() => setActiveActionMenuId(activeActionMenuId === tx.id ? null : tx.id)}
                              aria-label="Transaction actions"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {/* Working ⋮ Action Menu */}
                            {activeActionMenuId === tx.id && (
                              <div className="action-floating-popover">
                                <button type="button" onClick={() => handleOpenEdit(tx)}>
                                  <Edit2 size={14} />
                                  <span>Edit Details</span>
                                </button>
                                <button type="button" onClick={() => handleDuplicate(tx)}>
                                  <Copy size={14} />
                                  <span>Duplicate</span>
                                </button>
                                <button 
                                  type="button" 
                                  className="text-danger" 
                                  onClick={() => handleRequestDelete(tx)}
                                >
                                  <Trash2 size={14} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="tx-pagination-bar">
                <div className="pagination-buttons">
                  <button 
                    type="button" 
                    className="page-nav-btn" 
                    onClick={() => setCurrentPageNum(p => Math.max(1, p - 1))}
                    disabled={currentPageNum === 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                    <button 
                      key={num}
                      type="button" 
                      className={`page-number-btn ${currentPageNum === num ? 'active' : ''}`}
                      onClick={() => setCurrentPageNum(num)}
                    >
                      {num}
                    </button>
                  ))}
                  <button 
                    type="button" 
                    className="page-nav-btn" 
                    onClick={() => setCurrentPageNum(p => Math.min(totalPages, p + 1))}
                    disabled={currentPageNum === totalPages}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <span className="pagination-count-text">
                  Showing {Math.min((currentPageNum - 1) * pageSize + 1, processedTransactions.length)} - {Math.min(currentPageNum * pageSize, processedTransactions.length)} of {processedTransactions.length} {pluralize(processedTransactions.length, 'transaction').split(' ')[1]}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Modal: Edit Transaction */}
        {editingTx && (
          <div className="modal-backdrop" onClick={() => setEditingTx(null)}>
            <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit Transaction</h3>
                <button type="button" className="modal-close-btn" onClick={() => setEditingTx(null)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="modal-form">
                <div className="form-field">
                  <label htmlFor="edit-desc">Description</label>
                  <input 
                    id="edit-desc"
                    type="text" 
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-row-split">
                  <div className="form-field">
                    <label htmlFor="edit-amount">Amount (₹)</label>
                    <input 
                      id="edit-amount"
                      type="number" 
                      step="any"
                      value={editForm.amount}
                      onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="edit-type">Type</label>
                    <select 
                      id="edit-type"
                      value={editForm.type}
                      onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                      className="bgt-select"
                    >
                      <option value="Expense">Expense</option>
                      <option value="Income">Income</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="edit-cat">Category</label>
                  <select 
                    id="edit-cat"
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="bgt-select"
                  >
                    {categories
                      .filter(c => c.type === editForm.type)
                      .map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                  </select>
                </div>

                <div className="modal-actions-row">
                  <button type="button" className="btn-cancel" onClick={() => setEditingTx(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Confirm Delete */}
        {txToDelete && (
          <div className="modal-backdrop" onClick={() => setTxToDelete(null)}>
            <div className="modal-dialog-box modal-confirm" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-icon-box">
                <Trash2 size={24} className="text-danger" />
              </div>
              <h3 className="confirm-title">Delete this transaction?</h3>
              <p className="confirm-desc">
                Are you sure you want to remove <strong>"{txToDelete.description}"</strong> ({formatINR(txToDelete.amount)})? This action cannot be undone.
              </p>
              <div className="modal-actions-row">
                <button type="button" className="btn-cancel" onClick={() => setTxToDelete(null)}>
                  Keep Transaction
                </button>
                <button type="button" className="btn-danger-confirm" onClick={handleConfirmDelete}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default TransactionsPage;
