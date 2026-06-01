import { useState } from 'react';

const GROUP_NAME_MAX_LENGTH = 50;

const isJoinedSpace = (space) => {
  return Boolean(
    space?.memberStatus === 'APPROVED'
    || space?.memberRole === 'LEADER'
  );
};

const isRejectedSpace = (space) => {
  return space?.memberStatus === 'REJECTED'
    || space?.membershipStatus === 'REJECTED'
    || space?.requestStatus === 'REJECTED'
    || space?.joinStatus === 'REJECTED'
    || space?.status === 'REJECTED';
};

const getSpaceState = (space, actionLoadingKeys, requestedGroupIds) => {
  const joinKey = `join:${space.id}`;
  const hasRequested = requestedGroupIds.includes(space.id);
  const isJoining = actionLoadingKeys.includes(joinKey);
  const isJoined = isJoinedSpace(space);
  const isRejected = isRejectedSpace(space);
  const isPending = !isRejected && (hasRequested || space.memberStatus === 'PENDING');
  const isArchived = space.status === 'ARCHIVED';

  return { isJoining, isJoined, isPending, isRejected, isArchived };
};

const SpaceCard = ({
  space,
  actionLoadingKeys,
  requestedGroupIds,
  onSelectSpace,
  onJoinSpace,
}) => {
  const { isJoining, isJoined, isPending, isRejected, isArchived } = getSpaceState(space, actionLoadingKeys, requestedGroupIds);

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex-1">
      <div className="h-28 w-full bg-gray-200 relative">
        <img src={space.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
        <div className="absolute -bottom-6 left-4 border-4 border-white rounded-xl bg-white">
          <img
            src={space.avatarUrl}
            alt={space.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
        </div>
      </div>

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

        {isArchived && (
          <span className="mt-2 inline-flex w-fit rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-100">
            Đã lưu trữ
          </span>
        )}

        {!isArchived && isRejected && (
          <span className="mt-2 inline-flex w-fit rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600 ring-1 ring-red-100">
            Yêu cầu bị từ chối
          </span>
        )}

        <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed flex-1">
          {space.description}
        </p>

        <div className="mt-4 pt-3 border-t border-gray-50 w-full grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSelectSpace(space.id)}
            className="w-full py-1.5 px-3 bg-[#f7edee] text-[#8d3f41] text-[13.5px] font-bold rounded-lg hover:bg-[#efdcdc] transition-colors"
          >
            Xem chi tiết
          </button>
          <button
            type="button"
            onClick={() => onJoinSpace(space.id)}
            disabled={isArchived || isJoining || isPending || isJoined}
            className="w-full py-1.5 px-3 bg-[#8d3f41] text-white text-[13.5px] font-bold rounded-lg hover:bg-[#6a2f30] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isArchived ? 'Đã lưu trữ' : isJoined ? 'Đã tham gia' : isPending ? 'Đã gửi' : isJoining ? 'Đang gửi...' : isRejected ? 'Gửi lại' : 'Tham gia'}
          </button>
        </div>
      </div>
    </div>
  );
};

const SpaceSection = ({
  title,
  description,
  spaces,
  emptyTitle,
  emptyDescription,
  actionLoadingKeys,
  requestedGroupIds,
  onSelectSpace,
  onJoinSpace,
}) => (
  <section className="mb-8">
    <div className="flex items-end justify-between gap-4 mb-3">
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
      <span className="text-xs font-bold text-gray-500 bg-white border border-gray-100 rounded-full px-3 py-1">
        {spaces.length} nhóm
      </span>
    </div>

    {spaces.length === 0 ? (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        <h3 className="text-base font-bold text-gray-900">{emptyTitle}</h3>
        <p className="text-sm text-gray-500 mt-1">{emptyDescription}</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {spaces.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
            actionLoadingKeys={actionLoadingKeys}
            requestedGroupIds={requestedGroupIds}
            onSelectSpace={onSelectSpace}
            onJoinSpace={onJoinSpace}
          />
        ))}
      </div>
    )}
  </section>
);

