const formatDate = (value) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getStatusMeta = (space) => {
  const isArchived = space?.isArchived || space?.status === 'ARCHIVED';

  if (isArchived) {
    return {
      label: 'Đã khóa',
      tone: 'red',
      description: 'Nhóm đang bị khóa hoặc lưu trữ. Thành viên có thể xem nội dung cũ nhưng hoạt động mới bị giới hạn.',
    };
  }

  return {
    label: 'Hoạt động bình thường',
    tone: 'emerald',
    description: 'Nhóm không có cảnh báo hoặc báo cáo vi phạm đang hiển thị.',
  };
};

const toneClasses = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  amber: 'bg-amber-50 text-amber-800 border-amber-100',
  red: 'bg-red-50 text-red-700 border-red-100',
};

const statusLabels = {
  ACTIVE: 'Đang hoạt động',
  ARCHIVED: 'Đã khóa',
  INACTIVE: 'Không hoạt động',
  PENDING: 'Đang chờ duyệt',
  REJECTED: 'Đã từ chối',
};

const formatStatus = (status) => {
  if (!status) return 'Đang hoạt động';
  return statusLabels[status] || status;
};

const getItemTitle = (item, fallback) => {
  return item?.reason || item?.title || item?.type || fallback;
};

const getItemDescription = (item) => {
  return item?.description || item?.message || item?.adminNotes || item?.note || '';
};

const getItemDate = (item) => {
  return formatDate(item?.createdAt || item?.created_at || item?.time || item?.updatedAt);
};

const StatusList = ({ title, items, emptyText }) => (
  <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
    <h3 className="text-sm font-black text-gray-900">{title}</h3>
    <div className="mt-4 space-y-3">
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyText}</p>
      ) : (
        items.map((item, index) => (
          <div key={item?.id || index} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-bold text-gray-900">{getItemTitle(item, 'Thông tin trạng thái')}</p>
              {getItemDate(item) && (
                <span className="text-[11px] font-semibold text-gray-400 whitespace-nowrap">{getItemDate(item)}</span>
              )}
            </div>
            {getItemDescription(item) && (
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">{getItemDescription(item)}</p>
            )}
          </div>
        ))
      )}
    </div>
  </section>
);

const SpaceStatus = ({ space, detailLoading, error, onBack, onShowFeed }) => {
  if (detailLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="mx-auto animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <p className="text-sm font-semibold text-red-600">{error}</p>
        <button
          type="button"
          onClick={onShowFeed}
          className="mt-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-bold hover:bg-gray-800"
        >
          Quay lại bảng tin
        </button>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <p className="text-sm font-semibold text-gray-500">Không tìm thấy nhóm.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-bold hover:bg-gray-800"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const statusMeta = getStatusMeta(space);
  const reports = space.reports || [];
  const latestReport = space.latestReport && reports.length === 0 ? [space.latestReport] : reports;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-wide text-gray-400">Trạng thái nhóm</p>
            <h1 className="mt-1 text-xl font-black text-gray-900">{space.name}</h1>
          </div>
          <button
            type="button"
            onClick={onShowFeed}
            className="px-3 py-2 rounded-lg text-[13px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Bảng tin
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`md:col-span-2 rounded-xl border px-4 py-4 ${toneClasses[statusMeta.tone]}`}>
            <p className="text-sm font-black">{statusMeta.label}</p>
            <p className="mt-1 text-sm leading-relaxed">{statusMeta.description}</p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Trạng thái</p>
            <p className="mt-1 text-lg font-black text-gray-900">{formatStatus(space.status)}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Báo cáo</p>
            <p className="mt-1 text-lg font-black text-gray-900">{Number(space.reportCount || 0).toLocaleString('vi-VN')}</p>
          </div>
        </div>

        {space.adminNotes && (
          <div className="mx-5 mb-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left">
            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Ghi chú quản trị</p>
            <p className="mt-1 text-sm text-gray-700 leading-relaxed">{space.adminNotes}</p>
          </div>
        )}
      </div>

      <StatusList
        title="Báo cáo vi phạm"
        items={latestReport}
        emptyText="Nhóm chưa có báo cáo vi phạm nào đang hiển thị."
      />
    </div>
  );
};

export default SpaceStatus;
