import { apiFetch } from '../../../utils/api';

/**
 * Get groups for the admin console.
 * @param {string|null} query
 * @param {string|null} status
 * @param {{ page: number, size: number, sortBy: string, sortDir: string }} pageable
 */
export const getGroupsAPI = async (query = null, status = null, pageable) => {
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  if (status) params.set('status', status);
  if (pageable) {
    params.set('page', pageable.page);
    params.set('size', pageable.size);
    params.set('sortBy', pageable.sortBy);
    params.set('sortDir', pageable.sortDir);
  }

  return apiFetch(`/admin/groups?${params.toString()}`, {
    method: 'GET',
  });
};

/**
 * Report and resolve a group violation from the admin console.
 * @param {string} groupId
 * @param {{ reason: string, description?: string, adminNotes: string, action?: 'ARCHIVE' | 'WARNING' }} payload
 */
export const reportGroupAPI = async (groupId, payload) => {
  return apiFetch(`/admin/groups/${groupId}/report`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

/**
 * Lock a group manually by changing its status to ARCHIVED.
 * @param {string} groupId
 */
export const lockGroupAPI = async (groupId) => {
  return apiFetch(`/admin/groups/${groupId}/lock`, {
    method: 'PUT',
  });
};

/**
 * Unlock a group manually by changing its status back to ACTIVE.
 * @param {string} groupId
 */
export const unlockGroupAPI = async (groupId) => {
  return apiFetch(`/admin/groups/${groupId}/unlock`, {
    method: 'PUT',
  });
};
