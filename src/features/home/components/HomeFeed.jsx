import { CreatePostBar } from '../../../components/CreatePostBar';
import PostCard from '../../../components/PostCard';
import { useHomeFeed } from '../hooks/useHomeFeed';
import { useAuth } from '../../../context/AuthContext';

const HomeFeed = ({ avatarUrl }) => {
  const { posts, loading, error, hasNext, refreshPosts, handleGetMorePost } = useHomeFeed();
  const { user } = useAuth();

  return (
    <div className="flex-1 min-w-0">
      {/* Create Post */}
      <div className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden shadow-sm">
        <div className="p-3">
          <CreatePostBar avatarUrl={avatarUrl} onPostCreated={refreshPosts} />
        </div>
      </div>

      {/* Feed Filter */}
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
              <div key={post.id} className="relative pt-2">
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
        {hasNext && posts.length > 0 && (
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
    </div>
  );
};

export default HomeFeed;
