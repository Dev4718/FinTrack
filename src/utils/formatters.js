// Common formatting utilities for FinTrack

/**
 * Format an amount into Indian Rupee format (e.g. ₹ 1,50,000 or ₹ 450)
 */
export const formatINR = (amount, includeSymbol = true) => {
  const numeric = typeof amount === 'number' ? amount : Number(amount) || 0;
  const isNegative = numeric < 0;
  const absValue = Math.abs(numeric);

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(absValue);

  if (!includeSymbol) {
    return isNegative ? `-${formatted}` : formatted;
  }

  return isNegative ? `-₹ ${formatted}` : `₹ ${formatted}`;
};

/**
 * Time-aware friendly greeting
 */
export const getTimeAwareGreeting = (name = 'there') => {
  const hour = new Date().getHours();
  let timeOfDay = 'Morning';

  if (hour >= 4 && hour < 12) {
    timeOfDay = 'Morning';
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'Afternoon';
  } else if (hour >= 17 && hour < 21) {
    timeOfDay = 'Evening';
  } else {
    timeOfDay = 'Night';
  }

  return {
    timeOfDay,
    title: `Good ${timeOfDay}, ${name}! 👋`,
    subtitle: hour >= 21 || hour < 4 
      ? 'Burning the midnight oil? Here is your financial snapshot.'
      : 'Here is what is happening with your finances today.'
  };
};

/**
 * Friendly pluralization helper
 */
export const pluralize = (count, singular, plural) => {
  const n = typeof count === 'number' ? count : Number(count) || 0;
  if (n === 1) {
    return `1 ${singular}`;
  }
  return `${n} ${plural || singular + 's'}`;
};

/**
 * Relative date formatter
 */
export const formatRelativeDate = (dateString) => {
  if (!dateString) return '';
  const lower = String(dateString).toLowerCase();
  if (lower.includes('today')) return 'Today';
  if (lower.includes('yesterday')) return 'Yesterday';
  return dateString;
};
