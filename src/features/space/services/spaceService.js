import { apiFetch } from '../../../utils/api';

const GROUPS_ENDPOINT = '/users/groups';

export const getGroups = async () => {
  return apiFetch(GROUPS_ENDPOINT, {
    method: 'GET',
  });
};

export const getGroupById = async (groupId) => {
  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}`, {
    method: 'GET',
  });
};

export const getGroupStatus = async (groupId) => {
  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}/status`, {
    method: 'GET',
  });
};

export const getGroupPosts = async (groupId, size = 20, cursor = null) => {
  let url = `${GROUPS_ENDPOINT}/${groupId}/posts?size=${size}`;
  if (cursor) {
    url += `&cursor=${encodeURIComponent(cursor)}`;
  }

  return apiFetch(url, {
    method: 'GET',
  });
};

export const getGroupMembers = async (
  groupId,
  { page = 0, size = 12 } = {},
) => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}/members?${params.toString()}`, {
    method: 'GET',
  });
};

export const getGroupJoinRequests = async (
  groupId,
  { page = 0, size = 12 } = {},
) => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  let lastError;

  try {
    return await apiFetch(`${GROUPS_ENDPOINT}/${groupId}/pending-members?${params.toString()}`, {
      method: 'GET',
    });
  } catch (err) {
    lastError = err;
  }

  throw lastError;
};

export const createGroup = async (groupData) => {
  return apiFetch(GROUPS_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(groupData),
  });
};

export const joinGroup = async (groupId) => {
  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}/join`, {
    method: 'POST',
  });
};

export const reportGroup = async (groupId, payload) => {
  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}/report`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateGroupName = async (groupId, name) => {
  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}/name`, {
    method: 'PUT',
    body: JSON.stringify({ name }),
  });
};

export const updateGroupDescription = async (groupId, description) => {
  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}/description`, {
    method: 'PUT',
    body: JSON.stringify({ description }),
  });
};

export const updateGroupAvatar = async (groupId, avatarUrl) => {
  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}/avatar?avatarUrl=${encodeURIComponent(avatarUrl)}`, {
    method: 'POST',
  });
};

export const updateGroupCover = async (groupId, coverUrl) => {
  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}/cover?coverUrl=${encodeURIComponent(coverUrl)}`, {
    method: 'POST',
  });
};

export const approveJoinRequest = async (groupId, targetUserId) => {
  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}/approve/${targetUserId}`, {
    method: 'POST',
  });
};

export const rejectJoinRequest = async (groupId, targetUserId) => {
  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}/reject/${targetUserId}`, {
    method: 'POST',
  });
};

export const kickMember = async (groupId, targetUserId) => {
  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}/members/${targetUserId}`, {
    method: 'DELETE',
  });
};

export const deleteGroup = async (groupId) => {
  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}`, {
    method: 'DELETE',
  });
};

export const leaveGroup = async (groupId) => {
  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}/leave`, {
    method: 'DELETE',
  });
};
