import { apiFetch } from '../../../utils/api';

/**
 * Gets posts by topic name.
 * @param {string} topicName - The name of the topic.
 * @param {number} size - Page size.
 * @param {string|null} cursor - Cursor for next page.
 * @returns {Promise<any>}
 */
export const getPostsByTopic = async (topicName, size = 20, cursor = null) => {
    let url = `/users/posts/topic/${topicName}?size=${size}`;
    if (cursor) {
        url += `&cursor=${encodeURIComponent(cursor)}`;
    }
    return apiFetch(url, {
        method: 'GET',
    });
};
