import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { followUser, unfollowUser } from '../../following/services/followingService';

const UserHeader = ({ user }) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(user?.following || false);
  const [followersCount, setFollowersCount] = useState(user?.followersCount || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Refs để quản lý debounce
  const debounceTimerRef = useRef(null);
  const lastSyncedStateRef = useRef(user?.following || false);
  const moreMenuRef = useRef(null);

  // Đồng bộ state nếu prop user thay đổi
  useEffect(() => {
    setIsFollowing(user?.following || false);
    setFollowersCount(user?.followersCount || 0);
    lastSyncedStateRef.current = user?.following || false;
  }, [user]);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isOwnProfile = currentUser && (currentUser.id === user?.id || currentUser.userId === user?.id);
  const displayName = user?.fullname || 'User';
  const avatarUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=dfb9b9&color=6a2f30&size=128`;

  const handleFollowToggle = () => {
    if (!user?.id) return;

    // 1. Cập nhật UI ngay lập tức (Optimistic Update)
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setFollowersCount(prev => Math.max(0, prev + (nextState ? 1 : -1)));

    // 2. Debounce việc gọi API
    if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
        // Chỉ gọi API nếu trạng thái hiện tại khác với trạng thái đã đồng bộ cuối cùng
        if (nextState === lastSyncedStateRef.current) {
            return;
        }

        try {
            setIsLoading(true);
            if (nextState) {
                await followUser(user.id);
            } else {
                await unfollowUser(user.id);
            }
            lastSyncedStateRef.current = nextState;
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái theo dõi:", error);
            // Revert UI nếu lỗi
            setIsFollowing(!nextState);
            setFollowersCount(prev => Math.max(0, prev + (!nextState ? 1 : -1)));
        } finally {
            setIsLoading(false);
        }
    }, 1000);
  };

  const handleBlockUser = () => {
    // TODO: Tích hợp logic/API chặn người dùng
    console.log("Chặn người dùng:", user?.id);
    setShowMoreMenu(false);
    alert("Chức năng chặn người dùng đang được phát triển!");
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
            <div className="flex items-center gap-2">
              {/* Nút Nhắn tin */}
              <button
                onClick={() =>
                  navigate('/chat', {
                    state: {
                      newChatUser: {
                        id: user?.id,
                        fullName: user?.fullname || user?.fullName,
                        avatarUrl: user?.avatarUrl,
                        department: user?.department,
                      },
                    },
                  })
                }
                className="px-5 py-2 rounded-full font-bold border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-500">
                  <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                  <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
                </svg>
                Nhắn tin
              </button>

              {/* Nút Theo dõi */}
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

              {/* Nút 3 chấm cho chức năng khác */}
              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="w-[42px] h-[42px] rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm flex items-center justify-center"
                  aria-label="Thêm tùy chọn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
                  </svg>
                </button>

                {showMoreMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 overflow-hidden">
                    <button
                      onClick={handleBlockUser}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2.5 transition-colors duration-150"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <span className="font-medium">Chặn người dùng</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
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
