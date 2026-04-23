import { apiFetch } from "../../../utils/api";

export const getSuggestedUsers = async () => {
    return apiFetch('/users/suggestions', {
        method: 'GET',
    });
}

export const searchUsers = async (query) => {
    return apiFetch(`/users/search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
    });
}

export const followUser = async (targetId) => {
    return apiFetch(`/users/${targetId}/follow`, {
        method: 'POST',
    });
}

export const unfollowUser = async (targetId) => {
    return apiFetch(`/users/${targetId}/unfollow`, {
        method: 'POST',
    });
}