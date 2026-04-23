import React from 'react';
import PostCard from '../../../components/PostCard';
import { useProfilePosts } from '../../profile/hooks/posts/useProfilePosts'; // Reusing the hook but it's parameterized

const UserPosts = ({ userId }) => {
  const {
    dropdownRef,
    isOpenSort,
    selectedSort,
    sortOptions,
    posts,
    handleSelect,
    setIsOpenSort
  } = useProfilePosts(userId);

  return (
    <>
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
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedSort === option ? 'font-semibold text-[#b04f51] bg-red-50' : 'text-gray-700'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <hr className="mb-4 border-gray-200" />

      <div className="flex flex-col mt-4">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} isOwnPost={false} />
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

export default UserPosts;
