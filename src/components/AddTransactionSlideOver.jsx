import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Trash2,
  Receipt
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './AddTransactionSlideOver.css';

const AddTransactionSlideOver = () => {
  const { 
    quickAddOpen, 
    setQuickAddOpen, 
    addTransaction, 
    categories
  } = useApp();

  const [type, setType] = useState('Expense'); // Default to Expense!
  const [date, setDate] = useState('Today');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [receiptFileName, setReceiptFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Filter categories by type
  const availableCategories = categories.filter(c => c.type === type);

  // Set default category when type changes
  const handleTypeChange = (newType) => {
    setType(newType);
    const newCats = categories.filter(c => c.type === newType);
    if (newCats.length > 0) {
      setCategory(newCats[0].name);
    }
  };

  // Handle receipt selection and create preview
  const handleReceiptChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReceipt = () => {
    setReceiptPreview(null);
    setReceiptFileName('');
  };

  const validate = () => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      setErrorMessage('Please enter a valid amount greater than ₹0.');
      return false;
    }
    if (!category) {
      setErrorMessage('Please choose a category.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleSave = (addAnother = false) => {
    if (!validate()) return;

    addTransaction({
      type,
      date: date || 'Today',
      amount: parseFloat(amount),
      category: category || (type === 'Expense' ? 'Food' : 'Salary'),
      description: description.trim() || (type === 'Expense' ? `${category} Expense` : 'Income Received'),
      paymentMethod,
      receiptUrl: receiptPreview
    });

    if (addAnother) {
      setAmount('');
      setDescription('');
      removeReceipt();
      setErrorMessage('');
    } else {
      setQuickAddOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setType('Expense');
    setDate('Today');
    setAmount('');
    setPaymentMethod('UPI');
    setDescription('');
    removeReceipt();
    setErrorMessage('');
  };

  const handleClose = () => {
    setQuickAddOpen(false);
    resetForm();
  };

  if (!quickAddOpen) return null;

  return (
    <div className="slideover-backdrop" onClick={handleClose}>
      <div 
        className="slideover-panel" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Add Transaction Panel"
      >
        {/* Panel Header */}
        <div className="slideover-header">
          <div className="slideover-title-box">
            <div className="slideover-icon-circle">
              <Receipt size={20} />
            </div>
            <div>
              <h2 className="slideover-title">Add Transaction</h2>
              <p className="slideover-sub">Log expenses or income with automatic budget tracking</p>
            </div>
          </div>
          <button 
            type="button" 
            className="slideover-close-btn" 
            onClick={handleClose}
            aria-label="Close panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="slideover-body">
          {errorMessage && (
            <div className="slideover-error-alert">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Type Toggle: Expense vs Income */}
          <div className="form-group">
            <label className="slideover-label">Transaction Type</label>
            <div className="type-pill-selector">
              <button
                type="button"
                className={`type-pill ${type === 'Expense' ? 'active expense' : ''}`}
                onClick={() => handleTypeChange('Expense')}
              >
                <ArrowDownRight size={16} />
                <span>Expense</span>
              </button>
              <button
                type="button"
                className={`type-pill ${type === 'Income' ? 'active income' : ''}`}
                onClick={() => handleTypeChange('Income')}
              >
                <ArrowUpRight size={16} />
                <span>Income</span>
              </button>
            </div>
          </div>

          {/* Amount Field */}
          <div className="form-group">
            <label htmlFor="tx-slideover-amount" className="slideover-label">Amount *</label>
            <div className="amount-input-box">
              <span className="currency-tag">₹</span>
              <input 
                id="tx-slideover-amount"
                type="number"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                className="amount-input"
                autoFocus
              />
            </div>
          </div>

          {/* Category Dropdown (Filtered by selected type) */}
          <div className="form-group">
            <label htmlFor="tx-slideover-cat" className="slideover-label">
              Category ({type}s) *
            </label>
            <select
              id="tx-slideover-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="slideover-select"
            >
              {availableCategories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Payment Method Row */}
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="tx-slideover-date" className="slideover-label">Date</label>
              <div className="input-with-icon">
                <input 
                  id="tx-slideover-date"
                  type="text" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Today, Yesterday, etc."
                  className="slideover-input"
                />
                <Calendar size={16} className="inner-icon" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tx-slideover-method" className="slideover-label">Payment Method</label>
              <select
                id="tx-slideover-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="slideover-select"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          {/* Description / Note */}
          <div className="form-group">
            <label htmlFor="tx-slideover-desc" className="slideover-label">Note / Payee (Optional)</label>
            <input 
              id="tx-slideover-desc"
              type="text"
              placeholder="e.g. Swiggy delivery, Grocery refill, Freelance bonus"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="slideover-input"
            />
          </div>

          {/* Receipt Upload with Live Preview */}
          <div className="form-group">
            <label className="slideover-label">Receipt / Bill Attachment</label>
            {receiptPreview ? (
              <div className="receipt-preview-card">
                <img src={receiptPreview} alt="Receipt preview" className="receipt-thumb-img" />
                <div className="receipt-info-col">
                  <span className="receipt-file-title">{receiptFileName || 'Receipt Attached'}</span>
                  <span className="receipt-ready-tag">Ready to save</span>
                </div>
                <button 
                  type="button" 
                  className="receipt-remove-btn" 
                  onClick={removeReceipt}
                  title="Remove receipt"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <label className="slideover-dropzone">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleReceiptChange}
                  className="hidden-file-field"
                />
                <div className="dropzone-center">
                  <UploadCloud size={22} className="text-emerald" />
                  <span className="dropzone-text">Click to attach photo or receipt</span>
                  <span className="dropzone-hint">PNG, JPG up to 5MB</span>
                </div>
              </label>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="slideover-footer">
          <button 
            type="button" 
            className="btn-slideover-another"
            onClick={() => handleSave(true)}
          >
            <Plus size={16} />
            <span>Save & Add Another</span>
          </button>
          
          <button 
            type="button" 
            className="btn-slideover-primary"
            onClick={() => handleSave(false)}
          >
            <CheckCircle2 size={16} />
            <span>Save Transaction</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddTransactionSlideOver;
