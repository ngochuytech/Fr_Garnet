import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

/**
 * Temporary Dashboard page shown after successful login/register.
 */
const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 mx-auto mb-4 overflow-hidden flex items-center justify-center text-2xl font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <h1 className="text-2xl font-bold mb-1">{user?.fullName || 'Người dùng'}</h1>
            <p className="text-blue-100 text-sm">{user?.email}</p>
            <span className="inline-block mt-3 px-3 py-1 bg-white/20 rounded-full text-xs font-medium capitalize">
              {user?.role === 'student' ? '🎓 Sinh viên' : '👨‍🏫 Giảng viên'}
            </span>
          </div>

          {/* Body */}
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Đăng nhập thành công!</h2>
            <p className="text-slate-500 text-sm mb-8">
              Chào mừng bạn đến với CampusHub. Dashboard đang được xây dựng.
            </p>
            <button
              onClick={logout}
              className="w-full py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
