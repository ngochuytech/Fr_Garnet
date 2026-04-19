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

  let result;
  try {
    result = await response.json();
  } catch (e) {
    throw new Error(e.message);
  }

  if (!response.ok || (result && result.success === false)) {
    const errorMsg = result?.error || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
    throw errorMsg;
  }

  // Ưu tiên trả về result.data nếu có, nếu không trả về cả object result
  return (result && result.data !== undefined && result.data !== null) ? result.data : result;
};
