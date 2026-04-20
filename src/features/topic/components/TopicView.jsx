import { useParams } from 'react-router-dom';
import HomeLeftSidebar from '../../home/components/HomeLeftSidebar';
import TopicHeader from './TopicHeader';
import TopicFeed from './TopicFeed';
import RelatedTopicsSidebar from './RelatedTopicsSidebar';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../utils/api';

const TopicView = () => {
  const { topicName } = useParams();
  const decodedTopicName = decodeURIComponent(topicName || '');
  const [topicInfo, setTopicInfo] = useState({ followerCount: 0, imageUrl: '' });

  useEffect(() => {
    // Fetch this topic's data from generic topics list
    const fetchTopicInfo = async () => {
      try {
        const data = await apiFetch(`/users/topics/${decodedTopicName}`);
        if (data) {
          setTopicInfo({ followerCount: data.followerCount, imageUrl: data.imageUrl });
        }
      } catch (err) {
        console.error("Error fetching topic info", err);
      }
    };
    fetchTopicInfo();
  }, [decodedTopicName]);

  return (
    <div className="w-full min-h-[calc(100vh-50px)]" style={{ backgroundColor: '#faf7f7' }}>
      <div className="max-w-[1100px] mx-auto px-4 pt-5 pb-10">
        <div className="flex items-start gap-6">
          {/* Left Sidebar */}
          <HomeLeftSidebar />

          {/* Main Feed */}
          <div className="flex-1 min-w-0">
             <TopicHeader 
               topicName={decodedTopicName} 
               followerCount={topicInfo.followerCount} 
               imageUrl={topicInfo.imageUrl} 
             />

             {/* Search bar */}
             <div className="mb-4 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm flex items-center gap-2.5 transition-colors focus-within:border-[#8d3f41] focus-within:ring-1 focus-within:ring-[#8d3f41]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm trong topic này" 
                  className="w-full bg-transparent outline-none text-[14.5px] text-gray-800 placeholder-gray-400" 
                />
             </div>
             
             <TopicFeed topicName={decodedTopicName} />
          </div>

          {/* Right Sidebar */}
          <RelatedTopicsSidebar currentTopic={decodedTopicName} />
        </div>
      </div>
    </div>
  );
};

export default TopicView;
