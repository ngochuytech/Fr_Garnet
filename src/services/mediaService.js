import { apiFetch } from '../utils/api';

/**
 * Lấy Presigned URL từ backend để upload video lên S3
 * @param {string} fileName Tên file video
 * @returns {Promise<{uploadUrl: string}>}
 */
export const getVideoUploadUrl = async (fileName) => {
    return await apiFetch(`/users/media/generate-video-url?fileName=${encodeURIComponent(fileName)}`);
};

/**
 * Lấy Presigned URL từ backend để upload ảnh lên S3
 * @param {string} fileName Tên file ảnh
 * @param {string} category Thư mục lưu trữ (mặc định 'images')
 * @returns {Promise<{uploadUrl: string}>}
 */
export const getImageUploadUrl = async (fileName, category = 'images') => {
    return await apiFetch(`/users/media/generate-image-url?fileName=${encodeURIComponent(fileName)}&category=${encodeURIComponent(category)}`);
};

/**
 * Upload file video trực tiếp lên S3 sử dụng Presigned URL
 * @param {string} presignedUrl 
 * @param {File} file 
 */
export const uploadToS3 = async (presignedUrl, file) => {
    const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type
        }
    });
    
    if (!response.ok) {
        throw new Error(`Lỗi upload S3: ${response.statusText}`);
    }
    return response;
};

/**
 * Trích xuất public URL từ presigned URL (bỏ query string)
 * @param {string} presignedUrl 
 * @returns {string} public URL của file trên S3
 */
export const extractPublicUrl = (presignedUrl) => {
    return presignedUrl.split('?')[0];
};
