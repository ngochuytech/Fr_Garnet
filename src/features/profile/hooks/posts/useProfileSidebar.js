import { useState } from 'react';

export const useProfileSidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [isModalEditHighlightOpen, setIsModalEditHighlightOpen] = useState(false);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setModalType(null), 150);
  };

  const closeModalEditHighlight = () => {
    setIsModalEditHighlightOpen(false);
    setTimeout(() => setModalType(null), 150);
  };

  return {
    isModalOpen,
    modalType,
    isModalEditHighlightOpen,
    openModal,
    closeModal,
    setIsModalEditHighlightOpen,
    closeModalEditHighlight
  };
};
