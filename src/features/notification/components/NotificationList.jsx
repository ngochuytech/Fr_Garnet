import { useNavigate } from 'react-router-dom';

const NotificationList = ({
  notifications = [],
  loading = false,
  wsConnected = false,
  onMarkAllRead,
  onMarkAsRead,
}) => {
  const navigate = useNavigate();

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await onMarkAsRead?.(notif);
    }

    // Ưu tiên điều hướng theo postId nếu có (LIKE_POST, COMMENT_POST, etc.)
    const postId = notif.postId || notif.targetId;
    
    if (postId && notif.type !== 'NEW_FOLLOWER') {
      navigate(`/post/${postId}`);
    } else if (notif.type === 'NEW_FOLLOWER' && notif.actor) {
      navigate(`/user/${notif.actor.id}`);
    }
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
      case 'LIKE_POST':       return `${senderName} đã thích bài viết của bạn`;
      case 'LIKE_COMMENT':    return `${senderName} đã thích bình luận của bạn`;
      case 'COMMENT_POST':    return `${senderName} đã bình luận về bài viết của bạn`;
      case 'REPLY_COMMENT':   return `${senderName} đã trả lời bình luận của bạn`;
      case 'SHARE_POST':      return `${senderName} đã chia sẻ bài viết của bạn`;
      case 'NEW_FOLLOWER':    return `${senderName} đã bắt đầu theo dõi bạn`;
      case 'REPORT_RESOLVED': return `Báo cáo của bạn đã được giải quyết`;
      case 'SYSTEM_ALERT':    return `Thông báo hệ thống CampusHub`;
      default:                return notif.title || notif.message || 'Thông báo mới';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1)  return 'Vừa xong';
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 30)  return `${diffDays} ngày trước`;
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return '';
    }
  };

  // ── Loading state ──
  if (loading) {
    return (
      <main className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full flex-1 p-6 flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-[#8d3f41] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full flex-1">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-800">Thông báo</h2>
          {/* WS status indicator */}
          <span
            title={wsConnected ? 'Đang kết nối realtime' : 'Chưa kết nối realtime'}
            className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
              wsConnected ? 'bg-green-400' : 'bg-gray-300'
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

      {/* Notification Items */}
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
                className={`flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors relative group ${
                  isUnread ? 'bg-[#fdfbfb]' : ''
                }`}
              >
                {/* Unread dot */}
                {isUnread && (
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#8d3f41]" />
                )}

                {/* Avatar */}
                <div className="flex-shrink-0 w-8 h-8 mt-1 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={notif.actor?.avatarUrl || getIconUrl(notif)}
                    alt="icon"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex flex-col">
                    <span className="text-[13px] text-gray-500 mb-1 leading-tight flex items-center flex-wrap gap-1">
                      <span>CampusHub</span>
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

                {/* Mark-as-read button */}
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
  );
};

export default NotificationList;