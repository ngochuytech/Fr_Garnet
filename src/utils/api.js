const TOKEN_KEY = 'campushub_token';

let refreshPromise = null;

/**
 * Base utility for making API requests with automatic Bearer token injection.
 * @param {string} endpoint - The API endpoint (e.g., '/auth/login').
 * @param {Object} options - Fetch options (method, headers, body, etc.).
 * @param {boolean} isRetry - Indicate if this is a request retry after refreshing token.
 * @returns {Promise<any>} - The parsed JSON data.
 */
export const apiFetch = async (endpoint, options = {}, isRetry = false) => {
  const API_URL = import.meta.env.VITE_API_URL;
  let token = localStorage.getItem(TOKEN_KEY);

  const getHeaders = (t) => ({
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(t && { 'Authorization': `Bearer ${t}` }),
    ...options.headers,
  });

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: getHeaders(token),
  });

  // Handle Token Expiry
  if (response.status === 401 && !isRetry && endpoint !== '/auth/login' && endpoint !== '/auth/refresh-token') {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const res = await fetch(`${API_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          const data = await res.json();
          if (!res.ok || data.success === false) {
            throw new Error('Failed to refresh token');
          }

          let newToken = data.data?.token || data.token || (typeof data.data === 'string' ? data.data : undefined);
          
          if (newToken) {
            localStorage.setItem(TOKEN_KEY, newToken);
            return newToken;
          }
          throw new Error('Invalid token response');
        } catch (err) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem('campushub_user');
          window.location.href = '/login';
          throw err;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    try {
      const newToken = await refreshPromise;
      // Retry original request with the new token
      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: getHeaders(newToken),
      });
    } catch (err) {
      throw 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    }
  }

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
