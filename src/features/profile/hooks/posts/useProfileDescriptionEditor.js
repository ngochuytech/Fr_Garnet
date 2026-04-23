import { useState, useRef, useEffect } from 'react';
import { updateBio } from '../../services/profileSerivce';
import { useAuth } from '../../../../context/AuthContext';
import { toast } from 'sonner';

import DOMPurify from 'dompurify';

export const useProfileDescriptionEditor = () => {
    const { user, updateUser } = useAuth();
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [description, setDescription] = useState(user?.bio || '');
    const [isSaving, setIsSaving] = useState(false);
    const [showFormatBar, setShowFormatBar] = useState(false);
    const [hasText, setHasText] = useState(!!user?.bio);
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showSeeMore, setShowSeeMore] = useState(false);

    const editorRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (user?.bio !== undefined) {
            const bio = user?.bio || '';
            setDescription(bio);
            setHasText(bio.trim().length > 0);

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = bio;
            const text = tempDiv.textContent || tempDiv.innerText || '';
            setCharCount(text.length);
        }
    }, [user?.bio]);

    useEffect(() => {
        if (!isEditingDesc && description && contentRef.current) {
            // Kiểm tra xem chiều cao nội dung có vượt quá 300px không sau khi DOM render xong
            setTimeout(() => {
                if (contentRef.current) {
                    const isOverflowing = contentRef.current.scrollHeight > 300;
                    setShowSeeMore(isOverflowing);
                }
            }, 10);
        }
    }, [isEditingDesc, description, isExpanded]);

    useEffect(() => {
        if (description) {
            const cleanHTML = DOMPurify.sanitize(description, { 
                ALLOWED_TAGS: ['b', 'i', 'u', 'a', 'blockquote', 'pre', 'code', 'span', 'div', 'p', 'br'], 
                ALLOWED_ATTR: ['href', 'target', 'rel'] 
            });
            if (cleanHTML !== description) {
                setDescription(cleanHTML);
            }
        }
    }, [description]);

    const getCharCount = (htmlString) => {
        if (!htmlString) return 0;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;
        const text = tempDiv.textContent || tempDiv.innerText || '';
        return text.length;
    };

    useEffect(() => {
        if (isEditingDesc && editorRef.current) {
            editorRef.current.innerHTML = description;
        }
    }, [isEditingDesc]);

    const applyFormat = (e, command, value = null) => {
        e.preventDefault();
        if (editorRef.current) {
            document.execCommand(command, false, value);
            editorRef.current.focus();
            handleEditorInput();
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

    const handleEditorInput = () => {
        if (editorRef.current) {
            const text = editorRef.current.textContent || '';
            setCharCount(text.length);
            setHasText(text.trim().length > 0);
        }
    };

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            const currentHTML = editorRef.current ? editorRef.current.innerHTML : description;
            await updateBio(currentHTML);
            setDescription(currentHTML);
            updateUser({ bio: currentHTML });
            toast.success('Cập nhật giới thiệu thành công!');
            setIsEditingDesc(false);
            setIsExpanded(false);
            setShowSeeMore(false);
        } catch (error) {
            toast.error(error.message || 'Cập nhật giới thiệu thất bại');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditingDesc(false);
        setIsExpanded(false);
        setShowSeeMore(false);
    };

    const openEditor = () => {
        setIsEditingDesc(true);
        setHasText(!!description);
        setCharCount(getCharCount(description));
        setShowFormatBar(false);
        setIsExpanded(false);
    };
    return {
        editorRef,
        contentRef,
        isEditingDesc,
        setIsEditingDesc,
        description,
        isSaving,
        showFormatBar,
        setShowFormatBar,
        hasText,
        isFocused,
        setIsFocused,
        charCount,
        isExpanded,
        setIsExpanded,
        showSeeMore,
        handleLink,
        insertQuote,
        insertCode,
        insertMath,
        handleUpdate,
        handleCancel,
        openEditor,
        handleEditorInput,
        applyFormat,
    }
};