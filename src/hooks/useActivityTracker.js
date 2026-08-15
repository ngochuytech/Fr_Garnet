import { useEffect, useRef, useCallback } from 'react';
import { postActivities } from '../services/activityService';

export const useActivityTracker = (flushIntervalMs = 10000) => {
  // Lưu dưới dạng chuỗi: "postId:::eventType"
  const pendingActivities = useRef(new Set());
  const timerRef = useRef(null);

  const flush = useCallback(async () => {
    if (pendingActivities.current.size > 0) {
      const activities = Array.from(pendingActivities.current).map(key => {
        const [postId, eventType] = key.split(':::');
        return { postId, eventType };
      });
      pendingActivities.current.clear();
      
      // Gửi batch
      await postActivities(activities);
    }
  }, []);

  useEffect(() => {
    // Flush định kỳ
    timerRef.current = setInterval(flush, flushIntervalMs);

    // Flush khi đóng tab/chuyển trang
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flush();
      }
    };
    
    // Sử dụng pagehide thay cho unload
    const handlePageHide = () => {
        flush();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      flush(); // Flush một lần cuối khi unmount component
    };
  }, [flush, flushIntervalMs]);

  const trackEvent = useCallback((postId, eventType) => {
    if (!postId || !eventType) return;
    pendingActivities.current.add(`${postId}:::${eventType}`);
  }, []);

  return { trackEvent };
};
