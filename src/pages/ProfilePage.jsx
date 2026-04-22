import { useState, useEffect } from 'react';
import ProfileHeader from '../features/profile/components/posts/ProfileHeader';
import ProfileDescriptionEditor from '../features/profile/components/posts/ProfileDescriptionEditor';
import ProfileTabs from '../features/profile/components/ProfileTabs';
import ProfilePosts from '../features/profile/components/posts/ProfilePosts';
import ProfileSidebar from '../features/profile/components/posts/ProfileSidebar';
import SettingsTab from '../features/profile/components/settings/ProfileSetting';
import { getProfile } from '../features/profile/services/profileSerivce';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Bài đăng');
  const [profileData, setProfileData] = useState(null);
  const { updateUser } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfileData(data);
        // Also sync to auth context if it's the current user profile
        updateUser(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, [updateUser]);

  return (
    <div className="w-full flex justify-center py-6 px-4 bg-white">
      <div className="flex flex-col md:flex-row w-full max-w-[1300px] gap-8">

        {/* Left Column - Main Content */}
        <div className="flex-1 md:max-w-[850px] flex flex-col">
          <ProfileHeader userProp={profileData} />
          <ProfileDescriptionEditor userProp={profileData} />
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          {activeTab === 'Cài đặt' ? <SettingsTab /> : <ProfilePosts />}
        </div>

        {/* Right Column - Sidebar */}
        <ProfileSidebar userProp={profileData} />

      </div>
    </div>
  );
};

export default ProfilePage;
