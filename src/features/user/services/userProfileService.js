import { apiFetch } from '../../../utils/api';

export const fetchPostsByUser = (userId, page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    return apiFetch(`/users/posts/by-user/${userId}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`, {
        method: 'GET',
    });
};