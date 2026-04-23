import { useAuth } from "../../../../context/AuthContext";
import { useProfileHeader } from "../../hooks/posts/useProfileHeader";

const ProfileHeader = ({ userProp }) => {
  const { user: contextUser } = useAuth();
  const { user: hookUser, fileInputRef, isUploading, handleAvatarClick, handleFileChange } = useProfileHeader();
  const user = userProp || hookUser;
  const isOwnProfile = contextUser?.email === user?.email;
  const displayName = user?.fullname || 'User';
  const avatarUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=dfb9b9&color=6a2f30&size=128`;

  return (
    <div className="flex items-start gap-6 mb-6 relative">
      {/* Avatar */}
      <div 
        className={`relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border border-gray-200 ${isOwnProfile ? 'cursor-pointer group' : ''}`}
        onClick={isOwnProfile ? handleAvatarClick : undefined}
      >
        <img
          src={avatarUrl}
          alt="Avatar"
          className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-50' : isOwnProfile ? 'group-hover:opacity-75' : ''}`}
        />
        {isOwnProfile && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <span className="text-white text-sm font-semibold text-center leading-tight">
              {isUploading ? 'Đang cập nhật...' : 'Thay đổi ảnh'}
            </span>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      {isOwnProfile && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      )}

      {/* User Info */}
      <div className="flex-1 pt-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{displayName}</h1>
        <div className="text-gray-500 text-sm mt-1">
          <span className="hover:underline cursor-pointer">{user?.followersCount} Theo dõi</span>
          <span className="mx-1">&middot;</span>
          <span className="hover:underline cursor-pointer">{user?.followingCount} Đang theo dõi</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
