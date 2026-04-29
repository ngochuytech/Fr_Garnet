import { useState, useRef, useEffect } from 'react';

export const useCommentInput = ({ onSubmit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasText, setHasText] = useState(false);
    const [showFormatBar, setShowFormatBar] = useState(false);
    const editorRef = useRef(null);

    const isExpanded = isFocused || hasText;

    useEffect(() => {
        if (!isOpen) {
            setHasText(false);
            setShowFormatBar(false);
            if (editorRef.current) {
                editorRef.current.textContent = '';
            }
        }
    }, [isOpen]);

    const handleSubmit = () => (e) => {
        e.preventDefault();
        if (hasText) {
            const content = editorRef.current.innerHTML.trim();
            if (onSubmit) {
                onSubmit(content);
            }
            setIsOpen(false);
            setHasText(false);
            setShowFormatBar(false);
            if (editorRef.current) {
                editorRef.current.innerHTML = '';
            }
        }
    };

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
            handleInput(); // Cập nhật lại state nút Post
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



    return {
        isOpen,
        isFocused,
        hasText,
        showFormatBar,
        editorRef,
        isExpanded,
        handleSubmit,
        handleInput,
        applyFormat,
        handleLink,
        insertQuote,
        insertCode,
        setIsOpen,
        setIsFocused,
        setHasText,
        setShowFormatBar,
    };
}