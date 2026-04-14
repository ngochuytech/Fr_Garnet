import { apiFetch } from '../utils/api';

export const createPostBarService = async (postData) => {
    try {
        return apiFetch('/users/posts', {
            method: 'POST',
            body: JSON.stringify(postData),
        });
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}