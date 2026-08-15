import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GROUP_NOTIFICATION_TYPES = new Set([
  'GROUP_JOIN_REQUEST',
  'GROUP_JOIN_APPROVED',
  'GROUP_NAME_UPDATED',
  'GROUP_LOCKED',
  'GROUP_UNLOCKED',
  'GROUP_JOIN_REJECTED',
]);

const getGroupId = (notif) => (
  notif.targetId
);

const NotificationList = ({
  notifications = [],
  loading = false,
  wsConnected = false,
  onMarkAllRead,
  onMarkAsRead,
}) => {
  const navigate = useNavigate();
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await onMarkAsRead?.(notif);
    }

    const target = getNotificationTarget(notif);
    if (target?.type === 'group') {
      navigate(target.path);
      return;
    }

    setSelectedNotification(notif);
  };

  const getNotificationTarget = (notif) => {
    if (GROUP_NOTIFICATION_TYPES.has(notif.type)) {
      const groupId = getGroupId(notif);

      if (groupId) {
        return {
          type: 'group',
          label: 'Xem nhóm',
          path: `/spaces/${groupId}`,
        };
      }
    }

    const postId = notif.postId || notif.targetId;

    if (postId && notif.type === 'POST') {
      return {
        type: 'post',
        label: 'Xem bài viết',
        path: `/post/${postId}`,
      };
    }

    const userId = notif.actor?.id || notif.sender?.id || notif.actorId || notif.senderId;
    if (notif.type === 'NEW_FOLLOWER' && userId) {
      return {
        type: 'user',
        label: 'Xem hồ sơ',
        path: `/user/${userId}`,
      };
    }

    return null;
  };

  const getIconUrl = (notif) => {
    if (notif.sender?.avatarUrl) return notif.sender.avatarUrl;
    if (notif.sender?.avatar) return notif.sender.avatar;
    if (notif.sender?.profilePicture) return notif.sender.profilePicture;
    const name = notif.sender?.fullName || notif.sender?.name || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=D8B4E2&color=fff&size=128&rounded=true`;
  };

  const getNotificationTitle = (notif) => {
    const senderName = notif.sender?.fullName || notif.sender?.name || 'Một người dùng';
    switch (notif.type) {
      case 'LIKE_POST': return `${senderName} đã thích bài viết của bạn`;
      case 'LIKE_COMMENT': return `${senderName} đã thích bình luận của bạn`;
      case 'COMMENT_POST': return `${senderName} đã bình luận về bài viết của bạn`;
      case 'REPLY_COMMENT': return `${senderName} đã trả lời bình luận của bạn`;
      case 'SHARE_POST': return `${senderName} đã chia sẻ bài viết của bạn`;
      case 'NEW_FOLLOWER': return `${senderName} đã bắt đầu theo dõi bạn`;
      case 'REPORT_RESOLVED': return 'Báo cáo của bạn đã được giải quyết';
      case 'SYSTEM_ALERT': return 'Thông báo hệ thống Garnet';
      case 'GROUP_JOIN_REQUEST': return `${senderName} đã yêu cầu tham gia nhóm`;
      case 'GROUP_JOIN_APPROVED': return 'Yêu cầu tham gia nhóm của bạn đã được duyệt';
      case 'GROUP_NAME_UPDATED': return 'Tên nhóm đã được cập nhật';
      case 'GROUP_LOCKED': return 'Nhóm đã bị khóa';
      case 'GROUP_UNLOCKED': return 'Nhóm đã được mở khóa';
      default: return notif.title || notif.message || 'Thông báo mới';
    }
  };

  const getNotificationBody = (notif) => (
    notif.content ||
    notif.message ||
    notif.body ||
    notif.description ||
    'Không có nội dung chi tiết.'
  );

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

  if (loading) {
    return (
      <main className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full flex-1 p-6 flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-[#8d3f41] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const selectedTarget = selectedNotification
    ? getNotificationTarget(selectedNotification)
    : null;

  return (
    <>
      <main className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full flex-1">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-800">Thông báo</h2>
            <span
              title={wsConnected ? 'Đang kết nối realtime' : 'Chưa kết nối realtime'}
              className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${wsConnected ? 'bg-green-400' : 'bg-gray-300'
                }`}
            />
          </div>
          <div className="flex items-center gap-2 text-[13px] text-gray-500">
            <button
              onClick={onMarkAllRead}
              className="hover:underline transition-colors hover:text-[#8d3f41]"
            >
              Đánh dấu tất cả đã đọc
            </button>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              Không có thông báo nào.
            </div>
          ) : (
            notifications.map((notif) => {
              const id = notif.id || notif._id;
              const isUnread =
                notif.isRead === false ||
                notif.read === false ||
                notif.status === 'UNREAD';

              return (
                <div
                  key={id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors relative group ${isUnread ? 'bg-[#fdfbfb]' : ''
                    }`}
                >
                  {isUnread && (
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#8d3f41]" />
                  )}

                  <div className="flex-shrink-0 w-8 h-8 mt-1 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={notif.actor?.avatarUrl || getIconUrl(notif)}
                      alt="icon"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex flex-col">
                      <span className="text-[13px] text-gray-500 mb-1 leading-tight flex items-center flex-wrap gap-1">
                        <span>Garnet</span>
                        <span className="inline-block px-1">·</span>
                        <span>{formatTime(notif.createdAt)}</span>
                      </span>
                      <span className="text-[15px] font-bold text-gray-900 leading-snug">
                        {getNotificationTitle(notif)}
                      </span>
                      {(notif.message || notif.content) && (
                        <span className="text-[14px] text-gray-700 mt-0.5 leading-snug break-words line-clamp-2">
                          {notif.message || notif.content}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="absolute right-4 top-4 text-gray-400 group-hover:text-gray-700 transition-colors opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isUnread) onMarkAsRead?.(notif);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"
                      title={isUnread ? 'Đánh dấu đã đọc' : ''}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="19" cy="12" r="1.5" />
                        <circle cx="5" cy="12" r="1.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {selectedNotification && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setSelectedNotification(null)}
        >
          <div
            className="w-full max-w-[520px] rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 p-5 border-b border-gray-100">
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-gray-500">
                  Garnet · {formatTime(selectedNotification.createdAt)}
                </p>
                <h3 className="text-lg font-bold text-gray-900 mt-1 leading-snug">
                  {getNotificationTitle(selectedNotification)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 flex-shrink-0"
                aria-label="Đóng"
              >
                X
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line break-words">
                {getNotificationBody(selectedNotification)}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setSelectedNotification(null)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Đóng
              </button>
              {selectedTarget && (
                <button
                  onClick={() => {
                    setSelectedNotification(null);
                    navigate(selectedTarget.path);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#8d3f41] text-white hover:bg-[#6a2f30] transition-colors"
                >
                  {selectedTarget.label}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationList;
