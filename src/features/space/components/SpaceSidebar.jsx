const SpaceSidebar = ({ spaces, selectedSpace, onSelectSpace }) => {
  // Trạng thái 1: Khi chưa chọn group nào -> Hiển thị danh sách nhóm đã tham gia
  if (!selectedSpace) {
    return (
      <aside className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-base font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
          Nhóm của bạn
        </h2>
        <div className="flex flex-col gap-1.5 focus:outline-none">
          {spaces.slice(0, 4).map((space) => (
            <button
              key={space.id}
              onClick={() => onSelectSpace(space.id)}
              className="flex items-center gap-3 w-full p-2 rounded-lg text-left hover:bg-[#f7edee] transition-colors group cursor-pointer"
            >
              <img
                src={space.avatarUrl}
                alt={space.name}
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-bold text-gray-800 truncate group-hover:text-[#8d3f41]">
                  {space.name}
                </span>
                <span className="text-[11px] text-gray-500">
                  {space.membersCount.toLocaleString()} thành viên
                </span>
              </div>
            </button>
          ))}
          <button className="text-[12px] font-medium text-[#8d3f41] mt-2 underline opacity-80 hover:opacity-100 px-2 text-left">
            Xem tất cả nhóm
          </button>
        </div>
      </aside>
    );
  }

  // Trạng thái 2: Khi ĐÃ chọn group -> Hiển thị Profile Tóm tắt của Group đó
  return (
    <aside className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full text-center">
      {/* Ảnh bìa */}
      <div className="h-24 w-full bg-gray-200">
        <img src={selectedSpace.coverUrl} alt="Cover" className="w-full h-full object-cover" />
      </div>

      {/* Avatar nổi */}
      <div className="flex justify-center -mt-8">
        <img
          src={selectedSpace.avatarUrl}
          alt={selectedSpace.name}
          className="w-16 h-16 rounded-xl object-cover border-4 border-white shadow-sm bg-white"
        />
      </div>

      {/* Thông tin */}
      <div className="p-4 pt-2">
        <h2 className="text-base font-bold text-gray-900 leading-tight">
          {selectedSpace.name}
        </h2>
        <p className="text-[13px] text-gray-500 mt-1 mb-4 flex items-center justify-center gap-1">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#8d3f41]">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
           </svg>
           {selectedSpace.membersCount.toLocaleString()} thành viên
        </p>
        
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-snug">
           {selectedSpace.description}
        </p>

        {/* Nút hành động */}
        <div className="flex flex-col gap-2">
           <button className="w-full py-1.5 px-4 bg-[#8d3f41] text-white text-[13px] font-bold rounded-lg shadow-sm hover:bg-[#6a2f30] transition-colors">
              Chia sẻ nhóm
           </button>
           <button className="w-full py-1.5 px-4 bg-gray-50 text-gray-700 text-[13px] font-bold rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              Mời thành viên
           </button>
        </div>
      </div>
    </aside>
  );
};

export default SpaceSidebar;
