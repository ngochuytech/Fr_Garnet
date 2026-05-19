import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminNotifications from '../hooks/useAdminNotifications';

// ─── Helpers ─────────────────────────────────────────────────────────────────
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

// ─── Icon mapping by notification type ───────────────────────────────────────
const NotifIcon = ({ type }) => {
  if (type === 'SYSTEM_ALERT') {
    return (
      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
    );
  }
  if (type === 'REPORT_RESOLVED') {
    return (
      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
    );
  }
  if (type === 'NEW_FOLLOWER') {
    return (
      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      </div>
    );
  }
  // COMMENT_POST, LIKE_POST, etc. — dùng avatar actor nếu có
  return null;
};

// ─── Single Notification Item ─────────────────────────────────────────────────
const NotifItem = ({ notif, onMarkAsRead, onClick }) => {
  const isUnread = notif.isRead === false || notif.read === false || notif.status === 'UNREAD';
  const hasAvatarIcon = !['SYSTEM_ALERT', 'REPORT_RESOLVED', 'NEW_FOLLOWER'].includes(notif.type);
  const avatarUrl = notif.actor?.avatarUrl
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(notif.actor?.fullName || 'CH')}&background=D8B4E2&color=fff&size=128&rounded=true`;

  return (
    <div
      onClick={() => onClick(notif)}
      className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors relative group ${isUnread ? 'bg-blue-50/30' : ''}`}
    >
      {/* Unread dot */}
      {isUnread && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
      )}

      {/* Left icon */}
      {hasAvatarIcon ? (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
          <img src={avatarUrl} alt={notif.actor?.fullName} className="w-full h-full object-cover" />
        </div>
      ) : (
        <NotifIcon type={notif.type} />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-[13px] text-gray-800 leading-snug line-clamp-2">
          {notif.message}
        </p>
        <span className="text-[11px] text-gray-400 mt-0.5 block">{formatTime(notif.createdAt)}</span>
      </div>

      {/* Mark as read on hover */}
      {isUnread && (
        <button
          onClick={(e) => { e.stopPropagation(); onMarkAsRead(notif); }}
          title="Đánh dấu đã đọc"
          className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-200"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminNotificationPanel = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'
  
  const { notifications, unreadCount, handleMarkAsRead, handleMarkAllRead } = useAdminNotifications('all');

  const displayed = activeTab === 'unread' 
    ? notifications.filter((n) => n.isRead === false || n.read === false || n.status === 'UNREAD') 
    : notifications;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleItemClick = (notif) => {
    handleMarkAsRead(notif);
    onClose();
    if (notif.type === 'NEW_FOLLOWER' && notif.actor) {
      navigate(`/admin/users/${notif.actor.id || notif.actor._id}`);
    } else if (notif.targetType === 'POST' && notif.targetId) {
      navigate(`/admin/posts/${notif.targetId}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-[calc(100%+8px)] w-90 bg-white border border-gray-100 rounded-2xl shadow-lg shadow-gray-200 z-50 flex flex-col overflow-hidden"
      style={{ maxHeight: '480px' }}
    >
      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-gray-900 text-[15px] leading-none">
            Thông báo hệ thống
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold align-middle">
                {unreadCount}
              </span>
            )}
          </h2>
          <button
            onClick={handleMarkAllRead}
            className="text-[11px] font-semibold text-gray-400 hover:text-gray-900 transition-colors whitespace-nowrap"
          >
            Đánh dấu tất cả đã đọc
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg">
          {[{ key: 'all', label: 'Tất cả' }, { key: 'unread', label: 'Chưa đọc' }].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-1 text-[12px] font-bold rounded-md transition-all duration-200 ${
                activeTab === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Notification List ── */}
      <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <p className="text-[12px] text-gray-400 font-semibold">Không có thông báo nào</p>
          </div>
        ) : (
          displayed.map((notif) => (
            <NotifItem
              key={notif.id}
              notif={notif}
              onMarkAsRead={handleMarkAsRead}
              onClick={handleItemClick}
            />
          ))
        )}
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-gray-100 flex-shrink-0">
        <button
          onClick={() => { onClose(); navigate('/admin/notifications'); }}
          className="w-full py-3 text-[12px] font-bold text-gray-500 hover:text-gray-900 transition-colors text-center hover:bg-gray-50"
        >
          Xem toàn bộ thông báo →
        </button>
      </div>
    </div>
  );
};

export default AdminNotificationPanel;
