import { apiFetch } from "../../../utils/api";

export const getConversations = () => apiFetch('/users/chat/conversations');

export const getChatHistory = (otherUserId, page = 0, size = 20) =>
  apiFetch(`/users/chat/history/${otherUserId}?page=${page}&size=${size}&sort=createdAt,desc`);

export const markAsRead = (otherUserId) =>
  apiFetch(`/users/chat/read/${otherUserId}`, { method: 'PUT' });

export const sendMessageHttp = (otherUserId, content) =>
  apiFetch(`/users/chat/send/${otherUserId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: content,
  });