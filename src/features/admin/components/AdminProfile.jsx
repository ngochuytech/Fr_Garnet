import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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

const IconActivity = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const IconCheckCircle2 = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><polyline points="9 11 12 14 22 4"/>
  </svg>
);

const IconTrash2 = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

const IconLogIn = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
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

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const MOCK_DATA = {
  profile: {
    name: "Nguyễn Quản Trị",
    role: "Super Admin",
    email: "admin@campushub.edu.vn",
    phone: "+84 123 456 789",
    joined_at: "2024-01-15",
    avatar: "https://ui-avatars.com/api/?name=Admin&background=111&color=fff&size=128"
  },
  settings: {
    two_factor_enabled: true,
    email_notifications: false
  },
  activity_logs: [
    { id: 1, action: "TAKE_DOWN_POST", description: "Đã gỡ bài viết p892 của Trần B", time: "15 phút trước" },
    { id: 2, action: "RESOLVE_REPORT", description: "Đã xử lý xong báo cáo r152", time: "2 giờ trước" },
    { id: 3, action: "LOGIN", description: "Đăng nhập thành công từ IP 192.168.1.1", time: "Hôm qua" }
  ]
};

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────
const ToggleSwitch = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`w-10 h-6 flex items-center rounded-full px-1 transition-colors relative focus:outline-none ${
      enabled ? 'bg-gray-900' : 'bg-gray-200'
    }`}
  >
    <div
      className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm ${
        enabled ? 'translate-x-2' : 'translate-x-0'
      }`}
    />
  </button>
);

const ActivityIcon = ({ action }) => {
  switch (action) {
    case 'TAKE_DOWN_POST':
      return <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500"><IconTrash2 size={14} /></div>;
    case 'RESOLVE_REPORT':
      return <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500"><IconCheckCircle2 size={14} /></div>;
    case 'LOGIN':
      return <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><IconLogIn size={14} /></div>;
    default:
      return <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500"><IconActivity size={14} /></div>;
  }
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const AdminProfile = () => {
  const { profile, activity_logs } = MOCK_DATA;
  const [settings, setSettings] = useState(MOCK_DATA.settings);

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
                    <IconPhone size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Số điện thoại</p>
                    <p className="text-sm font-semibold text-gray-900">{profile.phone}</p>
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
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                  <IconLogOut size={16} />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Cột phải: Bảo mật & Hoạt động ── */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Khối 1: Bảo mật & Cài đặt */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <IconShield className="text-gray-400" size={20} />
              <h3 className="text-lg font-black text-gray-900">Bảo mật & Cài đặt</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form đổi mật khẩu */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-4">Thay đổi mật khẩu</h4>
                <div className="space-y-3">
                  <div>
                    <input 
                      type="password" 
                      placeholder="Mật khẩu hiện tại" 
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <input 
                      type="password" 
                      placeholder="Mật khẩu mới" 
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <input 
                      type="password" 
                      placeholder="Xác nhận mật khẩu mới" 
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-sm">
                    <IconKeyRound size={16} />
                    Lưu mật khẩu mới
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-4">Tùy chọn hệ thống</h4>
                <div className="space-y-4">
                  
                  {/* 2FA */}
                  <div className="flex items-start justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Xác thực hai yếu tố (2FA)</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">Tăng cường bảo mật bằng cách yêu cầu mã xác nhận khi đăng nhập.</p>
                    </div>
                    <ToggleSwitch 
                      enabled={settings.two_factor_enabled} 
                      onChange={() => toggleSetting('two_factor_enabled')} 
                    />
                  </div>

                  {/* Email Notifications */}
                  <div className="flex items-start justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="pr-4">
                      <p className="text-sm font-bold text-gray-900">Thông báo Email (Report)</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">Nhận email ngay khi có báo cáo vi phạm mới trên hệ thống.</p>
                    </div>
                    <ToggleSwitch 
                      enabled={settings.email_notifications} 
                      onChange={() => toggleSetting('email_notifications')} 
                    />
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Khối 2: Nhật ký hoạt động */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <IconActivity className="text-gray-400" size={20} />
                <h3 className="text-lg font-black text-gray-900">Nhật ký hoạt động</h3>
              </div>
              <Link to="/admin/activity-logs" className="text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-gray-900 transition-colors">
                Xem toàn bộ
              </Link>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-100" />
              
              <div className="space-y-6 relative">
                {activity_logs.map((log) => (
                  <div key={log.id} className="flex gap-4">
                    {/* Timeline dot */}
                    <div className="relative z-10">
                      <ActivityIcon action={log.action} />
                    </div>
                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-semibold text-gray-900">{log.description}</p>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mt-1 block">
                        {log.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
