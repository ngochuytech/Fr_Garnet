import { useEffect, useState } from 'react'
import { getRepliesByCommentId } from '../services/postService';

export const useComment = ({ comment, handleReactionComment, depth = 0 }) => {
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState(comment.replies || []);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [hasMoreReplies, setHasMoreReplies] = useState(comment.replyCount > 0 && !(comment.replies && comment.replies.length >= comment.replyCount));

    const [userReaction, setUserReaction] = useState(comment.userReaction);
    const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
    const [dislikeCount, setDislikeCount] = useState(comment.dislikeCount || 0);

    useEffect(() => {
        setUserReaction(comment.userReaction);
        setLikeCount(comment.likeCount || 0);
        setDislikeCount(comment.dislikeCount || 0);
    }, [comment.userReaction, comment.likeCount, comment.dislikeCount]);

    useEffect(() => {
        if (comment.replies) {
            setReplies(comment.replies);
        }
    }, [comment.replies]);

    const handleLocalReaction = (type) => {
        const wasLiked = userReaction === 'LIKE';
        const wasDisliked = userReaction === 'DISLIKE';

        let newReaction = userReaction;
        let newLikeCount = likeCount;
        let newDislikeCount = dislikeCount;

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

        setUserReaction(newReaction);
        setLikeCount(newLikeCount);
        setDislikeCount(newDislikeCount);

        handleReactionComment(comment.id, type);
    };

    const handleLoadReplies = async () => {
        if (loadingReplies) return;
        setLoadingReplies(true);
        try {
            const lastId = replies.length > 0 ? replies[replies.length - 1].id : null;

            const newReplies = await getRepliesByCommentId(comment.id, lastId, 5);
            if (newReplies && newReplies.length > 0) {
                setReplies(prev => {
                    const existingIds = new Set(prev.map(c => c.id));
                    const uniqueNewReplies = newReplies.filter(c => !existingIds.has(c.id));
                    return [...prev, ...uniqueNewReplies];
                });
                setHasMoreReplies(newReplies.length === 5);
            } else {
                setHasMoreReplies(false);
            }
            setShowReplies(true);
        } catch (error) {
            console.error("Lỗi tải phản hồi:", error);
        } finally {
            setLoadingReplies(false);
        }
    };

    const isMaxDepth = depth >= 4;
    const isNested = depth > 0;

    // Nếu ở depth tối đa thì k padding thêm nữa
    const containerClass = isNested && !isMaxDepth ? 'mt-3 mb-1 pl-2 border-l border-gray-200 ml-1' : (isMaxDepth ? 'mt-3 mb-1' : '');

    return {
        showReplies,
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
        containerClass
    };
}