import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_DETAIL = {
  user: {
    id: 'u1',
    avatar: 'https://i.pravatar.cc/150?img=11',
    full_name: 'Nguyễn Hải Đăng',
    email: 'dang.nguyen@campushub.edu.vn',
    student_id: 'IT2022001',
    department: 'Công nghệ Thông tin',
    joined_at: '2024-09-05',
    status: 'ACTIVE',
  },
  posts: [
    { id: 'p1', content: 'Hôm nay bảo vệ đồ án ReactJS vui quá mọi người ạ!', likes: 45, comments: 12, created_at: '2026-05-01', status: 'ACTIVE' },
    { id: 'p2', content: 'Cần pass lại tài liệu môn Mạng máy tính giá rẻ.', likes: 5, comments: 1, created_at: '2026-04-20', status: 'HIDDEN' },
  ],
  comments: [
    { id: 'c1', post_id: 'p99', content: 'Bọn em xin file PDF với ạ.', created_at: '2026-04-25' },
    { id: 'c2', post_id: 'p102', content: 'Code này chạy lỗi rồi bạn ơi.', created_at: '2026-04-22' },
  ],
  reports_against: [
    { id: 'r1', reporter: 'Trần B', reason: 'Spam/Quảng cáo', content_snapshot: 'Cần pass lại tài liệu môn Mạng máy tính giá rẻ.', status: 'RESOLVED', created_at: '2026-04-21' },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

// ── Sub-components ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    ACTIVE:   { label: 'Hoạt động', cls: 'bg-emerald-50 text-emerald-600 ring-emerald-200' },
    BANNED:   { label: 'Đã khóa',   cls: 'bg-red-50 text-red-600 ring-red-200' },
    HIDDEN:   { label: 'Đã ẩn',     cls: 'bg-gray-100 text-gray-500 ring-gray-200' },
    RESOLVED: { label: 'Đã xử lý', cls: 'bg-emerald-50 text-emerald-600 ring-emerald-200' },
    OPEN:     { label: 'Chờ xử lý', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
    CLOSED:   { label: 'Đã đóng',   cls: 'bg-gray-100 text-gray-500 ring-gray-200' },
  };
  const { label, cls } = map[status] || { label: status, cls: 'bg-gray-100 text-gray-500 ring-gray-200' };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ring-1 ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
};

// Tab: Posts
const PostsTab = ({ posts }) => (
  <div className="space-y-3">
    {posts.length === 0 ? (
      <p className="text-center text-gray-400 py-16 text-sm">Người dùng chưa có bài viết nào.</p>
    ) : (
      posts.map((p) => (
        <div key={p.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-gray-800 leading-relaxed flex-1 line-clamp-3">{p.content}</p>
            <StatusBadge status={p.status} />
          </div>
          <div className="mt-3 flex items-center gap-5 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {p.likes} lượt thích
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {p.comments} bình luận
            </span>
            <span className="flex items-center gap-1.5 ml-auto">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {formatDate(p.created_at)}
            </span>
          </div>
        </div>
      ))
    )}
  </div>
);

// Tab: Comments
const CommentsTab = ({ comments }) => (
  <div className="space-y-3">
    {comments.length === 0 ? (
      <p className="text-center text-gray-400 py-16 text-sm">Người dùng chưa có bình luận nào.</p>
    ) : (
      comments.map((c) => (
        <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow">
          <p className="text-sm text-gray-800 leading-relaxed">{c.content}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 font-medium">
            <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 font-mono">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              Bài #{c.post_id}
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {formatDate(c.created_at)}
            </span>
          </div>
        </div>
      ))
    )}
  </div>
);

// Tab: Reports Against
const ReportsTab = ({ reports }) => (
  <div className="space-y-3">
    {reports.length === 0 ? (
      <p className="text-center text-gray-400 py-16 text-sm">Không có báo cáo vi phạm nào đối với người dùng này.</p>
    ) : (
      reports.map((r) => (
        <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">{r.reporter}</p>
              <p className="text-xs text-red-600 font-bold mt-0.5">{r.reason}</p>
            </div>
            <StatusBadge status={r.status} />
          </div>
          <blockquote className="border-l-4 border-red-200 bg-red-50/50 pl-3 pr-3 py-2.5 rounded-r-xl">
            <p className="text-xs text-gray-600 italic leading-relaxed">"{r.content_snapshot}"</p>
          </blockquote>
          <p className="mt-3 text-right text-xs text-gray-400 font-medium">{formatDate(r.created_at)}</p>
        </div>
      ))
    )}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const TABS = [
  { key: 'posts',    label: 'Bài viết',     count: (d) => d.posts.length },
  { key: 'comments', label: 'Bình luận',    count: (d) => d.comments.length },
  { key: 'reports',  label: 'Bị cáo buộc', count: (d) => d.reports_against.length },
];

const UserDetailPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [data] = useState(MOCK_DETAIL);
  const { user, posts, comments, reports_against } = data;

  React.useEffect(() => {
    const breadcrumb = document.getElementById('breadcrumb-user-name');
    if (breadcrumb && user) {
      breadcrumb.textContent = user.full_name;
    }
    return () => {
      if (breadcrumb) breadcrumb.textContent = 'Chi tiết';
    };
  }, [user]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-28 bg-gray-900" />

        {/* Info */}
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end justify-between gap-4">
            <div className="ring-4 ring-white rounded-full flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.full_name}
                className="w-20 h-20 rounded-full object-cover border border-gray-100"
              />
            </div>
            {/* Action */}
            <button
              className={`mb-1 px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                user.status === 'ACTIVE'
                  ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100'
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d={user.status === 'ACTIVE' ? 'M7 11V7a5 5 0 0 1 10 0v4' : 'M7 11V7a5 5 0 0 1 9.9-1'}/>
              </svg>
              {user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa'}
            </button>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-gray-900 tracking-tight">{user.full_name}</h1>
              <StatusBadge status={user.status} />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
          </div>

          {/* Info chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { icon: <><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></>, label: user.student_id },
              { icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>, label: user.department },
              { icon: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>, label: `Tham gia ${formatDate(user.joined_at)}` },
            ].map(({ icon, label }, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tab nav */}
        <div className="flex items-center border-b border-gray-100 px-2 pt-1">
          {TABS.map((tab) => {
            const count = tab.count(data);
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-2 px-4 py-3.5 text-sm font-semibold transition-colors whitespace-nowrap ${
                  isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
                <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {count}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="p-5">
          {activeTab === 'posts'    && <PostsTab posts={posts} />}
          {activeTab === 'comments' && <CommentsTab comments={comments} />}
          {activeTab === 'reports'  && <ReportsTab reports={reports_against} />}
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
