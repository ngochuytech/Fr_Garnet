import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../../utils/api';

const topTopics = [
  { id: 1, tag: 'ReactJS', count: '2.1K bài' },
  { id: 2, tag: 'Python', count: '1.8K bài' },
  { id: 3, tag: 'MachineLearning', count: '1.5K bài' },
  { id: 4, tag: 'NodeJS', count: '1.2K bài' },
  { id: 5, tag: 'UXDesign', count: '950 bài' },
];

const HomeLeftSidebar = () => {
  const [showAllSpaces, setShowAllSpaces] = useState(false);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await apiFetch('/users/topics');
        setTopics(data);
      } catch (error) {
        console.error('Failed to fetch topics:', error);
      }
    };
    fetchTopics();
  }, []);

  const visibleSpaces = showAllSpaces ? topics : topics.slice(0, 4);

  return (
    <aside className="w-full pb-6 pr-2">
      {/* Spaces */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
            Topics
          </span>
          <button className="text-[12px] font-medium hover:underline" style={{ color: 'var(--color-dusty-rose-600)' }}>
            + Tạo mới
          </button>
        </div>

        <nav className="flex flex-col gap-0.5">
          {visibleSpaces.map((topic) => {
            return (
              <Link
                key={topic?.topicName}
                to={`/topic/${encodeURIComponent(topic?.topicName || '')}`}
                className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg text-left transition-all hover:bg-[#f7edee] group"
              >
                <img src={topic?.imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&q=80"} alt={topic.topicName} className="w-8 h-8 rounded-lg flex-shrink-0 object-cover" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-medium text-gray-800 truncate leading-tight group-hover:text-[#6a2f30] transition-colors">
                    {topic.topicName}
                  </span>
                  <span className="text-[11px] text-gray-400">{topic.followerCount} thành viên</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {topics.length > 4 && (
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
                Xem thêm ({topics.length - 4})
              </>
            )}
          </button>
        )}
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
    </aside>
  );
};

export default HomeLeftSidebar;
