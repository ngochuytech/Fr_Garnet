const ProfileHeader = () => {
  return (
    <div className="flex items-start gap-6 mb-6 relative">
      {/* Avatar */}
      <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
        <img
          src="https://ui-avatars.com/api/?name=Huy+Nguyen&background=dfb9b9&color=6a2f30&size=128"
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* User Info */}
      <div className="flex-1 pt-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Huy Nguyễn</h1>
        <div className="text-gray-500 text-sm mt-1">
          <span className="hover:underline cursor-pointer">0 followers</span>
          <span className="mx-1">&middot;</span>
          <span className="hover:underline cursor-pointer">0 following</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
