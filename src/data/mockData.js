// Clean baseline data configurations for FinTrack

export const INITIAL_TRANSACTIONS = [];

export const CATEGORIES_BREAKDOWN = [];

export const MONTHLY_CASHFLOW = [];

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

export const INITIAL_BUDGETS = [];

export const INITIAL_GOALS = [];

export const INITIAL_NOTIFICATIONS = [];

export const MONTHLY_ANALYTICS_DATA = [];

export { LANDING_FINANCIAL_DATA, CURRENCY_CONFIG, formatCurrency, formatCompact } from './landingData';
