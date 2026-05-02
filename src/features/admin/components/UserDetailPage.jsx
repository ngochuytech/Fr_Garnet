import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  getUserByIdAPI, 
  getPostsByUserIdAPI, 
  getCommentsByUserIdAPI, 
  getReportsByUserIdAPI,
  banUserAPI,
  unbanUserAPI
} from '../services/userService';

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

const PaginationControls = ({ pagination, onPageChange }) => {
  if (pagination.totalPages <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
        Tổng: <span className="text-gray-900">{pagination.totalElements}</span> mục
      </p>
      <div className="flex items-center gap-2">
        <button 
          disabled={pagination.page === 0}
          onClick={() => onPageChange(pagination.page - 1)}
          className="p-1.5 rounded-lg border border-gray-100 disabled:opacity-30 hover:bg-gray-50 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span className="text-[11px] font-bold text-gray-600 px-2">Trang {pagination.page + 1} / {pagination.totalPages}</span>
        <button 
          disabled={pagination.page >= pagination.totalPages - 1}
          onClick={() => onPageChange(pagination.page + 1)}
          className="p-1.5 rounded-lg border border-gray-100 disabled:opacity-30 hover:bg-gray-50 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  );
};
const Lightbox = ({ images, index, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[110] p-2 bg-white/10 rounded-full hover:bg-white/20">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      
      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[110] p-4 bg-white/5 rounded-full hover:bg-white/10 border border-white/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[110] p-4 bg-white/5 rounded-full hover:bg-white/10 border border-white/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white text-[11px] font-black uppercase tracking-widest z-[110]">
            {index + 1} / {images.length}
          </div>
        </>
      )}

      <div className="relative max-w-[90vw] max-h-[85vh] select-none" onClick={(e) => e.stopPropagation()}>
        <img 
          src={images[index].imageUrl || images[index]} 
          alt="Preview" 
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
        />
      </div>
    </div>
  );
};

