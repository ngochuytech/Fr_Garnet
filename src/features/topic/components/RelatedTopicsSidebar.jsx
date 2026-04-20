import { useEffect, useState } from 'react';
import { apiFetch } from '../../../utils/api';
import { Link } from 'react-router-dom';

const RelatedTopicsSidebar = ({ currentTopic }) => {
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

  const filteredTopics = topics.filter(t => t.topicName !== currentTopic).slice(0, 8);

  return (
    <aside className="w-[280px] flex-shrink-0 sticky top-[58px] self-start bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <h2 className="text-[15px] font-bold text-gray-800 mb-4 px-1 border-b border-gray-100 pb-2">Related Topics</h2>
      <div className="flex flex-col gap-1">
        {filteredTopics.map((topic, idx) => (
          <Link
            to={`/topic/${encodeURIComponent(topic.topicName)}`}
            key={idx}
            className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-left transition-all hover:bg-gray-50 group"
          >
            <img src={topic.imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&q=80"} alt={topic.topicName} className="w-10 h-10 rounded-lg flex-shrink-0 object-cover" />
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-semibold text-gray-800 truncate group-hover:text-[#6a2f30] transition-colors leading-tight">
                {topic.topicName}
              </span>
              <span className="text-[12px] text-gray-500 mt-0.5">{topic.followerCount || "12.4K"} followers</span>
            </div>
          </Link>
        ))}
      </div>
      {topics.length > 9 && (
        <button className="mt-4 text-[13px] font-medium text-gray-500 hover:text-gray-800 px-3 w-full text-left">
          Show 5 more
        </button>
      )}
    </aside>
  );
};
export default RelatedTopicsSidebar;
