import { apiFetch } from '../utils/api';

export const createPostBarService = async (postData) => {
    try {
        return apiFetch('/users/posts', {
            method: 'POST',
            body: postData,
        });
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}

export const fetchTopics = async () => {
    try {
        return apiFetch('/users/topics/all', {
            method: 'GET',
        });
    } catch (error) {
        console.error('Error fetching user topics:', error);
        throw error;
    }
};