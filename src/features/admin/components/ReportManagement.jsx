import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useReportManagement } from '../hooks/useReportManagement';

const StatusBadge = ({ status }) => {
  const config = {
    OPEN: { label: 'Chờ xử lý', cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
    RESOLVED: { label: 'Đã xử lý', cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
    CLOSED: { label: 'Đã từ chối', cls: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200' },
  };
  const { label, cls } = config[status] || { label: status, cls: 'bg-gray-50 text-gray-500' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
};

const TypeBadge = ({ type }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${type === 'POST'
      ? 'bg-blue-50 text-blue-600'
      : type === 'GROUP'
        ? 'bg-emerald-50 text-emerald-600'
        : 'bg-purple-50 text-purple-600'
    }`}>
    {type === 'POST' ? (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /></svg>
    ) : type === 'GROUP' ? (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ) : (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
    )}
    {type === 'POST' ? 'Bài viết' : type === 'GROUP' ? 'Nhóm' : 'Bình luận'}
  </span>
);

const formatDate = (iso) => {
  if (!iso) return 'N/A';
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};



// ── Main Component ────────────────────────────────────────────────────────────
const ReportManagement = () => {
  const navigate = useNavigate();
  const {
    loading,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    pagination,
    fetchReports,
    filteredReports,
    statusTabs
  } = useReportManagement();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black tracking-tight text-gray-900">Báo cáo vi phạm</h1>
            </div>
            <p className="text-sm font-medium text-gray-500">Danh sách các báo cáo từ cộng đồng sinh viên.</p>
          </div>

          {!loading && pagination.totalElements > 0 && statusFilter === 'OPEN' && !searchQuery && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {pagination.totalElements} báo cáo mới cần xử lý
            </div>
          )}
        </div>

        {/* ── Filter Bar ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
            {/* Left: Status Tabs */}
            <div className="flex items-center gap-1">
              {statusTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${statusFilter === tab.key && !searchQuery
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right: Search and Type Filter */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm báo cáo..."
                  className="pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all w-64"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
                >
                  <option value="ALL">Tất cả loại</option>
                  <option value="POST">Bài viết</option>
                  <option value="COMMENT">Bình luận</option>
                  <option value="GROUP">Nhóm</option>
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
              </div>

              {/* Sort Filter */}
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
                >
                  <option value="desc">Mới nhất</option>
                  <option value="asc">Cũ nhất</option>
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
              </div>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="overflow-x-auto min-h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80">
                    {['ID', 'Người báo cáo', 'Lý do vi phạm', 'Loại', 'Ngày tạo', 'Trạng thái', 'Hành động'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center text-gray-400">
                        <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Không có báo cáo nào
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50/60 transition-colors group">
                        <td className="px-5 py-4 text-gray-400 font-mono text-xs">#{r.id.substring(0, 8)}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <img src={r.reporter?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.reporter?.fullName)}`} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                            <span className="font-semibold text-gray-900 whitespace-nowrap">{r.reporter?.fullName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-medium text-gray-700">{r.reason}</span>
                          <p className="text-[11px] text-gray-400 mt-0.5 max-w-[220px] truncate">{r.description || 'Không có mô tả.'}</p>
                        </td>
                        <td className="px-5 py-4"><TypeBadge type={r.targetType} /></td>
                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap text-xs font-medium">{formatDate(r.createdAt)}</td>
                        <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/admin/reports/${r.id}`)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                            >
                              Xem
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Table footer / Pagination */}
          {!loading && pagination.totalElements > 0 && (
            <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Tổng cộng: <span className="text-gray-900">{pagination.totalElements}</span> báo cáo
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page === 0}
                  onClick={() => fetchReports(statusFilter, typeFilter, pagination.page - 1, searchQuery)}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <span className="text-xs font-bold text-gray-700 px-3">Trang {pagination.page + 1} {" / "} {pagination.totalPages || 1}</span>
                <button
                  disabled={pagination.page >= pagination.totalPages - 1}
                  onClick={() => fetchReports(statusFilter, typeFilter, pagination.page + 1, searchQuery)}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportManagement;
