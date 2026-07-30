import { useEffect, useRef } from 'react';
import { useWebSocket } from '../../../context/WebSocketContext';
import { toast } from 'sonner';

const GROUP_NOTIFICATION_TYPES = new Set([
  'GROUP_JOIN_REQUEST',
  'GROUP_JOIN_APPROVED',
  'GROUP_NAME_UPDATED',
  'GROUP_LOCKED',
  'GROUP_UNLOCKED',
  'GROUP_JOIN_REJECTED'
]);

const getGroupId = (notification) => (
  notification.targetId
);

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

const useNotificationSocket = (setUnreadCount) => {
  const { isConnected, subscribeToNotifications } = useWebSocket();

  useEffect(() => {
    if (!isConnected)
      return;

    const subscription = subscribeToNotifications((newNotif) => {
      try {
        const notifId = newNotif.id;
        console.info(`[WS Global] Notification mới (${notifId}):`, newNotif);

        dispatchNewNotification(newNotif);

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
              if (GROUP_NOTIFICATION_TYPES.has(newNotif.type)) {
                const groupId = getGroupId(newNotif);
                window.location.href = groupId ? `/spaces/${groupId}` : '/notifications';
                return;
              }

              const postId = newNotif.postId || newNotif.targetId;
              if (postId && newNotif.type !== 'NEW_FOLLOWER') {
                window.location.href = `/post/${postId}`;
              } else if (newNotif.type === 'NEW_FOLLOWER' && newNotif.actor) {
                window.location.href = `/user/${newNotif.actor.id}`;
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

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isConnected, subscribeToNotifications, setUnreadCount]);
};

export default useNotificationSocket;
