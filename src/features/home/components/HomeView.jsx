import { useAuth } from '../../../context/AuthContext';
import HomeFeed from './HomeFeed';
import HomeLeftSidebar from './HomeLeftSidebar';

const HomeView = () => {
  const { user } = useAuth();
  const displayName = user?.fullname || 'User';
  const avatarUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=dfb9b9&color=6a2f30`;

  return (
    <div className="w-full min-h-[calc(100vh-50px)]" style={{ backgroundColor: '#faf7f7' }}>
      <div className="max-w-[1300px] mx-auto px-4 pt-5 pb-10">
        <div className="flex items-start gap-6">
          {/* Left Sidebar */}
          <HomeLeftSidebar />

          {/* Main Feed */}
          <HomeFeed avatarUrl={avatarUrl} />
        </div>
      </div>
    </div>
  );
};

export default HomeView;
