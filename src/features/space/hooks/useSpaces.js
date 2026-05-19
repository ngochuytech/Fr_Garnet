import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  approveJoinRequest,
  createGroup,
  getGroupById,
  getGroups,
  joinGroup,
  kickMember,
  leaveGroup,
  rejectJoinRequest,
  updateGroupAvatar,
  updateGroupCover,
  updateGroupName,
} from '../services/spaceService';

const DEFAULT_COVER_URL = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80';

const getFallbackAvatarUrl = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Group')}&background=dfb9b9&color=6a2f30&size=128`;
};

const getErrorMessage = (error, fallback) => {
  if (typeof error === 'string') {
    return error;
  }

  return error?.message || fallback;
};

const normalizeSpace = (group) => {
  const name = group?.name || 'Nhóm chưa đặt tên';
  const membersCount = Number(group?.memberCount ?? group?.membersCount ?? 0);
  const memberStatus = group?.memberStatus ?? null;
  const memberRole = group?.memberRole ?? group?.role ?? null;

  return {
    ...group,
    name,
    description: group?.description || 'Chưa có mô tả cho nhóm này.',
    memberCount: membersCount,
    membersCount,
    memberStatus,
    memberRole,
    isMember: group?.isMember ?? memberStatus === 'APPROVED',
    isPending: group?.isPending ?? memberStatus === 'PENDING',
    isLeader: group?.isLeader ?? (memberRole === 'LEADER' && memberStatus === 'APPROVED'),
    avatarUrl: group?.avatarUrl || getFallbackAvatarUrl(name),
    coverUrl: group?.coverUrl || DEFAULT_COVER_URL,
  };
};

export const useSpaces = () => {
  const [spaces, setSpaces] = useState([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoadingKeys, setActionLoadingKeys] = useState([]);
  const [requestedGroupIds, setRequestedGroupIds] = useState([]);

  const selectedSpace = useMemo(() => {
    return spaces.find((space) => space.id === selectedSpaceId) || null;
  }, [selectedSpaceId, spaces]);

  const setActionLoading = useCallback((key, isLoading) => {
    setActionLoadingKeys((currentKeys) => {
      if (isLoading) {
        return currentKeys.includes(key) ? currentKeys : [...currentKeys, key];
      }

      return currentKeys.filter((currentKey) => currentKey !== key);
    });
  }, []);

  const syncSpace = useCallback((group) => {
    const normalized = normalizeSpace(group);

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
      await refreshGroup(groupId);
    } catch (err) {
      const message = getErrorMessage(err, 'Không thể tải chi tiết nhóm');
      setError(message);
      toast.error(message);
    } finally {
      setDetailLoading(false);
    }
  }, [refreshGroup]);

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
      toast.success('Đã tạo nhóm thành công');
      return normalized;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể tạo nhóm'));
      return null;
    } finally {
      setCreateLoading(false);
    }
  }, [syncSpace]);

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
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể rời nhóm'));
    } finally {
      setActionLoading(key, false);
    }
  }, [refreshGroup, setActionLoading]);

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

  const handleApproveJoinRequest = useCallback(async (groupId, targetUserId) => {
    const key = `approve:${groupId}:${targetUserId}`;

    try {
      setActionLoading(key, true);
      const result = await approveJoinRequest(groupId, targetUserId);
      toast.success(typeof result === 'string' ? result : 'Đã duyệt yêu cầu tham gia nhóm');
      await refreshGroup(groupId);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể duyệt yêu cầu tham gia nhóm'));
    } finally {
      setActionLoading(key, false);
    }
  }, [refreshGroup, setActionLoading]);

  const handleRejectJoinRequest = useCallback(async (groupId, targetUserId) => {
    const key = `reject:${groupId}:${targetUserId}`;

    try {
      setActionLoading(key, true);
      const result = await rejectJoinRequest(groupId, targetUserId);
      toast.success(typeof result === 'string' ? result : 'Đã từ chối yêu cầu tham gia nhóm');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể từ chối yêu cầu tham gia nhóm'));
    } finally {
      setActionLoading(key, false);
    }
  }, [setActionLoading]);

  const handleKickMember = useCallback(async (groupId, targetUserId) => {
    const key = `kick:${groupId}:${targetUserId}`;

    try {
      setActionLoading(key, true);
      const result = await kickMember(groupId, targetUserId);
      toast.success(typeof result === 'string' ? result : 'Đã xóa thành viên khỏi nhóm');
      await refreshGroup(groupId);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể xóa thành viên khỏi nhóm'));
    } finally {
      setActionLoading(key, false);
    }
  }, [refreshGroup, setActionLoading]);

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
    refreshSpaces: fetchSpaces,
    handleSelectSpace,
    handleBackToList,
    handleCreateGroup,
    handleJoinGroup,
    handleLeaveGroup,
    handleUpdateGroupAvatar,
    handleUpdateGroupCover,
    handleUpdateGroupName,
    handleApproveJoinRequest,
    handleRejectJoinRequest,
    handleKickMember,
  };
};
