// Initial mock dataset for FinTrack frontend demo with realistic Indian expense profiles

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    date: 'Today',
    description: 'Swiggy Dinner Order',
    category: 'Food',
    type: 'Expense',
    amount: 580,
    icon: 'Utensils',
    categoryColor: '#10b981'
  },
  {
    id: 'tx-2',
    date: 'Yesterday',
    description: 'Monthly Salary Credit',
    category: 'Salary',
    type: 'Income',
    amount: 52000,
    icon: 'Briefcase',
    categoryColor: '#3b82f6'
  },
  {
    id: 'tx-3',
    date: 'Sep 26, 2025',
    description: 'House Rent Payment',
    category: 'Bills',
    type: 'Expense',
    amount: 18000,
    icon: 'Home',
    categoryColor: '#ef4444'
  },
  {
    id: 'tx-4',
    date: 'Sep 25, 2025',
    description: 'DMart Monthly Groceries',
    category: 'Food',
    type: 'Expense',
    amount: 4650,
    icon: 'Utensils',
    categoryColor: '#10b981'
  },
  {
    id: 'tx-5',
    date: 'Sep 24, 2025',
    description: 'Myntra Autumn Apparel',
    category: 'Shopping',
    type: 'Expense',
    amount: 3200,
    icon: 'ShoppingBag',
    categoryColor: '#8b5cf6'
  },
  {
    id: 'tx-6',
    date: 'Sep 23, 2025',
    description: 'Electricity & Water Bill',
    category: 'Bills',
    type: 'Expense',
    amount: 2100,
    icon: 'Zap',
    categoryColor: '#ef4444'
  },
  {
    id: 'tx-7',
    date: 'Sep 22, 2025',
    description: 'Freelance UI Design gig',
    category: 'Freelance',
    type: 'Income',
    amount: 9500,
    icon: 'Laptop',
    categoryColor: '#06b6d4'
  },
  {
    id: 'tx-8',
    date: 'Sep 21, 2025',
    description: 'Uber Commute Pass',
    category: 'Transport',
    type: 'Expense',
    amount: 2400,
    icon: 'Car',
    categoryColor: '#f59e0b'
  },
  {
    id: 'tx-9',
    date: 'Sep 19, 2025',
    description: 'Cafe Coffee Day Meetup',
    category: 'Food',
    type: 'Expense',
    amount: 450,
    icon: 'Utensils',
    categoryColor: '#10b981'
  },
  {
    id: 'tx-10',
    date: 'Sep 18, 2025',
    description: 'Netflix & Spotify Family',
    category: 'Entertainment',
    type: 'Expense',
    amount: 899,
    icon: 'Film',
    categoryColor: '#ec4899'
  },
  {
    id: 'tx-11',
    date: 'Sep 15, 2025',
    description: 'Amazon Electronics & Cable',
    category: 'Shopping',
    type: 'Expense',
    amount: 1100,
    icon: 'ShoppingBag',
    categoryColor: '#8b5cf6'
  }
];

export const CATEGORIES_BREAKDOWN = [
  { name: 'Bills', percentage: 55, amount: 20100, color: '#ef4444' },
  { name: 'Food', percentage: 16, amount: 5680, color: '#10b981' },
  { name: 'Shopping', percentage: 12, amount: 4300, color: '#8b5cf6' },
  { name: 'Transport', percentage: 7, amount: 2400, color: '#f59e0b' },
  { name: 'Entertainment', percentage: 4, amount: 899, color: '#ec4899' },
  { name: 'Others', percentage: 6, amount: 2000, color: '#64748b' }
];

export const MONTHLY_CASHFLOW = [
  { month: 'Jun', income: 48000, expense: 33500 },
  { month: 'Jul', income: 51000, expense: 36000 },
  { month: 'Aug', income: 58000, expense: 39500 },
  { month: 'Sep', income: 61500, expense: 33379 }
];

