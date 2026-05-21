import { useState, useEffect, useCallback } from 'react';
import {
  getNotifications,
  getNotificationsByType,
  markAsRead,
  markAllAsRead,
} from '../services/NotificationService';
import { dispatchUnreadChange } from './useNotificationSocket';

/**
 * useNotifications
 *
 * Bước 1 – fetchNotifications(): gọi REST API lấy danh sách cũ
 * Bước 2 – lắng nghe event 'new-notification' từ global socket để cập nhật list
 */
const useNotifications = (activeFilter) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ─── Bước 1: Fetch REST API ───────────
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      let data = [];

      if (activeFilter === 'all') {
        const response = await getNotifications();
        data = response?.items || [];
      } else {
        let typesToFetch = [];
        switch (activeFilter) {
          case 'posts': typesToFetch = ['SHARE_POST']; break;
          case 'comments': typesToFetch = ['COMMENT_POST', 'REPLY_COMMENT']; break;
          case 'upvotes': typesToFetch = ['LIKE_POST', 'LIKE_COMMENT']; break;
          case 'profile': typesToFetch = ['NEW_FOLLOWER']; break;
          case 'systems': typesToFetch = ['SYSTEM_ALERT', 'REPORT_RESOLVED']; break;
          default: typesToFetch = [];
        }

        if (typesToFetch.length > 0) {
          const results = await Promise.all(
            typesToFetch.map((type) => getNotificationsByType(type))
          );
          data = results.reduce((acc, curr) => {
            const items = curr?.items || curr || [];
            return [...acc, ...(Array.isArray(items) ? items : [])];
          }, []);
          data.sort(
            (a, b) =>
              new Date(b.createdAt || b.timestamp) -
              new Date(a.createdAt || a.timestamp)
          );
        } else {
          const response = await getNotifications();
          data = response?.items || response || [];
        }
      }

      setNotifications(data);

      // Đếm unread từ danh sách vừa fetch
      const unread = data.filter(
        (n) => n.isRead === false || n.read === false || n.status === 'UNREAD'
      ).length;
      setUnreadCount(unread);
      dispatchUnreadChange(unread);
    } catch (error) {
      console.error('[Notification] Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  // ─── Bước 1 → ngay khi mount / filter đổi ────────────────────────────────
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ─── Bước 2 → Lắng nghe Notification mới từ Global Socket ────────────────
  useEffect(() => {
    const handleNewNotification = (e) => {
      const newNotif = e.detail.notification;
      const newId = newNotif.id;
      
      setNotifications((prev) => {
        // Kiểm tra tránh trùng lặp thông báo đã có trong danh sách
        if (prev.some(n => (n.id || n._id) === newId)) {
          return prev;
        }
        return [newNotif, ...prev];
      });
    };
    
    window.addEventListener('new-notification', handleNewNotification);
    return () => window.removeEventListener('new-notification', handleNewNotification);
  }, []);

  // ─── Actions ─────────────────────────────────────────────────────────────
  const handleMarkAsRead = useCallback(async (notif) => {
    const notifId = notif.id || notif._id;
    if (!notifId) {
      console.warn('[Notification] Không tìm thấy id của thông báo:', notif);
      return;
    }
    // isRead: true  → đã đọc rồi, bỏ qua
    // isRead: false hoặc undefined → chưa đọc, tiếp tục
    if (notif.isRead === true) return;
    try {
      console.log('[Notification] Marking as read:', notifId);
      await markAsRead(notifId);
      setNotifications((prev) =>
        prev.map((n) =>
          (n.id || n._id) === notifId ? { ...n, isRead: true, read: true, status: 'READ' } : n
        )
      );
      setUnreadCount((prev) => {
        const next = Math.max(0, prev - 1);
        dispatchUnreadChange(next);
        return next;
      });
    } catch (error) {
      console.error('[Notification] Error marking as read:', error);
    }
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, read: true, status: 'READ' }))
      );
      setUnreadCount(0);
      dispatchUnreadChange(0);
    } catch (error) {
      console.error('[Notification] Error marking all as read:', error);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    wsConnected: true, // we assume it's true as global socket handles it
    handleMarkAsRead,
    handleMarkAllRead,
    refetch: fetchNotifications,
  };
};

export default useNotifications;
