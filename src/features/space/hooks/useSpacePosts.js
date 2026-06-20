import { useCallback, useEffect, useState, useRef } from 'react';
import { getGroupPosts } from '../services/spaceService';

const getErrorMessage = (error, fallback) => {
  if (typeof error === 'string') {
    return error;
  }
  return error?.message || fallback;
};

export const useSpacePosts = (groupId) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  
  const isFetchingRef = useRef(false);

  const fetchPosts = useCallback(async (quiet = false) => {
    if (!groupId) {
      setPosts([]);
      setLoading(false);
      setHasNext(false);
      setNextCursor(null);
      return;
    }

    try {
      if (!quiet) setLoading(true);
      setError(null);
      
      isFetchingRef.current = true;
      const data = await getGroupPosts(groupId, 20, null);
      const newPosts = data?.items || [];

      if (quiet) {
        // Just prepend new posts not already in the list
        setPosts(current => {
          const existingIds = new Set(current.map(p => p.id));
          const toPrepend = newPosts.filter(p => !existingIds.has(p.id));
          return [...toPrepend, ...current];
        });
        // We don't change nextCursor or hasNext when quiet (typically when a post is created)
      } else {
        setPosts(newPosts);
        setNextCursor(data?.nextCursor || null);
        setHasNext(data?.hasNext !== undefined ? data.hasNext : false);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể tải bài viết trong nhóm'));
    } finally {
      if (!quiet) setLoading(false);
      isFetchingRef.current = false;
    }
  }, [groupId]);

  useEffect(() => {
    setPosts([]);
    setNextCursor(null);
    setHasNext(false);
    fetchPosts();
  }, [fetchPosts]);

  const handleGetMorePosts = useCallback(async () => {
    if (!groupId || !hasNext || loadingMore || isFetchingRef.current || !nextCursor) {
      return;
    }

    try {
      setLoadingMore(true);
      isFetchingRef.current = true;
      setError(null);
      
      const data = await getGroupPosts(groupId, 20, nextCursor);
      
      setPosts((currentPosts) => {
        const newItems = data?.items || [];
        const existingIds = new Set(currentPosts.map(p => p.id));
        const filteredNewItems = newItems.filter(p => !existingIds.has(p.id));
        return [...currentPosts, ...filteredNewItems];
      });
      
      setNextCursor(data?.nextCursor || null);
      setHasNext(data?.hasNext !== undefined ? data.hasNext : false);
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể tải thêm bài viết trong nhóm'));
    } finally {
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [groupId, hasNext, loadingMore, nextCursor]);

  return {
    posts,
    loading,
    loadingMore,
    error,
    hasNext,
    refreshPosts: () => fetchPosts(true),
    handleGetMorePosts,
  };
};
