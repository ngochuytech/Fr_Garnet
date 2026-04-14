import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { createPostBarService } from '../services/createPostBarService';

export const useCreatePostBar = (onPostCreated) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasText, setHasText] = useState(false);
    const [showFormatBar, setShowFormatBar] = useState(false);
    const editorRef = useRef(null);

    const isExpanded = isFocused || hasText;

    const handleInput = () => {
        if (editorRef.current) {
            const content = editorRef.current.textContent || '';
            setHasText(content.trim().length > 0);
        }
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
        if (editorRef.current && hasText) {
            const content = editorRef.current.innerHTML;
            try {
                await createPostBarService({ content });
                toast.success('Đăng bài viết thành công!');
                editorRef.current.innerHTML = '';
                setHasText(false);
                setIsFocused(false);
                setShowFormatBar(false);
                if (onPostCreated) {
                    onPostCreated();
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Đăng bài viết thất bại. Vui lòng thử lại!');
            }
        }
    };

    return {
        isFocused,
        setIsFocused,
        hasText,
        setHasText,
        showFormatBar,
        setShowFormatBar,
        editorRef,
        isExpanded,
        handleInput,
        applyFormat,
        handleLink,
        insertQuote,
        insertCode,
        insertMath,
        handleSubmit
    }
}