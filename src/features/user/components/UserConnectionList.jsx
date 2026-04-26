import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFollowers, fetchFollowing } from '../services/userProfileService';
import { followUser, unfollowUser } from '../../following/services/followingService';
import { useAuth } from '../../../context/AuthContext';

const UserConnectionList = ({ type, userId }) => {
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
            
            // Update state
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
            <div className="py-10 flex justify-center items-center">
                <svg className="animate-spin h-6 w-6 text-[#8d3f41]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="py-10 text-center text-gray-500">
                {type === 'followers' ? 'Chưa có người theo dõi' : 'Chưa theo dõi ai'}
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {users.map((user) => (
                <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#8d3f41] hover:shadow-md transition-all duration-200"
                >
                    {/* Left Side: Avatar and Info */}
                    <div 
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate(`/user/${user.id}`)}
                    >
                        <img
                            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.fullname || 'User')}&background=dfb9b9&color=6a2f30&size=128`}
                            alt={user.fullName || user.fullname}
                            className="w-14 h-14 rounded-full object-cover border-2 border-transparent group-hover:border-[#8d3f41] transition-all"
                        />
                        <div className="flex flex-col">
                            <span className="font-bold text-[15px] text-gray-800 group-hover:text-[#8d3f41] transition-colors">
                                {user.fullName || user.fullname}
                            </span>
                            {user.email && (
                                <span className="text-[13px] text-gray-500">
                                    {user.email}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Action Button */}
                    {(!currentUser || (currentUser.id !== user.id && currentUser.userId !== user.id)) && (
                        <button
                            onClick={() => handleFollowToggle(user.id, user.following)}
                            disabled={actionLoadingIds.includes(user.id)}
                            className={`px-5 py-1.5 rounded-full text-[14px] font-semibold transition-all duration-200 flex items-center justify-center min-w-[120px] gap-2 ${
                                user.following
                                    ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                                    : 'bg-[#8d3f41] text-white hover:bg-[#6a2f30] shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                            } ${actionLoadingIds.includes(user.id) ? 'opacity-70 cursor-not-allowed hover:transform-none' : ''}`}
                        >
                            {actionLoadingIds.includes(user.id) ? (
                                <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                <div className="flex justify-center p-4">
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

export default UserConnectionList;
