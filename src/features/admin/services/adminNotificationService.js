import { apiFetch } from "../../../utils/api";

export const getAdminNotifications = async () => {
    return apiFetch('/users/notifications/me', {
        method: 'GET',
    });
};

export const getAdminUnreadCount = async () => {
    return apiFetch('/users/notifications/me/unread-count', {
        method: 'GET',
    });
};

export const getAdminNotificationsByType = async (type) => {
    return apiFetch(`/users/notifications/me/type/${type}`, {
        method: 'GET',
    });
};

export const markAdminAsRead = async (notificationId) => {
    return apiFetch(`/users/notifications/me/${notificationId}/mark-read`, {
        method: 'PUT',
    });
};

export const markAdminAllAsRead = async () => {
    return apiFetch(`/users/notifications/me/mark-all-read`, {
        method: 'PUT',
    });
};
