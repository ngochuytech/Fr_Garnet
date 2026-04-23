import { useState, useRef, useEffect } from 'react';
import { getProfilePosts } from '../../services/profileSerivce';
import { fetchPostsByUser } from '../../../user/services/userProfileService';

export const useProfilePosts = (userId = null) => {
    const dropdownRef = useRef(null);

    const [posts, setPosts] = useState([]);

    const [isOpenSort, setIsOpenSort] = useState(false);
    const [selectedSort, setSelectedSort] = useState("Gần đây nhất");
    const sortOptions = ["Gần đây nhất", "Cũ nhất", "Phổ biến nhất"];

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpenSort(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [userId]);

    const handleSelect = (option) => {
        setSelectedSort(option);
        setIsOpenSort(false);
    };

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
        dropdownRef,
        isOpenSort,
        selectedSort,
        sortOptions,
        posts,
        handleSelect,
        setIsOpenSort
    }
}
