import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { getPostsAPI, reportPostAPI } from '../services/postService';

export const useContentModeration = () => {
  // ── States ──────────────────────────────────────────────────────────────────
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [pagination, setPagination] = useState({
    page: 0, 
    size: 15, 
    totalPages: 0, 
    totalElements: 0,
    totalActive: 0,
    totalHidden: 0,
  });

  // ── Actions ─────────────────────────────────────────────────────────────────
  const fetchContents = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const pageable = {
        page: page,
        size: pagination.size,
        sortBy: 'createdAt',
        sortDir: 'desc'
      };
      
      const status = statusFilter === 'ALL' ? null : statusFilter;
      const response = await getPostsAPI(search, status, pageable);

      setContents(response.items || []);
      setPagination(prev => ({
        ...prev,
        page: response.pageNumber || 0,
        totalPages: response.totalPages || 0,
        totalElements: response.totalElements || 0,
        totalActive: response.totalActive || 0,
        totalHidden: response.totalHidden || 0,
      }));
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast.error('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, pagination.size]);

  // Handle Search and Filter changes (Reset to page 0)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContents(0);
    }, 400); 
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]); 

  const handleToggleStatus = useCallback(async (contentId) => {
    try {
      // Logic for generic toggle (restore/hide) if needed
      toast.info('Tính năng cập nhật trạng thái đang được kết nối...');
      fetchContents(pagination.page);
    } catch (error) {
      toast.error('Thao tác thất bại');
    }
  }, [fetchContents, pagination.page]);

  const handleReportPost = useCallback(async (postId, reason, adminNotes = '') => {
    try {
      await reportPostAPI(postId, { reason, adminNotes });
      toast.success('Đã gỡ bài viết vi phạm');
      fetchContents(pagination.page);
      return true;
    } catch (error) {
      console.error('Error reporting post:', error);
      toast.error('Không thể gỡ bài viết');
      return false;
    }
  }, [fetchContents, pagination.page]);

  return {
    contents,
    loading,
    search, setSearch,
    statusFilter, setStatusFilter,
    pagination,
    fetchContents,
    handleToggleStatus,
    handleReportPost,
  };
};
