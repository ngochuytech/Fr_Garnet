import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { likePostAPI, dislikePostAPI, getCommentsByPostId, createCommentAPI, likeCommentAPI, dislikeCommentAPI } from '../services/postService';

export const usePostCard = ({ postId, initialUpvotes = 0, initialDownvotes = 0, initialUserReaction = null } = {}) => {
  // Reaction states
  const [upvotesCount, setUpvotesCount] = useState(initialUpvotes);
  const [downvotesCount, setDownvotesCount] = useState(initialDownvotes);
  const [isLiked, setIsLiked] = useState(initialUserReaction === 'LIKE');
  const [isDisliked, setIsDisliked] = useState(initialUserReaction === 'DISLIKE');

  // Original PostCard states
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const optionRef = useRef(null);

  // Comment states
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);


  useEffect(() => {
    if (isCommentOpen && comments.length === 0) {
      loadComments();
    }
  }, [isCommentOpen]);

  const handleCreateComment = async (content, parentId = null) => {
    if (!postId) return;
    try {
      await createCommentAPI(postId, parentId, content);
      toast.success('Đã bình luận thành công!');
      await loadComments(true);
      if (parentId) {
        setActiveReplyId(null);
      }
    } catch (error) {
      toast.error(error || 'Không thể đăng bình luận');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionRef.current && !optionRef.current.contains(event.target)) {
        setIsOptionOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOptionOpen) {
        setIsOptionOpen(false);
      }
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

  // Share Modal states
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharePrivacy, setSharePrivacy] = useState('Everyone'); // 'Everyone' or other groups
  const [isFocused, setIsFocused] = useState(false);
  const [hasText, setHasText] = useState(false);
  const [showFormatBar, setShowFormatBar] = useState(false);
  const editorRef = useRef(null);

  const toggleComment = () => setIsCommentOpen(!isCommentOpen);
  const toggleOption = () => setIsOptionOpen(!isOptionOpen);

  const openShareModal = () => setIsShareModalOpen(true);
  const closeShareModal = () => {
    setIsShareModalOpen(false);
    // Optionally clear text editor on close
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
    if (url) {
      applyFormat(e, 'createLink', url);
    }
  };

  const insertQuote = (e) => {
    e.preventDefault();
    applyFormat(e, 'formatBlock', 'BLOCKQUOTE');
  };

  const insertCode = (e) => {
    e.preventDefault();
    applyFormat(e, 'formatBlock', 'PRE');
  };

  const insertMath = (e) => {
    e.preventDefault();
    applyFormat(e, 'insertText', ' $$ equation $$ ');
  };

  const handleLike = async () => {
    if (!postId) return;

    // Optimistic Update
    const wasLiked = isLiked;
    const wasDisliked = isDisliked;

    setIsLiked(!wasLiked);
    if (wasDisliked) setIsDisliked(false);

    // Add/remove upvote based on toggle
    setUpvotesCount(prev => prev + (wasLiked ? -1 : 1));
    if (wasDisliked) setDownvotesCount(prev => prev - 1);

    try {
      await likePostAPI(postId);
    } catch (error) {
      // Revert on error
      setIsLiked(wasLiked);
      if (wasDisliked) setIsDisliked(true);
      setUpvotesCount(prev => prev - (wasLiked ? -1 : 1));
      if (wasDisliked) setDownvotesCount(prev => prev + 1);
      toast.error(error || 'Lỗi kết nối máy chủ');
    }
  };

  const handleDislike = async () => {
    if (!postId) return;

    // Optimistic Update
    const wasDisliked = isDisliked;
    const wasLiked = isLiked;

    setIsDisliked(!wasDisliked);
    if (wasLiked) setIsLiked(false);

    setDownvotesCount(prev => prev + (wasDisliked ? -1 : 1));
    if (wasLiked) setUpvotesCount(prev => prev - 1);

    try {
      await dislikePostAPI(postId);
    } catch (error) {
      // Revert on error
      setIsDisliked(wasDisliked);
      if (wasLiked) setIsLiked(true);
      setDownvotesCount(prev => prev - (wasDisliked ? -1 : 1));
      if (wasLiked) setUpvotesCount(prev => prev + 1);
      toast.error(error || 'Lỗi kết nối máy chủ');
    }
  };

  const loadComments = async (refresh = false) => {
    if (!postId || (!hasMoreComments && !refresh) || loadingComments) return;
    setLoadingComments(true);
    try {
      const lastId = refresh || comments.length === 0 ? '' : comments[comments.length - 1].id;
      const res = await getCommentsByPostId(postId, lastId, 10);
      const fetchedComments = res || [];
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

  const handleReactionComment = async (commentId, type = 'LIKE') => {
    const originalComments = [...comments];
    
    const updateItems = (items) => {
      return items.map(item => {
        if (item.id === commentId) {
          const wasLiked = item.userReaction === 'LIKE';
          const wasDisliked = item.userReaction === 'DISLIKE';
          
          let newReaction = item.userReaction;
          let newLikeCount = item.likeCount || 0;
          let newDislikeCount = item.dislikeCount || 0;

          if (type === 'LIKE') {
            if (wasLiked) {
              newReaction = null;
              newLikeCount -= 1;
            } else {
              newReaction = 'LIKE';
              newLikeCount += 1;
              if (wasDisliked) newDislikeCount -= 1;
            }
          } else {
            if (wasDisliked) {
              newReaction = null;
              newDislikeCount -= 1;
            } else {
              newReaction = 'DISLIKE';
              newDislikeCount += 1;
              if (wasLiked) newLikeCount -= 1;
            }
          }

          return { ...item, userReaction: newReaction, likeCount: newLikeCount, dislikeCount: newDislikeCount };
        }
        
        if (item.replies && item.replies.length > 0) {
          return { ...item, replies: updateItems(item.replies) };
        }
        
        return item;
      });
    };

    setComments(updateItems(comments));

    try {
      if (type === 'LIKE') await likeCommentAPI(commentId);
      else await dislikeCommentAPI(commentId);
    } catch (error) {
      setComments(originalComments);
      toast.error(error || 'Lỗi khi tương tác bình luận');
    }
  };

  return {
    upvotesCount, downvotesCount, isLiked, isDisliked, handleLike, handleDislike,
    comments, loadingComments, hasMoreComments, loadComments, handleCreateComment, handleReactionComment,
    isCommentOpen, toggleComment,
    activeReplyId, setActiveReplyId,
    isOptionOpen, toggleOption, optionRef,
    isShareModalOpen, openShareModal, closeShareModal,
    sharePrivacy, setSharePrivacy,
    isFocused, setIsFocused,
    hasText, setHasText,
    showFormatBar, setShowFormatBar,
    editorRef,
    handleInput, applyFormat, handleLink, insertQuote, insertCode, insertMath
  };
};
