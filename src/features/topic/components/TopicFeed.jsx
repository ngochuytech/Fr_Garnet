import { useHomeFeed } from '../../home/hooks/useHomeFeed';
import { useAuth } from '../../../context/AuthContext';
import PostCard from '../../../components/PostCard';

const TopicFeed = ({ topicName }) => {
  const { posts, loading, error, isLast, handleGetMorePost } = useHomeFeed(); // using home feed for mock data
  const { user } = useAuth();

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
