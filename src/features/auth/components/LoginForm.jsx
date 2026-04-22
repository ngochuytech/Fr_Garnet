import { Link } from 'react-router-dom';
import Input from '../../../components/Input';
import { useLoginForm } from '../hooks/useLoginForm';

/* ── Inline SVG icons ── */
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
const MailIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const LockIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/**
 * LoginForm – Quora-style card form using dusty rose brand colors.
 */
const LoginForm = () => {
  const {
    formData,
    errors,
    isLoading,
    serverError,
    showPassword,
    setShowPassword,
    handleGoogleLogin,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <div>
      {/* Section title */}
      <h2 className="text-lg font-semibold text-slate-700 mb-5">Đăng nhập</h2>

      {/* Server error */}
      {serverError && (
        <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <span className="mt-0.5 shrink-0">⚠</span>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          id="login-email"
          name="email"
          type="email"
          label="Email"
          placeholder="Email của bạn"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={MailIcon}
          autoComplete="email"
        />

        <div>
          <Input
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Mật khẩu"
            placeholder="Mật khẩu của bạn"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={LockIcon}
            autoComplete="current-password"
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

        {/* Forgot + Submit row */}
        <div className="flex items-center justify-between mt-1">
          <Link
            to="/forgot-password"
            className="text-sm transition-colors"
            style={{ color: 'var(--color-dusty-rose-500)' }}
            onMouseEnter={e => e.target.style.color = 'var(--color-dusty-rose-700)'}
            onMouseLeave={e => e.target.style.color = 'var(--color-dusty-rose-500)'}
          >
            Quên mật khẩu?
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-7 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 shadow-md"
            style={{ background: 'var(--color-dusty-rose-500)' }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang xử lý
              </>
            ) : 'Đăng nhập'}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative flex items-center gap-3 my-6">
        <div className="flex-1 border-t border-slate-200" />
        <span className="text-xs text-slate-400 font-medium tracking-wide">HOẶC</span>
        <div className="flex-1 border-t border-slate-200" />
      </div>

      {/* Social buttons */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 active:scale-[0.98]"
          onClick={handleGoogleLogin}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          Tiếp tục với Google
        </button>
      </div>

      {/* Register link */}
      <p className="text-center text-sm text-slate-500 mt-7 pt-6 border-t border-slate-100">
        Chưa có tài khoản?{' '}
        <Link
          to="/register"
          className="font-semibold transition-colors"
          style={{ color: 'var(--color-dusty-rose-500)' }}
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
