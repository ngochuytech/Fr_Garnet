import { useEffect, useRef } from 'react';
import { useWebSocket } from '../../../context/WebSocketContext';

/**
 * useChatSocket
 * Subscribe vào 2 kênh WebSocket liên quan tới chat:
 *  - /user/queue/messages   → Nhận tin nhắn đến
 *  - /user/queue/chat.read  → Nhận thông báo đối phương đã xem
 */
const useChatSocket = ({ onNewMessage, onReadReceipt }) => {
  const { isConnected, subscribeToChat, subscribeToReadReceipt } = useWebSocket();
  const msgSubRef = useRef(null);
  const readSubRef = useRef(null);

  // Subscribe tin nhắn mới
  useEffect(() => {
    if (!isConnected) return;
    msgSubRef.current = subscribeToChat((msg) => {
      if (onNewMessage) onNewMessage(msg);
    });
    return () => {
      msgSubRef.current?.unsubscribe();
    };
  }, [isConnected, subscribeToChat, onNewMessage]);

  // Subscribe sự kiện "đã xem"
  useEffect(() => {
    if (!isConnected) return;
    readSubRef.current = subscribeToReadReceipt((readerId) => {
      if (onReadReceipt) onReadReceipt(readerId);
    });
    return () => {
      readSubRef.current?.unsubscribe();
    };
  }, [isConnected, subscribeToReadReceipt, onReadReceipt]);

  return null;
};

export default useChatSocket;