const SpaceGrid = ({
  spaces,
  loading,
  error,
  createLoading,
  actionLoadingKeys,
  requestedGroupIds,
  onRetry,
  onSelectSpace,
  onCreateSpace,
  onJoinSpace,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const mySpaces = spaces.filter(isJoinedSpace);
  const discoverSpaces = spaces.filter((space) => !isJoinedSpace(space) && space.status !== 'ARCHIVED');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    const createdSpace = await onCreateSpace(formData);

    if (createdSpace) {
      setFormData({ name: '', description: '' });
      setIsCreateOpen(false);
    }
  };

  return (
    <main className="w-full">
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Hội nhóm CampusHub</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý nhóm đã tham gia và khám phá cộng đồng mới</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#8d3f41] text-white text-sm font-semibold rounded-lg hover:bg-[#6a2f30] transition-colors shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Tạo nhóm mới
        </button>
      </div>

      {isCreateOpen && (
        <form
          onSubmit={handleCreateSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">Tạo nhóm mới</h2>
              <p className="text-sm text-gray-500 mt-1">Nhập tên và mô tả ngắn cho nhóm học tập hoặc câu lạc bộ.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Đóng form tạo nhóm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="grid gap-3">
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              maxLength={GROUP_NAME_MAX_LENGTH}
              placeholder="Tên nhóm"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#d09596]"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Mô tả nhóm"
              rows="3"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#d09596] resize-none"
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="px-4 py-2 rounded-lg bg-[#8d3f41] text-sm font-semibold text-white hover:bg-[#6a2f30] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {createLoading ? 'Đang tạo...' : 'Tạo nhóm'}
            </button>
          </div>
        </form>
      )}

      {!isCreateOpen && (
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="sm:hidden w-full mb-4 flex items-center justify-center gap-1.5 px-4 py-2 bg-[#8d3f41] text-white text-sm font-semibold rounded-lg hover:bg-[#6a2f30] transition-colors shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Tạo nhóm mới
        </button>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 mb-4 flex items-center justify-between gap-3">
          <p className="text-sm font-medium">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="px-3 py-1.5 rounded-lg bg-white border border-red-100 text-sm font-semibold hover:bg-red-50"
          >
            Thử lại
          </button>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-28 bg-gray-200"></div>
              <div className="p-4 pt-8">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-100 rounded w-1/3 mb-4"></div>
                <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && spaces.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <h2 className="text-lg font-bold text-gray-900">Chưa có nhóm nào</h2>
          <p className="text-sm text-gray-500 mt-2">Tạo nhóm đầu tiên để bắt đầu xây dựng cộng đồng trong CampusHub.</p>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#8d3f41] text-white text-sm font-semibold hover:bg-[#6a2f30] transition-colors"
          >
            Tạo nhóm mới
          </button>
        </div>
      )}

      {!loading && spaces.length > 0 && (
        <>
          <SpaceSection
            title="Nhóm của tôi"
            description="Các nhóm bạn đã tham gia hoặc đang quản lý"
            spaces={mySpaces}
            emptyTitle="Bạn chưa tham gia nhóm nào"
            emptyDescription="Hãy khám phá các nhóm bên dưới hoặc tự tạo nhóm mới."
            actionLoadingKeys={actionLoadingKeys}
            requestedGroupIds={requestedGroupIds}
            onSelectSpace={onSelectSpace}
            onJoinSpace={onJoinSpace}
          />

          <SpaceSection
            title="Khám phá nhóm"
            description="Các nhóm bạn chưa là thành viên"
            spaces={discoverSpaces}
            emptyTitle="Không còn nhóm để khám phá"
            emptyDescription="Bạn đã tham gia hoặc gửi yêu cầu tới tất cả nhóm hiện có."
            actionLoadingKeys={actionLoadingKeys}
            requestedGroupIds={requestedGroupIds}
            onSelectSpace={onSelectSpace}
            onJoinSpace={onJoinSpace}
          />
        </>
      )}
    </main>
  );
};

export default SpaceGrid;
