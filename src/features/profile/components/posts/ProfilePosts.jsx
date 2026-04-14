import PostCard from '../../../../components/PostCard';
import { useProfilePosts } from '../../hooks/posts/useProfilePosts';

const mockPosts = [
  {
    id: 1,
    author: 'Huy Nguyễn',
    avatarUrl: 'https://ui-avatars.com/api/?name=Huy+Nguyen&background=dfb9b9&color=6a2f30',
    authorCredential: 'Sinh viên tại Đại học Công nghệ',
    timeAgo: '1 năm trước',
    title: 'Làm thế nào để cân bằng giữa việc học trên trường và tự học lập trình?',
    content: 'Lên kế hoạch rõ ràng, phân bổ thời gian hợp lý và tránh sự trì hoãn. Khi đã quen với nhịp độ, bạn sẽ thấy việc học tập mượt mà hơn rất nhiều so với bạn nghĩ...',
    upvotes: '24',
    image: null
  },
  {
    id: 2,
    author: 'Huy Nguyễn',
    avatarUrl: 'https://ui-avatars.com/api/?name=Huy+Nguyen&background=dfb9b9&color=6a2f30',
    authorCredential: 'Sinh viên tại Đại học Công nghệ',
    timeAgo: '2 năm trước',
    title: 'Những địa điểm thực tế nào có tên nghe giống trong tiểu thuyết hư cấu?',
    content: 'Đảo Robinson Crusoe hoặc Isla Róbinson Crusoe, một phần của Chile. Nơi đây sở hữu cảnh vật thiên nhiên vô cùng kỳ vĩ... (xem thêm)',
    upvotes: '12',
    image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=650&q=80'
  }
];

const ProfilePosts = () => {
  const {
    dropdownRef,
    isOpenSort,
    selectedSort,
    sortOptions,
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
        {mockPosts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </>
  );
};

export default ProfilePosts;
