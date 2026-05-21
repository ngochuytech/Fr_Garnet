import { useNavigate } from 'react-router-dom';

const JoinRequestCard = ({
  request,
  groupId,
  isArchived,
  actionLoadingKeys,
  onApprove,
  onReject,
}) => {
  const navigate = useNavigate();
  const canOpenProfile = Boolean(request.profileId);
  const approveKey = `approve:${groupId}:${request.profileId}`;
  const rejectKey = `reject:${groupId}:${request.profileId}`;
  const isApproving = actionLoadingKeys.includes(approveKey);
  const isRejecting = actionLoadingKeys.includes(rejectKey);
  const isBusy = isApproving || isRejecting;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-[#d09596] hover:shadow-sm transition-all">
      <button
        type="button"
        onClick={() => {
          if (canOpenProfile) {
            navigate(`/user/${request.profileId}`);
          }
        }}
        disabled={!canOpenProfile}
        className="flex items-center gap-3 min-w-0 text-left disabled:cursor-default"
      >
        <img
          src={request.avatarUrl}
          alt={request.fullName}
          className="w-12 h-12 rounded-full object-cover border border-gray-100 flex-shrink-0"
        />
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold text-gray-900 truncate">
            {request.fullName}
          </h3>
          <p className="text-[13px] text-gray-500 truncate">
            {request.email || 'Đang chờ duyệt'}
          </p>
        </div>
      </button>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-end shrink-0">
        <button
          type="button"
          onClick={() => onReject(groupId, request.profileId)}
          disabled={isArchived || isBusy || !request.profileId}
          className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-[13px] font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isRejecting ? 'Đang từ chối...' : 'Từ chối'}
        </button>
        <button
          type="button"
          onClick={() => onApprove(groupId, request.profileId)}
          disabled={isArchived || isBusy || !request.profileId}
          className="px-4 py-2 rounded-lg bg-[#8d3f41] text-[13px] font-bold text-white hover:bg-[#6a2f30] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isApproving ? 'Đang duyệt...' : 'Duyệt'}
        </button>
      </div>
    </div>
  );
};

const SpaceJoinRequests = ({
  space,
  detailLoading,
  requests,
  loading,
  loadingMore,
  error,
  isLast,
  total,
  actionLoadingKeys,
  onBack,
  onShowFeed,
  onLoadMoreJoinRequests,
  onApproveJoinRequest,
  onRejectJoinRequest,
}) => {
  if (!space) {
    return (
      <main className="w-full flex-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-sm font-semibold text-gray-700">
            {detailLoading ? 'Đang tải thông tin nhóm...' : 'Không tìm thấy nhóm'}
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-4 px-4 py-2 rounded-lg bg-[#8d3f41] text-white text-sm font-bold hover:bg-[#6a2f30] transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </main>
    );
  }

  const isArchived = space.isArchived || space.status === 'ARCHIVED';

  return (
    <main className="w-full flex-1">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 p-4 flex items-center justify-between top-[78px] z-10">
        <div className="flex items-center gap-4 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors border border-gray-200 shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>

          <div className="flex flex-col min-w-0">
            <h1 className="text-[17px] font-bold text-gray-900 leading-tight truncate">
              Hội {space.name}
            </h1>
            <p className="text-[13px] text-gray-500 font-medium">
              {Number(total || 0).toLocaleString()} yêu cầu chờ duyệt
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onShowFeed}
          className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-[13px] font-bold text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Bảng tin
        </button>
      </div>

      {isArchived && (
        <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p className="font-bold">Nhóm đã bị lưu trữ</p>
          <p className="mt-1">Không thể duyệt yêu cầu tham gia mới trong trạng thái này.</p>
        </div>
      )}

      {loading && requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="flex-1 min-w-0">
                <div className="h-3.5 w-36 rounded bg-gray-200 mb-2"></div>
                <div className="h-3 w-24 rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-red-100 shadow-sm p-6 text-center text-red-500">
          {error}
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center text-gray-500">
          Không có yêu cầu tham gia nào đang chờ duyệt.
        </div>
      ) : (
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-[15px] font-bold text-gray-900">Yêu cầu tham gia</h2>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {requests.map((request) => (
              <JoinRequestCard
                key={request.id}
                request={request}
                groupId={space.id}
                isArchived={isArchived}
                actionLoadingKeys={actionLoadingKeys}
                onApprove={onApproveJoinRequest}
                onReject={onRejectJoinRequest}
              />
            ))}
          </div>

          {!isLast && (
            <div className="flex justify-center p-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => onLoadMoreJoinRequests(space.id)}
                disabled={loadingMore}
                className="px-6 py-2 rounded-full text-[14px] font-bold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {loadingMore ? 'Đang tải...' : 'Xem thêm yêu cầu'}
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default SpaceJoinRequests;
