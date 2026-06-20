import { useState, useEffect, useRef } from 'react';
import { getHomePosts } from '../services/homeService';

export const useHomeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const isFetchingRef = useRef(false);

  const fetchPosts = async (quiet = false) => {
    try {
      if (!quiet) setLoading(true);
      const data = await getHomePosts(20, null);
      setPosts(data.items || []);
      setNextCursor(data.nextCursor || null);
      setHasNext(data.hasNext !== undefined ? data.hasNext : true);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải bài viết');
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleGetMorePost = async () => {
    if (!hasNext || isFetchingRef.current || !nextCursor) return;

    try {
      isFetchingRef.current = true;
      const data = await getHomePosts(20, nextCursor);
      
      setPosts((prevPosts) => {
        const newPosts = data.items || [];
        const existingIds = new Set(prevPosts.map(p => p.id));
        const filteredNewPosts = newPosts.filter(p => !existingIds.has(p.id));
        return [...prevPosts, ...filteredNewPosts];
      });
      
      setNextCursor(data.nextCursor || null);
      setHasNext(data.hasNext !== undefined ? data.hasNext : true);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải bài viết');
    } finally {
      isFetchingRef.current = false;
    }
  };

  return {
    posts,
    loading,
    error,
    hasNext,
    refreshPosts: () => fetchPosts(true),
    handleGetMorePost
  };
};