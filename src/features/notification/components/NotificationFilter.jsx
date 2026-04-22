import { useState } from 'react';

const filters = [
  { id: 'all', label: 'Tất cả thông báo' },
  { id: 'stories', label: 'Bài viết' },
  { id: 'spaces', label: 'Hội nhóm' },
  { id: 'comments', label: 'Bình luận và nhắc đến' },
  { id: 'upvotes', label: 'Lượt thích' },
  { id: 'content', label: 'Nội dung của bạn' },
  { id: 'profile', label: 'Hồ sơ của bạn' },
  { id: 'announcements', label: 'Thông báo hệ thống' },
];

const NotificationFilter = () => {
  const [active, setActive] = useState('all');

  return (
    <aside className="w-full">
      <h3 className="font-semibold text-[15px] mb-2 px-3 text-gray-800">Bộ lọc</h3>
      <div className="h-px bg-gray-200 mx-3 mb-2" />
      <nav className="flex flex-col gap-0.5">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActive(filter.id)}
            className={`w-full text-left px-3 py-2 text-[13px] rounded-lg transition-colors duration-200 ${
              active === filter.id
                ? 'bg-[#f7edee] text-[#8d3f41] font-medium'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default NotificationFilter;
