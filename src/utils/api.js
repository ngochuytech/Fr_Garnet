const TOKEN_KEY = 'campushub_token';

/**
 * Base utility for making API requests with automatic Bearer token injection.
 * @param {string} endpoint - The API endpoint (e.g., '/auth/login').
 * @param {Object} options - Fetch options (method, headers, body, etc.).
 * @returns {Promise<any>} - The parsed JSON data.
 */
export const apiFetch = async (endpoint, options = {}) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem(TOKEN_KEY);

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
  }

  return result.data;
};
