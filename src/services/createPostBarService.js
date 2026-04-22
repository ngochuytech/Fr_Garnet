import { apiFetch } from '../utils/api';

export const createPostBarService = async (postData) => {
    try {
        const isFormData = postData instanceof FormData;
        return apiFetch('/users/posts', {
            method: 'POST',
            body: isFormData ? postData : JSON.stringify(postData),
        });
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}