import { useState } from 'react';
import { Link } from 'react-router-dom';

const spaces = [
  {
    id: 1,
    name: 'Công nghệ thông tin',
    icon: '💻',
    bg: '#efdcdc',
    color: '#6a2f30',
    followers: '12.4K',
  },
  {
    id: 2,
    name: 'Khoa học dữ liệu',
    icon: '📊',
    bg: '#dfb9b9',
    color: '#462020',
    followers: '8.2K',
  },
  {
    id: 3,
    name: 'Lập trình Web',
    icon: '🌐',
    bg: '#f7edee',
    color: '#8d3f41',
    followers: '15.1K',
  },
  {
    id: 4,
    name: 'Trí tuệ nhân tạo',
    icon: '🤖',
    bg: '#efdcdc',
    color: '#6a2f30',
    followers: '9.7K',
  },
  {
    id: 5,
    name: 'An ninh mạng',
    icon: '🔐',
    bg: '#dfb9b9',
    color: '#462020',
    followers: '5.3K',
  },
  {
    id: 6,
    name: 'Điện tử - Viễn thông',
    icon: '📡',
    bg: '#f7edee',
    color: '#8d3f41',
    followers: '4.8K',
  },
];

const topTopics = [
  { id: 1, tag: 'ReactJS', count: '2.1K bài' },
  { id: 2, tag: 'Python', count: '1.8K bài' },
  { id: 3, tag: 'MachineLearning', count: '1.5K bài' },
  { id: 4, tag: 'NodeJS', count: '1.2K bài' },
  { id: 5, tag: 'UXDesign', count: '950 bài' },
];

const HomeLeftSidebar = () => {
  const [showAllSpaces, setShowAllSpaces] = useState(false);
  const visibleSpaces = showAllSpaces ? spaces : spaces.slice(0, 4);

  return (
    <aside className="w-[220px] flex-shrink-0 sticky top-[58px] self-start h-[calc(100vh-58px)] overflow-y-auto pb-6 pr-2 hide-scrollbar">
      {/* Spaces */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
            Spaces
          </span>
          <button className="text-[12px] font-medium hover:underline" style={{ color: 'var(--color-dusty-rose-600)' }}>
            + Tạo mới
          </button>
        </div>

        <nav className="flex flex-col gap-0.5">
          {visibleSpaces.map((space) => (
            <button
              key={space.id}
              className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg text-left transition-all hover:bg-[#f7edee] group"
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[16px] flex-shrink-0 shadow-sm"
                style={{ backgroundColor: space.bg }}
              >
                {space.icon}
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-medium text-gray-800 truncate leading-tight group-hover:text-[#6a2f30] transition-colors">
                  {space.name}
                </span>
                <span className="text-[11px] text-gray-400">{space.followers} thành viên</span>
              </div>
            </button>
          ))}
        </nav>

        <button
          onClick={() => setShowAllSpaces(!showAllSpaces)}
          className="mt-1 w-full text-left px-2 py-1.5 text-[13px] font-medium rounded-lg hover:bg-[#f7edee] transition-colors flex items-center gap-1"
          style={{ color: 'var(--color-dusty-rose-600)' }}
        >
          {showAllSpaces ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
              Thu gọn
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              Xem thêm ({spaces.length - 4})
            </>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-1 mb-4" />

      {/* Top Topics */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
            Chủ đề hot
          </span>
        </div>
        <div className="flex flex-col gap-1">
          {topTopics.map((topic, idx) => (
            <button
              key={topic.id}
              className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-[#f7edee] transition-colors group text-left w-full"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="text-[12px] font-bold w-5 text-center flex-shrink-0"
                  style={{ color: 'var(--color-dusty-rose-400)' }}
                >
                  {idx + 1}
                </span>
                <span className="text-[13px] text-gray-700 group-hover:text-[#6a2f30] font-medium truncate transition-colors">
                  #{topic.tag}
                </span>
              </div>
              <span className="text-[11px] text-gray-400 flex-shrink-0 ml-1">{topic.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-1 mb-4" />

      {/* Footer links */}
      <div className="px-2">
        <p className="text-[11px] text-gray-400 mt-1">© 2026 CampusHub</p>
      </div>
    </aside>
  );
};

export default HomeLeftSidebar;
