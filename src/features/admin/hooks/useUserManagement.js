import { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { getUsersAPI, banUserAPI, unbanUserAPI } from '../services/userService';

export const useUserManagement = () => {
  // ── States ──────────────────────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [confirmUser, setConfirmUser] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
    totalActive: 0,
    totalBanned: 0
  });

  // ── Actions ─────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const pageable = {
        page,
        size: pagination.size,
        sortBy: 'createdAt',
        sortDir: 'desc'
      };
      
      const statusParam = statusFilter === 'ALL' ? null : statusFilter;
      const queryParam = search.trim() || null;

      const response = await getUsersAPI(queryParam, statusParam, pageable);
      
      setUsers(response.items || []);
      setPagination(prev => ({
        ...prev,
        page: response.pageNumber,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        totalActive: response.totalActive || 0,
        totalBanned: response.totalBanned || 0
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, pagination.size]);

  const handleToggleBan = useCallback(async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
      if (user.status === 'ACTIVE') {
        await banUserAPI(userId);
        toast.success('Đã khóa tài khoản người dùng');
      } else {
        await unbanUserAPI(userId);
        toast.success('Đã mở khóa tài khoản người dùng');
      }
      fetchUsers(pagination.page);
    } catch (error) {
      toast.error('Thao tác thất bại');
    } finally {
      setConfirmUser(null);
    }
  }, [users, pagination.page, fetchUsers]);

  // ── Effects ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, fetchUsers]);

  return {
    users,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    confirmUser,
    setConfirmUser,
    filteredUsers: users, // Server-side filtered
    totalActive: pagination.totalActive,
    totalBanned: pagination.totalBanned,
    pagination,
    fetchUsers,
    handleToggleBan
  };
};
