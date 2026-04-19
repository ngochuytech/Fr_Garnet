import { useRef, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { updateAvatar } from '../../services/profileSerivce';

export const useProfileHeader = () => {
  const { user, updateUser } = useAuth(); // Extract updateUser
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatarFile', file);

      const updatedProfile = await updateAvatar(formData);
      
      if (updateUser && updatedProfile) {
        updateUser(updatedProfile); 
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật ảnh đại diện:', error);
      alert('Không thể cập nhật ảnh đại diện. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  return {
    user,
    fileInputRef,
    isUploading,
    handleAvatarClick,
    handleFileChange,
  };
};
