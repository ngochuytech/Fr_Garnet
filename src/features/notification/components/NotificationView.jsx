import { useState } from 'react';
import NotificationFilter from './NotificationFilter';
import NotificationList from './NotificationList';
import useNotifications from '../hooks/useNotifications';

const NotificationView = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const {
    notifications,
    loading,
    wsConnected,
    handleMarkAsRead,
    handleMarkAllRead,
  } = useNotifications(activeFilter);

  return (
    <div className="w-full min-h-[calc(100vh-50px)] bg-[#faf7f7]">
      <div className="max-w-[1300px] mx-auto px-4 pt-5 pb-10">
        <div className="flex items-start justify-center gap-6 w-full lg:max-w-[900px] mx-auto">

          {/* Left Sidebar: Filters */}
          <div className="hidden lg:block lg:w-[220px] shrink-0 sticky top-[78px] h-[calc(100vh-78px)] overflow-y-auto hide-scrollbar">
            <NotificationFilter active={activeFilter} setActive={setActiveFilter} />
          </div>

          {/* Main List */}
          <div className="w-full lg:flex-1 max-w-[650px]">
            <NotificationList
              notifications={notifications}
              loading={loading}
              wsConnected={wsConnected}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllRead={handleMarkAllRead}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotificationView;
