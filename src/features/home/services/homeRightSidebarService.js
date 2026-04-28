import { apiFetch } from '../../../utils/api';

export const getSuggestedUser = async () => {
  return apiFetch("/users/suggestions", {
    method: "GET",
  })
};