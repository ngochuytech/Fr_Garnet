import { apiFetch } from "../../../utils/api";

export const getNotifications = async () => {
    return apiFetch('/users/notifications/me', {
        method: 'GET',
    })
}

export const getUnreadCount = async () => {
    return apiFetch('/users/notifications/me/unread-count', {
        method: 'GET',
    })
}

// Các type hợp lệ: 
    // LIKE_POST,
    // LIKE_COMMENT,
    // COMMENT_POST,
    // REPLY_COMMENT,
    // SHARE_POST,
    // NEW_FOLLOWER,
    // REPORT_RESOLVED, 
    // SYSTEM_ALERT 
export const getNotificationsByType = async (type) => {
    return apiFetch(`/users/notifications/me/type/${type}`, {
        method: 'GET',
    })
}

export const markAsRead = async (notificationId) => {
    return apiFetch(`/users/notifications/me/${notificationId}/mark-read`, {
        method: 'PUT',
    })
}

export const markAllAsRead = async () => {
    return apiFetch(`/users/notifications/me/mark-all-read`, {
        method: 'PUT',
    })
}