/**
 * Registers a new user.
 * @param {{ fullName: string, email: string, password: string, role: string }} data
 * @returns {Promise<{ user: object, token: string }>}
 */
export const registerUser = async (data) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  } catch (error) {
    throw new Error(error.message || 'Lỗi kết nối đến server. Vui lòng thử lại sau.');
  }
};

/**
 * Logs in an existing user.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user: object, token: string }>}
 */
export const loginUser = async (credentials) => {
  try {
    // Lấy Base URL từ file .env (Trong Vite, biến phải bắt đầu bằng VITE_)
    const API_URL = import.meta.env.VITE_API_URL;

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }

    // Trả về phần data thực sự để hook lấy được user và token
    return result.data;
  } catch (error) {
    // Bắt lỗi khi không gọi được server (ví dụ server sập, mất mạng)
    throw new Error(error.message || 'Lỗi kết nối đến server. Vui lòng thử lại sau.');
  }
};

export const googleLogin = async () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/social-login/google`;
}

export const googleCallback = async ({ code }) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL;
    const REDIRECT_URI = import.meta.env.VITE_OAUTH2_REDIRECT_URI;
    const response = await fetch(`${API_URL}/auth/social-login/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        redirectUri: `${window.location.origin}${REDIRECT_URI}`
      }),
      credentials: 'include',
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
    return result.data;
  } catch (error) {
    throw new Error(error.message || 'Lỗi kết nối đến server. Vui lòng thử lại sau.');
  }

}