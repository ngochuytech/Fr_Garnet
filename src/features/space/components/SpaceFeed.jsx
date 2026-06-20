import PostCard from '../../../components/PostCard';
import { CreatePostBar } from '../../../components/CreatePostBar';
import { useAuth } from '../../../context/AuthContext';
import { useSpacePosts } from '../hooks/useSpacePosts';

const canCreateGroupPost = (space) => {
  return Boolean(
    space?.status === 'ACTIVE'
    && (space?.memberStatus === 'APPROVED'
      || space?.memberRole === 'LEADER')
  );
};

const SpaceFeed = ({ space, detailLoading, onBack, onShowMembers }) => {
  const { user } = useAuth();
  const displayName = user?.fullname || 'User';
  const avatarUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=dfb9b9&color=6a2f30`;
  const {
    posts,
    loading,
    loadingMore,
    error,
    hasNext,
    refreshPosts,
    handleGetMorePosts,
  } = useSpacePosts(space?.id);

  if (!space) {
    return (
      <main className="w-full flex-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-sm font-semibold text-gray-700">
            {detailLoading ? 'Đang tải thông tin nhóm...' : 'Không tìm thấy nhóm'}
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-4 px-4 py-2 rounded-lg bg-[#8d3f41] text-white text-sm font-bold hover:bg-[#6a2f30] transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </main>
    );
  }

  const canCreatePost = canCreateGroupPost(space);
  const isArchived = space?.status === 'ARCHIVED';

  return (
    <main className="w-full flex-1">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 p-4 flex items-center justify-between gap-3 top-[78px] z-10">
        <div className="flex items-center gap-4 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors border border-gray-200 shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>

          <div className="flex flex-col min-w-0">
            <h1 className="text-[17px] font-bold text-gray-900 leading-tight truncate">
              Hội {space.name}
            </h1>
            <p className="text-[13px] text-gray-500 font-medium">Bảng tin</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onShowMembers}
          className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-[13px] font-bold text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
        >
          Thành viên
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {isArchived && (
          <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <p className="font-bold">Nhóm đã bị lưu trữ</p>
            <p className="mt-1">Bạn chỉ có thể xem các bài viết cũ. Nhóm này không còn cho phép đăng bài hoặc phát sinh hoạt động mới.</p>
          </div>
        )}

        {canCreatePost && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-3">
              <CreatePostBar
                avatarUrl={avatarUrl}
                onPostCreated={refreshPosts}
                groupId={space.id}
                placeholder={`Bạn muốn chia sẻ thông tin gì tới hội ${space.name}?`}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 divide-y divide-gray-100">
            {loading ? (
              <div className="py-6 text-center text-gray-500">Đang tải bài viết...</div>
            ) : error ? (
              <div className="py-6 text-center text-red-500">{error}</div>
            ) : posts.length === 0 ? (
              <div className="py-6 text-center text-gray-500">Chưa có bài viết nào trong nhóm</div>
            ) : posts.map((post) => {
              const isOwnPost = Boolean(user && user.id && post.author && post.author.id === user.id);
              const isOwnSharePost = Boolean(user && user.id && post.sharedPost && post.sharedPost.author && post.sharedPost.author.id === user.id);

              return (
                <div key={post.id} className="relative pt-2">
                  <PostCard
                    post={post}
                    isOwnPost={isOwnPost}
                    isOwnSharePost={isOwnSharePost}
                    group={space}
                  />
                </div>
              );
            })}
          </div>

          {!loading && hasNext && posts.length > 0 && (
            <div className="flex justify-center py-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleGetMorePosts}
                disabled={loadingMore}
                className="px-6 py-2 rounded-full text-[14px] font-medium border transition-all hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
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

        {!hasNext && posts.length > 0 && (
          <div className="py-6 text-center text-gray-500 font-medium text-sm">
            Đã xem hết tin mới nhất
          </div>
        )}
      </div>
    </main>
  );
};

export default SpaceFeed;
