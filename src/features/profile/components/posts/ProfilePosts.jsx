import PostCard from '../../../../components/PostCard';
import { useProfilePosts } from '../../hooks/posts/useProfilePosts';
import { useAuth } from '../../../../context/AuthContext';

const ProfilePosts = ({ userId = null }) => {
  const { user: currentUser } = useAuth();
  const isOwnProfile = !userId || (currentUser && (currentUser.id === userId || currentUser.userId === userId));

  const { posts, loading, loadingMore, error, hasNext, handleGetMorePosts } = useProfilePosts(userId);

  return (
    <>
      {/* ... (phần code Sub Header & Search Content giữ nguyên) */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <h2 className="text-[15px] font-bold text-gray-900">Bài đăng</h2>
      </div>

      {/* Divider */}
      <hr className="mb-4 border-gray-200" />

      <div className="flex flex-col mt-4">
        {loading ? (
            <div className="py-6 text-center text-gray-500">Đang tải bài viết...</div>
        ) : error ? (
            <div className="py-6 text-center text-red-500">{error}</div>
        ) : Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} isOwnPost={isOwnProfile} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-[15px]">Chưa có bài viết nào</p>
          </div>
        )}

        {hasNext && posts.length > 0 && (
          <div className="flex justify-center py-4 border-t border-gray-100 mt-2">
            <button
              onClick={handleGetMorePosts}
              disabled={loadingMore}
              className="px-6 py-2 rounded-full text-[14px] font-medium border transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: 'var(--color-dusty-rose-300)',
                color: 'var(--color-dusty-rose-700)',
              }}
            >
              {loadingMore ? 'Đang tải...' : 'Tải thêm bài viết'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePosts;
