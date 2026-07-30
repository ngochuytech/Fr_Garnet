import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getChatHistory, markAsRead, sendMessageHttp } from '../services/chatService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

/**
 * ChatBox.jsx
 * Phần cửa sổ chat bên phải.
 * Props:
 *   - conversation: object | null
 *   - newMessageEvent: object | null — tin nhắn đến từ WS
 *   - readReceiptEvent: string | null — userId của người vừa xem tin nhắn
 *   - onReadSent: () => void — callback sau khi gửi mark-as-read
 *   - onMessageSent: (msg) => void — callback sau khi gửi tin nhắn thành công
 */
const ChatBox = ({ conversation, newMessageEvent, readReceiptEvent, onReadSent, onMessageSent }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isSendingRef = useRef(false);

  const otherUser = conversation?.otherUser;
  const displayName = otherUser?.fullName || otherUser?.fullname || 'Người dùng';
  const avatarUrl =
    otherUser?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=dfb9b9&color=6a2f30&size=128`;

  // Load history mỗi khi conversation thay đổi
  useEffect(() => {
    if (!conversation?.otherUser?.id) return;

    const loadHistory = async () => {
      setIsLoading(true);
      setMessages([]);
      try {
        const data = await getChatHistory(conversation.otherUser.id);
        const list = data?.content || [];
        setMessages([...list].reverse());
        await markAsRead(conversation.otherUser.id);
        onReadSent?.();
        window.dispatchEvent(new CustomEvent('chat-read'));
      } catch (err) {
        console.error('[ChatBox] Lỗi tải lịch sử:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [conversation?.otherUser?.id]);

  // Nhận tin nhắn mới qua WebSocket
  useEffect(() => {
    if (!newMessageEvent) return;
    const senderId = newMessageEvent.senderId || newMessageEvent.sender?.id;
    const receiverId = newMessageEvent.receiver?.id;
    
    const isRelevant = 
      (senderId === conversation?.otherUser?.id && receiverId === user?.id) || 
      (senderId === user?.id && receiverId === conversation?.otherUser?.id);

    if (isRelevant) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMessageEvent.id)) return prev;
        return [...prev, newMessageEvent];
      });
      
      // Đánh dấu đã đọc nếu người khác gửi cho mình
      if (senderId === conversation?.otherUser?.id) {
        markAsRead(conversation.otherUser.id).then(() => {
          onReadSent?.();
          window.dispatchEvent(new CustomEvent('chat-read'));
        });
      }
    }
  }, [newMessageEvent]);

  // Xử lý sự kiện đối phương đã xem tin nhắn
  useEffect(() => {
    if (!readReceiptEvent) return;
    if (readReceiptEvent === conversation?.otherUser?.id) {
      setMessages((prev) => 
        prev.map((msg) => ({ ...msg, isRead: true, read: true }))
      );
    }
  }, [readReceiptEvent]);

  const handleSend = useCallback(
    async (content) => {
      if (!otherUser?.id || isSendingRef.current) return;
      isSendingRef.current = true;

      // Optimistic update — hiển thị tin ngay lập tức
      const optimisticMsg = {
        id: `temp_${Date.now()}`,
        content,
        senderId: user?.id,
        sender: { id: user?.id, fullName: user?.fullname, avatarUrl: user?.avatarUrl },
        receiver: { id: otherUser.id, fullName: otherUser.fullName || otherUser.fullname, avatarUrl: otherUser.avatarUrl },
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      setMessages((prev) => [...prev, optimisticMsg]);

      try {
        await sendMessageHttp(otherUser.id, content);
        if (onMessageSent) {
          onMessageSent(optimisticMsg);
        }
      } catch (err) {
        console.error('[ChatBox] Lỗi gửi tin:', err);
        // Rollback nếu thất bại
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      } finally {
        isSendingRef.current = false;
      }
    },
    [otherUser?.id, user]
  );

  // State rỗng: chưa chọn conversation
  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center bg-gray-50/50 px-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'var(--color-dusty-rose-100)' }}
        >
          <svg className="w-10 h-10" style={{ color: 'var(--color-dusty-rose-400)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Chọn một cuộc trò chuyện</h3>
        <p className="text-sm text-gray-400">Chọn từ danh sách bên trái để bắt đầu nhắn tin.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white">
      {/* Header của ChatBox */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] flex-shrink-0">
        <button
          onClick={() => navigate(`/user/${otherUser?.id}`)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-9 h-9 rounded-full object-cover border border-gray-100"
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900 leading-tight">{displayName}</p>
          </div>
        </button>
      </div>

      {/* Message List */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
      />

      {/* Input */}
      <MessageInput onSend={handleSend} disabled={!otherUser?.id} />
    </div>
  );
};

export default ChatBox;