export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Food', type: 'Expense', icon: 'Utensils', color: '#10b981', description: 'Groceries, dining out, and food orders' },
  { id: 'cat-2', name: 'Transport', type: 'Expense', icon: 'Car', color: '#f59e0b', description: 'Cabs, fuel, metro, and commute' },
  { id: 'cat-3', name: 'Shopping', type: 'Expense', icon: 'ShoppingBag', color: '#8b5cf6', description: 'Clothing, household goods, electronics' },
  { id: 'cat-4', name: 'Bills', type: 'Expense', icon: 'Zap', color: '#ef4444', description: 'Rent, electricity, wifi, and utilities' },
  { id: 'cat-5', name: 'Entertainment', type: 'Expense', icon: 'Film', color: '#ec4899', description: 'Movies, streaming services, events' },
  { id: 'cat-6', name: 'Health', type: 'Expense', icon: 'HeartPulse', color: '#14b8a6', description: 'Doctor visits, medicines, gym membership' },
  { id: 'cat-7', name: 'Salary', type: 'Income', icon: 'Briefcase', color: '#3b82f6', description: 'Primary monthly employment paycheck' },
  { id: 'cat-8', name: 'Freelance', type: 'Income', icon: 'Laptop', color: '#06b6d4', description: 'Consulting, design projects, and side work' },
  { id: 'cat-9', name: 'Investments', type: 'Income', icon: 'TrendingUp', color: '#10b981', description: 'Dividends, mutual funds, interest payouts' }
];

export const INITIAL_BUDGETS = [
  { id: 'bgt-1', category: 'Food', limit: 8000, month: 'Sep 2025', alertThreshold: 80 },
  { id: 'bgt-2', category: 'Shopping', limit: 5000, month: 'Sep 2025', alertThreshold: 80 },
  { id: 'bgt-3', category: 'Bills', limit: 22000, month: 'Sep 2025', alertThreshold: 90 },
  { id: 'bgt-4', category: 'Transport', limit: 4000, month: 'Sep 2025', alertThreshold: 80 },
  { id: 'bgt-5', category: 'Entertainment', limit: 2000, month: 'Sep 2025', alertThreshold: 80 }
];

export const INITIAL_GOALS = [
  {
    id: 'goal-1',
    title: 'Emergency Cushion',
    targetAmount: 150000,
    currentAmount: 95000,
    targetDate: 'Dec 2025',
    category: 'Safety',
    color: '#10b981',
    icon: 'Shield'
  },
  {
    id: 'goal-2',
    title: 'Goa Friends Trip',
    targetAmount: 35000,
    currentAmount: 28000,
    targetDate: 'Nov 2025',
    category: 'Travel',
    color: '#06b6d4',
    icon: 'Plane'
  },
  {
    id: 'goal-3',
    title: 'New Laptop Setup',
    targetAmount: 85000,
    currentAmount: 42000,
    targetDate: 'Jan 2026',
    category: 'Electronics',
    color: '#8b5cf6',
    icon: 'Laptop'
  },
  {
    id: 'goal-4',
    title: 'Festival Celebrations',
    targetAmount: 20000,
    currentAmount: 20000,
    targetDate: 'Oct 2025',
    category: 'Celebration',
    color: '#f59e0b',
    icon: 'Gift'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Heads up on Shopping budget',
    message: 'Shopping is at 86% of its limit with 5 days left in the month.',
    time: '2 hours ago',
    type: 'warning',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Salary credited successfully',
    message: '₹ 52,000 received from employment paycheck.',
    time: 'Yesterday',
    type: 'success',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Goal reached! 🎉',
    message: 'You achieved 100% of your Festival Celebrations goal.',
    time: '3 days ago',
    type: 'celebration',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Monthly statement ready',
    message: 'Your spending summary for August is available to download.',
    time: '1 week ago',
    type: 'info',
    read: true
  }
];

export const MONTHLY_ANALYTICS_DATA = [
  { month: 'Apr', income: 45000, expense: 32000, savings: 13000 },
  { month: 'May', income: 48000, expense: 34500, savings: 13500 },
  { month: 'Jun', income: 48000, expense: 33500, savings: 14500 },
  { month: 'Jul', income: 51000, expense: 36000, savings: 15000 },
  { month: 'Aug', income: 58000, expense: 39500, savings: 18500 },
  { month: 'Sep', income: 61500, expense: 33379, savings: 28121 }
];

export { LANDING_FINANCIAL_DATA, CURRENCY_CONFIG, formatCurrency, formatCompact } from './landingData';
