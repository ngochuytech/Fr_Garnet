import { useState } from 'react';

const canManageGroup = (space) => {
  return space?.memberRole === 'LEADER' || space?.role === 'LEADER' || space?.isLeader;
};

const isJoinedSpace = (space) => {
  return Boolean(
    space?.isMember
    || space?.memberStatus === 'APPROVED'
    || space?.isLeader
    || space?.memberRole === 'LEADER'
    || space?.role === 'LEADER'
  );
};

const canLeaveSpace = (space) => {
  return !canManageGroup(space) && (space?.isMember || space?.memberStatus === 'APPROVED');
};

const canJoinSpace = (space) => {
  return !canManageGroup(space)
    && !space?.isMember
    && space?.memberStatus !== 'APPROVED'
    && space?.memberStatus !== 'PENDING'
    && space?.memberStatus !== 'REJECTED';
};

const SidebarGroupList = ({ title, spaces, emptyText, onSelectSpace }) => (
  <div className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
    <h3 className="text-[12px] font-bold uppercase tracking-wide text-gray-400 mb-2 px-1">
      {title}
    </h3>
    <div className="flex flex-col gap-1.5">
      {spaces.slice(0, 4).map((space) => (
        <button
          key={space.id}
          type="button"
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
      {spaces.length === 0 && (
        <p className="px-2 py-2 text-[13px] text-gray-500">
          {emptyText}
        </p>
      )}
    </div>
  </div>
);

const SpaceSidebar = ({
  spaces,
  selectedSpace,
  onSelectSpace,
  onJoinSpace,
  onLeaveSpace,
  onUpdateAvatar,
  onUpdateCover,
  onUpdateName,
  actionLoadingKeys,
  requestedGroupIds,
}) => {
  const [nameEditor, setNameEditor] = useState({ groupId: null, name: '', isEditing: false });

  if (!selectedSpace) {
    const mySpaces = spaces.filter(isJoinedSpace);
    const discoverSpaces = spaces.filter((space) => !isJoinedSpace(space));

    return (
      <aside className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-base font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
          Hội nhóm
        </h2>
        <div className="flex flex-col gap-4 focus:outline-none">
          <SidebarGroupList
            title="Nhóm của tôi"
            spaces={mySpaces}
            emptyText="Chưa tham gia nhóm nào."
            onSelectSpace={onSelectSpace}
          />
          <SidebarGroupList
            title="Khám phá"
            spaces={discoverSpaces}
            emptyText="Không còn nhóm mới."
            onSelectSpace={onSelectSpace}
          />
        </div>
      </aside>
    );
  }

  const joinKey = `join:${selectedSpace.id}`;
  const leaveKey = `leave:${selectedSpace.id}`;
  const nameKey = `name:${selectedSpace.id}`;
  const hasRequested = requestedGroupIds.includes(selectedSpace.id);
  const isJoining = actionLoadingKeys.includes(joinKey);
  const isLeaving = actionLoadingKeys.includes(leaveKey);
  const isUpdatingName = actionLoadingKeys.includes(nameKey);
  const isPending = hasRequested || selectedSpace.isPending || selectedSpace.memberStatus === 'PENDING';
  const isRejected = selectedSpace.memberStatus === 'REJECTED';
  const isLeader = canManageGroup(selectedSpace);
  const isEditingName = nameEditor.isEditing && nameEditor.groupId === selectedSpace.id;
  const draftName = isEditingName ? nameEditor.name : selectedSpace.name;

  const startEditingName = () => {
    setNameEditor({ groupId: selectedSpace.id, name: selectedSpace.name, isEditing: true });
  };

  const cancelEditingName = () => {
    setNameEditor({ groupId: null, name: '', isEditing: false });
  };

  const submitGroupName = async (event) => {
    event.preventDefault();
    const success = await onUpdateName(selectedSpace.id, draftName);

    if (success) {
      cancelEditingName();
    }
  };

  return (
    <aside className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full text-center">
      <div className="h-24 w-full bg-gray-200">
        <img src={selectedSpace.coverUrl} alt="Cover" className="w-full h-full object-cover" />
      </div>

      <div className="flex justify-center -mt-8">
        <img
          src={selectedSpace.avatarUrl}
          alt={selectedSpace.name}
          className="w-16 h-16 rounded-xl object-cover border-4 border-white shadow-sm bg-white"
        />
      </div>

      <div className="p-4 pt-2">
        {isEditingName ? (
          <form onSubmit={submitGroupName} className="mb-3">
            <input
              value={draftName}
              onChange={(event) => setNameEditor((current) => ({ ...current, name: event.target.value }))}
              disabled={isUpdatingName}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-center text-sm font-bold text-gray-900 outline-none focus:border-[#d09596] disabled:bg-gray-50"
              autoFocus
            />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={cancelEditingName}
                disabled={isUpdatingName}
                className="py-1.5 px-3 rounded-lg border border-gray-200 text-[12px] font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isUpdatingName || !draftName.trim()}
                className="py-1.5 px-3 rounded-lg bg-[#8d3f41] text-[12px] font-bold text-white hover:bg-[#6a2f30] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isUpdatingName ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-start justify-center gap-2 mb-1">
            <h2 className="text-base font-bold text-gray-900 leading-tight min-w-0">
              {selectedSpace.name}
            </h2>
            {isLeader && (
              <button
                type="button"
                onClick={startEditingName}
                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-[#8d3f41] transition-colors shrink-0"
                title="Chỉnh sửa tên nhóm"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                </svg>
              </button>
            )}
          </div>
        )}

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

        <div className="flex flex-col gap-2">
          {canJoinSpace(selectedSpace) && (
            <button
              type="button"
              onClick={() => onJoinSpace(selectedSpace.id)}
              disabled={isJoining || isPending}
              className="w-full py-1.5 px-4 bg-[#8d3f41] text-white text-[13px] font-bold rounded-lg shadow-sm hover:bg-[#6a2f30] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Đã gửi yêu cầu' : isJoining ? 'Đang gửi...' : 'Tham gia nhóm'}
            </button>
          )}

          {!canJoinSpace(selectedSpace) && (isPending || isRejected) && (
            <button
              type="button"
              disabled
              className="w-full py-1.5 px-4 bg-gray-100 text-gray-500 text-[13px] font-bold rounded-lg border border-gray-200 cursor-not-allowed"
            >
              {isPending ? 'Đã gửi yêu cầu' : 'Yêu cầu bị từ chối'}
            </button>
          )}

          {canLeaveSpace(selectedSpace) && (
            <button
              type="button"
              onClick={() => onLeaveSpace(selectedSpace.id)}
              disabled={isLeaving}
              className="w-full py-1.5 px-4 bg-gray-50 text-gray-700 text-[13px] font-bold rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isLeaving ? 'Đang rời...' : 'Rời nhóm'}
            </button>
          )}

          {isLeader && (
            <div className="grid grid-cols-2 gap-2">
              <label className="w-full py-1.5 px-3 bg-gray-50 text-gray-700 text-[12px] font-bold rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                Avatar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) onUpdateAvatar(selectedSpace.id, file);
                    event.target.value = '';
                  }}
                />
              </label>
              <label className="w-full py-1.5 px-3 bg-gray-50 text-gray-700 text-[12px] font-bold rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                Ảnh bìa
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) onUpdateCover(selectedSpace.id, file);
                    event.target.value = '';
                  }}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SpaceSidebar;
