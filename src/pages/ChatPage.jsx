import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatSidebar from '../features/chat/components/ChatSidebar';
import ChatBox from '../features/chat/components/ChatBox';
import useChatSocket from '../features/chat/hooks/useChatSocket';

/**
 * ChatPage.jsx
 * Trang nhắn tin chính: Sidebar bên trái + ChatBox bên phải.
 * Route: /chat
 */
const ChatPage = () => {
  const location = useLocation();
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessageEvent, setNewMessageEvent] = useState(null);
  const [readReceiptEvent, setReadReceiptEvent] = useState(null);

  // Cold-start: Bắt user được truyền sang từ trang Profile
  useEffect(() => {
    const newChatUser = location.state?.newChatUser;
    if (newChatUser?.id) {
      setActiveConversation({
        id: `new_${newChatUser.id}`, // ID tạm — chưa có trong DB
        otherUser: newChatUser,
        lastMessage: '',
        unreadCount: 0,
      });
    }
  }, [location.state]);

  const handleNewMessage = useCallback((msg) => {
    setNewMessageEvent(msg);
  }, []);

  const handleReadReceipt = useCallback((readerId) => {
    setReadReceiptEvent(readerId);
  }, []);

  useChatSocket({ onNewMessage: handleNewMessage, onReadReceipt: handleReadReceipt });

  const handleSelectConversation = (conv) => {
    setActiveConversation(conv);
    setNewMessageEvent(null);
    setReadReceiptEvent(null);
  };

  return (
    <div className="w-full min-h-[calc(100svh-50px)] bg-[#faf7f7]">
      <div className="max-w-[1300px] mx-auto px-4 py-5 h-[calc(100svh-50px)]">
        {/* Chat container — giới hạn chiều rộng, 2 bên có khoảng trống như trang Home */}
        <div className="flex h-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
          <ChatSidebar
            activeConversationId={activeConversation?.id}
            onSelectConversation={handleSelectConversation}
            newMessageEvent={newMessageEvent}
          />
          <ChatBox
            conversation={activeConversation}
            newMessageEvent={newMessageEvent}
            readReceiptEvent={readReceiptEvent}
            onReadSent={() => {
              // Khi đánh dấu đã đọc, sidebar tự cập nhật badge về 0 thông qua newMessageEvent
            }}
            onMessageSent={handleNewMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
