import { apiFetch } from '../../../utils/api';

/**
 * Gets posts by topic name.
 * @param {string} topicName - The name of the topic.
 * @returns {Promise<any>}
 */
export const getPostsByTopic = async (topicName) => {
    return apiFetch(`/users/posts/topic/${topicName}`, {
        method: 'GET',
    });
};
