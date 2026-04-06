import { useState } from 'react';

export const useProfileSidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Clear type after a short delay so the modal doesn't immediately lose content while fading out (if we add animation)
    setTimeout(() => setModalType(null), 150); 
  };

  return {
    isModalOpen,
    modalType,
    openModal,
    closeModal,
  };
};
