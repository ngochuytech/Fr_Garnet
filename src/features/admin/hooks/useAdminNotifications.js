import { useState, useEffect, useCallback } from 'react';
import {
  getAdminNotifications,
  getAdminNotificationsByType,
  markAdminAsRead,
  markAdminAllAsRead,
} from '../services/adminNotificationService';
import { dispatchAdminUnreadChange } from './useAdminNotificationSocket';

const useAdminNotifications = (activeFilter = 'all') => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      let data = [];

      if (activeFilter === 'all') {
        const response = await getAdminNotifications();
        data = response?.items || response || [];
      } else {
        // Logic for specific filters if needed
        const response = await getAdminNotifications();
        data = response?.items || response || [];
      }

      setNotifications(data);

      const unread = data.filter(
        (n) => n.isRead === false || n.read === false || n.status === 'UNREAD'
      ).length;
      setUnreadCount(unread);
      dispatchAdminUnreadChange(unread);
    } catch (error) {
      console.error('[AdminNotification] Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handleNewNotification = (e) => {
      const newNotif = e.detail.notification;
      setNotifications((prev) => {
        if (prev.some(n => (n.id || n._id) === newNotif.id)) return prev;
        return [newNotif, ...prev];
      });
    };
    
    window.addEventListener('admin-new-notification', handleNewNotification);
    return () => window.removeEventListener('admin-new-notification', handleNewNotification);
  }, []);

  const handleMarkAsRead = useCallback(async (notif) => {
    const notifId = notif.id || notif._id;
    if (!notifId || notif.isRead === true) return;

    try {
      await markAdminAsRead(notifId);
      setNotifications((prev) =>
        prev.map((n) =>
          (n.id || n._id) === notifId ? { ...n, isRead: true, read: true, status: 'READ' } : n
        )
      );
      setUnreadCount((prev) => {
        const next = Math.max(0, prev - 1);
        dispatchAdminUnreadChange(next);
        return next;
      });
    } catch (error) {
      console.error('[AdminNotification] Error marking as read:', error);
    }
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    try {
      await markAdminAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, read: true, status: 'READ' })));
      setUnreadCount(0);
      dispatchAdminUnreadChange(0);
    } catch (error) {
      console.error('[AdminNotification] Error marking all as read:', error);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    handleMarkAsRead,
    handleMarkAllRead,
    refetch: fetchNotifications,
  };
};

export default useAdminNotifications;
