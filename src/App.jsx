import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import AddTransactionPage from './pages/AddTransactionPage';
import BudgetsPage from './pages/BudgetsPage';
import ReportsPage from './pages/ReportsPage';
import CategoriesPage from './pages/CategoriesPage';
import GoalsPage from './pages/GoalsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import LegalPage from './pages/LegalPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function MainRouter() {
  const { currentPage } = useApp();

  switch (currentPage) {
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'transactions':
      return <TransactionsPage />;
    case 'add-transaction':
      return <AddTransactionPage />;
    case 'budgets':
      return <BudgetsPage />;
    case 'reports':
      return <ReportsPage />;
    case 'categories':
      return <CategoriesPage />;
    case 'goals':
      return <GoalsPage />;
    case 'profile':
    case 'settings':
      return <SettingsPage />;
    case 'help':
      return <HelpPage />;
    case 'privacy':
    case 'terms':
      return <LegalPage />;
    case '404':
      return <NotFoundPage />;
    case 'landing':
    default:
      return <LandingPage />;
  }
}

function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}

export default App;
