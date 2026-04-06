import { useState, useRef, useEffect } from 'react';

export const useProfileDescriptionEditor = () => {
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [description, setDescription] = useState('');
    const [showFormatBar, setShowFormatBar] = useState(false);
    const [hasText, setHasText] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showSeeMore, setShowSeeMore] = useState(false);

    const editorRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (!isEditingDesc && description && contentRef.current) {
            // Kiểm tra xem chiều cao nội dung có vượt quá 400px không
            const isOverflowing = contentRef.current.scrollHeight > 400;
            setShowSeeMore(isOverflowing);
        }
    }, [isEditingDesc, description, isExpanded]);

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

    const handleUpdate = () => {
        if (editorRef.current) {
            setDescription(editorRef.current.innerHTML);
        }
        setIsEditingDesc(false);
    };

    const openEditor = () => {
        setIsEditingDesc(true);
        setHasText(!!description);
        setCharCount(getCharCount(description));
        setShowFormatBar(false);
    };
    return {
        editorRef,
        contentRef,
        isEditingDesc,
        setIsEditingDesc,
        description,
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
        openEditor,
        handleEditorInput,
        applyFormat,
    }
};