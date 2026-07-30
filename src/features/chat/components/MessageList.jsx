import { useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';

/**
 * MessageList.jsx
 * Render danh sách tin nhắn trong cửa sổ chat.
 * Props:
 *   - messages: Message[]
 *   - isLoading: boolean
 *   - lastReadSenderId: string | null — ID người cuối cùng đọc (để hiển thị "Đã xem")
 */
const MessageList = ({ messages, isLoading, lastReadSenderId }) => {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const bottomRef = useRef(null);

  // Auto scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`flex animate-pulse ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
          >
            {i % 2 !== 0 && <div className="w-7 h-7 rounded-full bg-gray-200 mr-2 flex-shrink-0" />}
            <div
              className={`h-9 rounded-2xl bg-gray-200 ${
                i % 2 === 0 ? 'w-40' : 'w-52'
              }`}
            />
          </div>
        ))}
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 px-6">
        <svg className="w-14 h-14 mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <p className="text-sm font-medium text-gray-500">Hãy bắt đầu cuộc trò chuyện!</p>
        <p className="text-xs text-gray-400 mt-1">Gửi tin nhắn đầu tiên để kết nối.</p>
      </div>
    );
  }

  // Tìm index của tin nhắn cuối cùng do mình gửi
  let lastSentByMeIndex = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    const senderId = messages[i].senderId || messages[i].sender?.id;
    if (senderId === currentUserId) {
      lastSentByMeIndex = i;
      break;
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1 hide-scrollbar">
      {messages.map((msg, index) => {
        const senderId = msg.senderId || msg.sender?.id;
        const isMine = senderId === currentUserId;
        const isLastSentByMe = index === lastSentByMeIndex;
        const isRead = msg.isRead || msg.read;

        return (
          <div
            key={msg.id || index}
            className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
          >
            {/* Avatar đối phương */}
            {!isMine && (
              <img
                src={
                  msg.sender?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender?.name || 'User')}&background=dfb9b9&color=6a2f30&size=64`
                }
                alt="avatar"
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-1"
              />
            )}

            <div className={`flex flex-col max-w-[65%] ${isMine ? 'items-end' : 'items-start'}`}>
              {/* Bubble */}
              <div
                className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed break-words shadow-sm ${
                  isMine
                    ? 'rounded-br-sm text-white'
                    : 'rounded-bl-sm bg-gray-100 text-gray-800'
                }`}
                style={isMine ? { backgroundColor: 'var(--color-dusty-rose-600)' } : {}}
              >
                {msg.content}
              </div>

              {/* Timestamp + Read receipt */}
              <div className={`flex items-center gap-1 mt-0.5 ${isMine ? 'flex-row-reverse' : ''}`}>
                <span className="text-[10px] text-gray-400">{formatTime(msg.createdAt)}</span>
                {/* Hiển thị "Đã xem" chỉ ở tin nhắn cuối do mình gửi */}
                {isMine && isLastSentByMe && (
                  <span
                    className={`text-[10px] font-medium ${
                      isRead ? 'text-[#8d3f41]' : 'text-gray-400'
                    }`}
                  >
                    {isRead ? '✓✓ Đã xem' : '✓ Đã gửi'}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {/* Dummy div để scroll to bottom */}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
