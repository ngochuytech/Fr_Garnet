import React, { useState } from 'react';
import useAdminNotifications from '../hooks/useAdminNotifications';

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const formatTime = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 30) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '';
  }
};

const IconSystem = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconAlert = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconFollow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const IconMore = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
  </svg>
);

// ─── COMPONENT ───────────────────────────────────────────────────────────────
const AdminNotificationPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const { notifications, unreadCount, handleMarkAsRead, handleMarkAllRead } = useAdminNotifications('all');

  const displayed = activeTab === 'unread' 
    ? notifications.filter((n) => n.isRead === false || n.read === false || n.status === 'UNREAD') 
    : notifications;

  const getNotifIcon = (notif) => {
    if (notif.type === 'SYSTEM_ALERT') {
      return <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0"><IconSystem /></div>;
    }
    if (notif.type === 'REPORT_RESOLVED') {
      return <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0"><IconAlert /></div>;
    }
    if (notif.type === 'NEW_FOLLOWER') {
      return <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0"><IconFollow /></div>;
    }
    const avatarUrl = notif.actor?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(notif.actor?.fullName || 'CH')}&background=D8B4E2&color=fff&size=128&rounded=true`;
    return (
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
        <img src={avatarUrl} alt={notif.actor?.fullName} className="w-full h-full object-cover" />
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      
      {/* ── Page Header ── */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-3">
            Thông báo hệ thống
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                {unreadCount} mới
              </span>
            )}
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Xem tất cả các thông báo liên quan đến hệ thống và tài khoản của bạn</p>
        </div>
        <button 
          onClick={handleMarkAllRead}
          className="text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 shadow-sm"
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      {/* ── Content ── */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        
        {/* Tabs */}
        <div className="px-6 pt-6 border-b border-gray-100 flex gap-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'all' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Tất cả thông báo
            {activeTab === 'all' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-t-full" />}
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${
              activeTab === 'unread' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Chưa đọc
            {unreadCount > 0 && (
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === 'unread' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {unreadCount}
              </span>
            )}
            {activeTab === 'unread' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-t-full" />}
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2">
          {displayed.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <h3 className="text-sm font-black text-gray-900">Không có thông báo</h3>
              <p className="text-[12px] font-medium text-gray-500 mt-1">Bạn đã xem hết tất cả thông báo hiện có.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {displayed.map((notif) => {
                const isUnread = notif.isRead === false || notif.read === false || notif.status === 'UNREAD';
                return (
                <div 
                  key={notif.id || notif._id}
                  className={`flex items-start gap-4 p-4 rounded-2xl transition-all group hover:bg-gray-50 cursor-pointer ${
                    isUnread ? 'bg-blue-50/30' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notif)}
                >
                  {getNotifIcon(notif)}

                  <div className="flex-1 pt-1">
                    <p className={`text-sm leading-relaxed ${isUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {notif.message}
                    </p>
                    <span className={`text-[11px] font-bold uppercase tracking-widest mt-2 block ${isUnread ? 'text-blue-600' : 'text-gray-400'}`}>
                      {formatTime(notif.createdAt || notif.timestamp)}
                    </span>
                  </div>

                  {isUnread ? (
                    <div className="w-3 h-3 rounded-full bg-blue-500 mt-2 shadow-sm shadow-blue-200" />
                  ) : (
                    <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 mt-0.5">
                      <IconMore />
                    </button>
                  )}
                </div>
              )})}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminNotificationPage;
