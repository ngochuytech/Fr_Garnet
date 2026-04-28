import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostCard } from '../hooks/usePostCard';
import { useAuth } from '../context/AuthContext';
import CommentInput from './CommentInput';
import Comment from './Comment';
import SharedPostModal from './SharedPostModal';
import SharePostModal from './SharePostModal';
import { ImagePreviewModal } from './ImagePreviewModal';

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
};

const PostCard = ({ post, isOwnPost, isOwnSharePost }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [showContentToggle, setShowContentToggle] = useState(false);
  const contentRef = useRef(null);
  
  const [isSharedContentExpanded, setIsSharedContentExpanded] = useState(false);
  const [showSharedContentToggle, setShowSharedContentToggle] = useState(false);
  const sharedContentRef = useRef(null);
  
  const handleNavigateToUser = (e, userId) => {
    if (e) e.stopPropagation();
    if (userId) {
      navigate(`/user/${userId}`);
    }
  };

  const { sharedPost } = post;
  const authorName = post.author?.authorName || 'Người dùng ẩn danh';
  const authorCredential = post.author?.department ? `${post.author.department}` : 'Thành viên CampusHub';
  const avatarUrl = post.author?.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=dfb9b9&color=6a2f30`;

  const {
    upvotesCount, downvotesCount, shareAmount, isLiked, isDisliked, handleLike, handleDislike,
    comments, loadingComments, hasMoreComments, loadComments, handleCreateComment, handleReactionComment,
    isCommentOpen, toggleComment,
    activeReplyId, setActiveReplyId,
    isOptionOpen, toggleOption, optionRef,
    isShareModalOpen, openShareModal, closeShareModal,
    isSharing, handleSharePost,
    sharePrivacy,
    isFocused, setIsFocused,
    hasText,
    showFormatBar, setShowFormatBar,
    editorRef, dropdownRef,
    selectedTags, tagSearchQuery, isTagDropdownOpen, filteredTopics,
    setTagSearchQuery, setIsTagDropdownOpen, handleAddTag, handleRemoveTag,
    handleInput, applyFormat, handleLink,
    isPostModalOpen, openPostModal, closePostModal,
    isModalOptionOpen, toggleModalOption, modalOptionRef,
    localContent, isDeleted,
    isEditModalOpen, openEditModal, closeEditModal,
    editEditorRef, editHasText, editShowFormatBar, setEditShowFormatBar,
    handleEditInput, applyEditFormat,
    handleEditLink, insertEditQuote, insertEditCode, insertEditMath,
    handleDeletePost, handleUpdatePost,
    isReportModalOpen, openReportModal, closeReportModal,
    REPORT_REASONS, reportReason, setReportReason,
    reportDescription, setReportDescription,
    isSubmittingReport, handleSubmitReport,
    sharedPostModalId, openSharedPostModal, setSharedPostModalId, commentAmount
  } = usePostCard({
    postId: post.id,
    initialUpvotes: post.likeCount || 0,
    initialDownvotes: post.dislikeCount || 0,
    initialCommentCount: post.commentCount || 0,
    initialShareCount: post.shareCount || 0,
    initialUserReaction: post.userReaction || null,
    initialContent: post.content,
  });

  useEffect(() => {
    if (contentRef.current) {
      setTimeout(() => {
        if (contentRef.current && contentRef.current.scrollHeight > contentRef.current.clientHeight) {
          setShowContentToggle(true);
        }
      }, 50);
    }
  }, [localContent]);

  useEffect(() => {
    if (sharedContentRef.current) {
      setTimeout(() => {
        if (sharedContentRef.current && sharedContentRef.current.scrollHeight > sharedContentRef.current.clientHeight) {
          setShowSharedContentToggle(true);
        }
      }, 50);
    }
  }, [sharedPost?.content]);

  if (isDeleted) return null;

  return (
    <div className="py-4 border-b border-gray-200">
      {/* Post Header */}
      <div className="flex items-start gap-2 mb-2">
        <div 
          className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
          onClick={(e) => handleNavigateToUser(e, post.author?.id)}
        >
          <img src={avatarUrl} alt={`${authorName}'s Avatar`} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center text-[13px] text-gray-900 font-bold flex-wrap">
            <span 
              className="cursor-pointer hover:underline"
              onClick={(e) => handleNavigateToUser(e, post.author?.id)}
            >
              {authorName}
            </span>
          </div>
          <div className="text-[13px] text-gray-500 line-clamp-1">
            {authorCredential} <span className="mx-1">&middot;</span> {formatTimeAgo(post.createdAt)}
          </div>
        </div>
      </div>

      {/* Clickable Content */}
      <div className="cursor-pointer group" onClick={openPostModal}>
        {/*Content */}
        <div className="mb-3">
          <div
            ref={contentRef}
            className={`text-[14px] md:text-[15px] text-gray-800 leading-normal wysiwyg-editor whitespace-pre-wrap break-words group-hover:text-gray-900 transition-colors ${!isContentExpanded ? 'line-clamp-7' : ''}`}
            dangerouslySetInnerHTML={{ __html: localContent }}
          />
          {showContentToggle && (
            <div className="mt-1">
              <button
                onClick={(e) => { e.stopPropagation(); setIsContentExpanded(!isContentExpanded); }}
                className="text-[14px] font-semibold hover:underline"
                style={{ color: 'var(--color-dusty-rose-600)' }}
              >
                {isContentExpanded ? 'Thu gọn' : 'Xem thêm'}
              </button>
            </div>
          )}
        </div>

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 mb-3 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {post.images.map((imgUrl, i) => (
              <div 
                key={i} 
                className="w-full rounded-md overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setPreviewImageUrl(imgUrl); }}
              >
                <img src={imgUrl} alt={`Attachment ${i}`} className="w-full h-auto object-cover max-h-[300px] sm:max-h-[400px]" />
              </div>
            ))}
          </div>
        )}

        {/* Quoted Shared Post */}
        {sharedPost && (
          <div
            onClick={sharedPost.author ? (e) => openSharedPostModal(e, sharedPost.id) : undefined}
            className={`border border-gray-200 rounded-lg p-3 sm:p-4 mt-1 mb-3 hover:bg-gray-50 transition-colors border-l-4 border-gray-200 ${sharedPost.author ? 'cursor-pointer' : ''}`}
          >
            {sharedPost.author ? (
              <>
                <div className="flex items-start gap-2 mb-2">
                  <div 
                    className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
                    onClick={(e) => handleNavigateToUser(e, sharedPost.author?.id)}
                  >
                    <img
                      src={sharedPost.author.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sharedPost.author.authorName)}&background=dfb9b9&color=6a2f30`}
                      alt={sharedPost.author.authorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center text-[13px] text-gray-900 font-bold flex-wrap">
                      <span 
                        className="cursor-pointer hover:underline"
                        onClick={(e) => handleNavigateToUser(e, sharedPost.author?.id)}
                      >
                        {sharedPost.author.authorName}
                      </span>
                    </div>
                    <div className="text-[13px] text-gray-500 line-clamp-1">
                      {sharedPost.author.department} <span className="mx-1">&middot;</span> {formatTimeAgo(sharedPost.createdAt)}
                    </div>
                  </div>
                </div>
                <div
                  ref={sharedContentRef}
                  className={`text-[14px] text-gray-700 leading-normal wysiwyg-editor flex-1 ${!isSharedContentExpanded ? 'line-clamp-5' : ''}`}
                  dangerouslySetInnerHTML={{ __html: sharedPost.content }}
                />
                {showSharedContentToggle && (
                  <div className="mt-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsSharedContentExpanded(!isSharedContentExpanded); }}
                      className="text-[13px] font-semibold hover:underline"
                      style={{ color: 'var(--color-dusty-rose-600)' }}
                    >
                      {isSharedContentExpanded ? 'Thu gọn' : 'Xem thêm'}
                    </button>
                  </div>
                )}
                {sharedPost.images && sharedPost.images.length > 0 && (
                  <div className={`grid gap-1 mt-2 ${sharedPost.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {sharedPost.images.map((imgUrl, i) => (
                      <div 
                        key={i} 
                        className="w-full rounded-md overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); setPreviewImageUrl(imgUrl); }}
                      >
                        <img src={imgUrl} alt={`Attachment ${i}`} className="w-full h-auto object-cover max-h-[300px]" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 text-gray-500 py-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                <span className="text-[14px] font-medium select-none italic">{sharedPost.content}</span>
              </div>
            )}
          </div>
        )}

        {/* Post Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2 mt-1">
            {post.tags.map((tag, index) => (
              <span key={index} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[12px] font-medium rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between text-gray-500 mt-1">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <div className="flex rounded-full overflow-hidden border border-gray-200 bg-gray-50/50 flex-shrink-0">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-3 py-1.5 transition-colors ${isLiked ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
              <span className="text-[13px] font-medium">{upvotesCount}</span>
            </button>
            <button
              onClick={handleDislike}
              className={`flex items-center gap-1 px-3 py-1.5 border-l border-gray-300 transition-colors ${isDisliked ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
              {downvotesCount > 0 && <span className="text-[13px] font-medium">{downvotesCount}</span>}
            </button>
          </div>
          {/* Comment button */}
          <button
            onClick={toggleComment}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-[#f7edee] transition-colors flex-shrink-0 ${isCommentOpen ? 'bg-[#f7edee]' : ''}`}
            style={isCommentOpen ? { color: 'var(--color-dusty-rose-600)' } : {}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            <span className="text-[13px] font-medium">{commentAmount > 0 ? commentAmount : ''}</span>
          </button>


          {/* Share button */}
          <button
            onClick={openShareModal}
            className="flex items-center justify-center gap-1.5 p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
            {shareAmount > 0 && <span className="text-[13px] font-medium">{shareAmount}</span>}
          </button>
        </div>
        {/* Option button */}
        <div className='relative' ref={optionRef}>
          <button
            onClick={toggleOption}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
          </button>

          {/* Option Section */}
          {isOptionOpen && (
            <div className="absolute right-0 bottom-full mt-1 bg-white border border-gray-200 rounded shadow-md w-48 z-10 overflow-hidden">
              {isOwnPost && <button onClick={openEditModal} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Chỉnh sửa bài viết</button>}
              {isOwnPost && <button onClick={handleDeletePost} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Xóa bài viết</button>}
              <button onClick={openReportModal} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Báo cáo bài viết</button>
            </div>
          )}
        </div>
      </div>

      {/* Comment Section */}
      {isCommentOpen && (
        <div className="mt-3 pt-2">
          {/* Add a comment input */}
          <CommentInput
            avatarUrl={currentUser.avatarUrl}
            placeholder="Viết bình luận..."
            bgClass="bg-gray-50/80"
            toggleComment={toggleComment}
            onSubmit={(content) => handleCreateComment(content)} />

          {/* Comments Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
            <span className="text-[14px] font-bold text-gray-800">Bình luận</span>
            <button className="flex items-center text-[13px] text-gray-500 font-medium hover:bg-gray-100 px-2 py-1 rounded">
              Recommended
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

          {/* Comments List */}
          <div className="flex flex-col gap-4">
            {loadingComments && comments.length === 0 ? (
              <div className="py-2 text-center text-sm text-gray-500">Đang tải bình luận...</div>
            ) : comments.length === 0 ? (
              <div className="py-2 text-center text-sm text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên!</div>
            ) : (
              comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  authorId={post.author.id}
                  activeReplyId={activeReplyId}
                  setActiveReplyId={setActiveReplyId}
                  handleReactionComment={handleReactionComment}
                  handleCreateComment={handleCreateComment}
                  formatTimeAgo={formatTimeAgo}
                  isChild={false}
                />
              ))
            )}

            {hasMoreComments && comments.length > 0 && (
              <button onClick={() => loadComments(false)} className="text-[13px] self-start text-gray-500 hover:text-gray-800 font-medium py-1">
                {loadingComments ? 'Đang tải...' : 'Xem thêm bình luận'}
              </button>
            )}
          </div>
        </div>
      )}

      <SharePostModal
        isOpen={isShareModalOpen}
        onClose={closeShareModal}
        quotedPost={{
          authorAvatar: sharedPost ? sharedPost.author.authorAvatar : avatarUrl,
          authorName: sharedPost ? sharedPost.author.authorName : authorName,
          department: sharedPost ? sharedPost.author.department : authorCredential,
          createdAt: sharedPost ? sharedPost.createdAt : post.createdAt,
          content: sharedPost ? sharedPost.content : post.content,
          images: sharedPost ? sharedPost.images : post.images,
        }}
        editorRef={editorRef}
        hasText={hasText}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        handleInput={handleInput}
        applyFormat={applyFormat}
        handleLink={handleLink}
        showFormatBar={showFormatBar}
        setShowFormatBar={setShowFormatBar}
        isSharing={isSharing}
        handleSharePost={handleSharePost}
        dropdownRef={dropdownRef}
        selectedTags={selectedTags}
        tagSearchQuery={tagSearchQuery}
        isTagDropdownOpen={isTagDropdownOpen}
        filteredTopics={filteredTopics}
        setTagSearchQuery={setTagSearchQuery}
        setIsTagDropdownOpen={setIsTagDropdownOpen}
        handleAddTag={handleAddTag}
        handleRemoveTag={handleRemoveTag}
        zIndex="z-[110]"
      />

      {/* Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-[#242424]/80 backdrop-blur-[2px] transition-opacity">
          <div className="bg-white rounded-none sm:rounded-xl shadow-2xl w-full max-w-[700px] flex flex-col h-full sm:h-auto sm:max-h-[90vh]">
            {/* Modal Header */}
            <div className="relative flex items-center justify-center border-b border-gray-100 py-3 px-4 shrink-0">
              <span className="font-bold text-[16px] text-gray-900">Bài viết của {authorName}</span>
              <button
                onClick={closePostModal}
                className="absolute right-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                title="Đóng"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 relative">
              {/* Post Header */}
              <div className="flex items-start gap-2 mb-3">
                <div 
                  className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
                  onClick={(e) => handleNavigateToUser(e, post.author?.id)}
                >
                  <img src={avatarUrl} alt={`${authorName}'s Avatar`} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-[14px] text-gray-900 font-bold flex-wrap">
                    <span 
                      className="hover:underline cursor-pointer"
                      onClick={(e) => handleNavigateToUser(e, post.author?.id)}
                    >
                      {authorName}
                    </span>
                  </div>
                  <div className="text-[13px] text-gray-500 line-clamp-1">
                    {authorCredential} <span className="mx-1">&middot;</span> {formatTimeAgo(post.createdAt)}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div
                className="text-[15px] md:text-[16px] text-gray-800 leading-relaxed mb-4 wysiwyg-editor whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{ __html: localContent }}
              />

              {/* Post Images */}
              {post.images && post.images.length > 0 && (
                <div className={`grid gap-2 mb-4 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {post.images.map((imgUrl, i) => (
                    <div 
                      key={i} 
                      className="w-full rounded-md overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); setPreviewImageUrl(imgUrl); }}
                    >
                      <img src={imgUrl} alt={`Attachment ${i}`} className="w-full h-auto object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Post Tags (Main Post Tags) */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 mt-1">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-[13px] font-medium rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Quoted Shared Post (Detail) */}
              {sharedPost && (
                <div
                  onClick={sharedPost.author ? (e) => openSharedPostModal(e, sharedPost.id) : undefined}
                  className={`border border-gray-200 rounded-lg p-3 sm:p-4 mt-1 mb-4 hover:bg-gray-50 transition-colors border-l-4 border-gray-200 ${sharedPost.author ? 'cursor-pointer' : ''}`}
                >
                  {sharedPost.author ? (
                    <>
                      <div className="flex items-start gap-2 mb-2">
                        <div 
                          className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
                          onClick={(e) => handleNavigateToUser(e, sharedPost.author?.id)}
                        >
                          <img
                            src={sharedPost.author.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sharedPost.author.authorName)}&background=dfb9b9&color=6a2f30`}
                            alt={sharedPost.author.authorName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center text-[13px] text-gray-900 font-bold flex-wrap">
                            <span 
                              className="cursor-pointer hover:underline"
                              onClick={(e) => handleNavigateToUser(e, sharedPost.author?.id)}
                            >
                              {sharedPost.author.authorName}
                            </span>
                          </div>
                          <div className="text-[13px] text-gray-500 line-clamp-1">
                            {sharedPost.author.department} <span className="mx-1">&middot;</span> {formatTimeAgo(sharedPost.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div
                        className="text-[14px] text-gray-700 leading-normal wysiwyg-editor"
                        dangerouslySetInnerHTML={{ __html: sharedPost.content }}
                      />
                      {sharedPost.images && sharedPost.images.length > 0 && (
                        <div className={`grid gap-1 mt-2 ${sharedPost.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                          {sharedPost.images.map((imgUrl, i) => (
                            <div 
                              key={i} 
                              className="w-full rounded-md overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer"
                              onClick={(e) => { e.stopPropagation(); setPreviewImageUrl(imgUrl); }}
                            >
                              <img src={imgUrl} alt={`Attachment ${i}`} className="w-full h-auto object-cover max-h-[200px]" />
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Shared Post Tags */}
                      {sharedPost.tags && sharedPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {sharedPost.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[11px] font-medium rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-500 py-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                      <span className="text-[14px] font-medium select-none italic">{post.sharedPost.content}</span>
                    </div>
                  )}
                </div>
              )}



              {/* Action Bar */}
              <div className="flex items-center justify-between text-gray-500 mt-2 mb-4 border-y border-gray-100 py-1">
                <div className="flex items-center gap-2">
                  <button onClick={handleLike} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${isLiked ? 'text-blue-600 bg-blue-50' : 'hover:bg-gray-100'}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                    <span className="text-[14px] font-medium">{upvotesCount > 0 ? upvotesCount : ''}</span>
                  </button>
                  <button onClick={handleDislike} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${isDisliked ? 'text-blue-600 bg-blue-50' : 'hover:bg-gray-100'}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                    {downvotesCount > 0 && <span className="text-[14px] font-medium">{downvotesCount}</span>}
                  </button>
                </div>
                {/* Right side: Comment, Share & Option */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Comment */}
                  <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors hover:bg-gray-100`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    <span className="text-[14px] font-medium hidden sm:inline">
                      {commentAmount > 0 && <span className="text-[14px] font-medium ml-1">{commentAmount}</span>}
                    </span>
                  </button>

                  {/* Share button */}
                  <button onClick={openShareModal} className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                    <span className="text-[14px] font-medium hidden sm:inline">
                      {shareAmount > 0 && <span className="text-[13px] font-medium ml-1">{shareAmount}</span>}
                    </span>
                  </button>
                  
                  {/* Option button */}
                  <div className='relative' ref={modalOptionRef}>
                    <button
                      onClick={toggleModalOption}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                    </button>

                    {/* Option Section */}
                    {isModalOptionOpen && (
                      <div className="absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded shadow-md w-48 z-10 overflow-hidden">
                        {isOwnPost && <button onClick={openEditModal} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Chỉnh sửa bài viết</button>}
                        {isOwnPost && <button onClick={handleDeletePost} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Xóa bài viết</button>}
                        <button onClick={openReportModal} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Báo cáo bài viết</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Comments inside Modal (Always open) */}
              <div className="mt-2">
                <CommentInput
                  avatarUrl={avatarUrl}
                  placeholder="Viết bình luận..."
                  bgClass="bg-gray-50/80"
                  toggleComment={() => { }}
                  onSubmit={(content) => handleCreateComment(content)} />

                {/* Comments List */}
                <div className="flex flex-col gap-4 mt-4">
                  {/* Comments Header */}
                  <div className="text-[14px] font-bold text-gray-800 mb-2 border-b border-gray-100 pb-2">
                    Bình luận
                  </div>
                  {loadingComments && comments.length === 0 ? (
                    <div className="py-2 text-center text-sm text-gray-500">Đang tải bình luận...</div>
                  ) : comments.length === 0 ? (
                    <div className="py-2 text-center text-sm text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên!</div>
                  ) : (
                    comments.map((comment) => (
                      <Comment
                        key={comment.id}
                        comment={comment}
                        authorId={post.author.id}
                        activeReplyId={activeReplyId}
                        setActiveReplyId={setActiveReplyId}
                        handleReactionComment={handleReactionComment}
                        handleCreateComment={handleCreateComment}
                        formatTimeAgo={formatTimeAgo}
                        isChild={false}
                      />
                    ))
                  )}

                  {hasMoreComments && comments.length > 0 && (
                    <button onClick={() => loadComments(false)} className="text-[13px] self-center text-gray-500 hover:text-gray-800 font-medium py-1 px-4 border border-gray-200 rounded-full mt-2 transition-colors hover:bg-gray-50">
                      {loadingComments ? 'Đang tải...' : 'Xem thêm bình luận'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#242424]/80 backdrop-blur-[2px] transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[620px] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="relative flex items-center justify-center border-b border-gray-100 py-3 px-4">
              <span className="font-bold text-[16px] text-gray-900">Chỉnh sửa bài viết</span>
              <button onClick={closeEditModal} className="absolute left-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
              <div className="flex items-start gap-2 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img src={avatarUrl} alt="Current User" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[15px] text-gray-900 leading-tight">{authorName}</span>
                </div>
              </div>

              <div className="relative mb-4 border border-gray-200 rounded-lg p-2 focus-within:border-[#d09596] transition-colors">
                <div
                  ref={editEditorRef}
                  contentEditable
                  onInput={handleEditInput}
                  dangerouslySetInnerHTML={{ __html: localContent }}
                  className="w-full min-h-[100px] max-h-[300px] text-[15px] text-gray-800 outline-none overflow-y-auto wysiwyg-editor break-words whitespace-pre-wrap pt-1"
                />
              </div>
            </div>

            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-white mt-auto">
              <div className="flex items-center text-gray-500 overflow-x-auto no-scrollbar">
                {!editShowFormatBar ? (
                  <div className="flex items-center gap-1">
                    <button onMouseDown={(e) => { e.preventDefault(); setEditShowFormatBar(true); }} className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors" title="Format">
                      <span className="font-serif font-bold text-[16px] text-gray-600">Aa</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-gray-50 rounded-full px-1 py-1 border border-gray-200">
                    <button onMouseDown={(e) => { e.preventDefault(); setEditShowFormatBar(false); }} className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 rounded-full transition-colors shrink-0" title="Hide format">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                    <div className="w-px h-5 bg-gray-300 mx-0.5"></div>
                    <button onMouseDown={(e) => applyEditFormat(e, 'bold')} className="hover:bg-gray-200 rounded-full transition-colors font-serif font-bold text-[14px] w-7 h-7 flex items-center justify-center text-gray-700" title="Bold"><span className="leading-none">B</span></button>
                    <button onMouseDown={(e) => applyEditFormat(e, 'italic')} className="hover:bg-gray-200 rounded-full transition-colors font-serif italic font-bold text-[14px] w-7 h-7 flex items-center justify-center text-gray-700" title="Italic"><span className="leading-none">I</span></button>
                    <button onMouseDown={(e) => applyEditFormat(e, 'insertOrderedList')} className="hover:bg-gray-200 rounded-full transition-colors shrink-0 w-7 h-7 flex items-center justify-center text-gray-700" title="Numbered List">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><line x1="4" y1="6" x2="4.01" y2="6" /><line x1="4" y1="12" x2="4.01" y2="12" /><line x1="4" y1="18" x2="4.01" y2="18" /></svg>
                    </button>
                    <button onMouseDown={(e) => applyEditFormat(e, 'insertUnorderedList')} className="hover:bg-gray-200 rounded-full transition-colors shrink-0 w-7 h-7 flex items-center justify-center text-gray-700" title="Bulleted List">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                    </button>
                    <button onMouseDown={handleEditLink} className="hover:bg-gray-200 rounded-full transition-colors shrink-0 w-7 h-7 flex items-center justify-center text-gray-700" title="Link">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    </button>
                    <button onMouseDown={insertEditQuote} className="hover:bg-gray-200 rounded-full transition-colors font-serif font-bold text-[18px] shrink-0 w-7 h-7 flex items-center justify-center text-gray-700" title="Quote"><span className="leading-none mt-2">”</span></button>
                    <button onMouseDown={insertEditCode} className="hover:bg-gray-200 rounded-full transition-colors font-mono font-bold text-[14px] shrink-0 w-7 h-7 flex items-center justify-center text-gray-700" title="Code"><span className="leading-none">{`{}`}</span></button>
                    <button onMouseDown={insertEditMath} className="hover:bg-gray-200 rounded-full transition-colors font-serif font-bold text-[15px] shrink-0 w-7 h-7 flex items-center justify-center text-gray-700" title="Math"><span className="leading-none">Σ</span></button>
                    <button onMouseDown={(e) => applyEditFormat(e, 'undo')} className="hover:bg-gray-200 rounded-full transition-colors shrink-0 w-7 h-7 flex items-center justify-center text-gray-700" title="Undo">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleUpdatePost}
                disabled={!editHasText}
                className={`px-6 py-2 text-[14px] font-bold text-white rounded-full transition-colors shadow-sm ml-2 ${editHasText ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                style={{ backgroundColor: 'var(--color-dusty-rose-600)' }}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#242424]/80 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="relative flex items-center justify-center border-b border-gray-100 py-3.5 px-4 shrink-0">
              <span className="font-bold text-[16px] text-gray-900">Báo cáo bài viết</span>
              <button
                onClick={closeReportModal}
                className="absolute right-3 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto custom-scrollbar px-5 py-4 max-h-[70vh]">
              <p className="text-[14px] text-gray-500 mb-4">
                Vui lòng cho chúng tôi biết vấn đề bạn gặp phải với bài viết này. Báo cáo của bạn sẽ được xem xét và giữ bí mật.
              </p>

              {/* Reason list */}
              <div className="flex flex-col gap-2">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${reportReason === reason
                      ? 'border-[#d09596] bg-[#fdf4f4]'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${reportReason === reason ? 'border-[#c0606a]' : 'border-gray-300'
                      }`}>
                      {reportReason === reason && (
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-dusty-rose-600)' }} />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason}
                      checked={reportReason === reason}
                      onChange={() => setReportReason(reason)}
                      className="sr-only"
                    />
                    <span className="text-[14px] text-gray-800 leading-snug">{reason}</span>
                  </label>
                ))}
              </div>

              {/* Additional description - only show if "Khác" selected */}
              {reportReason === 'Khác' && (
                <div className="mt-4">
                  <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
                    Mô tả thêm <span className="text-gray-400 font-normal">(tùy chọn)</span>
                  </label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Hãy mô tả vấn đề bạn gặp phải..."
                    rows={3}
                    maxLength={500}
                    className="w-full text-[14px] text-gray-800 border border-gray-200 rounded-lg px-3 py-2.5 resize-none outline-none focus:border-[#d09596] transition-colors placeholder-gray-400"
                  />
                  <div className="text-right text-[12px] text-gray-400 mt-1">{reportDescription.length}/500</div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-gray-100 shrink-0">
              <button
                onClick={closeReportModal}
                className="px-5 py-2 text-[14px] font-medium text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={!reportReason || isSubmittingReport}
                className={`px-6 py-2 text-[14px] font-bold text-white rounded-full transition-all shadow-sm ${reportReason && !isSubmittingReport
                  ? 'opacity-100 cursor-pointer hover:brightness-90'
                  : 'opacity-50 cursor-not-allowed'
                  }`}
                style={{ backgroundColor: 'var(--color-dusty-rose-600)' }}
              >
                {isSubmittingReport ? 'Đang gửi...' : 'Gửi báo cáo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {sharedPostModalId && (
        <SharedPostModal
          sharedPostId={sharedPostModalId}
          onClose={() => setSharedPostModalId(null)}
        />
      )}

      {/* Image Preview Modal */}
      <ImagePreviewModal 
          imageUrl={previewImageUrl} 
          onClose={() => setPreviewImageUrl(null)} 
      />
    </div>

  );
};

export default PostCard;
