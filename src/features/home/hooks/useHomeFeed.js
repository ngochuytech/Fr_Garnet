import { useState, useEffect } from 'react';
import { getMyPosts, getPostsForHome } from '../services/homeService';

export const useHomeFeed = () => {
  const [activeFilter, setActiveFilter] = useState('forYou');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);

  const fetchPosts = async (quiet = false) => {
    try {
      if (!quiet) setLoading(true);
      const data = await getMyPosts();
      setPosts(data.items || []);
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
    try {
      const data = await getPostsForHome(page + 1);
      setPage(page + 1);
      setPosts((prevPosts) => [...prevPosts, ...(data.items || [])]);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải bài viết');
    }
  };

  return {
    activeFilter,
    setActiveFilter,
    posts,
    loading,
    error,
    refreshPosts: () => fetchPosts(true),
    handleGetMorePost
  };
};