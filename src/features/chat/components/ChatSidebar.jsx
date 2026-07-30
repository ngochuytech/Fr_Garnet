import { useState, useEffect, useRef } from 'react';
import { getConversations } from '../services/chatService';
import ConversationItem from './ConversationItem';

/**
 * ChatSidebar.jsx
 * Cột trái hiển thị danh sách các cuộc trò chuyện.
 * Props:
 *   - activeConversationId: id của cuộc trò chuyện đang mở
 *   - onSelectConversation: (conversation) => void
 *   - newMessageEvent: object | null — khi nhận tin nhắn mới qua WS, cập nhật sidebar
 */
const ChatSidebar = ({ activeConversationId, onSelectConversation, newMessageEvent }) => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeConvRef = useRef(activeConversationId);
  useEffect(() => {
    activeConvRef.current = activeConversationId;
  }, [activeConversationId]);

  const fetchConversations = async () => {
    try {
      const data = await getConversations();
      const rawList = data?.data || data?.content || data || [];
      
      const mappedList = rawList.map((c) => ({
        id: c.id,
        otherUser: {
          id: c.user?.id,
          fullName: c.user?.name,
          avatarUrl: c.user?.avatar,
        },
        lastMessage: c.lastMessage,
        updatedAt: c.lastTimeMessage,
        unreadCount: c.isRead ? 0 : 1, // Tạm coi isRead=false là có 1 tin chưa đọc
      }));
      
      setConversations(mappedList);
    } catch (err) {
      console.error('[ChatSidebar] Không tải được danh sách chat:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Xóa badge unread khi click vào một cuộc trò chuyện
  useEffect(() => {
    if (activeConversationId) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId || c.otherUser?.id === activeConversationId
            ? { ...c, unreadCount: 0 }
            : c
        )
      );
    }
  }, [activeConversationId]);

  // Khi nhận tin nhắn mới qua WS → cập nhật conversation tương ứng lên đầu
  useEffect(() => {
    if (!newMessageEvent) return;
    console.log('[ChatSidebar] Nhận tin nhắn mới:', newMessageEvent);
    setConversations((prev) => {
      const senderId = newMessageEvent.senderId || newMessageEvent.sender?.id;
      const receiverId = newMessageEvent.receiver?.id;
      const existing = prev.find(
        (c) => c.otherUser?.id === senderId || c.otherUser?.id === receiverId || c.id === newMessageEvent.conversationId
      );
      console.log('[ChatSidebar] Tìm thấy existing:', existing);
      if (existing) {
        const updated = {
          ...existing,
          lastMessage: newMessageEvent.content,
          updatedAt: newMessageEvent.createdAt || new Date().toISOString(),
          unreadCount:
            existing.id === activeConvRef.current
              ? 0
              : (existing.unreadCount || 0) + 1,
        };
        console.log('[ChatSidebar] Cập nhật existing:', updated);
        return [updated, ...prev.filter((c) => c.id !== existing.id)];
      }
      console.log('[ChatSidebar] Cuộc trò chuyện mới, fetch lại danh sách');
      fetchConversations();
      return prev;
    });
  }, [newMessageEvent]);

  const filtered = conversations.filter((c) => {
    const name = (c.otherUser?.fullName || c.otherUser?.fullname || '').toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <aside className="w-[300px] flex-shrink-0 border-r border-gray-100 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-gray-100">
        <h2
          className="text-xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-dusty-rose-700)' }}
        >
          Tin nhắn
        </h2>
        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-200 focus-within:border-[#8d3f41] transition-colors">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm"
            className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto py-2 px-2 hide-scrollbar">
        {isLoading ? (
          // Skeleton loading
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
              <div className="w-11 h-11 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-2.5 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm text-gray-400">
              {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có cuộc trò chuyện nào'}
            </p>
          </div>
        ) : (
          filtered.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={activeConversationId === conv.id}
              onClick={() => onSelectConversation(conv)}
            />
          ))
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
