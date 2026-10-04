import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_CATEGORIES, 
  INITIAL_BUDGETS, 
  INITIAL_GOALS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
import api from '../services/api';

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
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fintrack_user');
    return saved ? JSON.parse(saved) : {
      name: 'Default User',
      email: 'user@fintrack.com',
      initials: 'DU',
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

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Fetch all user records from Supabase via backend API
  const fetchAllData = useCallback(async () => {
    if (!api.token) return;
    setIsSyncing(true);

    try {
      const [catRes, txRes, bgtRes, goalRes, notifRes] = await Promise.allSettled([
        api.getCategories(),
        api.getTransactions({ limit: 100 }),
        api.getBudgets(),
        api.getGoals(),
        api.getNotifications()
      ]);

      if (catRes.status === 'fulfilled' && catRes.value?.data) {
        setCategories(catRes.value.data.length > 0 ? catRes.value.data : INITIAL_CATEGORIES);
      }
      if (txRes.status === 'fulfilled' && txRes.value?.data) {
        setTransactions(txRes.value.data);
      }
      if (bgtRes.status === 'fulfilled' && bgtRes.value?.data) {
        setBudgets(bgtRes.value.data);
      }
      if (goalRes.status === 'fulfilled' && goalRes.value?.data) {
        setGoals(goalRes.value.data);
      }
      if (notifRes.status === 'fulfilled' && notifRes.value?.data) {
        setNotifications(notifRes.value.data);
      }
    } catch (error) {
      console.error('Error syncing data with backend:', error);
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  }, []);

  // Ensure an active authenticated session
  const initializeSession = useCallback(async () => {
    try {
      if (api.token) {
        try {
          const meRes = await api.getMe();
          if (meRes?.user) {
            setUser(meRes.user);
            localStorage.setItem('fintrack_user', JSON.stringify(meRes.user));
            await fetchAllData();
            return;
          }
        } catch {
          // Token expired or invalid, reset
          api.setToken(null);
        }
      }

      // Auto-login or register default active session for seamless usage
      try {
        const loginRes = await api.login('user@fintrack.com', 'password123');
        if (loginRes?.user) {
          setUser(loginRes.user);
          localStorage.setItem('fintrack_user', JSON.stringify(loginRes.user));
          await fetchAllData();
          return;
        }
      } catch {
        // If user doesn't exist, create it in Supabase
        const regRes = await api.register('Default User', 'user@fintrack.com', 'password123', 'INR');
        if (regRes?.user) {
          setUser(regRes.user);
          localStorage.setItem('fintrack_user', JSON.stringify(regRes.user));
          await fetchAllData();
          return;
        }
      }
    } catch (err) {
      console.error('Failed to establish backend session:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAllData]);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Auth Functions
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('fintrack_user', JSON.stringify(res.user));
        await fetchAllData();
        showToast(`Welcome back, ${res.user.name}!`);
        return res;
      }
    } catch (error) {
      showToast(error.message || 'Login failed. Please check credentials.', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password, currency = 'INR') => {
    setIsLoading(true);
    try {
      const res = await api.register(name, email, password, currency);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('fintrack_user', JSON.stringify(res.user));
        await fetchAllData();
        showToast(`Account created successfully! Welcome, ${res.user.name}.`);
        return res;
      }
    } catch (error) {
      showToast(error.message || 'Registration failed.', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    localStorage.removeItem('fintrack_user');
    setUser({
      name: 'Guest',
      email: '',
      initials: 'G',
      currency: 'INR',
      theme: 'light'
    });
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setNotifications([]);
    navigateTo('landing');
    showToast('Logged out successfully.');
  };

  // Persist local user preferences
  useEffect(() => {
    localStorage.setItem('fintrack_user', JSON.stringify(user));
  }, [user]);

  // Calculate live stats
  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'Expense')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

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

  // Transaction Actions (Direct to Supabase via API)
  const addTransaction = async (newTx) => {
    const matchedCategory = categories.find(c => c.name.toLowerCase() === (newTx.category || '').toLowerCase());

    const payload = {
      amount: parseFloat(newTx.amount) || 0,
      type: newTx.type || 'Expense',
      description: newTx.description || (newTx.type === 'Income' ? 'Payment Received' : 'General Expense'),
      category: newTx.category || (newTx.type === 'Income' ? 'Salary' : 'Food'),
      notes: newTx.notes || null,
      icon: matchedCategory?.icon || (newTx.type === 'Income' ? 'Briefcase' : 'ShoppingBag'),
      categoryColor: matchedCategory?.color || (newTx.type === 'Income' ? '#3b82f6' : '#10b981'),
      date: newTx.date && newTx.date !== 'Today' ? new Date(newTx.date).toISOString() : new Date().toISOString()
    };

    try {
      const res = await api.createTransaction(payload);
      if (res?.data) {
        setTransactions(prev => [res.data, ...prev]);

        // Refresh budgets to update spent amounts accurately
        try {
          const bgtRes = await api.getBudgets();
          if (bgtRes?.data) setBudgets(bgtRes.data);
        } catch {
          // ignore background budget refresh error
        }

        showToast(`Saved to Supabase! ₹ ${payload.amount.toLocaleString()} logged under ${payload.category}.`);
        return res.data;
      }
    } catch (err) {
      console.error('Failed to create transaction on server:', err);
      showToast(err.message || 'Error saving to database.', 'error');
      throw err;
    }
  };

  const updateTransaction = async (id, updatedFields) => {
    try {
      const res = await api.updateTransaction(id, updatedFields);
      if (res?.data) {
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...res.data } : t));
        showToast('Transaction updated in Supabase.');
        return res.data;
      }
    } catch (err) {
      console.error('Failed to update transaction:', err);
      showToast(err.message || 'Error updating transaction in database.', 'error');
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await api.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      showToast('Transaction deleted from Supabase.');
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      showToast(err.message || 'Error deleting from database.', 'error');
      throw err;
    }
  };

  const duplicateTransaction = async (tx) => {
    return addTransaction({
      amount: tx.amount,
      type: tx.type,
      description: `${tx.description} (Copy)`,
      category: tx.category,
      notes: tx.notes
    });
  };

  // Budget Management
  const addBudget = async (newBudget) => {
    try {
      const res = await api.createBudget({
        category: newBudget.category,
        limit: parseFloat(newBudget.limit) || 0,
        month: newBudget.month || new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }),
        alertThreshold: parseInt(newBudget.alertThreshold, 10) || 80
      });
      const bgtRes = await api.getBudgets();
      if (bgtRes?.data) setBudgets(bgtRes.data);
      showToast(`Budget for ${newBudget.category} synced to Supabase.`);
      return res.data;
    } catch (err) {
      console.error('Failed to save budget:', err);
      showToast(err.message || 'Error saving budget.', 'error');
      throw err;
    }
  };

  const updateBudget = async (id, updatedFields) => {
    return addBudget(updatedFields);
  };

  const deleteBudget = async (id) => {
    try {
      await api.deleteBudget(id);
      setBudgets(prev => prev.filter(b => b.id !== id));
      showToast('Budget deleted.');
    } catch (err) {
      console.error('Failed to delete budget:', err);
      showToast(err.message || 'Error deleting budget.', 'error');
      throw err;
    }
  };

  // Category Management
  const addCategory = async (newCat) => {
    try {
      const res = await api.createCategory({
        name: newCat.name,
        type: newCat.type || 'Expense',
        icon: newCat.icon || 'ShoppingBag',
        color: newCat.color || '#10b981',
        description: newCat.description || ''
      });
      if (res?.data) {
        setCategories(prev => [...prev, res.data]);
        showToast(`Category "${newCat.name}" saved to database.`);
        return res.data;
      }
    } catch (err) {
      console.error('Failed to create category:', err);
      showToast(err.message || 'Error saving category.', 'error');
      throw err;
    }
  };

  const updateCategory = (id, updatedFields) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    showToast('Category updated.');
  };

  const deleteCategory = async (id, reassignToCategory = null) => {
    const catToDelete = categories.find(c => c.id === id);
    if (!catToDelete) return;

    try {
      await api.deleteCategory(id);
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
    } catch (err) {
      console.error('Failed to delete category:', err);
      showToast(err.message || 'Error deleting category.', 'error');
      throw err;
    }
  };

  // Savings Goals Management
  const addGoal = async (newGoal) => {
    try {
      const res = await api.createGoal({
        title: newGoal.title,
        targetAmount: parseFloat(newGoal.targetAmount) || 0,
        currentAmount: parseFloat(newGoal.currentAmount) || 0,
        targetDate: newGoal.targetDate || 'Dec 2026',
        category: newGoal.category || 'General',
        color: newGoal.color || '#10b981',
        icon: newGoal.icon || 'Target'
      });
      if (res?.data) {
        setGoals(prev => [res.data, ...prev]);
        showToast(`Goal "${newGoal.title}" saved to Supabase.`);
        return res.data;
      }
    } catch (err) {
      console.error('Failed to create goal:', err);
      showToast(err.message || 'Error saving goal to database.', 'error');
      throw err;
    }
  };

  const updateGoal = async (id, updatedFields) => {
    try {
      const res = await api.updateGoal(id, updatedFields);
      if (res?.data) {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, ...res.data } : g));
        showToast('Savings goal updated in Supabase.');
        return res.data;
      }
    } catch (err) {
      console.error('Failed to update goal:', err);
      showToast(err.message || 'Error updating goal.', 'error');
      throw err;
    }
  };

  const contributeToGoal = async (id, addAmount) => {
    try {
      const res = await api.contributeGoal(id, parseFloat(addAmount) || 0);
      if (res?.data) {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, ...res.data } : g));
        showToast(`Added ₹ ${parseFloat(addAmount).toLocaleString()} to goal!`);
        return res.data;
      }
    } catch (err) {
      console.error('Failed to contribute to goal:', err);
      showToast(err.message || 'Error contributing to goal.', 'error');
      throw err;
    }
  };

  const deleteGoal = async (id) => {
    try {
      await api.deleteGoal(id);
      setGoals(prev => prev.filter(g => g.id !== id));
      showToast('Goal removed from Supabase.');
    } catch (err) {
      console.error('Failed to delete goal:', err);
      showToast(err.message || 'Error deleting goal.', 'error');
      throw err;
    }
  };

  // Notification management
  const markNotificationAsRead = async (id) => {
    try {
      await api.markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      showToast('All notifications marked as read.');
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  // Reset / Clear Data
  const resetAllData = () => {
    fetchAllData();
    showToast('Data refreshed from Supabase.');
  };

  const clearAllData = async () => {
    try {
      for (const t of transactions) {
        await api.deleteTransaction(t.id).catch(() => {});
      }
      for (const b of budgets) {
        await api.deleteBudget(b.id).catch(() => {});
      }
      for (const g of goals) {
        await api.deleteGoal(g.id).catch(() => {});
      }
      await fetchAllData();
      showToast('All records cleared from database.');
    } catch (err) {
      console.error('Failed to clear data:', err);
    }
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
        login,
        register,
        logout,
        isLoading,
        isSyncing,
        fetchAllData,
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

export default AppContext;
