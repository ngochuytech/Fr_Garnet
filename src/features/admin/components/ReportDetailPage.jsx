import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getReportByIdAPI, resolveReportAPI, closeReportAPI } from '../services/reportService';

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return 'N/A';
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const StatusBadge = ({ status }) => {
  const config = {
    OPEN:  { label: 'Chờ xử lý', cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
    RESOLVED: { label: 'Đã xử lý',  cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
    CLOSED: { label: 'Đã từ chối', cls: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200' },
  };
  const { label, cls } = config[status] || { label: status, cls: 'bg-gray-50 text-gray-500' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
};

const TypeBadge = ({ type }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
    type === 'POST'
      ? 'bg-blue-50 text-blue-600'
      : type === 'GROUP'
        ? 'bg-emerald-50 text-emerald-600'
        : 'bg-purple-50 text-purple-600'
  }`}>
    {type === 'POST' ? (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
    ) : type === 'GROUP' ? (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ) : (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    )}
    {type === 'POST' ? 'Bài viết' : type === 'GROUP' ? 'Nhóm' : 'Bình luận'}
  </span>
);

const ReportDetailPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  useEffect(() => {
    const breadcrumb = document.getElementById('breadcrumb-report-id');
    if (breadcrumb && report) {
      breadcrumb.textContent = `#${report.id.substring(0, 8)}`;
    }
    return () => {
      if (breadcrumb) breadcrumb.textContent = 'Chi tiết';
    };
  }, [report]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await getReportByIdAPI(reportId);
      setReport(data);
      if (data.adminNotes) setAdminNotes(data.adminNotes);
    } catch (error) {
      toast.error('Không thể tải chi tiết báo cáo');
      navigate('/admin/reports');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!adminNotes.trim()) {
      toast.error('Vui lòng nhập lý do xử lý');
      return;
    }
    try {
      await resolveReportAPI(report.id, { adminNotes });
      toast.success('Đã xử lý vi phạm thành công');
      fetchReport();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xử lý báo cáo');
    }
  };

  const handleReject = async () => {
    try {
      await closeReportAPI(report.id);
      toast.success('Đã từ chối báo cáo');
      fetchReport();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đóng báo cáo');
    }
  };

  const openImageModal = (index) => setSelectedImageIndex(index);
  const closeImageModal = () => setSelectedImageIndex(null);

  const showPrevImage = () => {
    const images = Array.isArray(report?.reportedContentImages) ? report.reportedContentImages : [];
    if (images.length === 0) return;
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const showNextImage = () => {
    const images = Array.isArray(report?.reportedContentImages) ? report.reportedContentImages : [];
    if (images.length === 0) return;
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!report) return null;

  const reportedImages = Array.isArray(report.reportedContentImages) ? report.reportedContentImages : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-24 bg-red-600/5 border-b border-red-100 flex items-center px-8">
           <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-red-100 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                 <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
           </div>
           <div className="ml-4">
              <h1 className="text-xl font-black text-gray-900 tracking-tight">Chi tiết báo cáo #{report.id.substring(0, 8)}</h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                 Ngày tạo: {formatDate(report.createdAt)}
              </p>
           </div>
           <div className="ml-auto">
              <StatusBadge status={report.status} />
           </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Parties involved */}
            <div className="lg:col-span-1 space-y-6">
               <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Các bên liên quan</h3>
                  
                  {/* Reporter */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Người báo cáo</p>
                     <div className="flex items-center gap-3">
                        <img 
                          src={report.reporter?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.reporter?.fullName)}&background=f3f4f6&color=6b7280`} 
                          alt="Reporter" 
                          className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" 
                        />
                        <div>
                           <p className="text-sm font-black text-gray-900">{report.reporter?.fullName}</p>
                           <p className="text-xs font-medium text-gray-500">ID: {report.reporter?.id.substring(0,8)}</p>
                        </div>
                     </div>
                  </div>

                  {/* Reported User */}
                  <div className="bg-red-50/30 rounded-2xl p-4 border border-red-100/50">
                     <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-3">Người bị báo cáo</p>
                     <div className="flex items-center gap-3">
                        <img 
                          src={report.reportedUser?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.reportedUser?.fullName)}&background=fee2e2&color=ef4444`} 
                          alt="Reported" 
                          className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" 
                        />
                        <div>
                           <p className="text-sm font-black text-gray-900">{report.reportedUser?.fullName}</p>
                           <p className="text-xs font-medium text-gray-500">ID: {report.reportedUser?.id.substring(0,8)}</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Violation Info */}
               <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Thông tin vi phạm</h3>
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
                     <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Lý do</p>
                        <p className="text-sm font-bold text-red-600">{report.reason}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Đối tượng</p>
                        <TypeBadge type={report.targetType} />
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Col: Content and Actions */}
            <div className="lg:col-span-2 space-y-8">
               {/* Description */}
               <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Mô tả chi tiết</h3>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                     <p className="text-sm text-gray-700 leading-relaxed italic">
                        "{report.description || 'Không có mô tả bổ sung từ người báo cáo.'}"
                     </p>
                  </div>
               </div>

               {/* Content Snapshot */}
               <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Nội dung bị báo cáo (Snapshot)</h3>
                  <div className="bg-gray-800 rounded-2xl p-8 relative overflow-hidden group">
                     {/* Decorative background icon */}
                     <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="white"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                     </div>
                     
                     <div 
                        className="relative z-10 text-gray-100 text-sm leading-loose prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: report.reportedContentSnapshot || 'Nội dung không khả dụng.' }}
                     />
                     {reportedImages.length > 0 && (
                        <div className={`relative z-10 mt-6 grid gap-3 ${reportedImages.length === 1 ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
                           {reportedImages.slice(0, 4).map((img, idx) => (
                              <button
                                 key={`${img}-${idx}`}
                                 type="button"
                                 onClick={() => openImageModal(idx)}
                                 className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left group"
                              >
                                 <img
                                    src={img}
                                    alt={`Reported attachment ${idx + 1}`}
                                    className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                 />
                                 {idx === 3 && reportedImages.length > 4 && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-2xl font-black text-white">
                                       +{reportedImages.length - 4}
                                    </div>
                                 )}
                              </button>
                           ))}
                        </div>
                     )}
                     <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lưu vào {formatDate(report.createdAt)}</p>
                        <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-white uppercase">ID: {report.targetId}</span>
                     </div>
                  </div>
               </div>

               {/* Admin Action Section */}
               <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Xử lý của quản trị viên</h3>
                  
                  {report.status === 'OPEN' ? (
                     <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 space-y-4 shadow-xl shadow-gray-100/50">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                              Ghi chú xử lý <span className="text-red-500">*</span>
                           </label>
                           <textarea
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Nhập lý do xử lý hoặc ghi chú cho báo cáo này..."
                              className="w-full h-32 p-4 text-sm border border-gray-100 bg-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-50/50 focus:border-red-200 transition-all resize-none"
                           />
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                           <button
                              onClick={handleReject}
                              className="px-6 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
                           >
                              Từ chối báo cáo
                           </button>
                           <button
                              onClick={handleResolve}
                              className="px-8 py-3 rounded-xl text-sm font-black text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 transition-all flex items-center gap-2"
                           >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                 <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              Xác nhận xử lý
                           </button>
                        </div>
                     </div>
                  ) : (
                     <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
                        <div className="flex items-start gap-4">
                           <img 
                             src={report.handledBy?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.handledBy?.fullName || 'A')}&background=111&color=fff`} 
                             alt="Admin" 
                             className="w-12 h-12 rounded-xl shadow-sm border border-gray-100 object-cover" 
                           />
                           <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Xử lý bởi</p>
                              <p className="text-sm font-black text-gray-900">{report.handledBy?.fullName || 'Quản trị viên hệ thống'}</p>
                              <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{formatDate(report.updatedAt)}</p>
                           </div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Ghi chú xử lý</p>
                           <p className="text-sm text-gray-700 leading-relaxed font-medium italic">
                              "{report.adminNotes || 'Không có ghi chú.'}"
                           </p>
                        </div>
                     </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
      {selectedImageIndex !== null && reportedImages.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-300 backdrop-blur-sm"
          onClick={closeImageModal}
        >
          <button
            type="button"
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-all p-3 bg-white/10 hover:bg-white/20 rounded-full z-[110]"
            onClick={closeImageModal}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>

          {reportedImages.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-all p-4 bg-white/10 hover:bg-white/20 rounded-full z-[110]"
                onClick={(e) => { e.stopPropagation(); showPrevImage(); }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button
                type="button"
                className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-all p-4 bg-white/10 hover:bg-white/20 rounded-full z-[110]"
                onClick={(e) => { e.stopPropagation(); showNextImage(); }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </>
          )}

          <div className="relative max-w-full max-h-full flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
            <img
              src={reportedImages[selectedImageIndex]}
              alt="Reported attachment full view"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300"
            />
            <div className="text-white/80 text-[11px] font-black uppercase tracking-[0.2em] bg-white/10 px-6 py-2 rounded-full border border-white/10">
              {selectedImageIndex + 1} / {reportedImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetailPage;
