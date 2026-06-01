import { useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import CommentInput from './CommentInput';
import { useNavigate } from 'react-router-dom';
import { useComment } from '../hooks/useComment';
import { useAuth } from '../context/AuthContext';

const REPORT_REASONS = [
  'Nội dung spam hoặc lừa đảo',
  'Ngôn từ thù ghét hoặc quấy rối',
  'Nội dung không phù hợp',
  'Mạo danh hoặc thông tin sai lệch',
  'Vi phạm quy định cộng đồng',
];

const ReportCommentModal = ({
  comment,
  value,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}) => {
  if (!comment) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 px-4" style={{ zIndex: 9999 }}>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-xl bg-white border border-gray-100 shadow-xl p-5 text-left"
      >
        <h2 className="text-base font-bold text-gray-900">Báo cáo bình luận</h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          Báo cáo bình luận của <span className="font-bold text-gray-900">{comment.user?.name}</span> đến quản trị viên.
        </p>

        <label className="block mt-5 text-[12px] font-bold uppercase tracking-wide text-gray-500">
          Lý do vi phạm
        </label>
        <select
          value={value.reason}
          onChange={(event) => onChange({ ...value, reason: event.target.value })}
          disabled={isSubmitting}
          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#d09596] disabled:bg-gray-50"
          required
        >
          <option value="">Chọn lý do</option>
          {REPORT_REASONS.map((reason) => (
            <option key={reason} value={reason}>{reason}</option>
          ))}
        </select>

        <label className="block mt-4 text-[12px] font-bold uppercase tracking-wide text-gray-500">
          Mô tả thêm
        </label>
        <textarea
          value={value.description}
          onChange={(event) => onChange({ ...value, description: event.target.value })}
          disabled={isSubmitting}
          rows="4"
          placeholder="Nhập chi tiết để quản trị viên dễ kiểm tra..."
          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#d09596] disabled:bg-gray-50 resize-none"
        />

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="py-2 px-4 rounded-lg border border-gray-200 text-[13px] font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !value.reason}
            className="py-2 px-4 rounded-lg bg-[#8d3f41] text-[13px] font-bold text-white hover:bg-[#6a2f30] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
};

const Comment = ({
  comment,
  authorId,
  activeReplyId,
  setActiveReplyId,
  handleReactionComment,
  handleCreateComment,
  formatTimeAgo,
  depth = 0,
  showActions = true
}) => {
  const { showReplies,
    replies,
    loadingReplies,
    hasMoreReplies,
    userReaction,
    likeCount,
    dislikeCount,
    handleLocalReaction,
    handleLoadReplies,
    handleReportComment,
    setReplies,
    setShowReplies,
    isMaxDepth,
    isNested,
    containerClass } = useComment({ comment, handleReactionComment, depth });

    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportForm, setReportForm] = useState({ reason: '', description: '' });
    const [isReporting, setIsReporting] = useState(false);

    const submitReport = async (e) => {
      e.preventDefault();
      setIsReporting(true);
      const success = await handleReportComment(reportForm);
      setIsReporting(false);
      if (success) {
        toast.success('Đã gửi báo cáo thành công');
        setIsReportModalOpen(false);
        setReportForm({ reason: '', description: '' });
      } else {
        toast.error('Không thể gửi báo cáo');
      }
    };

    const handleNavigateToUser = (e, userId) => {
      if (e) e.stopPropagation();
      if (userId) {
        navigate(`/user/${userId}`);
      }
    };

  return (
    <div className={`${containerClass}`}>
      <div className="flex items-start gap-2">
        <div 
          className={`${isNested ? 'w-6 h-6 mt-0.5' : 'w-8 h-8'} rounded-full overflow-hidden flex-shrink-0 cursor-pointer`}
          onClick={(e) => handleNavigateToUser(e, comment.user?.id)}
        >
          <img
            src={comment.user?.avatar || `https://ui-avatars.com/api/?name=${comment.user?.name || 'User'}&background=random`}
            alt={comment.user?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className={`flex flex-col flex-1 ${isNested && !isMaxDepth ? 'pl-2' : ''}`}>
          <div
            className={`flex items-center text-[13px] text-gray-900 ${!isNested ? 'border-l-[2px] pl-2' : ''}`}
            style={!isNested ? { borderColor: 'var(--color-dusty-rose-500)' } : {}}
          >
            <span 
              className="font-bold hover:underline cursor-pointer"
              onClick={(e) => handleNavigateToUser(e, comment.user?.id)}
            >
              {comment.user?.name}
            </span>
            {comment.user?.id === authorId && (
              <span
                className="text-[11px] font-bold px-1 rounded ml-1"
                style={{ backgroundColor: '#f7edee', color: 'var(--color-dusty-rose-700)' }}
              >
                Tác giả
              </span>
            )}
            <span className="mx-1 text-gray-500">&middot;</span>
            <span className="text-gray-500 text-[12px]">{formatTimeAgo(comment.createdAt)}</span>
          </div>
          <div
            className={`text-[14px] text-gray-800 mt-[2px] leading-snug wysiwyg-editor whitespace-pre-wrap break-words ${!isNested ? 'pl-2' : ''}`}
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />

          {/* Actions */}
          {showActions && (
            <>
              <div className={`flex items-center gap-2 mt-1 ${!isNested ? 'pl-2' : ''}`}>
                <div className="flex items-center rounded-full overflow-hidden border border-gray-100 bg-gray-50/50 flex-shrink-0">
                  <button
                    onClick={() => handleLocalReaction('LIKE')}
                    className={`flex items-center gap-1 px-2 py-0.5 transition-colors ${userReaction === 'LIKE' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                      }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                    <span className="text-[12px] font-medium">{likeCount || 0}</span>
                  </button>
                  <button
                    onClick={() => handleLocalReaction('DISLIKE')}
                    className={`flex items-center px-2 py-0.5 border-l border-gray-200 transition-colors ${userReaction === 'DISLIKE' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                      }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                  </button>
                </div>

                <button
                  onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                  className={`px-3 py-1 text-[13px] font-medium text-gray-500 rounded transition-colors ${activeReplyId === comment.id ? 'bg-gray-200' : 'hover:bg-gray-100'
                    }`}
                >
                  Phản hồi
                </button>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-3 py-1 text-[13px] font-medium text-gray-500 rounded hover:bg-gray-100 transition-colors"
                >
                  Báo cáo
                </button>
              </div>

              {/* Reply Input */}
              {activeReplyId === comment.id && (
                <div className="mt-2 ml-2">
                  <CommentInput
                    avatarUrl={currentUser.avatarUrl}
                    placeholder={`Viết phản hồi ${comment.user?.name}...`}
                    bgClass="bg-transparent"
                    toggleComment={() => setActiveReplyId(null)}
                    onSubmit={(content) => {
                      handleCreateComment(content, comment.id);
                      const newReplyInfo = {
                        id: Date.now().toString(),
                        content: content,
                        user: { 
                          id: currentUser.id, 
                          name: currentUser.fullname, 
                          avatar: currentUser.avatarUrl 
                        },
                        likeCount: 0,
                        dislikeCount: 0,
                        replyCount: 0,
                        createdAt: new Date().toISOString(),
                      };
                      setReplies([newReplyInfo, ...replies]);
                      setShowReplies(true);
                    }}
                  />
                </div>
              )}
            </>
          )}

          {/* Show Replies Button */}
          {((comment.replyCount > 0 && !showReplies) || hasMoreReplies) && (
            <button
              onClick={handleLoadReplies}
              disabled={loadingReplies}
              className="mt-2 text-[13px] font-medium text-blue-600 hover:underline flex flex-col items-start gap-1"
              style={{ color: 'var(--color-dusty-rose-600)' }}
            >
              {loadingReplies ? 'Đang tải...' : showReplies ? `Tải thêm phản hồi` : `Xem các phản hồi`}
            </button>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {showReplies && replies.length > 0 && (
        <div className={`mt-1 ${isMaxDepth ? '' : (!isNested ? 'ml-10' : 'ml-8')}`}>
          {replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              authorId={authorId}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              handleReactionComment={handleReactionComment}
              handleCreateComment={handleCreateComment}
              formatTimeAgo={formatTimeAgo}
              depth={depth + 1}
              showActions={showActions}
            />
          ))}
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <ReportCommentModal
          comment={comment}
          value={reportForm}
          isSubmitting={isReporting}
          onChange={setReportForm}
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={submitReport}
        />
      )}
    </div>
  );
};

export default Comment;