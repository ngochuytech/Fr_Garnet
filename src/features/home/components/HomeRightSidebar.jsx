import React from 'react';
import { useHomeRightSideBar } from '../hooks/useHomeRightSideBar';

const HomeRightSidebar = () => {
    const { currentUser, suggestedUsers, loadingSuggestions } = useHomeRightSideBar();

    // Dữ liệu giả lập (Mock data) cho Khám phá Hội nhóm
    const suggestedGroups = [
        {
            id: 1,
            name: 'CLB Lập trình',
            members: 1200,
            avatar: 'https://i.pravatar.cc/150?u=group1'
        },
        {
            id: 2,
            name: 'Hội sinh viên KTPM',
            members: 850,
            avatar: 'https://i.pravatar.cc/150?u=group2'
        },
    ];

    return (
        <aside className="w-full pb-6 pl-2 space-y-5">
            {/* Khối 1: Mini Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col items-center text-center">
                <img
                    src={currentUser?.avatarUrl}
                    alt={currentUser.displayName}
                    className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-white shadow-sm ring-2 ring-gray-100"
                />
                <h2 className="text-base font-bold text-gray-900 hover:underline cursor-pointer">
                    {currentUser.displayName}
                </h2>
                <p className="text-sm text-gray-500 mb-4">{currentUser.major}</p>

                {/* Statistics container */}
                <div className="flex items-center justify-center w-full pt-4 border-t border-gray-100">
                    <div className="flex flex-col flex-1 hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
                        <span className="text-base font-bold text-gray-900">{currentUser.followingCount}</span>
                        <span className="text-xs text-gray-500">Đang theo dõi</span>
                    </div>
                    <div className="h-8 w-px bg-gray-200"></div>
                    <div className="flex flex-col flex-1 hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
                        <span className="text-base font-bold text-gray-900">{currentUser.followerCount}</span>
                        <span className="text-xs text-gray-500">Người theo dõi</span>
                    </div>
                </div>
            </div>
            {/* Khối 2: Gợi ý kết nối (Who to follow) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-base font-bold text-gray-800 mb-4">Gợi ý kết nối</h2>
                <div className="space-y-4">
                    {loadingSuggestions ? (
                        <div className="text-sm text-center text-gray-500 py-2">Đang tải...</div>
                    ) : suggestedUsers.length === 0 ? (
                        <div className="text-sm text-center text-gray-500 py-2">Không có gợi ý nào</div>
                    ) : (
                        suggestedUsers.map((user) => {
                            const name = user.fullName || user.name || 'Người dùng';
                            const avatar = user.avatarUrl || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f7edee&color=8d3f41`;
                            const major = user.department || user.major || 'Thành viên CampusHub';
                            const reason = Array.isArray(user.commonInterests) && user.commonInterests.length > 0
                                ? user.commonInterests.join(', ')
                                : user.commonInterests || 'Gợi ý kết nối mới';

                            return (
                                <div key={user.id} className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={avatar}
                                            alt={name}
                                            className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                        />
                                        <div className="flex flex-col">
                                            <h3 className="text-sm font-semibold text-gray-900 leading-tight hover:underline cursor-pointer">
                                                {name}
                                            </h3>
                                            <span className="text-xs text-gray-500 mt-0.5">{major}</span>
                                            <span
                                                className="text-[11px] text-[#8d3f41] mt-1 self-start max-w-[150px] truncate font-medium bg-[#f7edee] px-1.5 py-0.5 rounded"
                                                title={reason}
                                            >
                                                {reason}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="px-3 py-1.5 bg-[#f7edee] text-[#8d3f41] hover:bg-[#efdcdc] hover:text-[#6a2f30] text-xs font-semibold rounded-full transition-colors flex-shrink-0">
                                        Theo dõi
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Khối 3: Khám phá Hội nhóm */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-base font-bold text-gray-800 mb-4">Khám phá Hội nhóm</h2>
                <div className="space-y-4">
                    {suggestedGroups.map((group) => (
                        <div key={group.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img
                                    src={group.avatar}
                                    alt={group.name}
                                    className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                                />
                                <div className="flex flex-col">
                                    <h3
                                        className="text-sm font-semibold text-gray-900 leading-tight truncate w-32 hover:underline cursor-pointer"
                                        title={group.name}
                                    >
                                        {group.name}
                                    </h3>
                                    <span className="text-xs text-gray-500 mt-0.5">{group.members} thành viên</span>
                                </div>
                            </div>
                            <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-full transition-colors flex-shrink-0">
                                Tham gia
                            </button>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                    Xem tất cả nhóm
                </button>
            </div>

        </aside>
    );
};

export default HomeRightSidebar;
