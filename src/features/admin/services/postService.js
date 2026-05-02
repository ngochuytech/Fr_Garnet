import { apiFetch } from "../../../utils/api";

/**
 * @param {string} query
 * @param {string} status - {ACTIVE, HIDDEN, REPORTED}
 * @param pageable {page: int, size: int, sortBy: string, sortDir: string}
 */
export const getPostsAPI = async (query = null, status = null, pageable) => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (status) params.set('status', status);
    if (pageable) {
        params.set('page', pageable.page);
        params.set('size', pageable.size);
        params.set('sortBy', pageable.sortBy);
        params.set('sortDir', pageable.sortDir);
    }
    return apiFetch(`/admin/posts?${params.toString()}`, {
        method: 'GET'
    });
}

export const getPostByIdAPI = async (postId) => {
    return apiFetch(`/admin/posts/${postId}`, {
        method: 'GET'
    });
};

export const getCommentByPostIdAPI = async (postId) => {
    return apiFetch(`/admin/posts/${postId}/comments`, {
        method: 'GET'
    });
}
