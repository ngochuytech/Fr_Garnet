import { Link } from 'react-router-dom';
import Input from '../../../components/Input';
import { useResetPasswordForm } from '../hooks/useResetPasswordForm';

const LockIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const ResetPasswordForm = () => {
  const {
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
  } = useResetPasswordForm();

  if (!token) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-slate-700 mb-2">Liên kết không hợp lệ</h2>
        <p className="text-sm text-slate-500 mb-5">Liên kết đặt lại mật khẩu không hợp lệ hoặc không được tìm thấy. Vui lòng kiểm tra lại email hoặc yêu cầu liên kết mới.</p>
        <Link
          to="/forgot-password"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all shadow-md hover:opacity-90 active:scale-95"
          style={{ background: 'var(--color-dusty-rose-500)' }}
        >
          Yêu cầu lại liên kết
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-700 mb-2">Đặt lại mật khẩu</h2>
      <p className="text-sm text-slate-500 mb-5">Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>

      {serverError && (
        <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <span className="mt-0.5 shrink-0">⚠</span>
          {serverError}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 flex flex-col gap-2 p-3.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0">✓</span>
            {successMessage}
          </div>
          <p className="text-xs text-green-600 pl-6">Đang chuyển hướng về trang đăng nhập...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <Input
            id="reset-newPassword"
            name="newPassword"
            type={showPassword ? 'text' : 'password'}
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            icon={LockIcon}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
          />
        </div>

        <div>
          <Input
            id="reset-confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu mới"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={LockIcon}
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <Link
            to="/login"
            className="text-sm transition-colors text-slate-500 hover:text-slate-700"
          >
            Quay lại đăng nhập
          </Link>

          <button
            type="submit"
            disabled={isLoading || !!successMessage}
            className="flex items-center gap-2 px-7 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 shadow-md"
            style={{ background: 'var(--color-dusty-rose-500)' }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang xử lý...
              </>
            ) : 'Đổi mật khẩu'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
