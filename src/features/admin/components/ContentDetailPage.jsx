import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getPostByIdAPI, getCommentByPostIdAPI } from '../services/postService';

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const StatusBadge = ({ status }) => {
  const map = {
    ACTIVE: { label: 'Đang hiển thị', cls: 'bg-emerald-50 text-emerald-600 ring-emerald-200' },
    HIDDEN: { label: 'Đã ẩn', cls: 'bg-amber-50 text-amber-600 ring-amber-200' },
  };
  const { label, cls } = map[status] || { label: status, cls: 'bg-gray-100 text-gray-500 ring-gray-200' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ring-1 shadow-sm ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
};

const ContentDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);

  // ── Fetch Logic ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await getPostByIdAPI(postId);
        setContent(response);
        fetchComments();
      } catch (error) {
        console.error('Error fetching post detail:', error);
        toast.error('Không thể tải chi tiết bài viết');
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const res = await getCommentByPostIdAPI(postId);
        setComments(res.items || []);
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setLoadingComments(false);
      }
    };

    if (postId) fetchDetail();
  }, [postId]);

  const handleToggleStatus = async () => {
    try {
      // Mock toggle
      const newStatus = content.status === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
      setContent(prev => ({ ...prev, status: newStatus }));
      toast.success(newStatus === 'HIDDEN' ? 'Đã ẩn nội dung' : 'Đã khôi phục nội dung');
    } catch (error) {
      toast.error('Thao tác thất bại');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-40">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  );

  if (!content) return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold text-gray-900">Không tìm thấy nội dung</h2>
      <button onClick={() => navigate('/admin/posts')} className="mt-4 text-blue-600 hover:underline">Quay lại danh sách</button>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Main Header */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-gray-900 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-50" />
          <div className="absolute -bottom-10 left-8 flex items-end gap-6">
            <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-xl ring-1 ring-gray-100">
              {content.author?.authorAvatar ? (
                <img src={content.author.authorAvatar} alt={content.author.authorName} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <div className="w-full h-full rounded-2xl bg-gray-50 flex items-center justify-center text-3xl font-black text-gray-200 uppercase">
                  {content.author?.authorName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="pb-2">
              <h1 className="text-2xl font-black text-white drop-shadow-md mb-1">{content.author?.authorName || 'Nguời dùng'}</h1>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{content.author?.department || 'Sinh viên'}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{formatDate(content.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 right-8">
            <StatusBadge status={content.status} />
          </div>
        </div>

        <div className="pt-16 px-8 pb-8 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-xl font-black text-gray-900">{content.likeCount || 0}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lượt thích</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-gray-900">{content.dislikeCount || 0}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Không thích</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-gray-900">{content.commentCount || 0}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bình luận</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-gray-900">{content.shareCount || 0}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chia sẻ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleStatus}
              className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-white transition-all shadow-lg flex items-center gap-2 ${content.status === 'ACTIVE'
                ? 'bg-red-500 hover:bg-red-600 shadow-red-100'
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100'
                }`}
            >
              {content.status === 'ACTIVE' ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  Ẩn nội dung
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  Khôi phục hiển thị
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              Nội dung chi tiết
            </h3>

            <div className="space-y-6">
              <div className="text-base text-gray-800 leading-relaxed whitespace-pre-line font-medium"
                dangerouslySetInnerHTML={{ __html: content.content }}>
              </div>

              {content.tags && content.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {content.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-500 text-[11px] font-bold rounded-lg border border-gray-100">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {content.images && content.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {content.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Attachment"
                    className="rounded-2xl w-full h-64 object-cover border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-8 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            Danh sách bình luận ({content.commentCount || 0})
          </h3>

          <div className="space-y-6">
            {loadingComments ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm italic">
                Chưa có bình luận nào.
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
                    {comment.user?.avatar ? (
                      <img src={comment.user.avatar} alt={comment.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-gray-400">{comment.user?.name?.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-gray-900">{comment.user?.name || 'Nguời dùng ẩn danh'}</span>
                        <span className="text-[10px] font-bold text-gray-500/60 uppercase tracking-tight bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{comment.user?.department}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-200" />
                        <span className="text-[10px] font-bold text-gray-400">{formatDate(comment.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-2xl border border-gray-50 whitespace-pre-wrap">
                      {comment.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar: Meta Info */}
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Thông tin hệ thống</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-xs font-bold text-gray-500">Mã định danh</span>
              <span className="text-xs font-mono text-gray-900">{content.id}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-xs font-bold text-gray-500">Loại nội dung</span>
              <span className="text-xs font-black text-blue-600 uppercase tracking-tighter">{content.type}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-xs font-bold text-gray-500">Người đăng</span>
              <span className="text-xs font-black text-gray-900 truncate max-w-[120px]">{content.author.authorName}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs font-bold text-gray-500">Cập nhật cuối</span>
              <span className="text-xs font-black text-gray-900">{formatDate(content.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-3xl border border-amber-100 p-6">
          <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            Lưu ý kiểm duyệt
          </h3>
          <p className="text-xs text-amber-700 leading-relaxed font-medium">
            Khi ẩn nội dung, bài viết sẽ không còn xuất hiện trên News Feed nhưng vẫn tồn tại trong cơ sở dữ liệu. Chỉ khôi phục khi nội dung không vi phạm tiêu chuẩn cộng đồng.
          </p>
        </div>
      </div>
    </div>
    </div >
  );
};

export default ContentDetailPage;
