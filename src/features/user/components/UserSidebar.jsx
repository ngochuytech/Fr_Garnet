import React from 'react';

const UserSidebar = ({ user }) => {
  return (
    <div className="w-full md:w-[380px] flex-shrink-0 flex flex-col gap-6">

      {/* Credentials & Highlights */}
      <div>
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
          <h3 className="text-[15px] font-medium text-gray-700">Thông tin</h3>
        </div>

        <div className="flex flex-col gap-3">
          {user?.department && (
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <span className="text-[15px] text-gray-700">{user.department}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.5"></rect>
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.5"></line>
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.5"></line>
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.5"></line>
            </svg>
            <span className="text-[15px] text-gray-700">Tham gia {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Chưa cập nhật'}</span>
          </div>
        </div>
      </div>

      {/* Knows About */}
      <div>
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
          <h3 className="text-[15px] font-medium text-gray-700">Quan tâm</h3>
        </div>

        <div className="flex flex-col gap-2">
          {user?.topics?.length > 0 ? (
            user.topics.map((topic, index) => (
              <div key={index} className="flex items-center gap-3 p-1 rounded hover:bg-gray-50 cursor-pointer group">
                {topic.imageUrl ? (
                  <img src={topic.imageUrl} alt={topic.topicName} className="w-8 h-8 rounded shrink-0 object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded shrink-0 bg-red-100 flex items-center justify-center font-bold text-red-700 text-xs shadow-sm">
                    {topic.topicName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-gray-800 hover:text-[#b04f51] transition-colors">{topic.topicName}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[14px] text-gray-500 italic">Chưa có chủ đề quan tâm</p>
          )}
        </div>
      </div>

      {/* Groups */}
      <div>
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
          <h3 className="text-[15px] font-medium text-gray-700">Nhóm đã tham gia</h3>
        </div>

        <div className="flex flex-col gap-2">
          {user?.groups?.length > 0 ? (
            user.groups.map((group) => (
              <div key={group.id} className="flex items-center gap-3 p-1 rounded hover:bg-gray-50 cursor-pointer group">
                {group.avatarUrl ? (
                  <img src={group.avatarUrl} alt={group.name} className="w-8 h-8 rounded shrink-0 object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded shrink-0 bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-xs shadow-sm">
                    {group.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-gray-800 hover:text-[#b04f51] transition-colors">{group.name}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[14px] text-gray-500 italic">Chưa tham gia nhóm nào</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
