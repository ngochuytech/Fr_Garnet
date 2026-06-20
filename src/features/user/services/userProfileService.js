import { apiFetch } from '../../../utils/api';

export const fetchPostsByUser = (userId, size = 20, cursor = null) => {
    let url = `/users/posts/by-user/${userId}?size=${size}`;
    if (cursor) url += `&cursor=${encodeURIComponent(cursor)}`;
    return apiFetch(url, {
        method: 'GET',
    });
};

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