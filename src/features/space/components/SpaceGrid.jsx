const SpaceGrid = ({ spaces, onSelectSpace }) => {
  return (
    <main className="w-full">
      {/* Tiêu đề Header */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div>
           <h1 className="text-xl font-bold text-gray-800">Hội nhóm CampusHub</h1>
           <p className="text-sm text-gray-500 mt-1">Khám phá và tham gia các cộng đồng học thuật, câu lạc bộ</p>
        </div>
        <button className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#8d3f41] text-white text-sm font-semibold rounded-lg hover:bg-[#6a2f30] transition-colors shadow-sm">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
           </svg>
           Tạo nhóm mới
        </button>
      </div>

      {/* Grid Layout Container: 1 cột mobile, 2 sm, 3 cột lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {spaces.map((space) => (
          <div
            key={space.id}
            className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex-1"
          >
            {/* Vùng Ảnh Cover (Nửa trên) */}
            <div className="h-28 w-full bg-gray-200 relative">
               <img src={space.coverUrl} alt="Cover" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
               {/* Avatar đè lên đường cắt */}
               <div className="absolute -bottom-6 left-4 border-4 border-white rounded-xl bg-white">
                  <img
                    src={space.avatarUrl}
                    alt={space.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
               </div>
            </div>

            {/* Vùng Thông tin (Nửa dưới) */}
            <div className="pt-8 p-4 flex flex-col flex-1">
               <h3 
                 className="text-[16px] font-bold text-gray-900 leading-snug line-clamp-1 group-hover:text-[#8d3f41] transition-colors cursor-pointer"
                 onClick={() => onSelectSpace(space.id)}
               >
                 {space.name}
               </h3>
               
               <p className="text-[12px] text-gray-500 font-medium mt-1">
                 {space.membersCount.toLocaleString()} thành viên
               </p>

               <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed flex-1">
                 {space.description}
               </p>

               {/* Action Buttons */}
               <div className="mt-4 pt-3 border-t border-gray-50 w-full">
                 <button
                   onClick={() => onSelectSpace(space.id)}
                   className="w-full py-1.5 px-3 bg-[#f7edee] text-[#8d3f41] text-[13.5px] font-bold rounded-lg hover:bg-[#efdcdc] transition-colors"
                 >
                   Xem chi tiết
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default SpaceGrid;