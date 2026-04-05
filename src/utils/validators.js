/**
 * Validates an email address format.
 * @param {string} email
 * @returns {string|null} Error message or null
 */
export const validateEmail = (email) => {
  if (!email) return 'Email là bắt buộc';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Địa chỉ email không hợp lệ';
  return null;
};

/**
 * Validates a password.
 * @param {string} password
 * @returns {string|null} Error message or null
 */
export const validatePassword = (password) => {
  if (!password) return 'Mật khẩu là bắt buộc';
  if (password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
  return null;
};

/**
 * Validates a full name.
 * @param {string} name
 * @returns {string|null} Error message or null
 */
export const validateFullName = (name) => {
  if (!name || !name.trim()) return 'Họ và tên là bắt buộc';
  if (name.trim().length < 2) return 'Họ và tên phải có ít nhất 2 ký tự';
  return null;
};

/**
 * Validates password confirmation.
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {string|null} Error message or null
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Xác nhận mật khẩu là bắt buộc';
  if (password !== confirmPassword) return 'Mật khẩu không khớp';
  return null;
};
