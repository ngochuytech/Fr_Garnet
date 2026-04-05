import { Link } from 'react-router-dom';
import Input from '../../../components/Input';
import { useRegisterForm } from '../hooks/useRegisterForm';

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
const UserIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
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

/* ── Password strength bar ── */
const getStrength = (pw) => {
  if (!pw) return { level: 0, label: '', color: '' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { level: 1, label: 'Yếu', color: '#ef4444' };
  if (s <= 3) return { level: 2, label: 'Trung bình', color: '#f59e0b' };
  return { level: 3, label: 'Mạnh', color: '#10b981' };
};

const PasswordStrength = ({ password }) => {
  const { level, label, color } = getStrength(password);
  if (!password) return null;
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= level ? color : '#e2e8f0' }}
          />
        ))}
      </div>
      <span className="text-xs font-medium" style={{ color }}>{label}</span>
    </div>
  );
};

/**
 * RegisterForm – Quora-style card form using dusty rose brand colors.
 */
const RegisterForm = () => {
  const {
    formData,
    errors,
    isLoading,
    serverError,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handleChange,
    handleSubmit,
  } = useRegisterForm();

  return (
    <div>
      {/* Section title */}
      <h2 className="text-lg font-semibold text-slate-700 mb-5">Tạo tài khoản</h2>

      {/* Server error */}
      {serverError && (
        <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <span className="mt-0.5 shrink-0">⚠</span>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
        {/* Full name */}
        <Input
          id="reg-fullname"
          name="fullname"
          type="text"
          label="Họ và tên"
          placeholder="Nguyễn Văn A"
          value={formData.fullname}
          onChange={handleChange}
          error={errors.fullname}
          icon={UserIcon}
          autoComplete="name"
        />

        {/* Email */}
        <Input
          id="reg-email"
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

        {/* Password */}
        <div>
          <Input
            id="reg-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Mật khẩu"
            placeholder="Tối thiểu 8 ký tự"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={LockIcon}
            autoComplete="new-password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Ẩn' : 'Hiện'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
          />
          <PasswordStrength password={formData.password} />
        </div>

        {/* Confirm password */}
        <Input
          id="reg-confirm-password"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          icon={LockIcon}
          autoComplete="new-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showConfirmPassword ? 'Ẩn' : 'Hiện'}
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
        />

        {/* Terms */}
        <div className="mt-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: 'var(--color-dusty-rose-500)' }}
            />
            <span className="text-xs text-slate-500 leading-relaxed">
              Tôi đồng ý với{' '}
              <a href="#" className="font-medium underline" style={{ color: 'var(--color-dusty-rose-500)' }}>
                Điều khoản dịch vụ
              </a>{' '}
              và{' '}
              <a href="#" className="font-medium underline" style={{ color: 'var(--color-dusty-rose-500)' }}>
                Chính sách bảo mật
              </a>
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <span>⚠</span> {errors.agreeTerms}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-1 py-3 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
          style={{ background: 'var(--color-dusty-rose-500)' }}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang tạo tài khoản...
            </>
          ) : 'Tạo tài khoản'}
        </button>
      </form>

      {/* Login link */}
      <p className="text-center text-sm text-slate-500 mt-6 pt-5 border-t border-slate-100">
        Đã có tài khoản?{' '}
        <Link
          to="/login"
          className="font-semibold transition-colors"
          style={{ color: 'var(--color-dusty-rose-500)' }}
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
