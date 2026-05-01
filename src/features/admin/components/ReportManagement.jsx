import React, { useState } from 'react';
import { toast } from 'sonner';
import { useReportManagement } from '../hooks/useReportManagement';

const StatusBadge = ({ status }) => {
  const config = {
    OPEN:  { label: 'Chờ xử lý', cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
    RESOLVED: { label: 'Đã xử lý',  cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
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
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
    type === 'POST'
      ? 'bg-blue-50 text-blue-600'
      : 'bg-purple-50 text-purple-600'
  }`}>
    {type === 'POST' ? (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
    ) : (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    )}
    {type === 'POST' ? 'Bài viết' : 'Bình luận'}
  </span>
);

const formatDate = (iso) => {
  if (!iso) return 'N/A';
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

// ── Detail Modal ─────────────────────────────────────────────────────────────
const DetailModal = ({ report, onClose, onResolve, onReject }) => {
  const [adminNotes, setAdminNotes] = useState('');

  if (!report) return null;

  const handleResolveClick = () => {
    if (!adminNotes.trim()) {
      toast.error('Vui lòng nhập lý do xử lý');
      return;
    }
    onResolve(report.id, adminNotes);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-gray-900">Chi tiết báo cáo #{report.id}</h2>
              <p className="text-xs text-gray-400">Ngày tạo: {formatDate(report.createdAt)} | Cập nhật lần cuối {formatDate(report.updatedAt)}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <img src={report.reporter?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.reporter?.fullName)}`} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-200" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Người báo cáo</p>
                <p className="text-sm font-semibold text-gray-800">{report.reporter?.fullName}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <img src={report.reportedUser?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.reportedUser?.fullName)}`} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-200" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Người bị báo cáo</p>
                <p className="text-sm font-semibold text-gray-800">{report.reportedUser?.fullName}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Loại vi phạm</p>
              <p className="text-sm font-semibold text-red-600">{report.reason}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Đối tượng</p>
              <TypeBadge type={report.targetType} />
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Mô tả từ người báo cáo</p>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 whitespace-pre-wrap">{report.description || 'Không có mô tả chi tiết.'}</p>
          </div>

          {/* Snapshot */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Nội dung bị báo cáo</p>
            <blockquote className="border-l-4 border-red-300 bg-red-50 pl-4 pr-4 py-3 rounded-r-xl">
              <div 
                className="text-sm text-gray-700 italic leading-relaxed"
                dangerouslySetInnerHTML={{ __html: `"${report.reportedContentSnapshot || 'Nội dung không khả dụng.'}"` }}
              />
              <p className="text-xs text-red-400 mt-2">— {report.reportedUser?.fullName} · {formatDate(report.createdAt)}</p>
            </blockquote>
          </div>

          {/* Handled Info (If already processed) */}
          {(report.status === 'RESOLVED' || report.status === 'CLOSED') && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">Kết quả xử lý</p>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Ghi chú từ quản trị viên:</p>
                <p className="text-sm text-gray-700 italic leading-relaxed">"{report.adminNotes || 'Không có ghi chú.'}"</p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <img 
                  src={report.handledBy?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.handledBy?.fullName || 'A')}`} 
                  alt="Admin" 
                  className="w-8 h-8 rounded-full border border-gray-200 object-cover" 
                />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Được xử lý bởi:</p>
                  <p className="text-sm font-semibold text-gray-800">{report.handledBy?.fullName || 'Quản trị viên hệ thống'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Admin Notes Input (Only if OPEN) */}
          {report.status === 'OPEN' && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Lý do xử lý (Ghi chú Admin) <span className="text-red-500">*</span></p>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Nhập lý do xử lý vi phạm này... (Ví dụ: Bài viết vi phạm quy tắc cộng đồng, chứa nội dung nhạy cảm)"
                className="w-full h-24 p-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all resize-none"
              />
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500">Trạng thái hiện tại:</p>
            <StatusBadge status={report.status} />
          </div>
        </div>

        {/* Footer actions */}
        {report.status === 'OPEN' && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
            <button
              onClick={() => onReject(report.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all"
            >
              Từ chối báo cáo
            </button>
            <button
              onClick={handleResolveClick}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 shadow-sm shadow-red-100 transition-all flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              </svg>
              Xác nhận xử lý
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const ReportManagement = () => {
  const {
    loading,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    searchQuery,
    setSearchQuery,
    selectedReport,
    setSelectedReport,
    pagination,
    fetchReports,
    handleResolve,
    handleReject,
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
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    statusFilter === tab.key && !searchQuery
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  {statusFilter === tab.key && !searchQuery && pagination.totalElements > 0 && (
                     <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-white/20 text-white">
                        {pagination.totalElements}
                     </span>
                  )}
                </button>
              ))}
            </div>

            {/* Right: Search and Type Filter */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
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
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
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
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
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
                              onClick={() => setSelectedReport(r)}
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                 </button>
                 <span className="text-xs font-bold text-gray-700 px-3">Trang {pagination.page + 1} / {pagination.totalPages || 1}</span>
                 <button 
                  disabled={pagination.page >= pagination.totalPages - 1}
                  onClick={() => fetchReports(statusFilter, typeFilter, pagination.page + 1, searchQuery)}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                 >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <DetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onResolve={handleResolve}
        onReject={handleReject}
      />
    </div>
  );
};

export default ReportManagement;
