import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPasswordAPI } from '../services/authService';

export const useResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'Mật khẩu không được để trống';
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự';
      isValid = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setServerError('Token không hợp lệ hoặc đã hết hạn.');
      return;
    }
    if (!validate()) return;

    setIsLoading(true);
    setServerError('');
    setSuccessMessage('');

    try {
      const message = await resetPasswordAPI(token, formData.newPassword, formData.confirmPassword);
      setSuccessMessage(message);
      // Wait a bit, then redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    serverError,
    successMessage,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
    token,
  };
};
