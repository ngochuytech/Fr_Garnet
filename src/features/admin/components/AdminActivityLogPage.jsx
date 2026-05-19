import React, { useState } from 'react';

// ─── SVG ICONS ─────────────────────────────────────────────────────────────
const IconActivity = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IconCheckCircle2 = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><polyline points="9 11 12 14 22 4"/>
  </svg>
);
const IconTrash2 = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);
const IconLogIn = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);
const IconFilter = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const MOCK_LOGS = [
  { id: 1, action: "TAKE_DOWN_POST", description: "Đã gỡ bài viết p892 của Trần B", details: "Lý do: Vi phạm tiêu chuẩn cộng đồng", time: "15 phút trước", date: "2026-05-07" },
  { id: 2, action: "RESOLVE_REPORT", description: "Đã xử lý xong báo cáo r152", details: "Nội dung báo cáo: Spam", time: "2 giờ trước", date: "2026-05-07" },
  { id: 3, action: "LOGIN", description: "Đăng nhập thành công", details: "IP: 192.168.1.1 - Windows Chrome", time: "Hôm qua", date: "2026-05-06" },
  { id: 4, action: "TAKE_DOWN_POST", description: "Đã gỡ bài viết p890 của Lê C", details: "Lý do: Chứa ngôn từ kích động", time: "Hôm qua", date: "2026-05-06" },
  { id: 5, action: "RESOLVE_REPORT", description: "Đã xử lý xong báo cáo r150", details: "Nội dung báo cáo: Lừa đảo", time: "2 ngày trước", date: "2026-05-05" },
  { id: 6, action: "LOGIN", description: "Đăng nhập thành công", details: "IP: 192.168.1.1 - Windows Chrome", time: "3 ngày trước", date: "2026-05-04" },
  { id: 7, action: "SYSTEM_CONFIG", description: "Đã thay đổi cài đặt hệ thống", details: "Bật tính năng bảo trì tự động", time: "5 ngày trước", date: "2026-05-02" }
];

const ActivityIcon = ({ action }) => {
  switch (action) {
    case 'TAKE_DOWN_POST':
      return <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500"><IconTrash2 size={18} /></div>;
    case 'RESOLVE_REPORT':
      return <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500"><IconCheckCircle2 size={18} /></div>;
    case 'LOGIN':
      return <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><IconLogIn size={18} /></div>;
    default:
      return <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500"><IconActivity size={18} /></div>;
  }
};

const AdminActivityLogPage = () => {
  const [filterType, setFilterType] = useState('ALL');

  const filteredLogs = filterType === 'ALL' 
    ? MOCK_LOGS 
    : MOCK_LOGS.filter(log => log.action === filterType);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-3">
            Nhật ký hoạt động
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Theo dõi chi tiết tất cả các thao tác mà bạn đã thực hiện trên hệ thống
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <IconFilter size={14} />
            </div>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="ALL">Tất cả hoạt động</option>
              <option value="TAKE_DOWN_POST">Gỡ bài viết</option>
              <option value="RESOLVE_REPORT">Xử lý báo cáo</option>
              <option value="LOGIN">Đăng nhập</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden p-8">
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gray-100" />
          
          {filteredLogs.length === 0 ? (
             <div className="text-center py-12">
               <p className="text-sm font-medium text-gray-500">Không tìm thấy hoạt động nào phù hợp.</p>
             </div>
          ) : (
            <div className="space-y-8 relative">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex gap-6 group">
                  {/* Timeline dot */}
                  <div className="relative z-10 bg-white ring-8 ring-white">
                    <ActivityIcon action={log.action} />
                  </div>
                  
                  {/* Content Card */}
                  <div className="flex-1 border border-gray-100 bg-gray-50/30 rounded-2xl p-5 hover:bg-gray-50 transition-colors shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <h4 className="text-[15px] font-black text-gray-900">{log.description}</h4>
                        <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                      </div>
                      
                      <div className="flex flex-col sm:items-end flex-shrink-0">
                        <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">
                          {log.time}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-400 mt-2">
                          {log.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Load more button (Mock) */}
        {filteredLogs.length > 0 && (
          <div className="mt-10 flex justify-center border-t border-gray-50 pt-8">
            <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
              Tải thêm hoạt động
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminActivityLogPage;
