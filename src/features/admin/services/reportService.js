import { apiFetch } from "../../../utils/api";

/**
 * @param {string} status - {ALL, OPEN, RESOLVED, CLOSED} 
 * @param {string} type - {ALL, POST, COMMENT, GROUP}
 * @param payload {page: int, size: int, sortBy: string, sortDir: string}
 */
export const getReportAPI = async (status = 'PENDING', type='ALL', pageable) => {
    return apiFetch(`/admin/reports/status/${status}/type/${type}?page=${pageable.page}&size=${pageable.size}&sortBy=${pageable.sortBy}&sortDir=${pageable.sortDir}`, {
        method: 'GET'
    });
}

export const getReportByIdAPI = async (reportId) => {
    return apiFetch(`/admin/reports/${reportId}`, {
        method: 'GET'
    });
}

/**
 * @param {string} query
 * @param payload {page: int, size: int, sortBy: string, sortDir: string}
 */
export const searchReportsAPI = async (query, pageable) => {
    return apiFetch(`/admin/reports/search?query=${query}&page=${pageable.page}&size=${pageable.size}&sortBy=${pageable.sortBy}&sortDir=${pageable.sortDir}`, {
        method: 'GET'
    });
}

export const closeReportAPI = async (reportId) => {
    return apiFetch(`/admin/reports/${reportId}/close`, {
        method: 'PUT'
    });
}

/**
 * @param {string} reportId
 * @param payload {adminNotes: string}
 */
export const resolveReportAPI = async (reportId, payload) => {
    return apiFetch(`/admin/reports/${reportId}/resolve`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}
