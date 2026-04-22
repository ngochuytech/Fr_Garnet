import HomeLeftSidebar from '../../home/components/HomeLeftSidebar';
import HomeRightSidebar from '../../home/components/HomeRightSidebar';
import FollowingList from './FollowingList';

const FollowingView = () => {
  return (
    <div className="w-full min-h-[calc(100vh-50px)]" style={{ backgroundColor: '#faf7f7' }}>
      <div className="max-w-[1300px] mx-auto px-4 pt-5 pb-10">
        <div className="flex items-start gap-6 lg:justify-between w-full">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:w-[220px] shrink-0 sticky top-[78px] h-[calc(100vh-78px)] overflow-y-auto hide-scrollbar">
            <HomeLeftSidebar />
          </div>

          {/* Main List */}
          <div className="w-full lg:flex-1 max-w-[755px] mx-auto">
            <FollowingList />
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

export default FollowingView;