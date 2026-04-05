import React from 'react';
import PostCard from '../components/PostCard';

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

const ProfilePage = () => {
  return (
    <div className="w-full flex justify-center py-6 px-4 bg-white">
      <div className="flex flex-col md:flex-row w-full max-w-[1000px] gap-8">
        
        {/* Left Column - Main Content */}
        <div className="flex-1 md:max-w-[650px] flex flex-col">
          {/* User Header Section */}
          <div className="flex items-start gap-6 mb-6 relative">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
              <img 
                src="https://ui-avatars.com/api/?name=Huy+Nguyen&background=dfb9b9&color=6a2f30&size=128" 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* User Info */}
            <div className="flex-1 pt-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Huy Nguyễn</h1>
              <button className="text-blue-600 hover:underline text-sm font-medium">Add profile credential</button>
              <div className="text-gray-500 text-sm mt-1">
                <span className="hover:underline cursor-pointer">0 followers</span>
                <span className="mx-1">&middot;</span>
                <span className="hover:underline cursor-pointer">0 following</span>
              </div>
            </div>

            {/* Float Edit Button */}
            <button className="absolute top-2 right-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
          </div>

          <div className="mb-6 group">
            <p className="text-gray-400 text-sm cursor-pointer hover:underline underline-offset-2">Write a description about yourself</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar mb-4 mt-2">
            {['0 Bài đăng', '0 Người theo dõi', 'Đang theo dõi', 'Hoạt động', 'Giới thiệu'].map((tab, idx) => (
              <button 
                key={tab}
                className={`whitespace-nowrap px-3 py-3 text-sm font-semibold transition-colors ${
                  idx === 0 
                  ? 'text-[#b04f51] border-b-2 border-[#b04f51]' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sub Header & Search Content */}
          <div className="flex items-center justify-between mb-4 mt-2">
            <h2 className="text-[15px] font-bold text-gray-900">Bài đăng</h2>
            <button className="flex items-center text-gray-500 text-sm hover:bg-gray-100 px-2 py-1 rounded">
              Gần đây nhất
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
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
        </div>

        {/* Right Column - Sidebar */}
        <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col gap-6">
          
          {/* Credentials & Highlights */}
          <div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
              <h3 className="text-[15px] font-medium text-gray-700">Credentials & Highlights</h3>
              <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 group cursor-pointer">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-blue-600 group-hover:underline">Add employment credential</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                <span className="text-sm font-medium text-blue-600 group-hover:underline">Add education credential</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium text-blue-600 group-hover:underline">Add location credential</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="text-[15px] text-gray-700">Knows Vietnamese</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.5"></rect>
                  <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.5"></line>
                  <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.5"></line>
                  <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.5"></line>
                </svg>
                <span className="text-[15px] text-gray-700">Joined March 2026</span>
              </div>
            </div>
          </div>

          {/* Knows About */}
          <div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
              <h3 className="text-[15px] font-medium text-gray-700">Knows about</h3>
              <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {/* Fake Chip Item */}
              <div className="flex items-center gap-3 p-1 rounded hover:bg-gray-50 cursor-pointer group">
                <div className="w-8 h-8 rounded shrink-0 bg-red-100 flex items-center justify-center font-bold text-red-700 text-xs">
                  VN
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-gray-800 hover:text-blue-600 transition-colors">Vietnamese (language)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
