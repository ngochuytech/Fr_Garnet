import { useCallback, useEffect, useState } from 'react';
import { getGroupPosts } from '../services/spaceService';

const getErrorMessage = (error, fallback) => {
  if (typeof error === 'string') {
    return error;
  }

  return error?.message || fallback;
};

const getItems = (data) => data?.items || data?.content || [];

const getIsLast = (data) => {
  if (data?.isLast !== undefined) {
    return data.isLast;
  }

  if (data?.last !== undefined) {
    return data.last;
  }

  return getItems(data).length === 0;
};

export const useSpacePosts = (groupId) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [isLast, setIsLast] = useState(true);

  const fetchPosts = useCallback(async (quiet = false) => {
    if (!groupId) {
      setPosts([]);
      setLoading(false);
      setIsLast(true);
      return;
    }

    try {
      if (!quiet) {
        setLoading(true);
      }

      setError(null);
      const data = await getGroupPosts(groupId, { page: 0 });
      setPosts(getItems(data));
      setPage(data?.pageNumber || 0);
      setIsLast(getIsLast(data));
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể tải bài viết trong nhóm'));
    } finally {
      if (!quiet) {
        setLoading(false);
      }
    }
  }, [groupId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleGetMorePosts = useCallback(async () => {
    if (!groupId || isLast || loadingMore) {
      return;
    }

    const nextPage = page + 1;

    try {
      setLoadingMore(true);
      setError(null);
      const data = await getGroupPosts(groupId, { page: nextPage });
      setPosts((currentPosts) => [...currentPosts, ...getItems(data)]);
      setPage(data?.pageNumber ?? nextPage);
      setIsLast(getIsLast(data));
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể tải thêm bài viết trong nhóm'));
    } finally {
      setLoadingMore(false);
    }
  }, [groupId, isLast, loadingMore, page]);

  return {
    posts,
    loading,
    loadingMore,
    error,
    isLast,
    refreshPosts: () => fetchPosts(true),
    handleGetMorePosts,
  };
};
