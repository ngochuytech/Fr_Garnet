import { Link } from 'react-router-dom';
import Input from '../../../components/Input';
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm';

const MailIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const ForgotPasswordForm = () => {
  const {
    email,
    error,
    isLoading,
    serverError,
    successMessage,
    handleChange,
    handleSubmit,
  } = useForgotPasswordForm();

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-700 mb-2">Quên mật khẩu</h2>
      <p className="text-sm text-slate-500 mb-5">Nhập email của bạn để nhận liên kết khôi phục mật khẩu.</p>

      {serverError && (
        <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <span className="mt-0.5 shrink-0">⚠</span>
          {serverError}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          <span className="mt-0.5 shrink-0">✓</span>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          id="forgot-email"
          name="email"
          type="email"
          label="Email"
          placeholder="Email của bạn"
          value={email}
          onChange={handleChange}
          error={error}
          icon={MailIcon}
          autoComplete="email"
        />

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
                Đang gửi...
              </>
            ) : 'Gửi yêu cầu'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
