import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getSuggestedUser } from '../services/homeRightSidebarService';
import { followUser, unfollowUser } from '../../following/services/followingService';

export const useHomeRightSideBar = () => {
    const { user } = useAuth();
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(true);
    const [actionLoadingIds, setActionLoadingIds] = useState([]);

    const debounceTimersRef = useRef({});
    const lastSyncedStatesRef = useRef({});

    const displayName = user?.fullname || 'User';
    const avatarUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=dfb9b9&color=6a2f30`;
    const major = user?.department || 'Thành viên CampusHub';
    const followingCount = user?.followingCount || 0;
    const followerCount = user?.followerCount || 0;

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const data = await getSuggestedUser();
                if (data && Array.isArray(data)) {
                    setSuggestedUsers(data);
                } else if (data && data.items && Array.isArray(data.items)) {
                    setSuggestedUsers(data.items);
                }
            } catch (error) {
                console.error("Error fetching suggested users:", error);
            } finally {
                setLoadingSuggestions(false);
            }
        };

        if (user) {
            fetchSuggestedUsers();
        } else {
            setLoadingSuggestions(false);
        }
    }, [user]);

    useEffect(() => {
        suggestedUsers.forEach(u => {
            if (lastSyncedStatesRef.current[u.id] === undefined) {
                lastSyncedStatesRef.current[u.id] = !!u.isFollowing;
            }
        });
    }, [suggestedUsers]);

    const toggleFollow = (userId, currentFollowingState) => {
        const nextState = !currentFollowingState;
        
        const updateState = (prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId ? { ...user, isFollowing: nextState } : user
            );

        setSuggestedUsers(updateState);

        if (debounceTimersRef.current[userId]) {
            clearTimeout(debounceTimersRef.current[userId]);
        }

        debounceTimersRef.current[userId] = setTimeout(async () => {
            if (nextState === lastSyncedStatesRef.current[userId]) {
                delete debounceTimersRef.current[userId];
                return;
            }

            try {
                setActionLoadingIds(prev => [...prev, userId]);
                
                if (nextState) {
                    await followUser(userId);
                } else {
                    await unfollowUser(userId);
                }
                
                lastSyncedStatesRef.current[userId] = nextState;
            } catch (error) {
                console.error("Lỗi khi cập nhật trạng thái theo dõi:", error);
                const revertState = (prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === userId ? { ...user, isFollowing: currentFollowingState } : user
                    );
                setSuggestedUsers(revertState);
            } finally {
                delete debounceTimersRef.current[userId];
                setActionLoadingIds(prev => prev.filter(id => id !== userId));
            }
        }, 1000);
    };

    return {
        currentUser : {
            displayName,
            avatarUrl,
            major,
            followingCount,
            followerCount
        },
        suggestedUsers,
        loadingSuggestions,
        actionLoadingIds,
        toggleFollow
    }
}