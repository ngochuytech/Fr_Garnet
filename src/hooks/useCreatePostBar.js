import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { createPostBarService, fetchUserTopics } from '../services/createPostBarService';

export const useCreatePostBar = (onPostCreated, options = {}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasText, setHasText] = useState(false);
    const [showFormatBar, setShowFormatBar] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    
    // Tag state
    const [userTopics, setUserTopics] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagSearchQuery, setTagSearchQuery] = useState('');
    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
    
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);
    const dropdownRef = useRef(null);

    const isExpanded = isFocused || hasText || selectedImages.length > 0 || tagSearchQuery.length > 0 || selectedTags.length > 0;

    useEffect(() => {
        const loadTopics = async () => {
            try {
                const data = await fetchUserTopics();
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

        if (selectedImages.length + files.length > 5) {
            toast.error('Chỉ được tải lên tối đa 5 ảnh');
            if (fileInputRef.current) fileInputRef.current.value = null;
            return;
        }

        const newSelectedImages = [...selectedImages, ...files];
        const newPreviewImages = [...previewImages, ...files.map(file => URL.createObjectURL(file))];

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
        if ((editorRef.current && hasText) || selectedImages.length > 0) {
            setIsSubmitting(true);
            const content = editorRef.current ? editorRef.current.innerHTML : '';
            try {
                let postData = new FormData();
                postData.append('content', content === '<br>' ? '' : content);
                
                selectedImages.forEach(img => postData.append('images', img));
                selectedTags.forEach(tag => {
                    postData.append('tags', getTopicNameStr(tag));
                });
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
                setSelectedTags([]);
                setTagSearchQuery('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
                if (onPostCreated) {
                    onPostCreated();
                }
            } catch (error) {
                toast.error(error || 'Đăng bài viết thất bại. Vui lòng thử lại!');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return {
        isFocused, setIsFocused,
        hasText, setHasText,
        showFormatBar, setShowFormatBar,
        editorRef, fileInputRef, dropdownRef,
        isExpanded,
        selectedImages, previewImages, isSubmitting,
        selectedTags, tagSearchQuery, isTagDropdownOpen,
        userTopics, filteredTopics,
        setTagSearchQuery, setIsTagDropdownOpen, handleAddTag, handleRemoveTag,
        handleInput, applyFormat, handleLink, insertQuote, insertCode,
        handleImageChange, removeImage,
        handleSubmit
    }
}
