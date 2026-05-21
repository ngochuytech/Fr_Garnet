import { useState } from 'react';
import { createPortal } from 'react-dom';

const canManageGroup = (space) => {
  return ['LEADER', 'OWNER'].includes(space?.memberRole)
    || ['LEADER', 'OWNER'].includes(space?.role)
    || space?.isLeader;
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
    && space?.status !== 'ARCHIVED'
    && !space?.isArchived
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

const LeaveConfirmModal = ({
  space,
  isLeaving,
  onClose,
  onConfirm,
}) => {
  if (!space) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 px-4" style={{ zIndex: 9999 }}>
      <div className="w-full max-w-sm rounded-xl bg-white border border-gray-100 shadow-xl p-5 text-left">
        <h2 className="text-base font-bold text-gray-900">Xác nhận rời nhóm</h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          Bạn có chắc muốn rời khỏi nhóm <span className="font-bold text-gray-900">{space.name}</span> không?
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLeaving}
            className="py-2 px-4 rounded-lg border border-gray-200 text-[13px] font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => onConfirm(space.id)}
            disabled={isLeaving}
            className="py-2 px-4 rounded-lg bg-red-600 text-[13px] font-bold text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLeaving ? 'Đang rời...' : 'Rời nhóm'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

const REPORT_REASONS = [
  'Nội dung spam hoặc lừa đảo',
  'Ngôn từ thù ghét hoặc quấy rối',
  'Nội dung không phù hợp',
  'Mạo danh hoặc thông tin sai lệch',
  'Vi phạm quy định cộng đồng',
];

const ReportGroupModal = ({
  space,
  value,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}) => {
  if (!space) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 px-4" style={{ zIndex: 9999 }}>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-xl bg-white border border-gray-100 shadow-xl p-5 text-left"
      >
        <h2 className="text-base font-bold text-gray-900">Báo cáo nhóm vi phạm</h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          Báo cáo nhóm <span className="font-bold text-gray-900">{space.name}</span> đến quản trị viên.
        </p>

        <label className="block mt-5 text-[12px] font-bold uppercase tracking-wide text-gray-500">
          Lý do vi phạm
        </label>
        <select
          value={value.reason}
          onChange={(event) => onChange({ ...value, reason: event.target.value })}
          disabled={isSubmitting}
          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#d09596] disabled:bg-gray-50"
          required
        >
          <option value="">Chọn lý do</option>
          {REPORT_REASONS.map((reason) => (
            <option key={reason} value={reason}>{reason}</option>
          ))}
        </select>

        <label className="block mt-4 text-[12px] font-bold uppercase tracking-wide text-gray-500">
          Mô tả thêm
        </label>
        <textarea
          value={value.description}
          onChange={(event) => onChange({ ...value, description: event.target.value })}
          disabled={isSubmitting}
          rows="4"
          placeholder="Nhập chi tiết để quản trị viên dễ kiểm tra..."
          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#d09596] disabled:bg-gray-50 resize-none"
        />

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="py-2 px-4 rounded-lg border border-gray-200 text-[13px] font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !value.reason}
            className="py-2 px-4 rounded-lg bg-red-600 text-[13px] font-bold text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
};

const SpaceSidebar = ({
  spaces,
  selectedSpace,
  onSelectSpace,
  onJoinSpace,
  onLeaveSpace,
  onUpdateAvatar,
  onUpdateCover,
  onUpdateName,
  onUpdateDescription,
  onReportGroup,
  actionLoadingKeys,
  requestedGroupIds,
  membersTotal,
  joinRequestsTotal,
  activeView,
  onShowFeed,
  onShowMembers,
  onShowJoinRequests,
  onShowStatus,
}) => {
  const [nameEditor, setNameEditor] = useState({ groupId: null, name: '', isEditing: false });
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: '', description: '' });
  const [descriptionEditor, setDescriptionEditor] = useState({
    groupId: null,
    description: '',
    isEditing: false,
  });

  if (!selectedSpace) {
    const mySpaces = spaces.filter(isJoinedSpace);
    const discoverSpaces = spaces.filter((space) => !isJoinedSpace(space) && !space.isArchived && space.status !== 'ARCHIVED');

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
  const descriptionKey = `description:${selectedSpace.id}`;
  const reportKey = `report:${selectedSpace.id}`;
  const hasRequested = requestedGroupIds.includes(selectedSpace.id);
  const isJoining = actionLoadingKeys.includes(joinKey);
  const isLeaving = actionLoadingKeys.includes(leaveKey);
  const isUpdatingName = actionLoadingKeys.includes(nameKey);
  const isUpdatingDescription = actionLoadingKeys.includes(descriptionKey);
  const isReporting = actionLoadingKeys.includes(reportKey);
  const isPending = hasRequested || selectedSpace.isPending || selectedSpace.memberStatus === 'PENDING';
  const isRejected = selectedSpace.memberStatus === 'REJECTED';
  const isArchived = selectedSpace.isArchived || selectedSpace.status === 'ARCHIVED';
  const isLeader = canManageGroup(selectedSpace);
  const canEditGroup = isLeader && !isArchived;
  const isEditingName = nameEditor.isEditing && nameEditor.groupId === selectedSpace.id;
  const isEditingDescription = descriptionEditor.isEditing && descriptionEditor.groupId === selectedSpace.id;
  const draftName = isEditingName ? nameEditor.name : selectedSpace.name;
  const draftDescription = isEditingDescription ? descriptionEditor.description : selectedSpace.description;

  const startEditingName = () => {
    setNameEditor({ groupId: selectedSpace.id, name: selectedSpace.name, isEditing: true });
  };

  const cancelEditingName = () => {
    setNameEditor({ groupId: null, name: '', isEditing: false });
  };

  const startEditingDescription = () => {
    setDescriptionEditor({
      groupId: selectedSpace.id,
      description: selectedSpace.description,
      isEditing: true,
    });
  };

  const cancelEditingDescription = () => {
    setDescriptionEditor({ groupId: null, description: '', isEditing: false });
  };

  const submitGroupName = async (event) => {
    event.preventDefault();
    const success = await onUpdateName(selectedSpace.id, draftName);

    if (success) {
      cancelEditingName();
    }
  };

  const submitGroupDescription = async (event) => {
    event.preventDefault();
    const success = await onUpdateDescription(selectedSpace.id, draftDescription);

    if (success) {
      cancelEditingDescription();
    }
  };

  const confirmLeaveSpace = async (groupId) => {
    const success = await onLeaveSpace(groupId);

    if (success) {
      setIsLeaveConfirmOpen(false);
    }
  };

  const submitGroupReport = async (event) => {
    event.preventDefault();
    const success = await onReportGroup(selectedSpace.id, reportForm);

    if (success) {
      setIsReportModalOpen(false);
      setReportForm({ reason: '', description: '' });
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
            {canEditGroup && (
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

        <button
          type="button"
          onClick={onShowMembers}
          className="text-[13px] text-gray-500 mt-1 mb-4 inline-flex items-center justify-center gap-1 rounded-full px-3 py-1 hover:bg-[#f7edee] hover:text-[#8d3f41] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#8d3f41]">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          {selectedSpace.membersCount.toLocaleString()} thành viên
        </button>

        {isEditingDescription ? (
          <form onSubmit={submitGroupDescription} className="mb-4">
            <textarea
              value={draftDescription}
              onChange={(event) => setDescriptionEditor((current) => ({ ...current, description: event.target.value }))}
              disabled={isUpdatingDescription}
              rows="4"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#d09596] disabled:bg-gray-50 resize-none text-left"
              autoFocus
            />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={cancelEditingDescription}
                disabled={isUpdatingDescription}
                className="py-1.5 px-3 rounded-lg border border-gray-200 text-[12px] font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isUpdatingDescription}
                className="py-1.5 px-3 rounded-lg bg-[#8d3f41] text-[12px] font-bold text-white hover:bg-[#6a2f30] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isUpdatingDescription ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-4">
            <div className="flex items-start justify-center gap-2">
              <p className="text-sm text-gray-600 line-clamp-3 leading-snug">
                {selectedSpace.description || 'Chưa có mô tả cho nhóm này.'}
              </p>
              {canEditGroup && (
                <button
                  type="button"
                  onClick={startEditingDescription}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-[#8d3f41] transition-colors shrink-0"
                  title="Chỉnh sửa mô tả nhóm"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {isArchived && (
            <div className="w-full rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-left">
              <p className="text-[13px] font-bold text-amber-800">Nhóm đã bị lưu trữ</p>
              <p className="mt-0.5 text-[12px] text-amber-700">Bạn vẫn có thể xem nội dung cũ, nhưng không thể tạo hoạt động mới.</p>
            </div>
          )}

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
              onClick={() => setIsLeaveConfirmOpen(true)}
              disabled={isLeaving}
              className="w-full py-1.5 px-4 bg-gray-50 text-gray-700 text-[13px] font-bold rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isLeaving ? 'Đang rời...' : 'Rời nhóm'}
            </button>
          )}

          {!isLeader && !isArchived && (
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              disabled={isReporting}
              className="w-full py-1.5 px-4 bg-red-50 text-red-600 text-[13px] font-bold rounded-lg border border-red-100 hover:bg-red-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isReporting ? 'Đang gửi báo cáo...' : 'Báo cáo nhóm'}
            </button>
          )}

          {canEditGroup && (
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

        <div className="mt-4 pt-4 border-t border-gray-100 text-left">
          <h3 className="text-[12px] font-bold uppercase tracking-wide text-gray-400 mb-2 px-1">
            Trong nhóm
          </h3>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={onShowFeed}
              className={`flex items-center justify-between w-full p-2 rounded-lg text-left transition-colors ${
                activeView === 'feed'
                  ? 'bg-[#f7edee] text-[#8d3f41]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-[13px] font-bold">Bảng tin</span>
            </button>
            <button
              type="button"
              onClick={onShowMembers}
              className={`flex items-center justify-between w-full p-2 rounded-lg text-left transition-colors ${
                activeView === 'members'
                  ? 'bg-[#f7edee] text-[#8d3f41]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-[13px] font-bold">Thành viên</span>
              <span className="text-[11px] text-gray-400">
                {Number(membersTotal || selectedSpace.membersCount || 0).toLocaleString()}
              </span>
            </button>
            <button
              type="button"
              onClick={onShowStatus}
              className={`flex items-center justify-between w-full p-2 rounded-lg text-left transition-colors ${
                activeView === 'status'
                  ? 'bg-[#f7edee] text-[#8d3f41]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-[13px] font-bold">Trạng thái</span>
              {isArchived && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
            {canEditGroup && (
              <button
                type="button"
                onClick={onShowJoinRequests}
                className={`flex items-center justify-between w-full p-2 rounded-lg text-left transition-colors ${
                  activeView === 'joinRequests'
                    ? 'bg-[#f7edee] text-[#8d3f41]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-[13px] font-bold">Duyệt thành viên</span>
                <span className="text-[11px] text-gray-400">
                  {Number(joinRequestsTotal || 0).toLocaleString()}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {isLeaveConfirmOpen && (
        <LeaveConfirmModal
          space={selectedSpace}
          isLeaving={isLeaving}
          onClose={() => setIsLeaveConfirmOpen(false)}
          onConfirm={confirmLeaveSpace}
        />
      )}

      {isReportModalOpen && (
        <ReportGroupModal
          space={selectedSpace}
          value={reportForm}
          isSubmitting={isReporting}
          onChange={setReportForm}
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={submitGroupReport}
        />
      )}
    </aside>
  );
};

export default SpaceSidebar;
