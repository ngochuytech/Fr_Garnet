import { useState } from 'react';

const mockSuggestedUsers = [
  {
    id: 1,
    fullname: 'Nguyễn Văn A',
    avatarUrl: 'https://ui-avatars.com/api/?name=Nguyễn+Văn+A&background=dfb9b9&color=6a2f30&size=128',
    reason: 'Có 5 bạn chung',
    isFollowing: false,
  },
  {
    id: 2,
    fullname: 'Trần Thị B',
    avatarUrl: 'https://ui-avatars.com/api/?name=Trần+Thị+B&background=d09596&color=190b0b&size=128',
    reason: 'Cùng khoa CNTT',
    isFollowing: false,
  },
  {
    id: 3,
    fullname: 'Lê Hoàng C',
    avatarUrl: 'https://ui-avatars.com/api/?name=Lê+Hoàng+C&background=efdcdc&color=6a2f30&size=128',
    reason: 'Chung sở thích Java',
    isFollowing: false,
  },
  {
    id: 4,
    fullname: 'Phạm D',
    avatarUrl: 'https://ui-avatars.com/api/?name=Phạm+D&background=dfb9b9&color=6a2f30&size=128',
    reason: 'Có 2 bạn chung',
    isFollowing: false,
  }
];

const FollowingList = () => {
  const [users, setUsers] = useState(mockSuggestedUsers);

  const toggleFollow = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
  };

  return (
    <main className="w-full flex flex-col gap-5">
      {/* Khối 1: Gợi ý kết nối */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-white">
          <h2 className="text-lg font-bold text-gray-800">Gợi ý cho bạn</h2>
          <p className="text-sm text-gray-500">Những người bạn có thể biết</p>
        </div>

        {/* User List */}
        <div className="flex flex-col">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              {/* Left Side: Avatar and Info */}
              <div className="flex items-center gap-3">
                <img
                  src={user.avatarUrl}
                  alt={user.fullname}
                  className="w-[48px] h-[48px] rounded-full object-cover border border-gray-200 shadow-sm"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-[15px] text-gray-800 hover:underline cursor-pointer">
                    {user.fullname}
                  </span>
                  <span className="text-[12px] text-[#8d3f41] font-medium bg-[#f7edee] w-fit px-2 py-0.5 rounded mt-1">
                    ✨ {user.reason}
                  </span>
                </div>
              </div>

              {/* Right Side: Action Button */}
              <button
                onClick={() => toggleFollow(user.id)}
                className={`px-5 py-1.5 rounded-full text-[14px] font-semibold transition-all duration-200 ${user.isFollowing
                    ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                    : 'bg-[#8d3f41] text-white hover:bg-[#6a2f30] shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
              >
                {user.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Khối 2: Bộ lọc & Tìm kiếm */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
        <h2 className="text-base font-bold text-gray-800">Bộ lọc & Tìm kiếm</h2>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

          </div>
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8d3f41] focus:ring-1 focus:ring-[#8d3f41] transition-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center pt-2">
          {/* Checkboxes */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 accent-[#8d3f41] bg-gray-100 border-gray-300 rounded cursor-pointer" />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Chỉ hiện người học cùng ngành</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 accent-[#8d3f41] bg-gray-100 border-gray-300 rounded cursor-pointer" />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Chỉ hiện người có chung sở thích</span>
            </label>
          </div>

          {/* Dropdown Sort */}
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 self-start sm:self-auto">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <line x1="21" y1="10" x2="3" y2="10" />
              <line x1="21" y1="6" x2="3" y2="6" />
              <line x1="21" y1="14" x2="3" y2="14" />
              <line x1="21" y1="18" x2="3" y2="18" />
            </svg>
            <select className="bg-transparent text-gray-700 text-sm focus:outline-none cursor-pointer py-1 max-w-[150px] truncate">
              <option>Theo dõi gần đây</option>
              <option>Tương tác nhiều nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* List Kết quả sau bộ lọc */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500 text-sm">
        Danh sách người dùng đang theo dõi sẽ hiển thị ở đây...
      </div>
    </main>
  );
};

export default FollowingList;