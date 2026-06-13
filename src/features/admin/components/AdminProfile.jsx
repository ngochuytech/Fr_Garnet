import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getProfile, updatePassword } from '../../profile/services/profileSerivce';
import { toast } from 'sonner';

// ─── SVG ICONS (Inline, no external deps) ────────────────────────────────────
const IconCamera = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
  </svg>
);

const IconLogOut = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const IconShield = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconKeyRound = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zM12 7l.343-.343a4 4 0 1 1 5.657 5.657L17 13l4 4V21l-3 3-4-4v-4l-2.343 2.343a4 4 0 1 1-5.657-5.657L7.61 11.61z"/>
  </svg>
);



const IconMail = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

const IconPhone = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconCalendar = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

const formatDate = (value) => {
  if (!value) return 'Chưa cập nhật';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatRole = (role) => {
  const normalizedRole = Array.isArray(role)
    ? (role[0]?.authority || role[0]?.name || role[0])
    : (role?.authority || role?.name || role);
  if (!normalizedRole) return 'Quản trị viên';

  const roleMap = {
    ADMIN: 'Quản trị viên',
    ROLE_ADMIN: 'Quản trị viên',
    SUPER_ADMIN: 'Super Admin',
    ROLE_SUPER_ADMIN: 'Super Admin',
  };

  return roleMap[normalizedRole] || normalizedRole;
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const AdminProfile = () => {
  const { user, isLoading, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const userId = user?.id || user?.userId || user?.email;

  const [formDataPassword, setFormDataPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormDataPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (formDataPassword.newPassword !== formDataPassword.confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }
    setIsSavingPassword(true);
    try {
      await updatePassword(formDataPassword);
      toast.success('Cập nhật mật khẩu thành công!');
      setFormDataPassword({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(typeof error === 'string' ? error : error.message || 'Có lỗi xảy ra');
    } finally {
      setIsSavingPassword(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      return;
    }

    let isMounted = true;

    const fetchCurrentProfile = async () => {
      try {
        const data = await getProfile();
        if (!isMounted) return;
        setProfileUser(data);
        updateUser(data);
      } catch (error) {
        console.error('Failed to fetch admin profile:', error);
      }
    };

    fetchCurrentProfile();

    return () => {
      isMounted = false;
    };
  }, [userId, updateUser]);

  const currentUser = user && (profileUser?.id === user?.id || profileUser?.email === user?.email) ? profileUser : user;
  const displayName = currentUser?.fullname || currentUser?.fullName || currentUser?.name || 'Quản trị viên';
  const profile = {
    name: displayName,
    role: formatRole(currentUser?.role || currentUser?.roles || currentUser?.authorities),
    email: currentUser?.email || 'Chưa cập nhật',
    phone: currentUser?.phone || 'Chưa cập nhật',
    joined_at: formatDate(currentUser?.createdAt || currentUser?.created_at || currentUser?.joinedAt || currentUser?.joined_at),
    avatar: currentUser?.avatarUrl || currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=111&color=fff&size=128`,
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-[320px] flex flex-col items-center justify-center gap-3 text-gray-500">
        <svg className="animate-spin h-8 w-8 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <p className="text-sm font-semibold">Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900">Hồ sơ quản trị</h1>
        <p className="text-sm font-medium text-gray-500 mt-0.5">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ── Cột trái: Thông tin tổng quan ── */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header / Cover */}
            <div className="h-24 bg-gray-900 w-full relative">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            </div>
            
            <div className="px-6 pb-6 relative flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative -mt-12 mb-4 group cursor-pointer">
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-gray-100">
                  <img src={profile.avatar} alt="Admin Avatar" className="w-full h-full object-cover" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-105 border-2 border-white">
                  <IconCamera size={14} />
                </button>
              </div>

              {/* Name & Role */}
              <h2 className="text-xl font-black text-gray-900">{profile.name}</h2>
              <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-600">
                {profile.role}
              </span>

              {/* Info List */}
              <div className="w-full mt-6 space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex flex-shrink-0 items-center justify-center text-gray-400">
                    <IconMail size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email</p>
                    <p className="text-sm font-semibold text-gray-900">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex flex-shrink-0 items-center justify-center text-gray-400">
                    <IconCalendar size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ngày tham gia</p>
                    <p className="text-sm font-semibold text-gray-900">{profile.joined_at}</p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="w-full mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <IconLogOut size={16} />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Cột phải: Bảo mật & Hoạt động ── */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Bảo mật & Cài đặt */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <IconShield className="text-gray-400" size={20} />
              <h3 className="text-lg font-black text-gray-900">Bảo mật & Cài đặt</h3>
            </div>

            <div className="max-w-xl">
              {/* Form đổi mật khẩu */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-4">Thay đổi mật khẩu</h4>
                <form onSubmit={handleSubmitPassword} className="space-y-3">
                  <div>
                    <input 
                      type="password" 
                      name="currentPassword"
                      value={formDataPassword.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Mật khẩu hiện tại" 
                      required
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <input 
                      type="password" 
                      name="newPassword"
                      value={formDataPassword.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Mật khẩu mới" 
                      required
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={formDataPassword.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Xác nhận mật khẩu mới" 
                      required
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSavingPassword}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSavingPassword ? (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <IconKeyRound size={16} />
                    )}
                    {isSavingPassword ? 'Đang cập nhật...' : 'Lưu mật khẩu mới'}
                  </button>
                </form>
              </div>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
