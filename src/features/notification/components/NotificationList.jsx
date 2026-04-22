const mockNotifications = [
  {
    id: 1,
    type: 'space',
    iconUrl: 'https://ui-avatars.com/api/?name=SSC+CGL&background=D8B4E2&color=fff&size=128&rounded=true',
    title: 'Hội sinh viên KTPM · Đăng trong nhóm bạn có thể thích',
    time: 'CN',
    mainText: 'KẾT QUẢ ĐÃ ĐƯỢC CHỌN LÀM TRỢ LÝ PHẦN MỀM (CSS)',
    subText: 'Thực sự một ngày tuyệt vời khi được thông báo...',
    unread: true,
  },
  {
    id: 2,
    type: 'space',
    iconUrl: 'https://ui-avatars.com/api/?name=IT+SCAM&background=D8B4E2&color=fff&size=128&rounded=true',
    title: 'Hội Công nghệ thông tin · Đăng trong nhóm bạn có thể thích',
    time: '12 thg 4',
    mainText: 'ĐIỂM TỔNG KẾT HỌC KỲ 2.. 326/390 (MÁY TÍNH - 20)',
    subText: 'Thất vọng về toán, dẫn đến kết quả thấp 😭 Đạt được kết quả này khi...',
    unread: false,
  },
  {
    id: 3,
    type: 'post',
    iconUrl: 'https://ui-avatars.com/api/?name=FIGHT&background=A8D5BA&color=fff&size=128&rounded=true',
    title: 'CHỐNG LẠI LỪA ĐẢO INTERNET · Đăng trong nhóm bạn có thể thích',
    time: '6 thg 4',
    mainText: 'Tin nhắn sai số chuyển thành LỪA ĐẢO TÀI CHÍNH. Bắt đầu bằng một tin nhắn bình thường...',
    subText: 'Chào, đây là Sarah à? hay...',
    unread: false,
  },
  {
    id: 4,
    type: 'system',
    iconUrl: 'https://ui-avatars.com/api/?name=CH&background=87CEEB&color=fff&size=128&rounded=true',
    title: 'CampusHub · Hệ thống',
    time: '3 thg 4',
    mainText: 'Tham gia các Hội nhóm trên CampusHub',
    subText: 'Trải nghiệm tốt hơn khi tham gia các hội. Tìm và tham gia các hội khớp với sở thích...',
    unread: true,
  }
];

const NotificationList = () => {
  return (
    <main className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full flex-1">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <h2 className="text-lg font-bold text-gray-800">Thông báo</h2>
        <div className="flex items-center gap-2 text-[13px] text-gray-500">
          <button className="hover:underline transition-colors hover:text-[#8d3f41]">Đánh dấu tất cả đã đọc</button>
        </div>
      </div>

      {/* Notification Items */}
      <div className="flex flex-col divide-y divide-gray-100">
        {mockNotifications.map((notif) => (
          <div
            key={notif.id}
            className={`flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors relative group ${
              notif.unread ? 'bg-[#fdfbfb]' : ''
            }`}
          >
            {/* Unread indicator */}
            {notif.unread && (
              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#8d3f41]" />
            )}

            {/* Left Icon/Avatar */}
            <div className="flex-shrink-0 w-8 h-8 mt-1 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
               <img src={notif.iconUrl} alt="icon" className="w-full h-full object-cover" />
            </div>

            {/* Right Content */}
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex flex-col">
                <span className="text-[13px] text-gray-500 mb-1 leading-tight flex items-center flex-wrap gap-1">
                  <span>{notif.title}</span>
                  <span className="inline-block px-1">·</span> 
                  <span>{notif.time}</span>
                </span>
                <span className="text-[15px] font-bold text-gray-900 leading-snug">
                  {notif.mainText}
                </span>
                <span className="text-[14px] text-gray-700 mt-0.5 leading-snug break-words line-clamp-2">
                  {notif.subText}
                </span>
              </div>
            </div>

            {/* Top Right Options */}
            <div className="absolute right-4 top-4 text-gray-400 group-hover:text-gray-700 transition-colors opacity-0 group-hover:opacity-100">
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="1.5"/>
                    <circle cx="19" cy="12" r="1.5"/>
                    <circle cx="5" cy="12" r="1.5"/>
                 </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default NotificationList;