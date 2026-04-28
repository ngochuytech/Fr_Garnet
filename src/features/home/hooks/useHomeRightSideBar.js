import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getSuggestedUser } from '../services/homeRightSidebarService';

export const useHomeRightSideBar = () => {
    const { user } = useAuth();
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(true);

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

    return {
        currentUser : {
            displayName,
            avatarUrl,
            major,
            followingCount,
            followerCount
        },
        suggestedUsers,
        loadingSuggestions
    }
}