// Tab: Posts
const PostsTab = ({ posts, loading, pagination, onPageChange }) => {
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 });

  const openLightbox = (images, index) => {
    setLightbox({ open: true, images, index });
  };

  const handlePrev = () => {
    setLightbox(prev => ({ ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }));
  };

  const handleNext = () => {
    setLightbox(prev => ({ ...prev, index: (prev.index + 1) % prev.images.length }));
  };

  return (
    <div className="space-y-3">
      {loading ? (
        <div className="py-16 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div></div>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-400 py-16 text-sm">Người dùng chưa có bài viết nào.</p>
      ) : (
        <>
          {posts.map((p) => (
            <div key={p.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-800 leading-relaxed line-clamp-3" dangerouslySetInnerHTML={{ __html: p.content }} />
                  
                  {/* Image Gallery - Max 2 images display */}
                  {p.images && p.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2 max-w-sm">
                      {p.images.slice(0, 2).map((img, idx) => (
                        <div 
                          key={idx} 
                          className="relative group cursor-pointer"
                          onClick={() => openLightbox(p.images, idx)}
                        >
                          <img 
                            src={img.imageUrl || img} 
                            alt="Post content" 
                            className="rounded-xl w-full h-32 object-cover border border-gray-100 shadow-sm transition-transform group-hover:scale-[1.02]" 
                          />
                          {idx === 1 && p.images.length > 2 && (
                            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center border border-white/20">
                              <span className="text-white text-xs font-black">+{p.images.length - 2}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                  {p.likeCount || 0}
                </span>
                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/></svg>
                  {p.dislikeCount || 0}
                </span>
                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  {p.commentCount || 0}
                </span>
                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                  {p.shareCount || 0}
                </span>
                <span className="flex items-center gap-1.5 ml-auto text-[10px] font-bold text-gray-300">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {formatDate(p.createdAt)}
                </span>
              </div>
            </div>
          ))}
          <PaginationControls pagination={pagination} onPageChange={onPageChange} />
        </>
      )}

      {lightbox.open && (
        <Lightbox 
          images={lightbox.images} 
          index={lightbox.index} 
          onClose={() => setLightbox({ ...lightbox, open: false })}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

// Tab: Comments
const CommentsTab = ({ comments, loading, pagination, onPageChange }) => (
  <div className="space-y-3">
    {loading ? (
      <div className="py-16 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div></div>
    ) : comments.length === 0 ? (
      <p className="text-center text-gray-400 py-16 text-sm">Người dùng chưa có bình luận nào.</p>
    ) : (
      <>
        {comments.map((c) => (
          <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow">
            <p className="text-sm text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: c.content }} />
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 font-medium">
              <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 font-mono">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                Bài #{c.postId?.substring(0, 8)}
              </span>
              <span className="ml-auto flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {formatDate(c.createdAt)}
              </span>
            </div>
          </div>
        ))}
        <PaginationControls pagination={pagination} onPageChange={onPageChange} />
      </>
    )}
  </div>
);

// Tab: Reports Against
const ReportsTab = ({ reports, loading, pagination, onPageChange }) => (
  <div className="space-y-3">
    {loading ? (
      <div className="py-16 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div></div>
    ) : reports.length === 0 ? (
      <p className="text-center text-gray-400 py-16 text-sm">Không có báo cáo vi phạm nào đối với người dùng này.</p>
    ) : (
      <>
        {reports.map((r) => (
          <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">{r.reporter?.fullName}</p>
                <p className="text-xs text-red-600 font-bold mt-0.5">{r.reason}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <blockquote className="border-l-4 border-red-200 bg-red-50/50 pl-3 pr-3 py-2.5 rounded-r-xl">
              <p className="text-xs text-gray-600 italic leading-relaxed" dangerouslySetInnerHTML={{ __html: `"${r.reportedContentSnapshot || 'Nội dung không khả dụng.'}"` }} />
            </blockquote>
            <p className="mt-3 text-right text-xs text-gray-400 font-medium">{formatDate(r.createdAt)}</p>
          </div>
        ))}
        <PaginationControls pagination={pagination} onPageChange={onPageChange} />
      </>
    )}
  </div>
);

const UserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  // Tab Data States
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [reports, setReports] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);
  
  // Pagination States
  const [postsPagination, setPostsPagination] = useState({ page: 0, size: 20, totalPages: 0, totalElements: 0 });
  const [commentsPagination, setCommentsPagination] = useState({ page: 0, size: 20, totalPages: 0, totalElements: 0 });
  const [reportsPagination, setReportsPagination] = useState({ page: 0, size: 20, totalPages: 0, totalElements: 0 });

  const fetchUserDetail = useCallback(async () => {
    setLoadingUser(true);
    try {
      const data = await getUserByIdAPI(userId);
      setUser(data);
    } catch (error) {
      toast.error('Không thể tải thông tin người dùng');
      navigate('/admin/users');
    } finally {
      setLoadingUser(false);
    }
  }, [userId, navigate]);

  const fetchPosts = useCallback(async (page = 0) => {
    setTabLoading(true);
    try {
      const res = await getPostsByUserIdAPI(userId, { page, size: postsPagination.size, sortBy: 'createdAt', sortDir: 'desc' });
      setPosts(res.items || []);
      setPostsPagination(prev => ({ ...prev, page: res.pageNumber, totalPages: res.totalPages, totalElements: res.totalElements }));
    } catch (error) {
      toast.error('Lỗi khi tải bài viết');
    } finally {
      setTabLoading(false);
    }
  }, [userId, postsPagination.size]);

  const fetchComments = useCallback(async (page = 0) => {
    setTabLoading(true);
    try {
      const res = await getCommentsByUserIdAPI(userId, { page, size: commentsPagination.size, sortBy: 'createdAt', sortDir: 'desc' });
      setComments(res.items || []);
      setCommentsPagination(prev => ({ ...prev, page: res.pageNumber, totalPages: res.totalPages, totalElements: res.totalElements }));
    } catch (error) {
      toast.error('Lỗi khi tải bình luận');
    } finally {
      setTabLoading(false);
    }
  }, [userId, commentsPagination.size]);

  const fetchReports = useCallback(async (page = 0) => {
    setTabLoading(true);
    try {
      const res = await getReportsByUserIdAPI(userId, { page, size: reportsPagination.size, sortBy: 'createdAt', sortDir: 'desc' });
      setReports(res.items || []);
      setReportsPagination(prev => ({ ...prev, page: res.pageNumber, totalPages: res.totalPages, totalElements: res.totalElements }));
    } catch (error) {
      toast.error('Lỗi khi tải báo cáo');
    } finally {
      setTabLoading(false);
    }
  }, [userId, reportsPagination.size]);

  useEffect(() => {
    if (userId) {
      fetchUserDetail();
      fetchPosts(0);
      fetchComments(0);
      fetchReports(0);
    }
  }, [userId]); // Only re-run when userId changes

  useEffect(() => {
    const breadcrumb = document.getElementById('breadcrumb-user-name');
    if (breadcrumb && user) {
      breadcrumb.textContent = user.fullName;
    }
    return () => {
      if (breadcrumb) breadcrumb.textContent = 'Chi tiết';
    };
  }, [user]);

  const handleToggleStatus = async () => {
    try {
      if (user.status === 'ACTIVE') {
        await banUserAPI(user.id);
        toast.success('Đã khóa tài khoản');
      } else {
        await unbanUserAPI(user.id);
        toast.success('Đã mở khóa tài khoản');
      }
      fetchUserDetail();
    } catch (error) {
      toast.error('Thao tác thất bại');
    }
  };

  if (loadingUser) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>;
  }

  if (!user) return null;

  const TABS = [
    { key: 'posts',    label: 'Bài viết',     count: postsPagination.totalElements },
    { key: 'comments', label: 'Bình luận',    count: commentsPagination.totalElements },
    { key: 'reports',  label: 'Bị cáo buộc', count: reportsPagination.totalElements },
  ];

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
                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=f3f4f6&color=6b7280`}
                alt={user.fullName}
                className="w-20 h-20 rounded-full object-cover border border-gray-100"
              />
            </div>
            {/* Action */}
            <button
              onClick={handleToggleStatus}
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
              <h1 className="text-xl font-black text-gray-900 tracking-tight">{user.fullName}</h1>
              <StatusBadge status={user.status} />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
          </div>

          {/* Info chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>, label: `Tham gia ${formatDate(user.createdAt)}` },
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
                  {tab.count}
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
          {activeTab === 'posts'    && <PostsTab posts={posts} loading={tabLoading} pagination={postsPagination} onPageChange={fetchPosts} />}
          {activeTab === 'comments' && <CommentsTab comments={comments} loading={tabLoading} pagination={commentsPagination} onPageChange={fetchComments} />}
          {activeTab === 'reports'  && <ReportsTab reports={reports} loading={tabLoading} pagination={reportsPagination} onPageChange={fetchReports} />}
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
