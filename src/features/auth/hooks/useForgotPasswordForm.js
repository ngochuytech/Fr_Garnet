import { useState } from 'react';
import { forgotPasswordAPI } from '../services/authService';

export const useForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    let isValid = true;
    let newError = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newError = 'Email không được để trống';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newError = 'Email không hợp lệ';
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
    if (serverError) setServerError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setServerError('');
    setSuccessMessage('');

    try {
      const message = await forgotPasswordAPI(email);
      setSuccessMessage(message);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    error,
    isLoading,
    serverError,
    successMessage,
    handleChange,
    handleSubmit,
  };
};
