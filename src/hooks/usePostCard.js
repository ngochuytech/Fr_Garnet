import { useState, useRef, useEffect } from 'react';

export const usePostCard = () => {
  // Original PostCard states
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const optionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionRef.current && !optionRef.current.contains(event.target)) {
        setIsOptionOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOptionOpen) {
        setIsOptionOpen(false);
      }
    };

    if (isOptionOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOptionOpen]);

  // Share Modal states
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharePrivacy, setSharePrivacy] = useState('Everyone'); // 'Everyone' or other groups
  const [isFocused, setIsFocused] = useState(false);
  const [hasText, setHasText] = useState(false);
  const [showFormatBar, setShowFormatBar] = useState(false);
  const editorRef = useRef(null);

  const toggleComment = () => setIsCommentOpen(!isCommentOpen);
  const toggleOption = () => setIsOptionOpen(!isOptionOpen);
  
  const openShareModal = () => setIsShareModalOpen(true);
  const closeShareModal = () => {
    setIsShareModalOpen(false);
    // Optionally clear text editor on close
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
      handleInput(); 
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

  return {
    isCommentOpen, toggleComment,
    activeReplyId, setActiveReplyId,
    isOptionOpen, toggleOption, optionRef,
    isShareModalOpen, openShareModal, closeShareModal,
    sharePrivacy, setSharePrivacy,
    isFocused, setIsFocused,
    hasText, setHasText,
    showFormatBar, setShowFormatBar,
    editorRef,
    handleInput, applyFormat, handleLink, insertQuote, insertCode, insertMath
  };
};
