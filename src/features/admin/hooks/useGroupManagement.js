import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  getGroupsAPI,
  lockGroupAPI,
  reportGroupAPI,
  unlockGroupAPI,
} from '../services/groupService';

const getListItems = (payload) => {
  if (Array.isArray(payload)) return payload;

  const keys = ['items', 'content', 'groups', 'data'];
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
    if (Array.isArray(payload?.[key]?.items)) return payload[key].items;
    if (Array.isArray(payload?.[key]?.content)) return payload[key].content;
  }

  return [];
};

const getFallbackAvatarUrl = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Group')}&background=dfb9b9&color=6a2f30&size=128`;
};

const normalizeGroup = (group) => {
  const name = group?.name || group?.groupName || 'Nhóm chưa đặt tên';
  const owner = group?.owner || group?.leader || group?.createdBy || group?.admin || null;
  const status = group?.status || (group?.archived ? 'ARCHIVED' : 'ACTIVE');
  const leaderName = owner?.fullName
    || owner?.fullname
    || owner?.name
    || group?.leaderName
    || group?.ownerName
    || 'Chưa xác định';

  return {
    ...group,
    id: group?.id || group?.groupId,
    name,
    description: group?.description || 'Chưa có mô tả',
    status,
    avatarUrl: group?.avatarUrl || group?.avatar || getFallbackAvatarUrl(name),
    coverUrl: group?.coverUrl || group?.cover,
    memberCount: Number(group?.memberCount ?? group?.membersCount ?? group?.totalMembers ?? 0),
    postCount: Number(group?.postCount ?? group?.postsCount ?? group?.totalPosts ?? 0),
    reportCount: Number(group?.reportCount ?? group?.reportedCount ?? group?.totalReports ?? 0),
    leaderName,
    leaderAvatarUrl: group?.leaderAvatarUrl || owner?.avatarUrl || owner?.avatar || getFallbackAvatarUrl(leaderName),
    ownerName: leaderName,
    ownerEmail: owner?.email || group?.ownerEmail || '',
    createdAt: group?.createdAt || group?.created_at || group?.joinedAt || group?.joined_at || null,
  };
};

const normalizePayload = (payload, fallbackPage, fallbackSize) => {
  const items = getListItems(payload).map(normalizeGroup).filter((group) => group.id);

  return {
    items,
    pageNumber: Number(payload?.pageNumber ?? payload?.number ?? payload?.page ?? fallbackPage),
    totalPages: Number(payload?.totalPages ?? payload?.pageCount ?? 1),
    totalElements: Number(payload?.totalElements ?? payload?.totalItems ?? payload?.total ?? items.length),
    size: Number(payload?.size ?? fallbackSize),
  };
};

export const useGroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [confirmGroup, setConfirmGroup] = useState(null);
  const [reportGroup, setReportGroup] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  const fetchGroups = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const pageable = {
        page,
        size: pagination.size,
        sortBy: 'createdAt',
        sortDir: 'desc',
      };
      const statusParam = statusFilter === 'ALL' ? null : statusFilter;
      const queryParam = search.trim() || null;
      const response = await getGroupsAPI(queryParam, statusParam, pageable);
      const normalized = normalizePayload(response, page, pagination.size);

      setGroups(normalized.items);
      setPagination((prev) => ({
        ...prev,
        page: normalized.pageNumber,
        size: normalized.size,
        totalPages: normalized.totalPages,
        totalElements: normalized.totalElements,
      }));
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Không thể tải danh sách nhóm');
    } finally {
      setLoading(false);
    }
  }, [pagination.size, search, statusFilter]);

  const handleToggleLock = useCallback(async (groupId) => {
    const group = groups.find((item) => item.id === groupId);
    if (!group) return;

    setActionLoadingId(groupId);
    try {
      if (group.status === 'ARCHIVED') {
        await unlockGroupAPI(groupId);
        toast.success('Đã mở khóa nhóm');
      } else {
        await lockGroupAPI(groupId);
        toast.success('Đã khóa nhóm');
      }

      await fetchGroups(pagination.page);
    } catch (error) {
      console.error('Error toggling group lock:', error);
      toast.error('Thao tác thất bại');
    } finally {
      setActionLoadingId(null);
      setConfirmGroup(null);
    }
  }, [fetchGroups, groups, pagination.page]);

  const handleReportGroup = useCallback(async (groupId, payload) => {
    const reason = payload?.reason?.trim();
    const adminNotes = payload?.adminNotes?.trim();

    if (!reason) {
      toast.error('Vui lòng chọn lý do xử lý');
      return false;
    }

    if (!adminNotes) {
      toast.error('Vui lòng nhập ghi chú quản trị');
      return false;
    }

    setActionLoadingId(groupId);
    try {
      await reportGroupAPI(groupId, {
        reason,
        description: payload?.description?.trim() || '',
        adminNotes,
        action: payload?.action || 'WARNING',
      });
      toast.success('Đã ghi nhận xử lý nhóm');
      await fetchGroups(pagination.page);
      setReportGroup(null);
      return true;
    } catch (error) {
      console.error('Error reporting group:', error);
      toast.error('Không thể xử lý báo cáo nhóm');
      return false;
    } finally {
      setActionLoadingId(null);
    }
  }, [fetchGroups, pagination.page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGroups(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchGroups]);

  return {
    groups,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    confirmGroup,
    setConfirmGroup,
    reportGroup,
    setReportGroup,
    actionLoadingId,
    pagination,
    fetchGroups,
    handleToggleLock,
    handleReportGroup,
  };
};
