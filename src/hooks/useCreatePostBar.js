import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { createPostBarService } from '../services/createPostBarService';

export const useCreatePostBar = (onPostCreated) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasText, setHasText] = useState(false);
    const [showFormatBar, setShowFormatBar] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);

    const isExpanded = isFocused || hasText || selectedImages.length > 0;

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

    const insertMath = (e) => {
        e.preventDefault();
        applyFormat(e, 'insertText', ' $$ equation $$ ');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((editorRef.current && hasText) || selectedImages.length > 0) {
            setIsSubmitting(true);
            const content = editorRef.current ? editorRef.current.innerHTML : '';
            try {
                let postData;
                if (selectedImages.length > 0) {
                    postData = new FormData();
                    postData.append('content', content === '<br>' ? '' : content);
                    selectedImages.forEach(img => postData.append('images', img));
                } else {
                    postData = { content: content === '<br>' ? '' : content };
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
        editorRef, fileInputRef,
        isExpanded,
        selectedImages, previewImages, isSubmitting,
        handleInput, applyFormat, handleLink, insertQuote, insertCode, insertMath,
        handleImageChange, removeImage,
        handleSubmit
    }
}