import { useState, useEffect, useRef } from 'react';
import { getSuggestedUsers, searchUsers, followUser, unfollowUser } from '../services/followingService';

export const useFollowList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // States cho tính năng tìm kiếm
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [actionLoadingIds, setActionLoadingIds] = useState([]);

    // Refs cho debounce
    const debounceTimersRef = useRef({});
    const lastSyncedStatesRef = useRef({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await getSuggestedUsers();
                console.log(data);
                
                
                const candidates = data.items;
                const formattedUsers = candidates.map(user => ({
                    ...user,
                    id: user.candidateUserId || user.id,
                }));
                
                setUsers(formattedUsers);
            } catch (error) {
                console.error("Lỗi khi tải danh sách gợi ý:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Khởi tạo/Cập nhật lastSyncedStatesRef khi users hoặc searchResults thay đổi
    useEffect(() => {
        [...users, ...searchResults].forEach(u => {
            if (lastSyncedStatesRef.current[u.id] === undefined) {
                lastSyncedStatesRef.current[u.id] = !!u.isFollowing;
            }
        });
    }, [users, searchResults]);

    // Debounce effect cho chức năng search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setHasSearched(false);
            setIsSearching(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const data = await searchUsers(searchQuery);
                
                setSearchResults(data.items || []);
                setHasSearched(true);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm:", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 500); // Đợi 500ms sau khi người dùng ngừng gõ
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Hàm follow chung cho cả gợi ý lẫn kết quả tìm kiếm (đã debounce)
    const toggleFollow = (userId, currentFollowingState) => {
        // 1. Cập nhật UI ngay lập tức (Optimistic Update)
        const nextState = !currentFollowingState;
        
        const updateState = (prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId ? { ...user, isFollowing: nextState } : user
            );

        setUsers(updateState);
        setSearchResults(updateState);

        // 2. Debounce việc gọi API
        if (debounceTimersRef.current[userId]) {
            clearTimeout(debounceTimersRef.current[userId]);
        }

        debounceTimersRef.current[userId] = setTimeout(async () => {
            // Chỉ gọi API nếu trạng thái hiện tại khác với trạng thái đã đồng bộ cuối cùng
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
                // Revert UI nếu lỗi
                const revertState = (prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === userId ? { ...user, isFollowing: currentFollowingState } : user
                    );
                setUsers(revertState);
                setSearchResults(revertState);
            } finally {
                delete debounceTimersRef.current[userId];
                setActionLoadingIds(prev => prev.filter(id => id !== userId));
            }
        }, 1000);
    };

    return {
        users,
        loading,
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        hasSearched,
        actionLoadingIds,
        toggleFollow
    };
}