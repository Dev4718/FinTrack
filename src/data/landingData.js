// Mock dataset for FinTrack Landing Page & Hero Visual Preview

export const CURRENCY_CONFIG = {
  symbol: '$',
  code: 'USD',
  locale: 'en-US'
};

export const formatCurrency = (amount, decimals = 2) => {
  const numeric = typeof amount === 'number' ? amount : Number(amount) || 0;
  const isNegative = numeric < 0;
  const absFormatted = Math.abs(numeric).toLocaleString(CURRENCY_CONFIG.locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return isNegative
    ? `-${CURRENCY_CONFIG.symbol}${absFormatted}`
    : `${CURRENCY_CONFIG.symbol}${absFormatted}`;
};

export const formatCompact = (amount) => {
  const numeric = typeof amount === 'number' ? amount : Number(amount) || 0;
  if (Math.abs(numeric) >= 1000) {
    const kVal = (numeric / 1000).toFixed(numeric % 1000 === 0 ? 0 : 1);
    return `${CURRENCY_CONFIG.symbol}${kVal}k`;
  }
  return `${CURRENCY_CONFIG.symbol}${numeric}`;
};

// Base landing page raw figures
const rawMonthlyIncome = 8450.00;
const rawMonthlyExpenses = 3120.40;

// savings = income - expenses, computed in code
const rawSavings = rawMonthlyIncome - rawMonthlyExpenses;

export const LANDING_FINANCIAL_DATA = {
  netWorth: 24850.50,
  netWorthGrowth: '+18.4%',
  monthlyIncome: rawMonthlyIncome,
  monthlyExpenses: rawMonthlyExpenses,
  savings: rawSavings, // computed in code: income - expenses = 5329.60

  // 6 months with uneven values and July as high-spend month, latest month (Oct) highlighted
  monthlyCashflow: [
    { month: 'May', income: 7200, expense: 3400, isLatest: false },
    { month: 'Jun', income: 7800, expense: 4100, isLatest: false },
    { month: 'Jul', income: 8400, expense: 7650, isLatest: false, isHighSpend: true }, // high-spend month
    { month: 'Aug', income: 8100, expense: 3250, isLatest: false },
    { month: 'Sep', income: 8650, expense: 3800, isLatest: false },
    { month: 'Oct', income: 8450, expense: 3120, isLatest: true } // latest month highlighted
  ],

  transactions: [
    {
      id: 'tx-hero-1',
      title: 'Salary Deposit',
      date: 'Today, 09:42 AM',
      amount: 4250.00,
      formattedAmount: '+$4,250.00',
      type: 'income', // emerald green
      icon: 'CreditCard'
    },
    {
      id: 'tx-hero-2',
      title: 'Investment Savings',
      date: 'Yesterday',
      amount: -500.00,
      formattedAmount: '-$500.00',
      type: 'savings-transfer', // neutral gray, not red
      icon: 'PieChart'
    }
  ],

  goalProgress: {
    title: 'Goal Reached',
    subtitle: 'Emergency Fund: 100%',
    progressPercent: 100
  },

  autoTracked: {
    title: 'Auto-Tracked',
    label: 'Saved this month',
    // Saved amount computed from savings
    amount: rawSavings
  }
};
