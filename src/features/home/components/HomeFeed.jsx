import { CreatePostBar } from '../../../components/CreatePostBar';
import PostCard from '../../../components/PostCard';
import { useHomeFeed } from '../hooks/useHomeFeed';
import { useAuth } from '../../../context/AuthContext';

const FeedFilter = ({ active, onChange }) => {
  const filters = [
    { key: 'following', label: 'Đang theo dõi' },
    { key: 'forYou', label: 'Dành cho bạn' },
    { key: 'newest', label: 'Mới nhất' },
  ];

  return (
    <div className="flex items-center gap-0 border-b border-gray-100">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={`px-4 py-3 text-[14px] font-medium transition-all relative ${
            active === f.key
              ? 'text-[#8d3f41] font-semibold'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          {f.label}
          {active === f.key && (
            <span
              className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-sm"
              style={{ backgroundColor: 'var(--color-dusty-rose-600)' }}
            />
          )}
        </button>
      ))}
    </div>
  );
};


const HomeFeed = ({ avatarUrl }) => {
  const { activeFilter, setActiveFilter, posts, loading, error, refreshPosts, handleGetMorePost } = useHomeFeed();
  const { user } = useAuth();

  return (
    <div className="flex-1 min-w-0">
      {/* Create Post */}
      <div className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden shadow-sm">
        <div className="p-3">
          <CreatePostBar avatarUrl={avatarUrl} onPostCreated={refreshPosts} />
        </div>
        <div className="flex items-center gap-1 px-3 pb-2 border-t border-gray-50 pt-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] text-gray-500 hover:bg-[#f7edee] hover:text-[#8d3f41] font-medium transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            Ảnh
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] text-gray-500 hover:bg-[#f7edee] hover:text-[#8d3f41] font-medium transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            Video
          </button>
        </div>
      </div>

      {/* Feed Filter */}
      <div className="bg-white rounded-xl border border-gray-200 mb-4 shadow-sm overflow-hidden">
        <FeedFilter active={activeFilter} onChange={setActiveFilter} />

        {/* Post List */}
        <div className="px-4 divide-y divide-gray-100">
          {loading ? (
             <div className="py-4 text-center text-gray-500">Đang tải...</div>
          ) : error ? (
             <div className="py-4 text-center text-red-500">{error}</div>
          ) : posts.length === 0 ? (
             <div className="py-4 text-center text-gray-500">Chưa có bài viết nào</div>
          ) : posts.map((post) => {
             const authorName = post.author?.authorName || 'Người dùng ẩn danh';
             const department = post.author?.department;
             const isOwnPost = Boolean(user && user.id && post.author && post.author.id === user.id);
             
             return (
              <div key={post.id} className="relative pt-2">
                <PostCard
                  postId={post.id}
                  authorId={post.author?.id}
                  author={authorName}
                  avatarUrl={`https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=dfb9b9&color=6a2f30`}
                  authorCredential={department ? `Khoa: ${department}` : 'Thành viên CampusHub'}
                  createdAt={post.createdAt}
                  content={post.content}
                  upvotes={post.likeCount}
                  downvotes={post.dislikeCount || 0}
                  userReaction={post.userReaction}
                  isOwnPost={isOwnPost}
                />
              </div>
            );
          })}
        </div>

        {/* Load more */}
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
      </div>
    </div>
  );
};

export default HomeFeed;
