import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_CATEGORIES, 
  INITIAL_BUDGETS, 
  INITIAL_GOALS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

const AppContext = createContext();

const VALID_PAGES = [
  'landing',
  'login',
  'register',
  'dashboard',
  'transactions',
  'add-transaction',
  'budgets',
  'reports',
  'categories',
  'goals',
  'profile',
  'settings',
  'help',
  'privacy',
  'terms'
];

export const AppProvider = ({ children }) => {
  // Sync with URL hash or default to 'landing'
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#', '');
    return VALID_PAGES.includes(hash) ? hash : (hash ? '404' : 'landing');
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('fintrack_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('fintrack_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('fintrack_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('fintrack_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('fintrack_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fintrack_user');
    return saved ? JSON.parse(saved) : {
      name: 'John Doe',
      email: 'john@example.com',
      initials: 'JD',
      currency: 'INR',
      theme: 'light'
    };
  });

  // Privacy Eye Toggle (hide amounts in public)
  const [hideAmounts, setHideAmounts] = useState(() => {
    return localStorage.getItem('fintrack_hide_amounts') === 'true';
  });

  const toggleHideAmounts = () => {
    setHideAmounts(prev => {
      const next = !prev;
      localStorage.setItem('fintrack_hide_amounts', String(next));
      return next;
    });
  };

  // Global Slide-Over for Add / Edit Transaction
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Global Notifications Drawer
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState(false);

  // Toast System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Persist items
  useEffect(() => {
    localStorage.setItem('fintrack_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fintrack_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('fintrack_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('fintrack_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('fintrack_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('fintrack_user', JSON.stringify(user));
  }, [user]);

  // Calculate live stats
  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'Expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const savings = totalIncome - totalExpenses;

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (VALID_PAGES.includes(hash)) {
        setCurrentPage(hash);
      } else if (hash) {
        setCurrentPage('404');
      } else {
        setCurrentPage('landing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Transaction Actions
  const addTransaction = (newTx) => {
    const matchedCategory = categories.find(c => c.name.toLowerCase() === (newTx.category || '').toLowerCase());

    const transactionItem = {
      id: `tx-${Date.now()}`,
      date: newTx.date || 'Today',
      description: newTx.description || (newTx.type === 'Income' ? 'Payment Received' : 'General Expense'),
      category: newTx.category || (newTx.type === 'Income' ? 'Salary' : 'Food'),
      type: newTx.type || 'Expense',
      amount: parseFloat(newTx.amount) || 0,
      icon: matchedCategory?.icon || (newTx.type === 'Income' ? 'Briefcase' : 'ShoppingBag'),
      categoryColor: matchedCategory?.color || (newTx.type === 'Income' ? '#3b82f6' : '#10b981'),
      receiptUrl: newTx.receiptUrl || null
    };

    setTransactions(prev => [transactionItem, ...prev]);

    // Calculate budget utilization for toast feedback
    if (transactionItem.type === 'Expense') {
      const bgt = budgets.find(b => b.category.toLowerCase() === transactionItem.category.toLowerCase());
      if (bgt && bgt.limit > 0) {
        const priorSpent = transactions
          .filter(t => t.type === 'Expense' && t.category.toLowerCase() === transactionItem.category.toLowerCase())
          .reduce((sum, t) => sum + t.amount, 0);
        const newSpent = priorSpent + transactionItem.amount;
        const pct = Math.round((newSpent / bgt.limit) * 100);
        showToast(`Saved! ${transactionItem.category} budget is now ${pct}% used.`);
      } else {
        showToast(`Saved! ₹ ${transactionItem.amount.toLocaleString()} logged under ${transactionItem.category}.`);
      }
    } else {
      showToast(`Income of ₹ ${transactionItem.amount.toLocaleString()} added successfully.`);
    }

    return transactionItem;
  };

  const updateTransaction = (id, updatedFields) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updatedFields };
        const matched = categories.find(c => c.name.toLowerCase() === (updated.category || '').toLowerCase());
        if (matched) {
          updated.categoryColor = matched.color;
          updated.icon = matched.icon;
        }
        return updated;
      }
      return t;
    }));
    showToast('Transaction updated successfully.');
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast('Transaction removed.');
  };

  const duplicateTransaction = (tx) => {
    const clone = {
      ...tx,
      id: `tx-${Date.now()}`,
      date: 'Today',
      description: `${tx.description} (Copy)`
    };
    setTransactions(prev => [clone, ...prev]);
    showToast(`Duplicated "${tx.description}".`);
  };

  // Budget Management
  const addBudget = (newBudget) => {
    const item = {
      id: `bgt-${Date.now()}`,
      category: newBudget.category,
      limit: parseFloat(newBudget.limit) || 0,
      month: newBudget.month || 'Sep 2025',
      alertThreshold: parseInt(newBudget.alertThreshold, 10) || 80
    };
    setBudgets(prev => [item, ...prev]);
    showToast(`Budget for ${newBudget.category} created.`);
  };

  const updateBudget = (id, updatedFields) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updatedFields } : b));
    showToast('Budget updated successfully.');
  };

  const deleteBudget = (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    showToast('Budget deleted.');
  };

  // Category Management
  const addCategory = (newCat) => {
    const item = {
      id: `cat-${Date.now()}`,
      name: newCat.name,
      type: newCat.type || 'Expense',
      icon: newCat.icon || 'ShoppingBag',
      color: newCat.color || '#10b981',
      description: newCat.description || ''
    };
    setCategories(prev => [...prev, item]);
    showToast(`Category "${newCat.name}" added.`);
  };

  const updateCategory = (id, updatedFields) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    showToast('Category updated.');
  };

  const deleteCategory = (id, reassignToCategory = null) => {
    const catToDelete = categories.find(c => c.id === id);
    if (!catToDelete) return;

    if (reassignToCategory) {
      setTransactions(prev => prev.map(t => {
        if (t.category.toLowerCase() === catToDelete.name.toLowerCase()) {
          return { ...t, category: reassignToCategory };
        }
        return t;
      }));
    }

    setCategories(prev => prev.filter(c => c.id !== id));
    showToast(`Category "${catToDelete.name}" deleted.`);
  };

  // Savings Goals Management
  const addGoal = (newGoal) => {
    const item = {
      id: `goal-${Date.now()}`,
      title: newGoal.title,
      targetAmount: parseFloat(newGoal.targetAmount) || 0,
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      targetDate: newGoal.targetDate || 'Dec 2025',
      category: newGoal.category || 'General',
      color: newGoal.color || '#10b981',
      icon: newGoal.icon || 'Target'
    };
    setGoals(prev => [item, ...prev]);
    showToast(`Savings goal "${newGoal.title}" created.`);
  };

  const updateGoal = (id, updatedFields) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updatedFields } : g));
    showToast('Savings goal updated.');
  };

  const contributeToGoal = (id, addAmount) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const nextAmount = g.currentAmount + (parseFloat(addAmount) || 0);
        const reached = nextAmount >= g.targetAmount && g.currentAmount < g.targetAmount;
        if (reached) {
          showToast(`Congratulations! You reached your goal "${g.title}"! 🎉`);
        } else {
          showToast(`Added ₹ ${parseFloat(addAmount).toLocaleString()} to "${g.title}".`);
        }
        return { ...g, currentAmount: nextAmount };
      }
      return g;
    }));
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    showToast('Savings goal removed.');
  };

  // Notification management
  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  // Reset / Clear Data
  const resetAllData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setCategories(INITIAL_CATEGORIES);
    setBudgets(INITIAL_BUDGETS);
    setGoals(INITIAL_GOALS);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('Reset to default sample data.');
  };

  const clearAllData = () => {
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    showToast('All transaction and budget data cleared.');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigateTo,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        duplicateTransaction,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        budgets,
        addBudget,
        updateBudget,
        deleteBudget,
        goals,
        addGoal,
        updateGoal,
        contributeToGoal,
        deleteGoal,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationCount,
        notificationsDrawerOpen,
        setNotificationsDrawerOpen,
        quickAddOpen,
        setQuickAddOpen,
        editingTransaction,
        setEditingTransaction,
        hideAmounts,
        toggleHideAmounts,
        toast,
        showToast,
        resetAllData,
        clearAllData,
        user,
        setUser,
        stats: {
          totalIncome,
          totalExpenses,
          savings
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
