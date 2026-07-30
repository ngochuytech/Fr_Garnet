/**
 * ConversationItem.jsx
 * Hiển thị một mục trong danh sách cuộc trò chuyện (Sidebar).
 * Props:
 *   - conversation: { id, otherUser: { id, fullName, avatarUrl }, lastMessage, unreadCount, updatedAt }
 *   - isActive: boolean
 *   - onClick: () => void
 */
const ConversationItem = ({ conversation, isActive, onClick }) => {
  const { otherUser, lastMessage, unreadCount, updatedAt } = conversation;

  const displayName = otherUser?.fullName || otherUser?.fullname || 'Người dùng';
  const avatarUrl =
    otherUser?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=dfb9b9&color=6a2f30&size=128`;

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ`;
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const hasUnread = unreadCount > 0;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
        isActive
          ? 'bg-[#f7edee]'
          : 'hover:bg-gray-50'
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-11 h-11 rounded-full object-cover border border-gray-100"
        />
        {/* Online indicator - placeholder */}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span
            className={`text-sm truncate ${
              hasUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'
            }`}
          >
            {displayName}
          </span>
          <span className="text-[11px] text-gray-400 flex-shrink-0 ml-1">
            {formatTime(updatedAt)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p
            className={`text-xs truncate max-w-[160px] ${
              hasUnread ? 'font-medium text-gray-700' : 'text-gray-500'
            }`}
          >
            {lastMessage || 'Chưa có tin nhắn'}
          </p>
          {hasUnread && (
            <span
              className="flex-shrink-0 ml-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ backgroundColor: 'var(--color-dusty-rose-500)' }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
