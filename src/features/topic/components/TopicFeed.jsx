import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import PostCard from '../../../components/PostCard';
import { getPostsByTopic } from '../services/topicService';

const TopicFeed = ({ topicName }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLast, setIsLast] = useState(true); 

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPostsByTopic(topicName);
        setPosts(data.items || []);
        setIsLast(data.isLast || true);        
      } catch (err) {
        console.error("Error fetching topic posts:", err);
        setError("Không thể tải bài viết của chủ đề này.");
      } finally {
        setLoading(false);
      }
    };

    if (topicName) {
      fetchPosts();
    }
  }, [topicName]);

  const handleGetMorePost = () => {
      // Pagination logic can be added here if needed in the future
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
                />
              </div>
            );
          })}
        </div>

        {/* Load more */}
        {!isLast && posts.length > 0 && (
          <div className="flex justify-center py-4 border-t border-gray-100">
            <button
              className="px-6 py-2 rounded-full text-[14px] font-medium border transition-all hover:shadow-md"
              style={{
                borderColor: 'var(--color-dusty-rose-300)',
                color: 'var(--color-dusty-rose-700)',
              }}
              onClick={handleGetMorePost}
            >
              Tải thêm bài viết
            </button>
          </div>
        )}
    </div>
  );
};

export default TopicFeed;
