import { useState, useEffect, useRef, useCallback } from 'react';
import { getProfilePosts } from '../../services/profileSerivce';
import { fetchPostsByUser } from '../../../user/services/userProfileService';

export const useProfilePosts = (userId = null) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const [nextCursor, setNextCursor] = useState(null);
    const [hasNext, setHasNext] = useState(false);

    const isFetchingRef = useRef(false);

    const fetchPosts = useCallback(async (quiet = false) => {
        try {
            if (!quiet) setLoading(true);
            setError(null);

            isFetchingRef.current = true;
            let response;
            if (userId) {
                response = await fetchPostsByUser(userId, 20, null);
            } else {
                response = await getProfilePosts(20, null);
            }

            const data = response || {};
            const newPosts = data.items || (Array.isArray(response) ? response : []);

            if (quiet) {
                setPosts(current => {
                    const existingIds = new Set(current.map(p => p.id));
                    const toPrepend = newPosts.filter(p => !existingIds.has(p.id));
                    return [...toPrepend, ...current];
                });
            } else {
                setPosts(newPosts);
                setNextCursor(data.nextCursor || null);
                setHasNext(data.hasNext !== undefined ? data.hasNext : false);
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError(err.message || "Không thể tải bài viết");
        } finally {
            if (!quiet) setLoading(false);
            isFetchingRef.current = false;
        }
    }, [userId]);

    useEffect(() => {
        setPosts([]);
        setNextCursor(null);
        setHasNext(false);
        fetchPosts();
    }, [fetchPosts]);

    const handleGetMorePosts = useCallback(async () => {
        if (!hasNext || loadingMore || isFetchingRef.current || !nextCursor) {
            return;
        }

        try {
            setLoadingMore(true);
            isFetchingRef.current = true;
            setError(null);

            let response;
            if (userId) {
                response = await fetchPostsByUser(userId, 20, nextCursor);
            } else {
                response = await getProfilePosts(20, nextCursor);
            }

            const data = response || {};
            const newItems = data.items || [];

            setPosts(currentPosts => {
                const existingIds = new Set(currentPosts.map(p => p.id));
                const filteredNewItems = newItems.filter(p => !existingIds.has(p.id));
                return [...currentPosts, ...filteredNewItems];
            });

            setNextCursor(data.nextCursor || null);
            setHasNext(data.hasNext !== undefined ? data.hasNext : false);
        } catch (err) {
            console.error("Error fetching more posts:", err);
            setError(err.message || "Không thể tải thêm bài viết");
        } finally {
            setLoadingMore(false);
            isFetchingRef.current = false;
        }
    }, [userId, hasNext, loadingMore, nextCursor]);

    return {
        posts,
        loading,
        loadingMore,
        error,
        hasNext,
        refreshPosts: () => fetchPosts(true),
        handleGetMorePosts,
    };
};
