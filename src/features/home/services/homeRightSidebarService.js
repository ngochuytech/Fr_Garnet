import { apiFetch } from '../../../utils/api';

export const getSuggestedUser = async () => {
  return apiFetch("/users/suggestions", {
    method: "GET",
  })
};

export const getFollowStats = async () => {
    return apiFetch('/users/profiles/me/follow-stats', {
        method: 'GET',
    });
};