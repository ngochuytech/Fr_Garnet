import { apiFetch } from "../../../utils/api";

/**
 * @param {string} query
 * @param {string} status - {ACTIVE, INACTIVE, BANNED}
 * @param pageable {page: int, size: int, sortBy: string, sortDir: string}
 */
export const getUsersAPI = async (query = null, status = null, pageable) => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (status) params.set('status', status);
    if (pageable) {
        params.set('page', pageable.page);
        params.set('size', pageable.size);
        params.set('sortBy', pageable.sortBy);
        params.set('sortDir', pageable.sortDir);
    }
    return apiFetch(`/admin/users?${params.toString()}`, {
        method: 'GET'
    });
};

export const getUserByIdAPI = async (userId) => {
    return apiFetch(`/admin/users/${userId}`, {
        method: 'GET'
    });
};

/**
 * @param {string} userId
 * @param pageable {page: int, size: int, sortBy: string, sortDir: string}
 */
export const getPostsByUserIdAPI = async (userId, pageable) => {
    const params = new URLSearchParams();
    if (pageable) {
        params.set('page', pageable.page);
        params.set('size', pageable.size);
        params.set('sortBy', pageable.sortBy);
        params.set('sortDir', pageable.sortDir);
    }
    return apiFetch(`/admin/users/${userId}/posts?${params.toString()}`, {
        method: 'GET'
    });
};

/**
 * @param {string} userId
 * @param pageable {page: int, size: int, sortBy: string, sortDir: string}
 */
export const getCommentsByUserIdAPI = async (userId, pageable) => {
    const params = new URLSearchParams();
    if (pageable) {
        params.set('page', pageable.page);
        params.set('size', pageable.size);
        params.set('sortBy', pageable.sortBy);
        params.set('sortDir', pageable.sortDir);
    }
    return apiFetch(`/admin/users/${userId}/comments?${params.toString()}`, {
        method: 'GET'
    });
};

/**
 * @param {string} userId
 * @param pageable {page: int, size: int, sortBy: string, sortDir: string}
 */
export const getReportsByUserIdAPI = async (userId, pageable) => {
    const params = new URLSearchParams();
    if (pageable) {
        params.set('page', pageable.page);
        params.set('size', pageable.size);
        params.set('sortBy', pageable.sortBy);
        params.set('sortDir', pageable.sortDir);
    }
    return apiFetch(`/admin/users/${userId}/reports?${params.toString()}`, {
        method: 'GET'
    });
};

export const banUserAPI = async (userId) => {
    return apiFetch(`/admin/users/${userId}/ban`, {
        method: 'PUT'
    });
};

export const unbanUserAPI = async (userId) => {
    return apiFetch(`/admin/users/${userId}/unban`, {
        method: 'PUT'
    });
};
