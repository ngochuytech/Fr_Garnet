import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getPostByIdAPI, getCommentByPostIdAPI, reportPostAPI, activePostAPI } from '../services/postService';
import Comment from '../../../components/Comment';

// ── Constants ─────────────────────────────────────────────────────────────────
const REPORT_REASONS = [
  'Spam hoặc lừa đảo',
  'Ngôn từ kích động thù địch',
  'Quấy rối hoặc bắt nạt',
  'Thông tin sai lệch',
  'Ảnh khỏa thân hoặc nội dung tình dục',
  'Khác',
];

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
    DELETED: { label: 'Đã xóa', cls: 'bg-gray-50 text-gray-600 ring-gray-200' },
    REPORTED: { label: 'Đã gỡ bài', cls: 'bg-red-50 text-red-600 ring-red-200' },
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
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // ── Take Down State ─────────────────────────────────────────────────────────
  const [isTakeDownModalOpen, setIsTakeDownModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [takeDownReason, setTakeDownReason] = useState('');
  const [takeDownNote, setTakeDownNote] = useState('');

  // ── Handlers & Helpers ──────────────────────────────────────────────────────
  const openImageModal = (index) => setSelectedImageIndex(index);
  const closeImageModal = () => setSelectedImageIndex(null);

  const nextImage = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!content?.images) return;
    setSelectedImageIndex((prev) => (prev + 1) % content.images.length);
  }, [content?.images]);

  const prevImage = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!content?.images) return;
    setSelectedImageIndex((prev) => (prev - 1 + content.images.length) % content.images.length);
  }, [content?.images]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') closeImageModal();
      if (e.key === 'ArrowRight') nextImage(e);
      if (e.key === 'ArrowLeft') prevImage(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, nextImage, prevImage]);

  const formatTimeAgo = useCallback((date) => {
    if (!date) return '';
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

    return formatDate(date);
  }, []);

  const handleReactionComment = useCallback(async (commentId, reactionType) => {
    console.log(`Reaction ${reactionType} on comment ${commentId}`);
  }, []);

  const handleCreateComment = useCallback(async (content, parentId = null) => {
    console.log('Creating comment:', { content, parentId, postId });
  }, [postId]);

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
    if (content.status === 'ACTIVE') {
      setIsTakeDownModalOpen(true);
    } else {
      setIsRestoreModalOpen(true);
    }
  };

  const confirmRestore = async () => {
    try {
      await activePostAPI(postId);
      setContent(prev => ({ ...prev, status: 'ACTIVE' }));
      setIsRestoreModalOpen(false);
      toast.success('Đã khôi phục hiển thị nội dung');
    } catch (error) {
      console.error('Error restoring post:', error);
      toast.error('Không thể khôi phục nội dung');
    }
  };

  const confirmTakeDown = async () => {
    if (!takeDownReason) {
      toast.error('Vui lòng chọn lý do gỡ bài');
      return;
    }

    if (!takeDownNote.trim()) {
      toast.error('Vui lòng nhập ghi chú chi tiết từ Admin');
      return;
    }
    
    try {
      const payload = {
        reason: takeDownReason,
        adminNotes: takeDownNote
      };
      
      await reportPostAPI(postId, payload);
      
      setContent(prev => ({ ...prev, status: 'REPORTED' }));
      setIsTakeDownModalOpen(false);
      setTakeDownReason('');
      setTakeDownNote('');
      toast.success('Đã gỡ bài viết vi phạm');
    } catch (error) {
      console.error('Error reporting post:', error);
      toast.error('Không thể thực hiện thao tác gỡ bài');
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
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-gray-800 to-slate-900 opacity-50" />
          <div className="absolute bottom-4 left-8 flex items-end gap-6">
            <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-xl ring-1 ring-gray-100">
              {content.author?.authorAvatar ? (
                <img src={content.author.authorAvatar} alt={content.author.authorName} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <div className="w-full h-full rounded-2xl bg-gray-100 flex items-center justify-center text-3xl font-black text-gray-500 uppercase">
                  {content.author?.authorName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-black text-white drop-shadow-lg mb-1">{content.author?.authorName || 'Nguời dùng'}</h1>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{content.author?.department || 'Sinh viên'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{formatDate(content.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 right-8">
            <StatusBadge status={content.status} />
          </div>
        </div>

        <div className="pt-6 px-8 pb-8 flex items-center justify-between bg-slate-300">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-xl font-black text-gray-900">{content.likeCount || 0}</p>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Lượt thích</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-gray-900">{content.dislikeCount || 0}</p>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Không thích</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-gray-900">{content.commentCount || 0}</p>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Bình luận</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-gray-900">{content.shareCount || 0}</p>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Chia sẻ</p>
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
                  Gỡ bài viết
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
                <div className={`grid gap-4 mt-8 ${content.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {content.images.slice(0, 2).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative cursor-pointer group overflow-hidden rounded-2xl border border-gray-100"
                      onClick={() => openImageModal(idx)}
                    >
                      <img
                        src={img}
                        alt="Attachment"
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {idx === 1 && content.images.length > 2 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                          <span className="text-white text-3xl font-black tracking-tighter">+{content.images.length - 2}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
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
                  <Comment
                    key={comment.id}
                    comment={comment}
                    authorId={content.author?.id}
                    activeReplyId={activeReplyId}
                    setActiveReplyId={setActiveReplyId}
                    handleReactionComment={handleReactionComment}
                    handleCreateComment={handleCreateComment}
                    formatTimeAgo={formatTimeAgo}
                    showActions={false}
                  />
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
              Khi gỡ nội dung, bài viết sẽ không còn xuất hiện trên News Feed nhưng vẫn tồn tại trong cơ sở dữ liệu. Chỉ khôi phục khi nội dung không vi phạm tiêu chuẩn cộng đồng.
            </p>
          </div>
        </div>
      </div>

      {/* Image Modal / Lightbox */}
      {selectedImageIndex !== null && content.images && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-300 backdrop-blur-sm"
          onClick={closeImageModal}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-all p-3 bg-white/10 hover:bg-white/20 rounded-full z-[110]"
            onClick={closeImageModal}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>

          {content.images.length > 1 && (
            <>
              <button
                className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-all p-4 bg-white/10 hover:bg-white/20 rounded-full z-[110]"
                onClick={prevImage}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button
                className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-all p-4 bg-white/10 hover:bg-white/20 rounded-full z-[110]"
                onClick={nextImage}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </>
          )}

          <div className="relative max-w-full max-h-full flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
            <img
              src={content.images[selectedImageIndex]}
              alt="Full view"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300"
            />
            <div className="text-white/80 text-[11px] font-black uppercase tracking-[0.2em] bg-white/10 px-6 py-2 rounded-full border border-white/10">
              {selectedImageIndex + 1} / {content.images.length}
            </div>
          </div>
        </div>
      )}

      {/* Take Down Modal */}
      {isTakeDownModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsTakeDownModalOpen(false)} />
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shadow-sm border border-red-100">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Gỡ nội dung vi phạm</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Xác nhận lý do vi phạm tiêu chuẩn</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Lý do gỡ bài (Bắt buộc)</label>
                  <div className="grid grid-cols-1 gap-2">
                    {REPORT_REASONS.map((reason) => (
                      <button
                        key={reason}
                        onClick={() => setTakeDownReason(reason)}
                        className={`flex items-center justify-between px-5 py-3.5 rounded-2xl border-2 transition-all duration-300 text-sm font-bold ${
                          takeDownReason === reason
                            ? 'border-red-500 bg-red-50 text-red-600 shadow-md translate-x-1'
                            : 'border-gray-50 bg-gray-50/50 text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {reason}
                        {takeDownReason === reason && (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Ghi chú thêm từ Admin (Bắt buộc)</label>
                  <textarea
                    value={takeDownNote}
                    onChange={(e) => setTakeDownNote(e.target.value)}
                    placeholder="Nhập nội dung chi tiết về vi phạm..."
                    className="w-full h-32 px-5 py-4 rounded-3xl bg-gray-50 border-2 border-gray-50 text-sm font-medium focus:outline-none focus:border-red-100 focus:bg-white transition-all resize-none placeholder:text-gray-300"
                  />
                </div>

                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3">
                  <div className="text-amber-500 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                  </div>
                  <p className="text-[11px] text-amber-700 font-bold leading-relaxed">
                    Hệ thống sẽ tự động gửi thông báo chi tiết cho tác giả kèm theo lý do bạn đã chọn ở trên.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-10">
                <button
                  onClick={() => setIsTakeDownModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmTakeDown}
                  className="flex-[1.5] py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-red-500 text-white shadow-xl shadow-red-100 hover:bg-red-600 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  Xác nhận Gỡ
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Restore Modal */}
      {isRestoreModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsRestoreModalOpen(false)} />
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-6 mx-auto shadow-sm border border-emerald-100">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Khôi phục nội dung</h2>
              <p className="text-sm font-bold text-gray-500 leading-relaxed mb-8 px-4">Bạn có chắc chắn muốn khôi phục hiển thị cho bài viết này không? Nội dung sẽ xuất hiện lại trên bảng tin của mọi người.</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsRestoreModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmRestore}
                  className="flex-[1.5] py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-emerald-500 text-white shadow-xl shadow-emerald-100 hover:bg-emerald-600 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  Xác nhận khôi phục
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDetailPage;
