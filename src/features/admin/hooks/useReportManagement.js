import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import {
  getReportAPI,
  resolveReportAPI,
  closeReportAPI,
  searchReportsAPI
} from '../services/reportService';

export const useReportManagement = () => {
  // ── States ──────────────────────────────────────────────────────────────────
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('OPEN');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedReport, setSelectedReport] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 30,
    totalPages: 0,
    totalElements: 0
  });

  // ── Constants ───────────────────────────────────────────────────────────────
  const statusTabs = useMemo(() => [
    { key: 'OPEN', label: 'Chờ xử lý' },
    { key: 'RESOLVED', label: 'Đã xử lý' },
    { key: 'CLOSED', label: 'Đã từ chối' },
  ], []);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const fetchReports = useCallback(async (status, type, page, query = '', currentSortOrder = sortOrder) => {
    setLoading(true);
    try {
      const pageable = {
        page: page,
        size: pagination.size,
        sortBy: 'createdAt',
        sortDir: currentSortOrder
      };

      const response = query.trim()
        ? await searchReportsAPI(query, pageable)
        : await getReportAPI(status, type, pageable);

      setReports(response.items || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages || 0,
        totalElements: response.totalElements || 0,
        page: response.pageNumber || 0
      }));
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Không thể tải danh sách báo cáo');
    } finally {
      setLoading(false);
    }
  }, [pagination.size, sortOrder]);

  const handleResolve = async (id, adminNotes) => {
    try {
      await resolveReportAPI(id, { adminNotes });
      toast.success('Đã xử lý vi phạm thành công');
      fetchReports(statusFilter, typeFilter, pagination.page, searchQuery, sortOrder);
      setSelectedReport(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xử lý báo cáo');
    }
  };

  const handleReject = async (id) => {
    try {
      await closeReportAPI(id);
      toast.success('Đã từ chối báo cáo');
      fetchReports(statusFilter, typeFilter, pagination.page, searchQuery, sortOrder);
      setSelectedReport(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đóng báo cáo');
    }
  };

  // ── Effects ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchReports(statusFilter, typeFilter, 0, searchQuery, sortOrder);
    }, searchQuery ? 500 : 0);

    return () => clearTimeout(delayDebounceFn);
  }, [statusFilter, typeFilter, searchQuery, sortOrder, fetchReports]);

  return {
    reports,
    loading,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    selectedReport,
    setSelectedReport,
    pagination,
    fetchReports,
    handleResolve,
    handleReject,
    filteredReports: reports, // Bây giờ reports đã được lọc từ server
    statusTabs
  };
};
