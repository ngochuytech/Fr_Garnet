import React from 'react';

const ProfileTabs = () => {
  return (
    <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar mb-4 mt-2">
      {['0 Bài đăng', '0 Người theo dõi', 'Đang theo dõi', 'Hoạt động', 'Giới thiệu'].map((tab, idx) => (
        <button
          key={tab}
          className={`whitespace-nowrap px-3 py-3 text-sm font-semibold transition-colors ${idx === 0
            ? 'text-[#b04f51] border-b-2 border-[#b04f51]'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;
