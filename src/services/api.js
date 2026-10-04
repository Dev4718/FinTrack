/**
 * FinTrack API Client Service
 * Connects React Frontend with the Express + Prisma + PostgreSQL Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('fintrack_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('fintrack_token', token);
    } else {
      localStorage.removeItem('fintrack_token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  }

  // --- Auth APIs ---
  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async register(name, email, password, currency = 'INR') {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, currency })
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  logout() {
    this.setToken(null);
  }

  // --- Transactions APIs ---
  async getTransactions(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/transactions${query ? `?${query}` : ''}`);
  }

  async createTransaction(transactionData) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData)
    });
  }

  async updateTransaction(id, transactionData) {
    return this.request(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData)
    });
  }

  async deleteTransaction(id) {
    return this.request(`/transactions/${id}`, {
      method: 'DELETE'
    });
  }

  // --- Categories APIs ---
  async getCategories() {
    return this.request('/categories');
  }

  async createCategory(categoryData) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  }

  async deleteCategory(id) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE'
    });
  }

  // --- Budgets APIs ---
  async getBudgets(month) {
    const query = month ? `?month=${encodeURIComponent(month)}` : '';
    return this.request(`/budgets${query}`);
  }

  async saveBudget(budgetData) {
    return this.request('/budgets', {
      method: 'POST',
      body: JSON.stringify(budgetData)
    });
  }

  async deleteBudget(id) {
    return this.request(`/budgets/${id}`, {
      method: 'DELETE'
    });
  }

  // --- Goals APIs ---
  async getGoals() {
    return this.request('/goals');
  }

  async createGoal(goalData) {
    return this.request('/goals', {
      method: 'POST',
      body: JSON.stringify(goalData)
    });
  }

  async contributeGoal(id, amount) {
    return this.request(`/goals/${id}/contribute`, {
      method: 'PATCH',
      body: JSON.stringify({ amount })
    });
  }

  async deleteGoal(id) {
    return this.request(`/goals/${id}`, {
      method: 'DELETE'
    });
  }

  // --- Analytics APIs ---
  async getDashboardSummary() {
    return this.request('/analytics/dashboard-summary');
  }

  async getCategoryBreakdown(type = 'Expense') {
    return this.request(`/analytics/category-breakdown?type=${type}`);
  }

  async getMonthlyCashflow() {
    return this.request('/analytics/monthly-cashflow');
  }

  // --- Notifications APIs ---
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH'
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PATCH'
    });
  }
}

export const api = new ApiService();
export default api;
