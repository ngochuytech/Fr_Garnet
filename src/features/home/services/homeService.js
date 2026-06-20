import { apiFetch } from '../../../utils/api';

export const getHomePosts = async (size = 20, cursor = null) => {
    let url = `/users/posts?size=${size}`;
    if (cursor) {
        url += `&cursor=${cursor}`;
    }
    return apiFetch(url, {
        method: 'GET',
    });
};