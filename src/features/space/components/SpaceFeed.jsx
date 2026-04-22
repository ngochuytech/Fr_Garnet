// Dummy Post Card component cho feed nhóm
const GroupPostCard = ({ author, time, content, likes }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative group">
    <div className="flex items-center gap-3 mb-3">
      <img
        src={`https://ui-avatars.com/api/?name=${author}&background=random&size=128`}
        alt="Avatar"
        className="w-10 h-10 object-cover rounded-full"
      />
      <div>
        <h3 className="font-bold text-[14.5px] text-gray-900 leading-tight">
          {author}
        </h3>
        <p className="text-[12px] text-gray-500">{time}</p>
      </div>
    </div>
    <p className="text-[14.5px] text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
      {content}
    </p>
    <div className="flex items-center justify-between border-t border-gray-50 mt-4 pt-3 pb-1">
      <button className="flex items-center gap-1.5 text-gray-500 hover:text-[#8d3f41] text-sm font-medium transition-colors">
         <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
         </svg>
         {likes} Thích
      </button>
      <button className="flex items-center gap-1.5 text-gray-500 hover:text-[#8d3f41] text-sm font-medium transition-colors">
         Bình luận
      </button>
      <button className="flex items-center gap-1.5 text-gray-500 hover:text-[#8d3f41] text-sm font-medium transition-colors">
         Chia sẻ
      </button>
    </div>
  </div>
);

const SpaceFeed = ({ space, onBack }) => {
  return (
    <main className="w-full flex-1">
      {/* Top Banner/Header Feedback */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 p-4 flex items-center justify-between sticky top-[78px] z-10">
        <div className="flex items-center gap-4">
           {/* Back Button */}
           <button 
             onClick={onBack}
             className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors border border-gray-200"
           >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                 <line x1="19" y1="12" x2="5" y2="12"></line>
                 <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
           </button>

           <div className="flex flex-col">
              <h1 className="text-[17px] font-bold text-gray-900 leading-tight">
                Hội {space.name}
              </h1>
              <p className="text-[13px] text-gray-500 font-medium">Bảng tin</p>
           </div>
        </div>

        <button className="bg-[#8d3f41] hover:bg-[#6a2f30] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
           Tạo bài viết
        </button>
      </div>

      {/* Main Feed */}
      <div className="flex flex-col gap-4">
        {/* Placeholder input (Giả lập thanh tạo post nhanh) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex gap-3 items-center">
            <img src="https://ui-avatars.com/api/?name=ME&background=dfb9b9&color=fff&size=128" alt="Me" className="w-10 h-10 rounded-full border border-gray-200" />
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 pt-2.5 pb-2 text-[14px] text-gray-500 cursor-text hover:bg-gray-100 transition-colors">
               Bạn muốn chia sẻ thông tin gì tới hội này?
            </div>
          </div>
        </div>

        {/* Dummy list posts */}
        <GroupPostCard 
          author="Nguyễn Duy Phương" 
          time="3 giờ trước" 
          content="Xin chào mọi người! Mình mới bắt đầu học ReactJS, không biết nên theo docs hay học qua video khóa học sẽ tốt hơn nhỉ? Gần đây hooks thay mới nhiều quá." 
          likes={24} 
        />
        <GroupPostCard 
          author="Trần Anh Khoa" 
          time="14 giờ trước" 
          content="Chào cả nhà, CLB mình có tổ chức buổi workshop cuối tuần này về ứng dụng AI vào thiết kế UI/UX trên Figma. Anh em nhớ check mail để xem thời gian địa điểm nha!" 
          likes={156} 
        />
        <GroupPostCard 
          author="Lan Hương" 
          time="Hôm qua vào 14:02" 
          content="Có bác nào chung nhóm môn Kỹ Thuật Lập Trình (Thầy Hải P21) không 🥲 Nhóm em có 1 slot rút môn nên đang tìm thêm thành viên gấp!!" 
          likes={8} 
        />
        <GroupPostCard 
          author="System Admin" 
          time="2 ngày trước" 
          content={`NỘI QUY HOẠT ĐỘNG:
1. Tuân thủ nguyên tắc tôn trọng trên không gian ảo
2. Không spam link lừa đảo
3. Đăng bài phải chọn đúng hashtag
Mong mọi người chia sẻ tri thức xây dựng cộng đồng trong sạch vững mạnh! ❤️`} 
          likes={320} 
        />

        {/* Trạng thái load thêm */}
        <div className="py-6 text-center text-gray-500 font-medium text-sm">
           Đã xem hết tin mới nhất
        </div>
      </div>
    </main>
  );
};

export default SpaceFeed;