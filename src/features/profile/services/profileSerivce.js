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

export const updateTopics = async (topics) => {
    return apiFetch('/users/profiles/topic', {
        method: 'PUT',
        body: JSON.stringify(topics),
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
        body: description,
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

export const updateAvatar = async (avatarUrl) => {
    return apiFetch(`/users/profiles/avatar?avatarUrl=${encodeURIComponent(avatarUrl)}`, {
        method: 'PUT',
    });
};

export const getProfilePosts = async (size = 20, cursor = null) => {
    let url = `/users/posts/me?size=${size}`;
    if (cursor) url += `&cursor=${encodeURIComponent(cursor)}`;
    return apiFetch(url, {
        method: 'GET',
    });
};
