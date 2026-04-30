import { apiFetch } from "../utils/api";

export const logoutService = async () => {
    return apiFetch('/auth/logout', {
        method: 'POST',
    });
}