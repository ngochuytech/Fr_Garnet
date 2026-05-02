import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentModeration } from '../hooks/useContentModeration';

// ── Internal Components ───────────────────────────────────────────────────────
const Avatar = ({ src, name }) => (
  src
    ? <img src={src} alt={name} className="w-8 h-8 rounded-full object-cover border border-gray-100 shadow-sm flex-shrink-0" />
    : <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 border border-gray-100 flex-shrink-0 text-xs">{name?.charAt(0)}</div>
);

const StatusBadge = ({ status }) => {
  const cfg = {
    ACTIVE: { label: 'HIỂN THỊ', cls: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200', dot: 'bg-emerald-500' },
    HIDDEN: { label: 'ĐÃ ẨN',   cls: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200',     dot: 'bg-amber-500' },
  };
  const { label, cls, dot } = cfg[status] || { label: status, cls: 'bg-gray-50 text-gray-500 ring-1 ring-gray-200', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dot}`} />
      {label}
    </span>
  );
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

// ── Main Component ────────────────────────────────────────────────────────────
const ContentModeration = () => {
  const navigate = useNavigate();
  const {
    contents,
    loading,
    search, setSearch,
    statusFilter, setStatusFilter,
    pagination,
    fetchContents,
    handleToggleStatus,
  } = useContentModeration();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Quản lý bài viết</h1>
          <p className="text-sm font-medium text-gray-500 mt-0.5">Kiểm duyệt bài viết trên nền tảng CampusHub.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-center">
            <p className="text-lg font-black text-emerald-600">{pagination.totalActive}</p>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Hiển thị</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2 text-center">
            <p className="text-lg font-black text-amber-600">{pagination.totalHidden}</p>
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Đã ẩn</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm nội dung hoặc tên người đăng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-2.5 pr-9 focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Hiển thị</option>
            <option value="HIDDEN">Đã ẩn</option>
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                {['Tác giả', 'Nội dung', 'Tương tác', 'Ngày đăng', 'Trạng thái', 'Hành động'].map((h) => (
                  <th key={h} className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  </td>
                </tr>
              ) : contents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-gray-200">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <p className="font-medium text-sm text-gray-500">Không tìm thấy nội dung nào</p>
                      <p className="text-xs">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                  </td>
                </tr>
              ) : (
                contents.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    {/* Author */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={item.author.authorAvatar} name={item.author.authorName} />
                        <span className="font-semibold text-gray-900 text-xs truncate max-w-[120px]">{item.author.authorName}</span>
                      </div>
                    </td>


                    {/* Content Preview */}
                    <td className="px-5 py-4 max-w-xs">
                      <div className="flex items-start gap-2">
                        <div className="text-gray-700 text-xs leading-relaxed line-clamp-2 flex-1"
                          dangerouslySetInnerHTML={{__html: item.content}}>
                        </div>
                        {item.images && item.images.length > 0 && (
                          <span title="Có ảnh đính kèm" className="text-sm grayscale hover:grayscale-0 transition-all cursor-default">🖼️</span>
                        )}
                      </div>
                    </td>

                    {/* Interactions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400">
                        <span className="flex items-center gap-1" title="Lượt thích">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                          <span className="text-gray-700">{item.likeCount}</span>
                        </span>
                        <span className="flex items-center gap-1" title="Lượt không thích">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/></svg>
                          <span className="text-gray-700">{item.dislikeCount}</span>
                        </span>
                        <span className="flex items-center gap-1" title="Bình luận">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          <span className="text-gray-700">{item.commentCount}</span>
                        </span>
                        <span className="flex items-center gap-1" title="Chia sẻ">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                          <span className="text-gray-700">{item.shareCount}</span>
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-gray-400 text-[11px] whitespace-nowrap font-bold uppercase tracking-tighter">{formatDate(item.createdAt)}</td>

                    {/* Status */}
                    <td className="px-5 py-4"><StatusBadge status={item.status} /></td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/posts/${item.id}`)}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider bg-gray-900 text-white hover:bg-black transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          Xem chi tiết
                        </button>
                        <button
                          onClick={() => handleToggleStatus(item.id)}
                          className={`p-1.5 rounded-lg transition-all ${
                            item.status === 'ACTIVE'
                              ? 'text-red-400 hover:bg-red-50 hover:text-red-600'
                              : 'text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600'
                          }`}
                          title={item.status === 'ACTIVE' ? 'Ẩn nội dung' : 'Khôi phục nội dung'}
                        >
                          {item.status === 'ACTIVE' ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        {!loading && pagination.totalElements > 0 && (
          <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Tổng cộng: <span className="text-gray-900">{pagination.totalElements}</span> bài viết
            </p>
            <div className="flex items-center gap-2">
               <button 
                disabled={pagination.page === 0}
                onClick={() => fetchContents(pagination.page - 1)}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors bg-white shadow-sm"
               >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
               </button>
               <span className="text-xs font-bold text-gray-700 px-3">Trang {pagination.page + 1} / {pagination.totalPages || 1}</span>
               <button 
                disabled={pagination.page >= pagination.totalPages - 1}
                onClick={() => fetchContents(pagination.page + 1)}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors bg-white shadow-sm"
               >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentModeration;
