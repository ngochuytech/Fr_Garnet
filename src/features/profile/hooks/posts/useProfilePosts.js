import { useState, useEffect } from 'react';
import { getProfilePosts } from '../../services/profileSerivce';
import { fetchPostsByUser } from '../../../user/services/userProfileService';

export const useProfilePosts = (userId = null) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, [userId]);

    const fetchPosts = async () => {
        try {
            let response;
            if (userId) {
                response = await fetchPostsByUser(userId);
            } else {
                response = await getProfilePosts();
            }

            const postsData = response?.items || (Array.isArray(response) ? response : []);
            setPosts(postsData);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    return {
        posts,
    };
}
