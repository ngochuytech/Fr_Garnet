import { apiFetch } from '../../../utils/api';

/**
 * Updates user profile information.
 * @param {Object} formdata - The profile data to update.
 * @returns {Promise<any>}
 */
export const updateProfile = async (formdata) => {
    return apiFetch('/users/profiles/information', {
        method: 'PUT',
        body: JSON.stringify(formdata),
    });
};

/**
 * Updates user password.
 * @param {Object} formdata - The password data (oldPassword, newPassword, etc.).
 * @returns {Promise<any>}
 */
export const updatePassword = async (formdata) => {
    return apiFetch('/users/profiles/password', {
        method: 'PUT',
        body: JSON.stringify(formdata),
    });
};

export const updateBio = async (description) => {
    return apiFetch('/users/profiles/bio', {
        method: 'PUT',
        body: JSON.stringify(description),
    });
};

export const getProfile = async () => {
    return apiFetch('/users/profiles/me', {
        method: 'GET',
    });
};

export const setupProfile = async (setupData) => {
    return apiFetch('/users/profiles/setup', {
        method: 'POST',
        body: JSON.stringify(setupData),
    });
};

export const updateAvatar = async (formData) => {
    return apiFetch('/users/profiles/avatar', {
        method: 'PUT',
        body: formData,
    });
};

export const getProfilePosts = async () => {
    return apiFetch(`/users/posts/me`, {
        method: 'GET',
    });
};
