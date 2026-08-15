import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import PostCard from '../../../components/PostCard';
import { getPostsByTopic } from '../services/topicService';
import { useActivityTracker } from '../../../hooks/useActivityTracker';

const TopicFeed = ({ topicName }) => {
  const { user } = useAuth();
  const { trackEvent } = useActivityTracker();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fetchFirstPage = async () => {
      setLoading(true);
      setError(null);
      setPosts([]);
      setNextCursor(null);
      setHasNext(false);
      
      try {
        isFetchingRef.current = true;
        const data = await getPostsByTopic(topicName, 20, null);
        setPosts(data.items || []);
        setNextCursor(data.nextCursor || null);
        setHasNext(data.hasNext !== undefined ? data.hasNext : false);
      } catch (err) {
        console.error("Error fetching topic posts:", err);
        setError("Không thể tải bài viết của chủ đề này.");
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    if (topicName) {
      fetchFirstPage();
    }
  }, [topicName]);

  const handleGetMorePost = async () => {
    if (!hasNext || isFetchingRef.current || nextCursor === null) return;

    try {
      isFetchingRef.current = true;
      setLoadingMore(true);
      const data = await getPostsByTopic(topicName, 20, nextCursor);
      
      setPosts((prevPosts) => {
        const newPosts = data.items || [];
        const existingIds = new Set(prevPosts.map(p => p.id));
        const filteredNewPosts = newPosts.filter(p => !existingIds.has(p.id));
        return [...prevPosts, ...filteredNewPosts];
      });
      
      setNextCursor(data.nextCursor || null);
      setHasNext(data.hasNext !== undefined ? data.hasNext : false);
    } catch (err) {
      console.error("Error loading more topic posts:", err);
    } finally {
      isFetchingRef.current = false;
      setLoadingMore(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-4 shadow-sm overflow-hidden">
        {/* Post List */}
        <div className="px-4 divide-y divide-gray-100">
          {loading ? (
             <div className="py-4 text-center text-gray-500">Đang tải...</div>
          ) : error ? (
             <div className="py-4 text-center text-red-500">{error}</div>
          ) : posts.length === 0 ? (
             <div className="py-4 text-center text-gray-500">Chưa có bài viết nào</div>
          ) : posts.map((post) => {
             const isOwnPost = Boolean(user && user.id && post.author && post.author.id === user.id);
             const isOwnSharePost = Boolean(user && user.id && post.sharedPost && post.sharedPost.author && post.sharedPost.author.id === user.id);
             
             return (
              <div key={post.id} className="relative pt-2 pb-2">
                <PostCard
                  post={post}
                  isOwnPost={isOwnPost}
                  isOwnSharePost={isOwnSharePost}
                  onTrackEvent={trackEvent}
                />
              </div>
            );
          })}
        </div>

        {/* Load more */}
        {hasNext && posts.length > 0 && (
          <div className="flex justify-center py-4 border-t border-gray-100">
            <button
              className="px-6 py-2 rounded-full text-[14px] font-medium border transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: 'var(--color-dusty-rose-300)',
                color: 'var(--color-dusty-rose-700)',
              }}
              onClick={handleGetMorePost}
              disabled={loadingMore}
            >
              {loadingMore ? 'Đang tải...' : 'Tải thêm bài viết'}
            </button>
          </div>
        )}
    </div>
  );
};

export default TopicFeed;
