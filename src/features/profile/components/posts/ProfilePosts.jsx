import PostCard from '../../../../components/PostCard';
import { useProfilePosts } from '../../hooks/posts/useProfilePosts';

const ProfilePosts = () => {
  const {
    dropdownRef,
    isOpenSort,
    selectedSort,
    sortOptions,
    posts,
    handleSelect,
    setIsOpenSort
  } = useProfilePosts();

  return (
    <>
      {/* Sub Header & Search Content */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <h2 className="text-[15px] font-bold text-gray-900">Bài đăng</h2>
        <div className='relative' ref={dropdownRef}>
          <button onClick={() => setIsOpenSort(!isOpenSort)} className="flex items-center text-gray-500 text-sm hover:bg-gray-100 px-2 py-1 rounded">
            {selectedSort}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isOpenSort && (
            <div className="absolute right-0 bottom-full mt-1 bg-white border border-gray-200 rounded shadow-md w-48 z-10">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedSort === option ? 'font-semibold text-blue-600 bg-blue-50' : 'text-gray-700'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <hr className="mb-4 border-gray-200" />

      {/* Content Space & Empty State */}
      <div className="flex items-center w-full max-w-[400px] h-10 border border-gray-300 rounded overflow-hidden hover:border-blue-500 hover:shadow-[0_0_0_2px_rgba(59,130,246,0.2)] transition-shadow">
        <input
          type="text"
          placeholder="Search content"
          className="w-full h-full px-3 text-sm outline-none text-gray-800 placeholder-gray-500"
        />
        <button className="w-10 h-10 flex items-center justify-center text-gray-400">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col mt-4">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} isOwnPost={true} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-[15px]">Chưa có bài viết nào</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePosts;
