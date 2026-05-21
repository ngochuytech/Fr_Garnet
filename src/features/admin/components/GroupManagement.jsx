import React, { useState } from 'react';
import { useGroupManagement } from '../hooks/useGroupManagement';

const formatDate = (value) => {
  if (!value) return 'Chưa cập nhật';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const StatusBadge = ({ status }) => {
  const isArchived = status === 'ARCHIVED';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${
      isArchived ? 'bg-red-50 text-red-600 ring-1 ring-red-200' : 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isArchived ? 'bg-red-500' : 'bg-emerald-500'}`} />
      {isArchived ? 'ĐÃ KHÓA' : 'HOẠT ĐỘNG'}
    </span>
  );
};

const GroupAvatar = ({ src, name }) => (
  <img
    src={src}
    alt={name}
    className="w-11 h-11 rounded-xl object-cover border border-gray-100 shadow-sm bg-gray-100"
  />
);

const LeaderAvatar = ({ src, name }) => (
  <img
    src={src}
    alt={name}
    className="w-9 h-9 rounded-full object-cover border border-gray-100 shadow-sm bg-gray-100"
  />
);

const ConfirmDialog = ({ group, loading, onConfirm, onCancel }) => {
  const isArchived = group.status === 'ARCHIVED';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isArchived ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {isArchived ? <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> : <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />}
          </svg>
        </div>
        <h3 className="text-lg font-black text-gray-900 mb-2">Xác nhận thay đổi?</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Bạn có chắc muốn {isArchived ? <span className="text-emerald-600 font-bold">MỞ KHÓA</span> : <span className="text-red-600 font-bold">KHÓA</span>} nhóm <b>{group.name}</b>?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-60"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => onConfirm(group.id)}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 ${isArchived ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {loading ? 'Đang xử lý...' : 'Đồng ý'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ReportDialog = ({ group, loading, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    reason: 'VIOLATION',
    description: '',
    adminNotes: '',
    action: 'ARCHIVE',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(group.id, formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-gray-900">Xử lý nhóm</h3>
            <p className="text-sm text-gray-500 mt-1">Ghi nhận vi phạm của nhóm <b>{group.name}</b>.</p>
          </div>
          <button type="button" onClick={onCancel} className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <label className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Lý do</span>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="VIOLATION">Vi phạm quy định</option>
              <option value="SPAM">Spam</option>
              <option value="INAPPROPRIATE_CONTENT">Nội dung không phù hợp</option>
              <option value="OTHER">Khác</option>
            </select>
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Mô tả</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Mô tả ngắn về nội dung vi phạm..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Ghi chú quản trị</span>
          <textarea
            name="adminNotes"
            value={formData.adminNotes}
            onChange={handleChange}
            rows={3}
            placeholder="Ghi chú nội bộ cho lần xử lý này..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            required
          />
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onCancel} disabled={loading} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-60">
            Hủy
          </button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-60">
            {loading ? 'Đang lưu...' : 'Lưu xử lý'}
          </button>
        </div>
      </form>
    </div>
  );
};

const GroupManagement = () => {
  const {
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
  } = useGroupManagement();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Nhóm</h1>
          <p className="text-sm font-medium text-gray-500 mt-0.5">Quản lý trạng thái và xử lý vi phạm của các nhóm CampusHub.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Tìm theo tên nhóm..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-2.5 pr-9 focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm cursor-pointer"
          >
            <option value="ALL">Tất cả</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="ARCHIVED">Đã khóa</option>
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                {['Nhóm', 'Trưởng nhóm', 'Thành viên', 'Ngày tạo', 'Trạng thái', 'Hành động'].map((heading) => (
                  <th key={heading} className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    </div>
                  </td>
                </tr>
              ) : groups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-200">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <p className="font-medium text-sm text-gray-500">Không tìm thấy nhóm nào</p>
                      <p className="text-xs">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                  </td>
                </tr>
              ) : (
                groups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 min-w-[260px]">
                      <div className="flex items-center gap-3">
                        <GroupAvatar src={group.avatarUrl} name={group.name} />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 leading-tight truncate">{group.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 min-w-[180px]">
                      <div className="flex items-center gap-3">
                        <LeaderAvatar src={group.leaderAvatarUrl} name={group.leaderName} />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-700 leading-tight truncate">{group.leaderName}</p>
                          {group.ownerEmail && <p className="text-[11px] text-gray-400 mt-0.5 truncate">{group.ownerEmail}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-xs font-bold whitespace-nowrap">{group.memberCount.toLocaleString('vi-VN')}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap font-medium">{formatDate(group.createdAt)}</td>
                    <td className="px-5 py-4"><StatusBadge status={group.status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setReportGroup(group)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all"
                        >
                          Xử lý
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmGroup(group)}
                          disabled={actionLoadingId === group.id}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-60 ${
                            group.status === 'ARCHIVED'
                              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100'
                              : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                          }`}
                        >
                          {group.status === 'ARCHIVED' ? 'Mở khóa' : 'Khóa'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && pagination.totalElements > 0 && (
          <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Tổng cộng: <span className="text-gray-900">{pagination.totalElements}</span> nhóm
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pagination.page === 0}
                onClick={() => fetchGroups(pagination.page - 1)}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors bg-white shadow-sm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <span className="text-xs font-bold text-gray-700 px-3">Trang {pagination.page + 1} / {pagination.totalPages || 1}</span>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages - 1}
                onClick={() => fetchGroups(pagination.page + 1)}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors bg-white shadow-sm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {confirmGroup && (
        <ConfirmDialog
          group={confirmGroup}
          loading={actionLoadingId === confirmGroup.id}
          onConfirm={handleToggleLock}
          onCancel={() => setConfirmGroup(null)}
        />
      )}

      {reportGroup && (
        <ReportDialog
          group={reportGroup}
          loading={actionLoadingId === reportGroup.id}
          onSubmit={handleReportGroup}
          onCancel={() => setReportGroup(null)}
        />
      )}
    </div>
  );
};

export default GroupManagement;
