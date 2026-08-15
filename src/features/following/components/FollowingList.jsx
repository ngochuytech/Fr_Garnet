import { useFollowList } from '../hooks/useFollowList';
import { useNavigate } from 'react-router-dom';

const FollowingList = () => {
  const { 
    users, 
    loading, 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    isSearching, 
    hasSearched, 
    actionLoadingIds,
    toggleFollow 
  } = useFollowList();

  const navigate = useNavigate();

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
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">Đang tải danh sách gợi ý...</div>
          ) : users.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">Chưa có gợi ý nào cho bạn.</div>
          ) : users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              {/* Left Side: Avatar and Info */}
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => navigate(`/user/${user.id}`)}
              >
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-[48px] h-[48px] rounded-full object-cover border border-gray-200 shadow-sm group-hover:opacity-90 transition-opacity"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-[15px] text-gray-800 group-hover:underline group-hover:text-[#8d3f41] transition-colors">
                    {user.fullName}
                  </span>
                  <span className="text-[12px] text-gray-500 mt-0.5">
                    {user.department || 'Người dùng Garnet'}
                  </span>
                </div>
              </div>

              {/* Right Side: Action Button */}
              <button
                onClick={() => toggleFollow(user.id, user.isFollowing)}
                disabled={actionLoadingIds.includes(user.id)}
                className={`px-5 py-1.5 rounded-full text-[14px] font-semibold transition-all duration-200 flex items-center justify-center min-w-[120px] gap-2 ${
                  user.isFollowing
                    ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                    : 'bg-[#8d3f41] text-white hover:bg-[#6a2f30] shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                } ${actionLoadingIds.includes(user.id) ? 'opacity-70 cursor-not-allowed hover:transform-none' : ''}`}
              >
                {actionLoadingIds.includes(user.id) ? (
                  <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : user.isFollowing ? (
                  'Đang theo dõi'
                ) : (
                  'Theo dõi'
                )}
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm người dùng..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8d3f41] focus:ring-1 focus:ring-[#8d3f41] transition-all"
          />
        </div>

      </div>

      {/* List Kết quả sau bộ lọc */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isSearching ? (
          <div className="p-8 text-center text-gray-500 text-sm">Đang tìm kiếm...</div>
        ) : hasSearched && searchResults.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">Không tìm thấy người dùng nào phù hợp với "{searchQuery}".</div>
        ) : searchResults.length > 0 ? (
          <div className="flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-bold text-gray-700">Kết quả tìm kiếm</h3>
            </div>
            {searchResults.map((user) => (
              <div
                key={`search-${user.id}`}
                className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                {/* Left Side: Avatar and Info */}
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => navigate(`/user/${user.id}`)}
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-[48px] h-[48px] rounded-full object-cover border border-gray-200 shadow-sm group-hover:opacity-90 transition-opacity"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-[15px] text-gray-800 group-hover:underline group-hover:text-[#8d3f41] transition-colors">
                      {user.fullName}
                    </span>
                    <span className="text-[12px] text-gray-500 mt-0.5">
                      {user.department || 'Người dùng CampusHub'}
                    </span>
                  </div>
                </div>

                {/* Right Side: Action Button */}
                <button
                  onClick={() => toggleFollow(user.id, user.isFollowing)}
                  disabled={actionLoadingIds.includes(user.id)}
                  className={`px-5 py-1.5 rounded-full text-[14px] font-semibold transition-all duration-200 flex items-center justify-center min-w-[120px] gap-2 ${
                    user.isFollowing
                      ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                      : 'bg-[#8d3f41] text-white hover:bg-[#6a2f30] shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  } ${actionLoadingIds.includes(user.id) ? 'opacity-70 cursor-not-allowed hover:transform-none' : ''}`}
                >
                  {actionLoadingIds.includes(user.id) ? (
                    <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : user.isFollowing ? (
                    'Đang theo dõi'
                  ) : (
                    'Theo dõi'
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            Danh sách kết quả tìm kiếm sẽ hiển thị ở đây...
          </div>
        )}
      </div>
    </main>
  );
};

export default FollowingList;
