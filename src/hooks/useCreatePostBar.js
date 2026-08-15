import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { createPostBarService, fetchTopics } from '../services/createPostBarService';
import { getVideoUploadUrl, getImageUploadUrl, uploadToS3, extractPublicUrl } from '../services/mediaService';

export const useCreatePostBar = (onPostCreated, options = {}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasText, setHasText] = useState(false);
    const [showFormatBar, setShowFormatBar] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    const [isUploadingImages, setIsUploadingImages] = useState(false);

    // Video state
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [previewVideos, setPreviewVideos] = useState([]);
    const [isUploadingVideos, setIsUploadingVideos] = useState(false);

    // Tag state
    const [userTopics, setUserTopics] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagSearchQuery, setTagSearchQuery] = useState('');
    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

    const editorRef = useRef(null);
    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const dropdownRef = useRef(null);

    const isExpanded = isFocused || hasText || selectedImages.length > 0 || selectedVideos.length > 0 || tagSearchQuery.length > 0 || selectedTags.length > 0;

    useEffect(() => {
        const loadTopics = async () => {
            try {
                const data = await fetchTopics();
                setUserTopics(data || []);
            } catch (error) {
                console.error('Failed to load user topics:', error);
            }
        };
        loadTopics();
    }, []);

    // Handle clicking outside to close topic dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsTagDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Helper to safely extract string from topic (if it's an object or string)
    const getTopicNameStr = (t) => {
        if (!t) return '';
        if (typeof t === 'string') return t;
        return t.topicName || t.name || '';
    };

    const filteredTopics = userTopics.filter(topic => {
        const topicStr = getTopicNameStr(topic);
        if (!topicStr) return false;

        const matchesQuery = topicStr.toLowerCase().includes(tagSearchQuery.toLowerCase());
        const isNotSelected = !selectedTags.some(t => getTopicNameStr(t) === topicStr);

        return matchesQuery && isNotSelected;
    });

    const handleAddTag = (topic) => {
        setSelectedTags([...selectedTags, topic]);
        setTagSearchQuery('');
        setIsTagDropdownOpen(false);
    };

    const handleRemoveTag = (topicStrToRemove) => {
        setSelectedTags(selectedTags.filter(t => getTopicNameStr(t) !== topicStrToRemove));
    };

    const handleInput = () => {
        if (editorRef.current) {
            const content = editorRef.current.textContent || '';
            setHasText(content.trim().length > 0);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const maxImageSize = 10 * 1024 * 1024;
        const validFiles = files.filter(f => f.size <= maxImageSize);
        if (validFiles.length < files.length) {
            toast.error('Có ảnh vượt quá dung lượng 10MB');
        }

        if (selectedImages.length + validFiles.length > 5) {
            toast.error('Chỉ được tải lên tối đa 5 ảnh');
            if (fileInputRef.current) fileInputRef.current.value = null;
            return;
        }

        const newSelectedImages = [...selectedImages, ...validFiles];
        const newPreviewImages = [...previewImages, ...validFiles.map(file => URL.createObjectURL(file))];

        setSelectedImages(newSelectedImages);
        setPreviewImages(newPreviewImages);
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    const removeImage = (indexToRemove) => {
        const updatedImages = selectedImages.filter((_, i) => i !== indexToRemove);
        const updatedPreviews = previewImages.filter((_, i) => i !== indexToRemove);

        setSelectedImages(updatedImages);
        setPreviewImages(updatedPreviews);
    };

    const handleVideoChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const maxVideoSize = 10 * 1024 * 1024;
        const validFiles = files.filter(f => f.size <= maxVideoSize);
        if (validFiles.length < files.length) {
            toast.error('Có video vượt quá dung lượng 10MB');
        }

        if (selectedVideos.length + validFiles.length > 3) {
            toast.error('Chỉ được tải lên tối đa 3 video');
            if (videoInputRef.current) videoInputRef.current.value = null;
            return;
        }

        const newSelectedVideos = [...selectedVideos, ...validFiles];
        const newPreviewVideos = [...previewVideos, ...validFiles.map(file => URL.createObjectURL(file))];

        setSelectedVideos(newSelectedVideos);
        setPreviewVideos(newPreviewVideos);
        if (videoInputRef.current) videoInputRef.current.value = null;
    };

    const removeVideo = (indexToRemove) => {
        const updatedVideos = selectedVideos.filter((_, i) => i !== indexToRemove);
        const updatedPreviews = previewVideos.filter((_, i) => i !== indexToRemove);

        setSelectedVideos(updatedVideos);
        setPreviewVideos(updatedPreviews);
    };

    const applyFormat = (e, command, value = null) => {
        e.preventDefault();
        if (editorRef.current) {
            document.execCommand(command, false, value);
            editorRef.current.focus();
            handleInput(); // Cập nhật state nút Đăng
        }
    };

    const handleLink = (e) => {
        e.preventDefault();
        const url = window.prompt('Nhập link URL liên kết:', 'https://');
        if (url) {
            applyFormat(e, 'createLink', url);
        }
    };

    const insertQuote = (e) => {
        e.preventDefault();
        applyFormat(e, 'formatBlock', 'BLOCKQUOTE');
    };

    const insertCode = (e) => {
        e.preventDefault();
        applyFormat(e, 'formatBlock', 'PRE');
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((editorRef.current && hasText) || selectedImages.length > 0 || selectedVideos.length > 0) {
            setIsSubmitting(true);
            try {
                let videoUrls = [];
                if (selectedVideos.length > 0) {
                    setIsUploadingVideos(true);
                    for (const video of selectedVideos) {
                        const res = await getVideoUploadUrl(video.name);
                        const presignedUrl = res?.uploadUrl;
                        if (!presignedUrl) throw new Error('Không lấy được link upload');
                        await uploadToS3(presignedUrl, video);
                        videoUrls.push(extractPublicUrl(presignedUrl));
                    }
                    setIsUploadingVideos(false);
                }

                let imageUrls = [];
                if (selectedImages.length > 0) {
                    setIsUploadingImages(true);
                    for (const image of selectedImages) {
                        const res = await getImageUploadUrl(image.name, 'posts');
                        const presignedUrl = res?.uploadUrl;
                        if (!presignedUrl) throw new Error('Không lấy được link upload ảnh');
                        await uploadToS3(presignedUrl, image);
                        imageUrls.push(extractPublicUrl(presignedUrl));
                    }
                    setIsUploadingImages(false);
                }

                const content = editorRef.current ? editorRef.current.innerHTML : '';
                let postData = new FormData();
                postData.append('content', content === '<br>' ? '' : content);

                imageUrls.forEach(url => postData.append('imageUrls', url));
                selectedTags.forEach(tag => {
                    postData.append('tags', getTopicNameStr(tag));
                });
                videoUrls.forEach(url => postData.append('videoUrls', url));
                if (options.groupId) {
                    postData.append('groupId', options.groupId);
                }

                await createPostBarService(postData);
                toast.success('Đăng bài viết thành công!');
                if (editorRef.current) {
                    editorRef.current.innerHTML = '';
                }
                setHasText(false);
                setIsFocused(false);
                setShowFormatBar(false);
                setSelectedImages([]);
                setPreviewImages([]);
                setSelectedVideos([]);
                setPreviewVideos([]);
                setSelectedTags([]);
                setTagSearchQuery('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
                if (videoInputRef.current) {
                    videoInputRef.current.value = null;
                }
                if (onPostCreated) {
                    onPostCreated();
                }
            } catch (error) {
                const errorMessage = typeof error === 'string' ? error : (error?.message || 'Đăng bài viết thất bại. Vui lòng thử lại!');
                toast.error(errorMessage);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return {
        isFocused, setIsFocused,
        hasText, setHasText,
        showFormatBar, setShowFormatBar,
        editorRef, fileInputRef, videoInputRef, dropdownRef,
        isExpanded,
        selectedImages, previewImages, isUploadingImages, isSubmitting,
        selectedVideos, previewVideos, isUploadingVideos,
        selectedTags, tagSearchQuery, isTagDropdownOpen,
        userTopics, filteredTopics,
        setTagSearchQuery, setIsTagDropdownOpen, handleAddTag, handleRemoveTag,
        handleInput, applyFormat, handleLink, insertQuote, insertCode,
        handleImageChange, removeImage, handleVideoChange, removeVideo,
        handleSubmit
    }
}
