import { useAuth } from '../../../context/AuthContext';

export const useHomeRightSideBar = () => {
    const { user } = useAuth();

    const displayName = user?.fullname || 'User';
    const avatarUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=dfb9b9&color=6a2f30`;
    const major = user?.department || 'Thành viên CampusHub';
    const followingCount = user?.followingCount || 0;
    const followerCount = user?.followerCount || 0;

    return {
        currentUser : {
            displayName,
            avatarUrl,
            major,
            followingCount,
            followerCount
        }
    }
}