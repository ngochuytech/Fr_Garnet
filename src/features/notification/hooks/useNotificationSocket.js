import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'sonner';

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const WS_URL = import.meta.env.VITE_WS_URL;

export const dispatchUnreadChange = (count) => {
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('unread-count-changed', { detail: { count } }));
  }, 0);
};

export const dispatchNewNotification = (notification) => {
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('new-notification', { detail: { notification } }));
  }, 0);
};

const useNotificationSocket = (user, setUnreadCount) => {
  const stompClientRef = useRef(null);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    if (isConnectedRef.current) return;

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      debug: (msg) => console.debug('[STOMP Global]', msg),
      onConnect: () => {
        isConnectedRef.current = true;
        console.info('[WS Global] Đã kết nối STOMP ✓');

        client.subscribe('/user/queue/notifications', (stompMessage) => {
          try {
            const newNotif = JSON.parse(stompMessage.body);
            const notifId = newNotif.id;
            console.info(`[WS Global] Notification mới (${notifId}):`, newNotif);

            // Dispatch global event cho NotificationView
            dispatchNewNotification(newNotif);

            // Cập nhật unread count ở Header
            const isUnread =
              newNotif.isRead === false ||
              newNotif.read === false ||
              newNotif.status === 'UNREAD' ||
              newNotif.isRead === undefined;

            if (isUnread) {
              setUnreadCount((prev) => prev + 1);
            }

            // Hiển thị toast thông báo cho người dùng
            toast('Thông báo mới', {
              description: newNotif.content || newNotif.message || 'Bạn có một thông báo mới.',
              action: {
                label: 'Xem',
                onClick: () => {
                  const postId = newNotif.postId || newNotif.targetId;
                  if (postId && newNotif.type !== 'NEW_FOLLOWER') {
                    window.location.href = `/post/${postId}`;
                  } else if (newNotif.type === 'NEW_FOLLOWER' && newNotif.sender) {
                    window.location.href = `/user/${newNotif.sender.id || newNotif.sender._id}`;
                  } else {
                    window.location.href = '/notifications';
                  }
                }
              }
            });

          } catch (err) {
            console.error('[WS Global] Lỗi parse message:', err);
          }
        });
      },
      onDisconnect: () => {
        isConnectedRef.current = false;
        console.info('[WS Global] Đã ngắt kết nối STOMP.');
      },
      onStompError: (frame) => {
        console.error('[WS Global] STOMP error:', frame.headers['message'], frame.body);
      },
      onWebSocketError: (evt) => {
        console.error('[WS Global] WebSocket error:', evt);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current?.active) {
        stompClientRef.current.deactivate();
      }
      isConnectedRef.current = false;
    };
  }, [user, setUnreadCount]);
};

export default useNotificationSocket;
