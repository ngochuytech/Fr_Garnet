import CommentInput from './CommentInput';
import { useComment } from '../hooks/useComment';
import { useAuth } from '../context/AuthContext';

const Comment = ({
  comment,
  authorId,
  activeReplyId,
  setActiveReplyId,
  handleReactionComment,
  handleCreateComment,
  formatTimeAgo,
  depth = 0
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
    setReplies,
    setShowReplies,
    isMaxDepth,
    isNested,
    containerClass } = useComment({ comment, handleReactionComment, depth });

    const { user: currentUser } = useAuth();

  return (
    <div className={`${containerClass}`}>
      <div className="flex items-start gap-2">
        <div className={`${isNested ? 'w-6 h-6 mt-0.5' : 'w-8 h-8'} rounded-full overflow-hidden flex-shrink-0`}>
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
            <span className="font-bold hover:underline cursor-pointer">{comment.user?.name}</span>
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
                  // Giả lập đưa bình luận con vào danh sách
                  const newReplyInfo = {
                    id: Date.now().toString(),
                    content: content,
                    user: { name: 'You' }, // Cần thông tin thực tế từ auth, tạm giả lập nếu component cha chưa xử lý tốt state
                    createdAt: new Date().toISOString(),
                  };
                  setReplies([newReplyInfo, ...replies]);
                  setShowReplies(true);
                }}
              />
            </div>
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;