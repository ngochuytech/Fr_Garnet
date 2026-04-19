import { apiFetch } from '../utils/api';

/**
 * Gets a single post by ID.
 * @param {string} postId
 */
export const getPostByIdAPI = async (postId) => {
    return apiFetch(`/users/posts/${postId}`, {
        method: 'GET',
    });
};

/**
 * Likes a post.
 * @param {string|number} postId 
 */
export const likePostAPI = async (postId) => {
    return apiFetch(`/users/posts/${postId}/like`, {
        method: 'POST',
    });
};

/**
 * Dislikes a post.
 * @param {string|number} postId 
 */
export const dislikePostAPI = async (postId) => {
    return apiFetch(`/users/posts/${postId}/dislike`, {
        method: 'POST',
    });
};

/**
 * Gets comments for a post.
 * @param {string|number} postId 
 * @param {string} lastCommentId 
 * @param {number} limit 
 */
export const getCommentsByPostId = async (postId, lastCommentId = '', limit = 10) => {
    const url = `/users/comments?postId=${postId}&lastCommentId=${lastCommentId}&limit=${limit}`;
    return apiFetch(url, {
        method: 'GET',
    });
};

/**
 * Gets replies for a comment.
 * @param {string|number} commentId 
 * @param {string} lastCommentId 
 * @param {number} limit 
 */
export const getRepliesByCommentId = async (commentId, lastCommentId = null, limit = 10) => {
    let url = `/users/comments/${commentId}/replies?limit=${limit}`;
    if (lastCommentId) {
        url += `&lastCommentId=${lastCommentId}`;
    }
    return apiFetch(url, {
        method: 'GET',
    });
};

/**
 * Creates a comment on a post.
 * @param {string|number} postId 
 * @param {string|null} parentId 
 * @param {string} content 
 */
export const createCommentAPI = async (postId, parentId, content) => {
    return apiFetch(`/users/comments/post/${postId}`, {
        method: 'POST',
        body: JSON.stringify({ parentId, content }),
    });
};

/**
 * Likes a comment.
 */
export const likeCommentAPI = async (commentId) => {
    return apiFetch(`/users/comments/${commentId}/like`, {
        method: 'POST',
    });
};

/**
 * Dislikes a comment.
 */
export const dislikeCommentAPI = async (commentId) => {
    return apiFetch(`/users/comments/${commentId}/dislike`, {
        method: 'POST',
    });
};

/**
 * Edits a post.
 * @param {string|number} postId 
 * @param {object} payload 
 */
export const editPostAPI = async (postId, payload) => {
    return apiFetch(`/users/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
};

/**
 * Deletes a post.
 * @param {string|number} postId 
 */
export const deletePostAPI = async (postId) => {
    return apiFetch(`/users/posts/${postId}`, {
        method: 'DELETE',
    });
};

/**
 * Reports a post or other content.
 * @param {object} payload - { reason, description, targetId, targetType }
 */
export const reportPostAPI = async (postId, payload) => {
    return apiFetch(`/users/posts/${postId}/report`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export const sharePostAPI = async (postId, payload) => {
    return apiFetch(`/users/posts/${postId}/share`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}
