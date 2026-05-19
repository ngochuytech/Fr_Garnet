import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUnreadCount } from '../features/notification/services/NotificationService';
import useNotificationSocket from '../features/notification/hooks/useNotificationSocket';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayName = user?.fullname || 'User';
  const avatarUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=dfb9b9&color=6a2f30&size=128`;

  // Khởi tạo WebSocket kết nối Global
  useNotificationSocket(user, setUnreadCount);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Bước 1: lần đầu load lấy count từ REST API
  useEffect(() => {
    const fetchInitialCount = async () => {
      if (!user) return;
      try {
        const count = await getUnreadCount();
        setUnreadCount(typeof count === 'number' ? count : count?.count || 0);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };
    fetchInitialCount();
  }, [user]);

  // Bước 3: lắng nghe event từ useNotifications hook để cập nhật badge realtime
  useEffect(() => {
    const handleUnreadChange = (e) => {
      setUnreadCount(e.detail?.count ?? 0);
    };
    window.addEventListener('unread-count-changed', handleUnreadChange);
    return () => window.removeEventListener('unread-count-changed', handleUnreadChange);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
        <div className="flex items-center space-x-3 flex-shrink-0 relative" ref={dropdownRef}>

          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-full overflow-hidden border border-gray-200 cursor-pointer hover:border-gray-400 transition-all shadow-sm"
          >
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </button>

          {/* User Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-10 right-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
              {/* User Info Section */}
              <Link 
                to="/profile" 
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                    <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 leading-tight">{displayName}</span>
                    </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>

              <div className="h-px bg-gray-100 mx-2 my-1" />

              {/* Menu Items */}
              <div className="flex flex-col">
                <Link to="/messages" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 transition-colors text-[14.5px]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>Tin nhắn</span>
                </Link>
              </div>

              <div className="flex flex-col">
                <Link to="/stats" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 transition-colors text-[14.5px]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    <span>Thống kê nội dung</span>
                </Link>
              </div>

              <div className="h-px bg-gray-100 mx-2 my-1" />

              <div className="flex flex-col">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors text-[14.5px] w-full text-left"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Sign out</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;