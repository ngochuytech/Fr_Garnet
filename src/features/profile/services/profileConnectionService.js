import { apiFetch } from '../../../utils/api';

export const fetchFollowers = (userId, page = 0, size = 20) => {
    return apiFetch(`/users/${userId}/followers?page=${page}&size=${size}`, {
        method: 'GET',
    });
};

export const fetchFollowing = (userId, page = 0, size = 20) => {
    return apiFetch(`/users/${userId}/following?page=${page}&size=${size}`, {
        method: 'GET',
    });
};