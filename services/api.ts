const API_BASE_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
  : '/api';

// Log API configuration on load
console.log('[API] Base URL:', API_BASE_URL);
console.log('[API] Environment:', import.meta.env.MODE);

// Storage key for auth token
const TOKEN_KEY = 'secretlease_token';

// Get stored token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Set token
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Remove token
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Base fetch wrapper
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log('[API] Request:', options.method || 'GET', url);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();
    console.log('[API] Response:', response.status, data);

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('[API] Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  async register(data: {
    email: string;
    password: string;
    paymentMethod: 'paypal' | 'btc' | 'usdt';
    paymentEmail?: string;
    walletAddress?: string;
    transactionHash: string;
  }) {
    const response = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setToken(response.data.token);
    return response;
  },

  async login(email: string, password: string) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.data.token);
    return data;
  },

  logout() {
    removeToken();
  },
};

// Listings API
export const listingsAPI = {
  async search(params: { city?: string; maxBudget?: number; sortBy?: string }) {
    const queryParams = new URLSearchParams();
    if (params.city) queryParams.append('city', params.city);
    if (params.maxBudget) queryParams.append('maxBudget', params.maxBudget.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    
    return apiFetch(`/listings/search?${queryParams.toString()}`);
  },

  async getById(id: string) {
    return apiFetch(`/listings/${id}`);
  },

  async create(listing: any) {
    return apiFetch('/listings', {
      method: 'POST',
      body: JSON.stringify(listing),
    });
  },

  async update(id: string, listing: any) {
    return apiFetch(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listing),
    });
  },

  async delete(id: string) {
    return apiFetch(`/listings/${id}`, {
      method: 'DELETE',
    });
  },
};

// Transactions API
export const transactionsAPI = {
  async create(amount: number, method: 'paypal' | 'btc' | 'usdt') {
    return apiFetch('/transactions', {
      method: 'POST',
      body: JSON.stringify({ amount, method }),
    });
  },

  async getAll() {
    return apiFetch('/transactions');
  },

  async getById(id: string) {
    return apiFetch(`/transactions/${id}`);
  },

  async approve(id: string) {
    return apiFetch(`/transactions/${id}/approve`, {
      method: 'PUT',
    });
  },

  async reject(id: string) {
    return apiFetch(`/transactions/${id}/reject`, {
      method: 'PUT',
    });
  },
};

// Admin API
export const adminAPI = {
  async getStats() {
    return apiFetch('/admin/stats');
  },

  async getConfig() {
    return apiFetch('/admin/config');
  },

  async updateConfig(config: {
    paypalEmail: string;
    btcAddress: string;
    usdtAddress: string;
    priceUsd: number;
  }) {
    return apiFetch('/admin/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  },

  async getUsers() {
    return apiFetch('/admin/users');
  },

  async getPendingSignups() {
    return apiFetch('/admin/pending-signups');
  },

  async approveUser(userId: string) {
    return apiFetch(`/admin/approve-user/${userId}`, {
      method: 'POST',
    });
  },

  async rejectUser(userId: string) {
    return apiFetch(`/admin/reject-user/${userId}`, {
      method: 'POST',
    });
  },
};

// Users API
export const usersAPI = {
  async getMe() {
    return apiFetch('/users/me');
  },

  async getFavorites() {
    return apiFetch('/users/favorites');
  },

  async addFavorite(listingId: string) {
    return apiFetch(`/users/favorites/${listingId}`, {
      method: 'POST',
    });
  },

  async removeFavorite(listingId: string) {
    return apiFetch(`/users/favorites/${listingId}`, {
      method: 'DELETE',
    });
  },
};
