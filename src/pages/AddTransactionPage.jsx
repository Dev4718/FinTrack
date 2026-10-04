import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  UploadCloud, 
  ArrowDownRight, 
  ArrowUpRight, 
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Receipt
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useApp } from '../context/AppContext';
import './AddTransactionPage.css';

const AddTransactionPage = () => {
  const { addTransaction, navigateTo, categories } = useApp();

  const [type, setType] = useState('Expense'); // Default to Expense
  const [date, setDate] = useState('Today');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [receiptFileName, setReceiptFileName] = useState('');
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const availableCategories = categories.filter(c => c.type === type);

  useEffect(() => {
    if (availableCategories.length > 0) {
      const exists = availableCategories.some(c => c.name === category);
      if (!exists) {
        setCategory(availableCategories[0].name);
      }
    }
  }, [type, categories]);

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
      setErrorMessage('Please select a category.');
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
      navigateTo('transactions');
    }
  };

  return (
    <AppLayout activeMenu="add-transaction">
      <div className="add-tx-content">
        
        {/* Header */}
        <div className="add-tx-header">
          <h1 className="add-tx-title">Add Transaction</h1>
          <p className="add-tx-subtitle">Record your daily spending or income with smart category tracking</p>
        </div>

        {errorMessage && (
          <div className="add-tx-error-banner">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 2-Column Grid */}
        <div className="add-tx-grid">
          {/* Main Form Card */}
          <div className="add-tx-form-card">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(false); }} className="add-transaction-form">
              
              {/* Row 1: Transaction Type & Date */}
              <div className="form-row-split">
                <div className="form-field-group">
                  <label className="field-label">Transaction Type</label>
                  <div className="type-toggle-pills">
                    <button
                      type="button"
                      className={`type-pill-btn ${type === 'Expense' ? 'active-expense' : ''}`}
                      onClick={() => setType('Expense')}
                    >
                      <ArrowDownRight size={16} />
                      <span>Expense</span>
                    </button>
                    <button
                      type="button"
                      className={`type-pill-btn ${type === 'Income' ? 'active-income' : ''}`}
                      onClick={() => setType('Income')}
                    >
                      <ArrowUpRight size={16} />
                      <span>Income</span>
                    </button>
                  </div>
                </div>

                <div className="form-field-group">
                  <label htmlFor="tx-date" className="field-label">Date</label>
                  <div className="input-with-icon-right">
                    <input 
                      id="tx-date"
                      type="text" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="Today, Yesterday, or date"
                    />
                    <Calendar size={16} className="field-right-icon" />
                  </div>
                </div>
              </div>

              {/* Row 2: Amount & Payment Method */}
              <div className="form-row-split">
                <div className="form-field-group">
                  <label htmlFor="tx-amount" className="field-label">Amount (₹) *</label>
                  <div className="input-with-currency">
                    <input 
                      id="tx-amount"
                      type="number" 
                      step="any"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      required
                    />
                    <span className="currency-prefix">₹</span>
                  </div>
                </div>

                <div className="form-field-group">
                  <label htmlFor="tx-payment" className="field-label">Payment Method</label>
                  <div className="select-wrapper">
                    <select 
                      id="tx-payment"
                      value={paymentMethod} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash">Cash</option>
                    </select>
                    <ChevronDown size={16} className="select-arrow-icon" />
                  </div>
                </div>
              </div>

              {/* Row 3: Category & Upload Receipt */}
              <div className="form-row-split">
                <div className="form-field-group">
                  <label htmlFor="tx-category" className="field-label">
                    Category ({type}s) *
                  </label>
                  <div className="select-wrapper">
                    <select 
                      id="tx-category"
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {availableCategories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="select-arrow-icon" />
                  </div>

                  {/* Description Box */}
                  <div className="form-field-group mt-3">
                    <label htmlFor="tx-desc" className="field-label">Description / Note (Optional)</label>
                    <textarea 
                      id="tx-desc"
                      rows={3} 
                      placeholder="Add merchant name or brief note..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="form-field-group">
                  <label className="field-label">Receipt Preview</label>
                  {receiptPreview ? (
                    <div className="full-receipt-preview-box">
                      <img src={receiptPreview} alt="Receipt preview" className="full-receipt-img" />
                      <div className="full-receipt-footer">
                        <span className="receipt-fname">{receiptFileName}</span>
                        <button type="button" className="btn-remove-receipt" onClick={removeReceipt}>
                          <Trash2 size={15} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="upload-dropzone">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden-file-input" 
                        onChange={handleReceiptChange}
                      />
                      <div className="dropzone-content">
                        <div className="upload-icon-circle">
                          <UploadCloud size={20} />
                        </div>
                        <span className="upload-instruction">
                          <strong>Click to attach photo</strong> or receipt
                        </span>
                        <span className="upload-filetypes">PNG, JPG up to 5MB</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Action Buttons: Save & Add Another, Save, Cancel */}
              <div className="form-actions-row">
                <button 
                  type="button" 
                  className="btn-save-another"
                  onClick={() => handleSave(true)}
                >
                  <Plus size={16} />
                  <span>Save & Add Another</span>
                </button>
                <button type="submit" className="btn-save-tx">
                  Save Transaction
                </button>
                <button 
                  type="button" 
                  className="btn-cancel-tx"
                  onClick={() => navigateTo('transactions')}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>

          {/* Right Incentive Card */}
          <div className="add-tx-side-card">
            <div className="side-card-illustration">
              <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="side-artwork-svg">
                <circle cx="100" cy="90" r="70" fill="#ecfdf5" />
                <rect x="75" y="30" width="60" height="85" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
                <line x1="85" y1="45" x2="125" y2="45" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                <line x1="85" y1="58" x2="115" y2="58" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                <line x1="85" y1="68" x2="120" y2="68" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                <line x1="85" y1="78" x2="105" y2="78" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                <rect x="55" y="75" width="95" height="70" rx="12" fill="#065f46" />
                <rect x="55" y="75" width="95" height="18" rx="8" fill="#047857" />
                <path d="M125 95H145C148 95 150 97 150 100V112C150 115 148 117 145 117H125V95Z" fill="#047857" />
                <circle cx="138" cy="106" r="4" fill="#fbbf24" />
                <path d="M135 45C148 30 160 38 155 52C150 62 138 52 135 45Z" fill="#34d399" />
              </svg>
            </div>

            <h3 className="side-card-title">
              Keep track of your<br />money, always.
            </h3>
            <p className="side-card-desc">
              Every small expense recorded adds up to clearer financial peace of mind.
            </p>
          </div>

        </div>

      </div>
    </AppLayout>
  );
};

export default AddTransactionPage;
