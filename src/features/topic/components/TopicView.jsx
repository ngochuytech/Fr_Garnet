import { useParams } from 'react-router-dom';
import HomeLeftSidebar from '../../home/components/HomeLeftSidebar';
import TopicHeader from './TopicHeader';
import TopicFeed from './TopicFeed';
import HomeRightSidebar from '../../home/components/HomeRightSidebar';
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
      <div className="max-w-[1300px] mx-auto px-4 pt-5 pb-10">
        <div className="flex items-start gap-6 lg:justify-between w-full">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:w-[220px] shrink-0 sticky top-[78px] h-[calc(100vh-78px)] overflow-y-auto hide-scrollbar">
            <HomeLeftSidebar />
          </div>

          {/* Main Feed */}
          <div className="w-full lg:flex-1 max-w-[755px] mx-auto">
             <TopicHeader 
               topicName={decodedTopicName} 
               followerCount={topicInfo.followerCount} 
               imageUrl={topicInfo.imageUrl} 
             />
             
             <TopicFeed topicName={decodedTopicName} />
          </div>

          {/* Right Sidebar */}
          <div className="hidden xl:block w-[30%] max-w-[325px] shrink-0 sticky top-[78px] h-[calc(100vh-78px)] overflow-y-auto hide-scrollbar">
            <HomeRightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicView;
