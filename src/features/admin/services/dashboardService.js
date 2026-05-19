import { apiFetch } from "../../../utils/api";

export const getDashboardStatsAPI = async () => {
    return apiFetch('/admin/dashboard/stat', {
        method: 'GET',
    });
};

export const getUserGrowthAPI = async () => {
    return apiFetch('/admin/dashboard/user-growth', {
        method: 'GET',
    });
};

export const getTopicDistributionAPI = async () => {
    return apiFetch('/admin/dashboard/topic-distribution', {
        method: 'GET',
    });
};

export const getReportWeeklyAPI = async () => {
    return apiFetch('/admin/dashboard/weekly-reports', {
        method: 'GET',
    });
};