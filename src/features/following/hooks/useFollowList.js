import { useState, useEffect } from 'react';
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

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await getSuggestedUsers();
                setUsers(data || []);
            } catch (error) {
                console.error("Lỗi khi tải danh sách gợi ý:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

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

    // Hàm follow chung cho cả gợi ý lẫn kết quả tìm kiếm
    const toggleFollow = async (userId, isFollowing) => {
        try {
            setActionLoadingIds((prev) => [...prev, userId]);
            // Gọi API tương ứng với trạng thái hiện tại
            if (isFollowing) {
                await unfollowUser(userId);
            } else {
                await followUser(userId);
            }
            
            // Cập nhật state sau khi gọi API thành công
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId ? { ...user, isFollowing: !isFollowing } : user
                )
            );
            
            setSearchResults((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId ? { ...user, isFollowing: !isFollowing } : user
                )
            );
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái theo dõi:", error);
        } finally {
            setActionLoadingIds((prev) => prev.filter((id) => id !== userId));
        }
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