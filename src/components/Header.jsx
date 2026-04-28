import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUnreadCount } from '../features/notification/services/NotificationService';

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const displayName = user?.fullname || 'User';
  const avatarUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=dfb9b9&color=6a2f30&size=128`;

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) return;
      try {
        const count = await getUnreadCount();
        setUnreadCount(typeof count === 'number' ? count : count?.count || 0);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };
    
    fetchUnreadCount();
    
    // Optionally poll or listen to events here, for now just fetch once
  }, [user, location.pathname]); // refetch when user changes or location changes (e.g. after reading notifications)

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] h-[50px] w-full flex justify-center">
      <div className="flex items-center justify-between w-full max-w-[1300px] h-full px-4">

        {/* Logo */}
        <Link to="/home" className="flex-shrink-0 cursor-pointer">
          <span className="text-[28px] font-bold font-display" style={{ color: 'var(--color-dusty-rose-600)' }}>
            CampusHub
          </span>
        </Link>

        {/* Navigation Icons */}
        <nav className="flex items-center ml-4 space-x-5">
          {/* Home */}
          <Link to="/home" className={`p-2 cursor-pointer rounded hover:bg-gray-100 flex items-center justify-center relative group ${isActive('/home') ? 'text-[#8d3f41]' : 'text-gray-500 hover:text-gray-800'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.3" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            {isActive('/home') && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: 'var(--color-dusty-rose-600)' }} />
            )}
            <div className="absolute top-10 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">Home</div>
          </Link>

          {/* Following */}
          <Link to="/following" className={`p-2 cursor-pointer rounded hover:bg-gray-100 flex items-center justify-center relative group ${isActive('/following') ? 'text-[#8d3f41]' : 'text-gray-500 hover:text-gray-800'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="size-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
            </svg>
            {isActive('/following') && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: 'var(--color-dusty-rose-600)' }} />
            )}
            <div className="absolute top-10 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">Following</div>
          </Link>



          {/* Spaces */}
          <Link to="/spaces" className={`p-2 cursor-pointer rounded hover:bg-gray-100 flex items-center justify-center relative group ${isActive('/spaces') ? 'text-[#8d3f41]' : 'text-gray-500 hover:text-gray-800'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
            {isActive('/spaces') && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: 'var(--color-dusty-rose-600)' }} />
            )}
            <div className="absolute top-10 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">Spaces</div>
          </Link>

          {/* Notifications */}
          <Link to="/notifications" className={`p-2 cursor-pointer rounded hover:bg-gray-100 flex items-center justify-center relative group ${isActive('/notifications') ? 'text-[#8d3f41]' : 'text-gray-500 hover:text-gray-800'}`}>
            <div className="relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white" style={{ backgroundColor: 'var(--color-dusty-rose-500)' }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            {isActive('/notifications') && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: 'var(--color-dusty-rose-600)' }} />
            )}
            <div className="absolute top-10 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">Notification</div>
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="flex-1 max-w-[360px] mx-4">
          <div className="relative flex items-center w-full h-8 rounded-full border border-gray-300 bg-gray-50 px-3 hover:border-gray-400 focus-within:bg-white focus-within:border-blue-500">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search CampusHub"
              className="w-full bg-transparent border-none outline-none px-2 text-sm text-gray-800 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3 flex-shrink-0">

          <Link to="/profile" className="w-8 h-8 flex items-center justify-center rounded-full overflow-hidden border border-gray-200 cursor-pointer">
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </Link>

          <button className="text-gray-500 hover:text-gray-800 cursor-pointer">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </button>

          <div className="flex rounded-full overflow-hidden border border-transparent" style={{ backgroundColor: 'var(--color-dusty-rose-600)' }}>
            <button className="px-4 py-1.5 text-sm font-semibold text-white cursor-pointer hover:bg-white/10 transition-colors">
              Post
            </button>
            <button className="px-2 py-1.5 flex items-center justify-center text-white cursor-pointer border-l border-white/20 hover:bg-white/10 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;