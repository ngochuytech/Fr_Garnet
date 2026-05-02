import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { likePostAPI, dislikePostAPI, getCommentsByPostId, createCommentAPI, likeCommentAPI, dislikeCommentAPI, editPostAPI, deletePostAPI, reportPostAPI, sharePostAPI } from '../services/postService';
import { fetchUserTopics } from '../services/createPostBarService';

export const usePostCard = ({ postId, initialUpvotes = 0, initialDownvotes = 0, initialCommentCount = 0, initialShareCount = 0, initialUserReaction = null, initialContent = '' } = {}) => {

  // Nội dung bài viết (dùng chung: hiển thị card, modal xem, modal sửa)
  const [localContent, setLocalContent] = useState(initialContent);

  // Trạng thái bị xóa (dùng chung: ẩn toàn bộ card sau khi xóa)
  const [isDeleted, setIsDeleted] = useState(false);

  // Dropdown option ngoài card (dùng chung: Edit, Delete, Report đều gọi setIsOptionOpen(false))
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const optionRef = useRef(null);
  const toggleOption = () => setIsOptionOpen(!isOptionOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionRef.current && !optionRef.current.contains(event.target)) {
        setIsOptionOpen(false);
      }
    };
    const handleScroll = () => {
      if (isOptionOpen) setIsOptionOpen(false);
    };
    if (isOptionOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOptionOpen]);

  // Dropdown option trong Post Modal (dùng chung: Edit, Delete, Report trong modal đều gọi setIsModalOptionOpen(false))
  const [isModalOptionOpen, setIsModalOptionOpen] = useState(false);
  const modalOptionRef = useRef(null);
  const toggleModalOption = () => setIsModalOptionOpen(!isModalOptionOpen);

  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (modalOptionRef.current && !modalOptionRef.current.contains(event.target)) {
        setIsModalOptionOpen(false);
      }
    };
    if (isModalOptionOpen) {
      document.addEventListener('mousedown', handleClickOutsideModal);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [isModalOptionOpen]);

  // + REACTIONS (Like / Dislike bài viết)
  const [upvotesCount, setUpvotesCount] = useState(initialUpvotes);
  const [downvotesCount, setDownvotesCount] = useState(initialDownvotes);
  const [commentAmount, setCommentAmount] = useState(initialCommentCount);
  const [shareAmount, setShareAmount] = useState(initialShareCount);
  const [isLiked, setIsLiked] = useState(initialUserReaction === 'LIKE');
  const [isDisliked, setIsDisliked] = useState(initialUserReaction === 'DISLIKE');

  // Ref để theo dõi trạng thái cuối cùng đã đồng bộ với server
  const serverReactionRef = useRef(initialUserReaction);
  const debounceTimerRef = useRef(null);

  // Hàm đồng bộ trạng thái Reaction lên server (đã được debounce)
  const syncReaction = useCallback(async (currentReaction) => {
    if (!postId || currentReaction === serverReactionRef.current) return;

    try {
      if (currentReaction === 'LIKE') {
        await likePostAPI(postId);
      } else if (currentReaction === 'DISLIKE') {
        await dislikePostAPI(postId);
      } else {
        // Nếu hiện tại là NULL (bỏ like/dislike), ta gọi lại API của trạng thái cũ để toggle nó về off
        if (serverReactionRef.current === 'LIKE') await likePostAPI(postId);
        else if (serverReactionRef.current === 'DISLIKE') await dislikePostAPI(postId);
      }
      // Cập nhật trạng thái đã đồng bộ
      serverReactionRef.current = currentReaction;
    } catch (error) {
      console.error('[Reaction Sync Error]', error);
      toast.error('Không thể đồng bộ lượt thích. Vui lòng thử lại.');
      // Không revert ở đây để tránh giật lag UI, user có thể nhấn lại
    }
  }, [postId]);

  const handleLike = () => {
    if (!postId) return;
    const wasLiked = isLiked;
    const wasDisliked = isDisliked;

    // 1. Cập nhật UI ngay lập tức (Optimistic UI)
    setIsLiked(!wasLiked);
    if (wasDisliked) setIsDisliked(false);
    setUpvotesCount(prev => prev + (wasLiked ? -1 : 1));
    if (wasDisliked) setDownvotesCount(prev => prev - 1);

    // 2. Debounce việc gọi API
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    const nextReaction = !wasLiked ? 'LIKE' : null;
    
    debounceTimerRef.current = setTimeout(() => {
      syncReaction(nextReaction);
    }, 1000);
  };

  const handleDislike = () => {
    if (!postId) return;
    const wasDisliked = isDisliked;
    const wasLiked = isLiked;

    // 1. Cập nhật UI ngay lập tức (Optimistic UI)
    setIsDisliked(!wasDisliked);
    if (wasLiked) setIsLiked(false);
    setDownvotesCount(prev => prev + (wasDisliked ? -1 : 1));
    if (wasLiked) setUpvotesCount(prev => prev - 1);

    // 2. Debounce việc gọi API
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    const nextReaction = !wasDisliked ? 'DISLIKE' : null;

    debounceTimerRef.current = setTimeout(() => {
      syncReaction(nextReaction);
    }, 1000);
  };

  // + COMMENTS (Bình luận & Phản hồi)

  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  const toggleComment = () => setIsCommentOpen(!isCommentOpen);

  // Tự động tải comments khi mở section bình luận lần đầu
  useEffect(() => {
    if (isCommentOpen && comments.length === 0) {
      loadComments();
    }
  }, [isCommentOpen]);

  const loadComments = async (refresh = false) => {
    if (!postId || (!hasMoreComments && !refresh) || loadingComments) return;
    setLoadingComments(true);
    try {
      const lastId = refresh || comments.length === 0 ? '' : comments[comments.length - 1].id;
      const res = await getCommentsByPostId(postId, lastId, 10);
      const fetchedComments = res.items || [];
      if (refresh) {
        setComments(fetchedComments);
      } else {
        setComments(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const newUnique = fetchedComments.filter(c => !existingIds.has(c.id));
          return [...prev, ...newUnique];
        });
      }
      setHasMoreComments(fetchedComments.length === 10);
    } catch (error) {
      toast.error('Lỗi khi tải bình luận');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCreateComment = async (content, parentId = null) => {
    if (!postId) return;
    try {
      await createCommentAPI(postId, parentId, content);
      toast.success('Đã bình luận thành công!');
      await loadComments(true);
      if (parentId) setActiveReplyId(null);
      setCommentAmount(prev => prev + 1);
    } catch (error) {
      toast.error(error || 'Không thể đăng bình luận');
    }
  };

  const handleReactionComment = async (commentId, type = 'LIKE') => {
    const originalComments = [...comments];
    const updateItems = (items) => items.map(item => {
      if (item.id !== commentId) return item;
      const wasLiked = item.userReaction === 'LIKE';
      const wasDisliked = item.userReaction === 'DISLIKE';
      let newReaction = item.userReaction;
      let newLikeCount = item.likeCount || 0;
      let newDislikeCount = item.dislikeCount || 0;
      if (type === 'LIKE') {
        if (wasLiked) { newReaction = null; newLikeCount -= 1; }
        else { newReaction = 'LIKE'; newLikeCount += 1; if (wasDisliked) newDislikeCount -= 1; }
      } else {
        if (wasDisliked) { newReaction = null; newDislikeCount -= 1; }
        else { newReaction = 'DISLIKE'; newDislikeCount += 1; if (wasLiked) newLikeCount -= 1; }
      }
      return { ...item, userReaction: newReaction, likeCount: newLikeCount, dislikeCount: newDislikeCount };
    });
    setComments(updateItems(comments));
    try {
      if (type === 'LIKE') await likeCommentAPI(commentId);
      else await dislikeCommentAPI(commentId);
    } catch (error) {
      setComments(originalComments);
      toast.error(error || 'Lỗi khi tương tác bình luận');
    }
  };

  // + POST DETAIL MODAL (Xem chi tiết bài viết)

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const openPostModal = () => {
    setIsPostModalOpen(true);
    // Cũng tải comments nếu chưa có (dùng chung comments state với section bình luận)
    if (!isCommentOpen && comments.length === 0) {
      loadComments();
    }
  };
  const closePostModal = () => setIsPostModalOpen(false);


  // + SHARE MODAL (Chia sẻ bài viết)

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharePrivacy, setSharePrivacy] = useState('Everyone');
  const [isFocused, setIsFocused] = useState(false);
  const [hasText, setHasText] = useState(false);
  const [showFormatBar, setShowFormatBar] = useState(false);
  const editorRef = useRef(null);
  const dropdownRef = useRef(null);

  // Tag state for Share Modal
  const [userTopics, setUserTopics] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  // Handle clicking outside to close topic dropdown
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
              setIsTagDropdownOpen(false);
          }
      };
      if (isTagDropdownOpen) {
          document.addEventListener('mousedown', handleClickOutside);
      }
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isTagDropdownOpen]);

  // Helper for topic str
  const getTopicNameStr = (t) => {
      if (!t) return '';
      if (typeof t === 'string') return t;
      return t.topicName || t.name || '';
  };

  const filteredTopics = userTopics.filter(topic => {
      const topicStr = getTopicNameStr(topic);
      if (!topicStr) return false;
      
      const matchesQuery = topicStr.toLowerCase().includes(tagSearchQuery.toLowerCase());
      const isNotSelected = !selectedTags.some(t => getTopicNameStr(t) === topicStr);
      
      return matchesQuery && isNotSelected;
  });

  const handleAddTag = (topic) => {
      setSelectedTags([...selectedTags, topic]);
      setTagSearchQuery('');
      setIsTagDropdownOpen(false);
  };

  const handleRemoveTag = (topicStrToRemove) => {
      setSelectedTags(selectedTags.filter(t => getTopicNameStr(t) !== topicStrToRemove));
  };

  const openShareModal = () => {
    setIsShareModalOpen(true);
    const loadTopics = async () => {
        try {
            const data = await fetchUserTopics();
            setUserTopics(data || []);
        } catch (error) {
            console.error('Failed to load user topics:', error);
        }
    };
    if (userTopics.length === 0) {
        loadTopics();
    }
  };
  
  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setSelectedTags([]);
    setTagSearchQuery('');
    setIsTagDropdownOpen(false);
  };

  const [isSharing, setIsSharing] = useState(false);

  const handleSharePost = async () => {
    if (!editorRef.current) return;
    const sharedContent = editorRef.current.innerHTML;

    setIsSharing(true);
    try {
      await sharePostAPI(postId, { 
          content: sharedContent === '<br>' ? '' : sharedContent,
          tags: selectedTags.map(t => getTopicNameStr(t))
      });
      setShareAmount(prev => prev + 1);
      toast.success('Đã chia sẻ bài viết lên dòng thời gian của bạn!');
      closeShareModal();
      // Clear editor content
      if (editorRef.current) editorRef.current.innerHTML = '';
      setHasText(false);
    } catch (error) {
      toast.error(error || 'Lỗi khi chia sẻ bài viết');
    } finally {
      setIsSharing(false);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.textContent || '';
      setHasText(content.trim().length > 0);
    }
  };

  const applyFormat = (e, command, value = null) => {
    e.preventDefault();
    if (editorRef.current) {
      document.execCommand(command, false, value);
      editorRef.current.focus();
      handleInput();
    }
  };

  const handleLink = (e) => {
    e.preventDefault();
    const url = window.prompt('Nhập link URL liên kết:', 'https://');
    if (url) applyFormat(e, 'createLink', url);
  };

  const insertQuote = (e) => { e.preventDefault(); applyFormat(e, 'formatBlock', 'BLOCKQUOTE'); };
  const insertCode = (e) => { e.preventDefault(); applyFormat(e, 'formatBlock', 'PRE'); };


  // + EDIT POST (Chỉnh sửa bài viết)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const editEditorRef = useRef(null);
  const [editHasText, setEditHasText] = useState(true);
  const [editShowFormatBar, setEditShowFormatBar] = useState(false);

  const openEditModal = () => {
    setIsEditModalOpen(true);
    setIsOptionOpen(false);        // đóng dropdown card
    setIsModalOptionOpen(false);   // đóng dropdown trong Post Modal
    setEditHasText(localContent ? localContent.trim().length > 0 : false);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleEditInput = () => {
    if (editEditorRef.current) {
      const content = editEditorRef.current.textContent || '';
      setEditHasText(content.trim().length > 0);
    }
  };

  const applyEditFormat = (e, command, value = null) => {
    e.preventDefault();
    if (editEditorRef.current) {
      document.execCommand(command, false, value);
      editEditorRef.current.focus();
      handleEditInput();
    }
  };

  const handleEditLink = (e) => {
    e.preventDefault();
    const url = window.prompt('Nhập link URL liên kết:', 'https://');
    if (url) applyEditFormat(e, 'createLink', url);
  };

  const insertEditQuote = (e) => { e.preventDefault(); applyEditFormat(e, 'formatBlock', 'BLOCKQUOTE'); };
  const insertEditCode = (e) => { e.preventDefault(); applyEditFormat(e, 'formatBlock', 'PRE'); };

  const handleUpdatePost = async () => {
    if (editEditorRef.current && editHasText) {
      const newContent = editEditorRef.current.innerHTML;
      try {
        await editPostAPI(postId, { content: newContent });
        toast.success('Đã cập nhật bài viết!');
        setLocalContent(newContent);  // cập nhật shared localContent
        closeEditModal();
      } catch (error) {
        toast.error(error || 'Lỗi khi cập nhật bài viết');
      }
    }
  };

  // + DELETE POST (Xóa bài viết)

  const handleDeletePost = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await deletePostAPI(postId);
        toast.success('Đã xóa bài viết!');
        setIsDeleted(true);  // cập nhật shared isDeleted
      } catch (error) {
        toast.error(error || 'Lỗi khi xóa bài viết');
      }
    }
  };

  // + REPORT POST (Báo cáo bài viết)

  const REPORT_REASONS = [
    'Spam hoặc lừa đảo',
    'Ngôn từ kích động thù địch',
    'Quấy rối hoặc bắt nạt',
    'Thông tin sai lệch',
    'Ảnh khỏa thân hoặc nội dung tình dục',
    'Khác',
  ];

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const openReportModal = () => {
    setIsReportModalOpen(true);
    setIsOptionOpen(false);
    setIsModalOptionOpen(false);
    setReportReason('');
    setReportDescription('');
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setReportReason('');
    setReportDescription('');
  };

  const handleSubmitReport = async () => {
    if (!reportReason) return;
    setIsSubmittingReport(true);
    try {
      await reportPostAPI(postId, {
        reason: reportReason,
        description: reportDescription,
        targetId: postId,
        targetType: "POST"
      });
      toast.success('Đã gửi báo cáo. Cảm ơn bạn!');
      closeReportModal();
    } catch (error) {
      toast.error(error || 'Lỗi khi gửi báo cáo');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // + Shared Post Modal
  const [sharedPostModalId, setSharedPostModalId] = useState(null);

  const openSharedPostModal = (e, id) => {
    e.stopPropagation();
    closePostModal(); // đóng modal cha nếu đang mở 
    setSharedPostModalId(id);
  };

  // + RETURN

  return {
    // Shared
    localContent, isDeleted,
    isOptionOpen, toggleOption, optionRef,
    isModalOptionOpen, toggleModalOption, modalOptionRef,

    // Reactions
    upvotesCount, downvotesCount, commentAmount, shareAmount, isLiked, isDisliked, handleLike, handleDislike,

    // Comments
    isCommentOpen, toggleComment,
    activeReplyId, setActiveReplyId,
    comments, loadingComments, hasMoreComments, loadComments,
    handleCreateComment, handleReactionComment,

    // Post Detail Modal
    isPostModalOpen, openPostModal, closePostModal,

    // Share Modal
    isShareModalOpen, openShareModal, closeShareModal,
    isSharing, handleSharePost,
    sharePrivacy, setSharePrivacy,
    isFocused, setIsFocused,
    hasText, setHasText,
    showFormatBar, setShowFormatBar,
    editorRef, dropdownRef,
    selectedTags, tagSearchQuery, isTagDropdownOpen, filteredTopics,
    setTagSearchQuery, setIsTagDropdownOpen, handleAddTag, handleRemoveTag,
    handleInput, applyFormat, handleLink, insertQuote, insertCode,

    // Edit Post
    isEditModalOpen, openEditModal, closeEditModal,
    editEditorRef, editHasText, editShowFormatBar, setEditShowFormatBar,
    handleEditInput, applyEditFormat,
    handleEditLink, insertEditQuote, insertEditCode,
    handleUpdatePost,

    // Delete Post
    handleDeletePost,

    // Report Post
    isReportModalOpen, openReportModal, closeReportModal,
    REPORT_REASONS, reportReason, setReportReason,
    reportDescription, setReportDescription,
    isSubmittingReport, handleSubmitReport,

    // Shared Post Modal
    sharedPostModalId, openSharedPostModal, setSharedPostModalId
  };
};
