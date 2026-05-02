import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserManagement } from '../hooks/useUserManagement';

// ── Internal Components ───────────────────────────────────────────────────────
const Avatar = ({ src, name, size = 'md' }) => {
  const dims = size === 'lg' ? 'w-16 h-16 text-xl' : 'w-10 h-10 text-sm';
  return src ? (
    <img src={src} alt={name} className={`${dims.split(' ')[0]} ${dims.split(' ')[1]} rounded-full object-cover border border-gray-100 shadow-sm`} />
  ) : (
    <div className={`${dims} rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 border border-gray-100`}>
      {name.charAt(0)}
    </div>
  );
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${
    status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' : 'bg-red-50 text-red-600 ring-1 ring-red-200'
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`} />
    {status === 'ACTIVE' ? 'HOẠT ĐỘNG' : 'ĐÃ KHÓA'}
  </span>
);

const formatDate = (iso) => new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

const ConfirmDialog = ({ user, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl scale-in-center">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${user.status === 'ACTIVE' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {user.status === 'ACTIVE' ? <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/> : <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}
        </svg>
      </div>
      <h3 className="text-lg font-black text-gray-900 mb-2">Xác nhận thay đổi?</h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Bạn có chắc muốn {user.status === 'ACTIVE' ? <span className="text-red-600 font-bold">KHÓA</span> : <span className="text-emerald-600 font-bold">MỞ KHÓA</span>} tài khoản <b>{user.full_name}</b>?
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all">Hủy</button>
        <button onClick={() => onConfirm(user.id)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${user.status === 'ACTIVE' ? 'bg-red-500 hover:bg-red-600 shadow-red-100' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100'} shadow-lg`}>Đồng ý</button>
      </div>
    </div>
  </div>
);

const DetailModal = ({ user, onClose, onBanAction }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative scale-in-center">
      <div className="h-24 bg-gray-900 relative">
        <div className="absolute -bottom-10 left-6 ring-4 ring-white rounded-full">
          <Avatar src={user.avatar} name={user.full_name} size="lg" />
        </div>
      </div>
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1">
            <h2 className="text-xl font-black text-gray-900 leading-tight">{user.full_name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <StatusBadge status={user.status} />
          <span className="text-xs text-gray-400 font-medium italic">Ngày tham gia: {formatDate(user.joined_at)}</span>
        </div>

        {/* Quick Stats */}
        <div className="mt-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Thống kê hoạt động</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50/50 rounded-2xl px-4 py-3 text-center border border-blue-100/50">
              <p className="text-xl font-black text-blue-600">{user.stats.total_posts}</p>
              <p className="text-[10px] text-blue-400 font-bold uppercase mt-0.5">Bài viết</p>
            </div>
            <div className="bg-purple-50/50 rounded-2xl px-4 py-3 text-center border border-purple-100/50">
              <p className="text-xl font-black text-purple-600">{user.stats.total_comments}</p>
              <p className="text-[10px] text-purple-400 font-bold uppercase mt-0.5">Bình luận</p>
            </div>
            <div className={`rounded-2xl px-4 py-3 text-center border ${user.stats.reported_count > 0 ? 'bg-red-50/50 border-red-100/50' : 'bg-gray-50/50 border-gray-100/50'}`}>
              <p className={`text-xl font-black ${user.stats.reported_count > 0 ? 'text-red-500' : 'text-gray-400'}`}>{user.stats.reported_count}</p>
              <p className={`text-[10px] font-bold uppercase mt-0.5 ${user.stats.reported_count > 0 ? 'text-red-400' : 'text-gray-400'}`}>Báo cáo</p>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => { onClose(); onBanAction(user); }}
            className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              user.status === 'ACTIVE'
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100'
            }`}
          >
            {user.status === 'ACTIVE' ? (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Khóa tài khoản</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg> Mở khóa</>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const UserManagement = () => {
  const navigate = useNavigate();
  const {
    users,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    confirmUser,
    setConfirmUser,
    filteredUsers,
    totalActive,
    totalBanned,
    pagination,
    fetchUsers,
    handleToggleBan
  } = useUserManagement();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Người dùng</h1>
          <p className="text-sm font-medium text-gray-500 mt-0.5">Quản lý tài khoản sinh viên và người dùng CampusHub.</p>
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
            placeholder="Tìm theo tên hoặc email..."
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
            <option value="ALL">Tất cả</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="BANNED">Đã khóa</option>
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
                {['Người dùng', 'Ngày tham gia', 'Trạng thái', 'Hành động'].map((h) => (
                  <th key={h} className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-200">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      <p className="font-medium text-sm text-gray-500">Không tìm thấy người dùng nào</p>
                      <p className="text-xs">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatarUrl} name={user.fullName} />
                        <div>
                          <p className="font-semibold text-gray-900 leading-tight">{user.fullName}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap font-medium">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-4"><StatusBadge status={user.status} /></td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all flex items-center gap-1.5"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                          </svg>
                          Xem
                        </button>
                        <button
                          onClick={() => setConfirmUser(user)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            user.status === 'ACTIVE'
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
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
              Tổng cộng: <span className="text-gray-900">{pagination.totalElements}</span> người dùng
            </p>
            <div className="flex items-center gap-2">
               <button 
                disabled={pagination.page === 0}
                onClick={() => fetchUsers(pagination.page - 1)}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors bg-white shadow-sm"
               >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
               </button>
               <span className="text-xs font-bold text-gray-700 px-3">Trang {pagination.page + 1} / {pagination.totalPages || 1}</span>
               <button 
                disabled={pagination.page >= pagination.totalPages - 1}
                onClick={() => fetchUsers(pagination.page + 1)}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors bg-white shadow-sm"
               >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
               </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {confirmUser && (
        <ConfirmDialog
          user={confirmUser}
          onConfirm={handleToggleBan}
          onCancel={() => setConfirmUser(null)}
        />
      )}
    </div>
  );
};

export default UserManagement;
