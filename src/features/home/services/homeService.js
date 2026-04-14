import { apiFetch } from '../../../utils/api';

export const getMyPosts = async () => {
    return apiFetch('/users/posts', {
        method: 'GET',
    });
};

export const getPostsForHome = async (page) => {
    return apiFetch(`/users/posts?page=${page}`, {
        method: 'GET',
    });
};