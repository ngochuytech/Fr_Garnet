import { useRef, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { updateAvatar, getProfile } from '../../services/profileSerivce';
import { getImageUploadUrl, uploadToS3, extractPublicUrl } from '../../../../services/mediaService';
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

    if (file.size > 10 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 10MB');
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      return;
    }

    setIsUploading(true);
    try {
      const res = await getImageUploadUrl(file.name, 'avatars');
      const presignedUrl = res?.uploadUrl;
      if (!presignedUrl) throw new Error('Không lấy được link upload ảnh');

      await uploadToS3(presignedUrl, file);
      const avatarUrl = extractPublicUrl(presignedUrl);

      await updateAvatar(avatarUrl);
      
      const updatedProfile = await getProfile();
      
      if (updateUser && updatedProfile) {
        updateUser(updatedProfile.data); 
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
