import { useState } from 'react';
import ProfileHeader from '../features/profile/components/posts/ProfileHeader';
import ProfileDescriptionEditor from '../features/profile/components/posts/ProfileDescriptionEditor';
import ProfileTabs from '../features/profile/components/ProfileTabs';
import ProfilePosts from '../features/profile/components/posts/ProfilePosts';
import ProfileSidebar from '../features/profile/components/posts/ProfileSidebar';
import SettingsTab from '../features/profile/components/settings/ProfileSetting';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('0 Bài đăng');

  return (
    <div className="w-full flex justify-center py-6 px-4 bg-white">
      <div className="flex flex-col md:flex-row w-full max-w-[1000px] gap-8">

        {/* Left Column - Main Content */}
        <div className="flex-1 md:max-w-[650px] flex flex-col">
          <ProfileHeader />
          <ProfileDescriptionEditor />
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          {activeTab === 'Cài đặt' ? <SettingsTab /> : <ProfilePosts />}
        </div>

        {/* Right Column - Sidebar */}
        <ProfileSidebar />

      </div>
    </div>
  );
};

export default ProfilePage;
