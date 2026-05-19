import { apiFetch } from '../../../utils/api';

const GROUPS_ENDPOINT = '/users/groups';

const toFileFormData = (file) => {
  if (file instanceof FormData) {
    return file;
  }

  const formData = new FormData();
  formData.append('file', file);
  return formData;
};

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

export const getGroupPosts = async (
  groupId,
  { page = 0, size = 20, sortBy = 'createdAt', sortDir = 'desc' } = {},
) => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sortBy,
    sortDir,
  });

  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}/posts?${params.toString()}`, {
    method: 'GET',
  });
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

export const updateGroupName = async (groupId, name) => {
  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}/name`, {
    method: 'PUT',
    body: JSON.stringify({ name }),
  });
};

export const updateGroupAvatar = async (groupId, file) => {
  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}/avatar`, {
    method: 'POST',
    body: toFileFormData(file),
  });
};

export const updateGroupCover = async (groupId, file) => {
  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}/cover`, {
    method: 'POST',
    body: toFileFormData(file),
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

export const leaveGroup = async (groupId) => {
  return apiFetch(`${GROUPS_ENDPOINT}/${groupId}/leave`, {
    method: 'DELETE',
  });
};
