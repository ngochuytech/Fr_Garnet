import { useHomeRightSideBar } from '../hooks/useHomeRightSideBar';
import { useNavigate } from 'react-router-dom';

const HomeRightSidebar = () => {
    const { currentUser, suggestedUsers, loadingSuggestions, actionLoadingIds, toggleFollow } = useHomeRightSideBar();
    const navigate = useNavigate();

    return (
        <aside className="w-full pb-6 pl-2 space-y-5">
            {/* Khối 1: Mini Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col items-center text-center">
                <img
                    src={currentUser?.avatarUrl}
                    alt={currentUser.displayName}
                    className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-white shadow-sm ring-2 ring-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => navigate(`/profile`)}
                />
                <h2 
                    className="text-base font-bold text-gray-900 hover:underline cursor-pointer"
                    onClick={() => navigate(`/profile`)}
                >
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
                            const major = user.department || user.major || 'Thành viên Garnet';

                            return (
                                <div key={user.id} className="flex items-start justify-between">
                                    <div 
                                        className="flex items-center gap-3 cursor-pointer group"
                                        onClick={() => navigate(`/user/${user.id}`)}
                                    >
                                        <img
                                            src={avatar}
                                            alt={name}
                                            className="w-10 h-10 rounded-full object-cover border border-gray-100 group-hover:opacity-90 transition-opacity"
                                        />
                                        <div className="flex flex-col">
                                            <h3 className="text-sm font-semibold text-gray-900 leading-tight group-hover:underline group-hover:text-[#8d3f41] transition-colors">
                                                {name}
                                            </h3>
                                            <span className="text-xs text-gray-500 mt-0.5">{major}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleFollow(user.id, user.isFollowing)}
                                        disabled={actionLoadingIds.includes(user.id)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors flex-shrink-0 ${
                                            user.isFollowing
                                                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                : 'bg-[#f7edee] text-[#8d3f41] hover:bg-[#efdcdc] hover:text-[#6a2f30]'
                                        } ${actionLoadingIds.includes(user.id) ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {user.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </aside>
    );
};

export default HomeRightSidebar;
