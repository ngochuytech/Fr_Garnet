import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFollowers, fetchFollowing } from '../../services/profileConnectionService'
import { followUser, unfollowUser } from '../../../../features/following/services/followingService';
import { useAuth } from '../../../../context/AuthContext';

const ProfileConnectionList = ({ type, userId }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [isLast, setIsLast] = useState(true);
    const [actionLoadingIds, setActionLoadingIds] = useState([]);
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Reset state when changing tab or user
        setPage(0);
        setUsers([]);
        setIsLast(true);
    }, [userId, type]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!userId) return;
            try {
                if (page === 0) setLoading(true);
                else setLoadingMore(true);

                const data = type === 'followers' 
                    ? await fetchFollowers(userId, page) 
                    : await fetchFollowing(userId, page);
                
                if (page === 0) {
                    setUsers(data.items || []);
                } else {
                    setUsers(prev => [...prev, ...(data.items || [])]);
                }
                
                setIsLast(data.isLast !== undefined ? data.isLast : true);
            } catch (error) {
                console.error(`Lỗi khi tải danh sách ${type}:`, error);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        fetchUsers();
    }, [userId, type, page]);

    const handleFollowToggle = async (targetId, currentFollowingState) => {
        try {
            setActionLoadingIds((prev) => [...prev, targetId]);
            if (currentFollowingState) {
                await unfollowUser(targetId);
            } else {
                await followUser(targetId);
            }
            
            // Cập nhật state nội bộ
            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u.id === targetId ? { ...u, following: !currentFollowingState } : u
                )
            );
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái theo dõi:", error);
        } finally {
            setActionLoadingIds((prev) => prev.filter((id) => id !== targetId));
        }
    };

    if (loading) {
        return (
            <div className="py-12 flex justify-center items-center">
                <svg className="animate-spin h-8 w-8 text-[#8d3f41]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center flex flex-col items-center justify-center">
                <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <p className="text-gray-500 font-medium text-lg">
                    {type === 'followers' ? 'Bạn chưa có người theo dõi nào' : 'Bạn chưa theo dõi ai'}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                    {type === 'followers' ? 'Hãy chia sẻ thêm bài viết để kết nối nhé!' : 'Hãy tìm kiếm và theo dõi những người bạn quan tâm!'}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 mt-2">
            {users.map((user) => (
                <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#8d3f41] hover:shadow-md transition-all duration-200"
                >
                    {/* Thông tin người dùng */}
                    <div 
                        className="flex items-center gap-4 cursor-pointer group flex-1"
                        onClick={() => navigate(`/user/${user.id}`)}
                    >
                        <div className="relative">
                            <img
                                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.fullname || 'User')}&background=dfb9b9&color=6a2f30&size=128`}
                                alt={user.fullName || user.fullname}
                                className="w-14 h-14 rounded-full object-cover border-2 border-transparent group-hover:border-[#8d3f41] transition-all"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-[16px] text-gray-900 group-hover:text-[#8d3f41] transition-colors">
                                {user.fullName || user.fullname}
                            </span>
                            {user.email && (
                                <span className="text-[14px] text-gray-500">
                                    {user.email}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Nút hành động */}
                    {(!currentUser || (currentUser.id !== user.id && currentUser.userId !== user.id)) && (
                        <button
                            onClick={() => handleFollowToggle(user.id, user.following)}
                            disabled={actionLoadingIds.includes(user.id)}
                            className={`px-6 py-2 rounded-full text-[14px] font-bold transition-all duration-200 flex items-center justify-center min-w-[130px] gap-2 ${
                                user.following
                                    ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-transparent'
                                    : 'bg-[#8d3f41] text-white hover:bg-[#6a2f30] shadow-md hover:shadow-lg hover:-translate-y-0.5'
                            } ${actionLoadingIds.includes(user.id) ? 'opacity-70 cursor-not-allowed hover:transform-none' : ''}`}
                        >
                            {actionLoadingIds.includes(user.id) ? (
                                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : user.following ? (
                                'Đang theo dõi'
                            ) : (
                                'Theo dõi'
                            )}
                        </button>
                    )}
                </div>
            ))}
            
            {!isLast && (
                <div className="flex justify-center mt-4 mb-2">
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={loadingMore}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loadingMore ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang tải...
                            </>
                        ) : (
                            'Xem thêm'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileConnectionList;
