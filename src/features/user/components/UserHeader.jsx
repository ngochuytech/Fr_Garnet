import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { followUser, unfollowUser } from '../../following/services/followingService';

const UserHeader = ({ user }) => {
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(user?.following || false);
  const [followersCount, setFollowersCount] = useState(user?.followersCount || 0);
  const [isLoading, setIsLoading] = useState(false);

  // Đồng bộ state nếu prop user thay đổi
  useEffect(() => {
    setIsFollowing(user?.following || false);
    setFollowersCount(user?.followersCount || 0);
  }, [user]);

  const isOwnProfile = currentUser && (currentUser.id === user?.id || currentUser.userId === user?.id);
  const displayName = user?.fullname || 'User';
  const avatarUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=dfb9b9&color=6a2f30&size=128`;

  const handleFollowToggle = async () => {
    if (!user?.id || isLoading) return;

    setIsLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(user.id);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        await followUser(user.id);
        setFollowersCount(prev => prev + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái theo dõi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-start gap-6 mb-6 relative">
      {/* Avatar */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* User Info */}
      <div className="flex-1 pt-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{displayName}</h1>
          {!isOwnProfile && (
            <button
              onClick={handleFollowToggle}
              disabled={isLoading}
              className={`px-6 py-2 rounded-full font-bold transition-all duration-200 shadow-sm flex items-center gap-2 min-w-[140px] justify-center ${isFollowing
                  ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  : 'bg-[#b04f51] text-white hover:bg-[#8d3f41]'
                } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : isFollowing ? (
                'Đang theo dõi'
              ) : (
                'Theo dõi'
              )}
            </button>
          )}
        </div>

        <div className="text-gray-500 text-sm mt-1">
          <span className="hover:underline cursor-pointer font-medium text-gray-700">{followersCount}</span>
          <span className="ml-1">Theo dõi</span>
          <span className="mx-2 text-gray-300">&middot;</span>
          <span className="hover:underline cursor-pointer font-medium text-gray-700">{user?.followingCount || 0}</span>
          <span className="ml-1">Đang theo dõi</span>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
