import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  approveJoinRequest,
  createGroup,
  getGroupById,
  getGroupJoinRequests,
  getGroupMembers,
  getGroupStatus,
  getGroups,
  joinGroup,
  kickMember,
  leaveGroup,
  reportGroup,
  rejectJoinRequest,
  updateGroupAvatar,
  updateGroupCover,
  updateGroupDescription,
  updateGroupName,
} from '../services/spaceService';

const DEFAULT_COVER_URL = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80';

const getFallbackAvatarUrl = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Group')}&background=dfb9b9&color=6a2f30&size=128`;
};

const getFallbackMemberAvatarUrl = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=dfb9b9&color=6a2f30&size=128`;
};

const getErrorMessage = (error, fallback) => {
  if (typeof error === 'string') {
    return error;
  }

  return error?.message || fallback;
};

const getListItems = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  const keys = ['items', 'content', 'members', 'memberList', 'users', 'approvedMembers', 'groupMembers'];

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) {
      return payload[key];
    }

    if (Array.isArray(payload?.[key]?.items)) {
      return payload[key].items;
    }

    if (Array.isArray(payload?.[key]?.content)) {
      return payload[key].content;
    }
  }

  return [];
};

const getEmbeddedMembers = (group) => {
  return getListItems({
    members: group?.members,
    memberList: group?.memberList,
    users: group?.users,
    approvedMembers: group?.approvedMembers,
    groupMembers: group?.groupMembers,
  });
};

const getEmbeddedJoinRequests = (group) => {
  return getListItems({
    items: group?.joinRequests,
    content: group?.pendingRequests,
    members: group?.pendingMembers,
    memberList: group?.requestedMembers,
    users: group?.requestingUsers,
    approvedMembers: group?.memberRequests,
    groupMembers: group?.groupJoinRequests,
  });
};

const canManageGroup = (space) => {
  return ['LEADER', 'OWNER'].includes(space?.memberRole)
    || ['LEADER', 'OWNER'].includes(space?.role)
    || space?.isLeader;
};

const normalizeMember = (member) => {
  const user = member?.user || member?.member || member?.profile || member;
  const displayName = user?.fullName
    || user?.fullname
    || user?.name
    || user?.displayName
    || member?.fullName
    || member?.fullname
    || member?.name
    || 'Người dùng CampusHub';
  const profileId = user?.id
    || user?.userId
    || member?.userId
    || member?.memberId
    || member?.id
    || null;

  return {
    ...member,
    ...user,
    id: profileId || `${displayName}-${user?.email || member?.email || ''}`,
    profileId,
    fullName: displayName,
    email: user?.email || member?.email || '',
    avatarUrl: user?.avatarUrl || user?.avatar || member?.avatarUrl || member?.avatar || getFallbackMemberAvatarUrl(displayName),
    memberRole: member?.memberRole || member?.role || user?.memberRole || user?.role || null,
    memberStatus: member?.memberStatus || member?.status || user?.memberStatus || user?.status || null,
  };
};

const normalizeMembersPayload = (payload) => {
  const items = getListItems(payload).map(normalizeMember);
  return {
    items,
    isLast: payload?.isLast ?? payload?.last ?? true,
    total: Number(payload?.totalElements ?? items.length),
  };
};

const normalizeJoinRequestsPayload = (payload) => {
  const items = getListItems(payload).map(normalizeMember);
  return {
    items,
    isLast: payload?.isLast ?? payload?.last ?? true,
    total: Number(payload?.totalElements ?? payload?.totalItems ?? payload?.total ?? items.length),
  };
};

const mergeMembers = (currentMembers, nextMembers) => {
  const seen = new Set();

  return [...currentMembers, ...nextMembers].filter((member) => {
    if (seen.has(member.id)) {
      return false;
    }

    seen.add(member.id);
    return true;
  });
};

const normalizeSpace = (group) => {
  const name = group?.name || 'Nhóm chưa đặt tên';
  const membersCount = Number(group?.memberCount ?? group?.membersCount ?? 0);
  const memberStatus = group?.memberStatus ?? null;
  const memberRole = group?.memberRole ?? group?.role ?? null;
  const status = group?.status ?? 'ACTIVE';
  const warnings = Array.isArray(group?.warnings)
    ? group.warnings
    : Array.isArray(group?.adminWarnings)
      ? group.adminWarnings
      : [];
  const reports = Array.isArray(group?.reports)
    ? group.reports
    : Array.isArray(group?.violationReports)
      ? group.violationReports
      : [];

  return {
    ...group,
    name,
    description: group?.description ?? 'Chưa có mô tả cho nhóm này.',
    memberCount: membersCount,
    membersCount,
    status,
    isArchived: status === 'ARCHIVED',
    memberStatus,
    memberRole,
    isMember: group?.isMember ?? memberStatus === 'APPROVED',
    isPending: group?.isPending ?? memberStatus === 'PENDING',
    isLeader: group?.isLeader ?? (['LEADER', 'OWNER'].includes(memberRole) && memberStatus === 'APPROVED'),
    avatarUrl: group?.avatarUrl || getFallbackAvatarUrl(name),
    coverUrl: group?.coverUrl || DEFAULT_COVER_URL,
    warningCount: Number(group?.warningCount ?? group?.warningsCount ?? warnings.length),
    reportCount: Number(group?.reportCount ?? group?.reportedCount ?? group?.reportsCount ?? reports.length),
    warnings,
    reports,
    latestWarning: group?.latestWarning || group?.lastWarning || warnings[0] || null,
    latestReport: group?.latestReport || group?.lastReport || reports[0] || null,
    adminNotes: group?.adminNotes || group?.moderationNotes || group?.statusNotes || '',
  };
};

const normalizeGroupStatus = (payload = {}) => {
  const warnings = Array.isArray(payload?.warnings)
    ? payload.warnings
    : Array.isArray(payload?.adminWarnings)
      ? payload.adminWarnings
      : [];
  const reports = Array.isArray(payload?.reports)
    ? payload.reports
    : Array.isArray(payload?.violationReports)
      ? payload.violationReports
      : [];

  return {
    ...payload,
    status: payload?.status,
    warningCount: Number(payload?.warningCount ?? payload?.warningsCount ?? warnings.length),
    reportCount: Number(payload?.reportCount ?? payload?.reportedCount ?? payload?.reportsCount ?? reports.length),
    warnings,
    reports,
    latestWarning: payload?.latestWarning || payload?.lastWarning || warnings[0] || null,
    latestReport: payload?.latestReport || payload?.lastReport || reports[0] || null,
    adminNotes: payload?.adminNotes || payload?.moderationNotes || payload?.statusNotes || '',
  };
};

export const useSpaces = (routeSpaceId = null) => {
  const [spaces, setSpaces] = useState([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState(routeSpaceId);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(Boolean(routeSpaceId));
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoadingKeys, setActionLoadingKeys] = useState([]);
  const [requestedGroupIds, setRequestedGroupIds] = useState([]);
  const [membersByGroupId, setMembersByGroupId] = useState({});
  const [joinRequestsByGroupId, setJoinRequestsByGroupId] = useState({});
  const [statusByGroupId, setStatusByGroupId] = useState({});

  const selectedSpace = useMemo(() => {
    return spaces.find((space) => space.id === selectedSpaceId) || null;
  }, [selectedSpaceId, spaces]);

  const selectedMembersState = selectedSpaceId ? membersByGroupId[selectedSpaceId] : null;
  const selectedJoinRequestsState = selectedSpaceId ? joinRequestsByGroupId[selectedSpaceId] : null;
  const selectedStatusState = selectedSpaceId ? statusByGroupId[selectedSpaceId] : null;

  const setActionLoading = useCallback((key, isLoading) => {
    setActionLoadingKeys((currentKeys) => {
      if (isLoading) {
        return currentKeys.includes(key) ? currentKeys : [...currentKeys, key];
      }

      return currentKeys.filter((currentKey) => currentKey !== key);
    });
  }, []);

  const syncEmbeddedMembers = useCallback((group) => {
    const embeddedMembers = getEmbeddedMembers(group);

    if (!group?.id || embeddedMembers.length === 0) {
      return;
    }

    const normalizedMembers = embeddedMembers.map(normalizeMember);

    setMembersByGroupId((currentState) => ({
      ...currentState,
      [group.id]: {
        ...(currentState[group.id] || {}),
        items: normalizedMembers,
        total: normalizedMembers.length,
        isLast: true,
        loading: false,
        loadingMore: false,
        error: null,
      },
    }));
  }, []);

  const syncEmbeddedJoinRequests = useCallback((group) => {
    const embeddedJoinRequests = getEmbeddedJoinRequests(group);

    if (!group?.id || embeddedJoinRequests.length === 0) {
      return;
    }

    const normalizedJoinRequests = embeddedJoinRequests.map(normalizeMember);

    setJoinRequestsByGroupId((currentState) => ({
      ...currentState,
      [group.id]: {
        ...(currentState[group.id] || {}),
        items: normalizedJoinRequests,
        total: normalizedJoinRequests.length,
        isLast: true,
        loading: false,
        loadingMore: false,
        error: null,
      },
    }));
  }, []);

  const syncSpace = useCallback((group) => {
    const normalized = normalizeSpace(group);
    syncEmbeddedMembers(group);
    syncEmbeddedJoinRequests(group);

    setSpaces((currentSpaces) => {
      const exists = currentSpaces.some((space) => space.id === normalized.id);

      if (!exists) {
        return [normalized, ...currentSpaces];
      }

      return currentSpaces.map((space) => (
        space.id === normalized.id ? { ...space, ...normalized } : space
      ));
    });

    return normalized;
  }, [syncEmbeddedJoinRequests, syncEmbeddedMembers]);

  const fetchGroupMembers = useCallback(async (groupId, page = 0) => {
    if (!groupId) {
      return;
    }

    setMembersByGroupId((currentState) => {
      const currentGroupState = currentState[groupId] || {};

      return {
        ...currentState,
        [groupId]: {
          ...currentGroupState,
          loading: page === 0,
          loadingMore: page > 0,
          error: null,
        },
      };
    });

    try {
      const data = await getGroupMembers(groupId, { page });
      const normalized = normalizeMembersPayload(data);

      setMembersByGroupId((currentState) => {
        const currentGroupState = currentState[groupId] || {};
        const currentItems = page === 0 ? [] : (currentGroupState.items || []);

        return {
          ...currentState,
          [groupId]: {
            ...currentGroupState,
            items: mergeMembers(currentItems, normalized.items),
            page,
            isLast: normalized.isLast,
            total: normalized.total,
            loading: false,
            loadingMore: false,
            error: null,
          },
        };
      });
    } catch (err) {
      setMembersByGroupId((currentState) => {
        const currentGroupState = currentState[groupId] || {};

        return {
          ...currentState,
          [groupId]: {
            ...currentGroupState,
            loading: false,
            loadingMore: false,
            error: currentGroupState.items?.length
              ? null
              : getErrorMessage(err, 'Không thể tải danh sách thành viên'),
          },
        };
      });
    }
  }, []);

  const fetchGroupJoinRequests = useCallback(async (groupId, page = 0) => {
    if (!groupId) {
      return;
    }

    setJoinRequestsByGroupId((currentState) => {
      const currentGroupState = currentState[groupId] || {};

      return {
        ...currentState,
        [groupId]: {
          ...currentGroupState,
          loading: page === 0,
          loadingMore: page > 0,
          error: null,
        },
      };
    });

    try {
      const data = await getGroupJoinRequests(groupId, { page });
      const normalized = normalizeJoinRequestsPayload(data);

      setJoinRequestsByGroupId((currentState) => {
        const currentGroupState = currentState[groupId] || {};
        const currentItems = page === 0 ? [] : (currentGroupState.items || []);

        return {
          ...currentState,
          [groupId]: {
            ...currentGroupState,
            items: mergeMembers(currentItems, normalized.items),
            page,
            isLast: normalized.isLast,
            total: normalized.total,
            loading: false,
            loadingMore: false,
            error: null,
          },
        };
      });
    } catch (err) {
      setJoinRequestsByGroupId((currentState) => {
        const currentGroupState = currentState[groupId] || {};

        return {
          ...currentState,
          [groupId]: {
            ...currentGroupState,
            loading: false,
            loadingMore: false,
            error: currentGroupState.items?.length
              ? null
              : getErrorMessage(err, 'Không thể tải danh sách yêu cầu tham gia'),
          },
        };
      });
    }
  }, []);

  const fetchGroupStatus = useCallback(async (groupId) => {
    if (!groupId) {
      return null;
    }

    setStatusByGroupId((currentState) => ({
      ...currentState,
      [groupId]: {
        ...(currentState[groupId] || {}),
        loading: true,
        error: null,
      },
    }));

    try {
      const data = await getGroupStatus(groupId);
      const normalized = normalizeGroupStatus(data);

      setStatusByGroupId((currentState) => ({
        ...currentState,
        [groupId]: {
          data: normalized,
          loading: false,
          error: null,
        },
      }));

      setSpaces((currentSpaces) => currentSpaces.map((space) => (
        space.id === groupId ? { ...space, ...normalized, status: normalized.status || space.status } : space
      )));

      return normalized;
    } catch (err) {
      const message = getErrorMessage(err, 'Không thể tải trạng thái nhóm');

      setStatusByGroupId((currentState) => ({
        ...currentState,
        [groupId]: {
          ...(currentState[groupId] || {}),
          loading: false,
          error: message,
        },
      }));

      toast.error(message);
      return null;
    }
  }, []);

  const fetchSpaces = useCallback(async (quiet = false) => {
    try {
      if (!quiet) {
        setLoading(true);
      }

      setError(null);
      const data = await getGroups();
      const groups = Array.isArray(data) ? data : (data?.items || []);
      setSpaces(groups.map(normalizeSpace));
    } catch (err) {
      const message = getErrorMessage(err, 'Không thể tải danh sách nhóm');
      setError(message);
      toast.error(message);
    } finally {
      if (!quiet) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  const refreshGroup = useCallback(async (groupId) => {
    if (!groupId) {
      return null;
    }

    const group = await getGroupById(groupId);
    return syncSpace(group);
  }, [syncSpace]);

  const handleSelectSpace = useCallback(async (groupId) => {
    setSelectedSpaceId(groupId);

    try {
      setDetailLoading(true);
      setError(null);
      const group = await refreshGroup(groupId);
      await fetchGroupMembers(groupId);
      if (canManageGroup(group)) {
        await fetchGroupJoinRequests(groupId);
      }
    } catch (err) {
      const message = getErrorMessage(err, 'Không thể tải chi tiết nhóm');
      setError(message);
      toast.error(message);
    } finally {
      setDetailLoading(false);
    }
  }, [fetchGroupJoinRequests, fetchGroupMembers, refreshGroup]);

  useEffect(() => {
    if (routeSpaceId) {
      handleSelectSpace(routeSpaceId);
      return;
    }

    setSelectedSpaceId(null);
  }, [handleSelectSpace, routeSpaceId]);

  const handleLoadMoreMembers = useCallback(async (groupId) => {
    const currentGroupState = membersByGroupId[groupId];

    if (!groupId || currentGroupState?.loadingMore || currentGroupState?.isLast) {
      return;
    }

    await fetchGroupMembers(groupId, (currentGroupState?.page || 0) + 1);
  }, [fetchGroupMembers, membersByGroupId]);

  const handleLoadMoreJoinRequests = useCallback(async (groupId) => {
    const currentGroupState = joinRequestsByGroupId[groupId];

    if (!groupId || currentGroupState?.loadingMore || currentGroupState?.isLast) {
      return;
    }

    await fetchGroupJoinRequests(groupId, (currentGroupState?.page || 0) + 1);
  }, [fetchGroupJoinRequests, joinRequestsByGroupId]);

  const handleBackToList = useCallback(() => {
    setSelectedSpaceId(null);
  }, []);

  const handleCreateGroup = useCallback(async (formData) => {
    const payload = {
      name: formData.name?.trim(),
      description: formData.description?.trim(),
    };

    if (!payload.name) {
      toast.error('Vui lòng nhập tên nhóm');
      return null;
    }

    try {
      setCreateLoading(true);
      const createdGroup = await createGroup(payload);
      const normalized = syncSpace({
        ...createdGroup,
        isLeader: true,
        isMember: true,
        memberRole: 'LEADER',
        memberStatus: 'APPROVED',
      });
      setSelectedSpaceId(normalized.id);
      await fetchGroupMembers(normalized.id);
      toast.success('Đã tạo nhóm thành công');
      return normalized;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể tạo nhóm'));
      return null;
    } finally {
      setCreateLoading(false);
    }
  }, [fetchGroupMembers, syncSpace]);

  const handleJoinGroup = useCallback(async (groupId) => {
    const key = `join:${groupId}`;

    try {
      setActionLoading(key, true);
      const result = await joinGroup(groupId);
      setSpaces((currentSpaces) => currentSpaces.map((space) => (
        space.id === groupId ? { ...space, memberStatus: 'PENDING', isPending: true } : space
      )));
      setRequestedGroupIds((currentIds) => (
        currentIds.includes(groupId) ? currentIds : [...currentIds, groupId]
      ));
      toast.success(typeof result === 'string' ? result : 'Đã gửi yêu cầu tham gia nhóm');
      await refreshGroup(groupId);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể gửi yêu cầu tham gia nhóm'));
    } finally {
      setActionLoading(key, false);
    }
  }, [refreshGroup, setActionLoading]);

  const handleLeaveGroup = useCallback(async (groupId) => {
    const key = `leave:${groupId}`;

    try {
      setActionLoading(key, true);
      const result = await leaveGroup(groupId);
      setSpaces((currentSpaces) => currentSpaces.map((space) => (
        space.id === groupId
          ? { ...space, memberStatus: null, memberRole: null, isMember: false, isPending: false, isLeader: false }
          : space
      )));
      setRequestedGroupIds((currentIds) => currentIds.filter((id) => id !== groupId));
      toast.success(typeof result === 'string' ? result : 'Đã rời nhóm');
      await refreshGroup(groupId);
      await fetchGroupMembers(groupId);
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể rời nhóm'));
      return false;
    } finally {
      setActionLoading(key, false);
    }
  }, [fetchGroupMembers, refreshGroup, setActionLoading]);

  const handleUpdateGroupAvatar = useCallback(async (groupId, file) => {
    const key = `avatar:${groupId}`;

    try {
      setActionLoading(key, true);
      const updatedGroup = await updateGroupAvatar(groupId, file);
      syncSpace(updatedGroup);
      toast.success('Đã cập nhật ảnh đại diện nhóm');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể cập nhật ảnh đại diện nhóm'));
    } finally {
      setActionLoading(key, false);
    }
  }, [setActionLoading, syncSpace]);

  const handleUpdateGroupCover = useCallback(async (groupId, file) => {
    const key = `cover:${groupId}`;

    try {
      setActionLoading(key, true);
      const updatedGroup = await updateGroupCover(groupId, file);
      syncSpace(updatedGroup);
      toast.success('Đã cập nhật ảnh bìa nhóm');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể cập nhật ảnh bìa nhóm'));
    } finally {
      setActionLoading(key, false);
    }
  }, [setActionLoading, syncSpace]);

  const handleUpdateGroupName = useCallback(async (groupId, name) => {
    const payloadName = name?.trim();

    if (!payloadName) {
      toast.error('Vui lòng nhập tên nhóm');
      return false;
    }

    const key = `name:${groupId}`;

    try {
      setActionLoading(key, true);
      const updatedGroup = await updateGroupName(groupId, payloadName);
      syncSpace(updatedGroup);
      toast.success('Đã cập nhật tên nhóm');
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể cập nhật tên nhóm'));
      return false;
    } finally {
      setActionLoading(key, false);
    }
  }, [setActionLoading, syncSpace]);

  const handleUpdateGroupDescription = useCallback(async (groupId, description) => {
    const payloadDescription = description?.trim() || '';
    const key = `description:${groupId}`;

    try {
      setActionLoading(key, true);
      const updatedGroup = await updateGroupDescription(groupId, payloadDescription);
      syncSpace(updatedGroup);
      toast.success('Đã cập nhật mô tả nhóm');
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể cập nhật mô tả nhóm'));
      return false;
    } finally {
      setActionLoading(key, false);
    }
  }, [setActionLoading, syncSpace]);

  const handleReportGroup = useCallback(async (groupId, payload) => {
    const reason = payload?.reason?.trim();
    const description = payload?.description?.trim() || '';

    if (!reason) {
      toast.error('Vui lòng chọn lý do báo cáo');
      return false;
    }

    const key = `report:${groupId}`;

    try {
      setActionLoading(key, true);
      const result = await reportGroup(groupId, { reason, description });
      toast.success(typeof result === 'string' ? result : 'Đã gửi báo cáo nhóm đến quản trị viên');
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể gửi báo cáo nhóm'));
      return false;
    } finally {
      setActionLoading(key, false);
    }
  }, [setActionLoading]);

  const handleApproveJoinRequest = useCallback(async (groupId, targetUserId) => {
    const key = `approve:${groupId}:${targetUserId}`;

    try {
      setActionLoading(key, true);
      const result = await approveJoinRequest(groupId, targetUserId);
      toast.success(typeof result === 'string' ? result : 'Đã duyệt yêu cầu tham gia nhóm');
      await refreshGroup(groupId);
      await fetchGroupMembers(groupId);
      await fetchGroupJoinRequests(groupId);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể duyệt yêu cầu tham gia nhóm'));
    } finally {
      setActionLoading(key, false);
    }
  }, [fetchGroupJoinRequests, fetchGroupMembers, refreshGroup, setActionLoading]);

  const handleRejectJoinRequest = useCallback(async (groupId, targetUserId) => {
    const key = `reject:${groupId}:${targetUserId}`;

    try {
      setActionLoading(key, true);
      const result = await rejectJoinRequest(groupId, targetUserId);
      toast.success(typeof result === 'string' ? result : 'Đã từ chối yêu cầu tham gia nhóm');
      await refreshGroup(groupId);
      await fetchGroupJoinRequests(groupId);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể từ chối yêu cầu tham gia nhóm'));
    } finally {
      setActionLoading(key, false);
    }
  }, [fetchGroupJoinRequests, refreshGroup, setActionLoading]);

  const handleKickMember = useCallback(async (groupId, targetUserId) => {
    const key = `kick:${groupId}:${targetUserId}`;

    try {
      setActionLoading(key, true);
      const result = await kickMember(groupId, targetUserId);
      toast.success(typeof result === 'string' ? result : 'Đã xóa thành viên khỏi nhóm');
      await refreshGroup(groupId);
      await fetchGroupMembers(groupId);
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể xóa thành viên khỏi nhóm'));
      return false;
    } finally {
      setActionLoading(key, false);
    }
  }, [fetchGroupMembers, refreshGroup, setActionLoading]);

  return {
    spaces,
    selectedSpace,
    selectedSpaceId,
    loading,
    detailLoading,
    createLoading,
    error,
    actionLoadingKeys,
    requestedGroupIds,
    selectedMembers: selectedMembersState?.items || [],
    membersLoading: Boolean(selectedMembersState?.loading),
    membersLoadingMore: Boolean(selectedMembersState?.loadingMore),
    membersError: selectedMembersState?.error || null,
    membersIsLast: selectedMembersState?.isLast ?? true,
    membersTotal: selectedMembersState?.total ?? selectedSpace?.membersCount ?? 0,
    selectedJoinRequests: selectedJoinRequestsState?.items || [],
    joinRequestsLoading: Boolean(selectedJoinRequestsState?.loading),
    joinRequestsLoadingMore: Boolean(selectedJoinRequestsState?.loadingMore),
    joinRequestsError: selectedJoinRequestsState?.error || null,
    joinRequestsIsLast: selectedJoinRequestsState?.isLast ?? true,
    joinRequestsTotal: selectedJoinRequestsState?.total ?? 0,
    selectedGroupStatus: selectedStatusState?.data || null,
    groupStatusLoading: Boolean(selectedStatusState?.loading),
    groupStatusError: selectedStatusState?.error || null,
    refreshSpaces: fetchSpaces,
    handleSelectSpace,
    handleBackToList,
    handleCreateGroup,
    handleJoinGroup,
    handleLeaveGroup,
    handleUpdateGroupAvatar,
    handleUpdateGroupCover,
    handleUpdateGroupName,
    handleUpdateGroupDescription,
    handleReportGroup,
    handleLoadGroupStatus: fetchGroupStatus,
    handleLoadMoreMembers,
    handleLoadMoreJoinRequests,
    handleApproveJoinRequest,
    handleRejectJoinRequest,
    handleKickMember,
  };
};
