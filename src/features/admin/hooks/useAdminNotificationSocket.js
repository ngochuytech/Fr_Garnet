import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const WS_URL = import.meta.env.VITE_WS_URL;

export const dispatchAdminUnreadChange = (count) => {
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('admin-unread-count-changed', { detail: { count } }));
  }, 0);
};

export const dispatchAdminNewNotification = (notification) => {
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('admin-new-notification', { detail: { notification } }));
  }, 0);
};

const useAdminNotificationSocket = (user, setUnreadCount) => {
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
      onConnect: () => {
        isConnectedRef.current = true;
        console.log('[AdminSocket] Connected');

        // Subscribe to admin-specific or user notifications
        client.subscribe(`/user/queue/notifications`, (message) => {
          const notification = JSON.parse(message.body);
          console.log('[AdminSocket] New Notification:', notification);
          
          dispatchAdminNewNotification(notification);
          
          // Optionally increment unread count locally if we don't want to refetch
          setUnreadCount(prev => {
            const next = prev + 1;
            dispatchAdminUnreadChange(next);
            return next;
          });
        });
      },
      onDisconnect: () => {
        isConnectedRef.current = false;
        console.log('[AdminSocket] Disconnected');
      },
      onStompError: (frame) => {
        console.error('[AdminSocket] Broker error: ' + frame.headers['message']);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        isConnectedRef.current = false;
      }
    };
  }, [user, setUnreadCount]);

  return { wsConnected: isConnectedRef.current };
};

export default useAdminNotificationSocket;
