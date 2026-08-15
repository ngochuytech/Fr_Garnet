import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

const isLeader = (member) => {
  return ['LEADER', 'OWNER'].includes(member?.memberRole || member?.role);
};

const getMemberRoleLabel = (member) => {
  if (isLeader(member)) {
    return 'Trưởng nhóm';
  }

  const role = member?.memberRole || member?.role;

  if (role === 'ADMIN' || role === 'MODERATOR') {
    return 'Quản trị viên';
  }

  return 'Thành viên';
};

const canManageSpace = (space) => {
  return ['LEADER', 'OWNER'].includes(space?.memberRole)
    || ['LEADER', 'OWNER'].includes(space?.role);
};

const MemberCard = ({
  member,
  groupId,
  canKick,
  actionLoadingKeys,
  onOpenKickConfirm,
}) => {
  const navigate = useNavigate();
  const canOpenProfile = Boolean(member.profileId);
  const kickKey = `kick:${groupId}:${member.profileId}`;
  const isKicking = actionLoadingKeys.includes(kickKey);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-[#d09596] hover:shadow-sm transition-all">
      <button
        type="button"
        onClick={() => {
          if (canOpenProfile) {
            navigate(`/user/${member.profileId}`);
          }
        }}
        disabled={!canOpenProfile}
        className="flex items-center gap-3 min-w-0 text-left disabled:cursor-default"
      >
        <img
          src={member.avatarUrl}
          alt={member.fullName}
          className="w-12 h-12 rounded-full object-cover border border-gray-100 flex-shrink-0"
        />
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold text-gray-900 truncate">
            {member.fullName}
          </h3>
          <p className="text-[13px] text-gray-500 truncate">
            {member.email || 'Garnet'}
          </p>
        </div>
      </button>

      <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
        <span className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-bold ${
          isLeader(member)
            ? 'bg-[#f7edee] text-[#8d3f41]'
            : 'bg-gray-100 text-gray-600'
        }`}
        >
          {getMemberRoleLabel(member)}
        </span>

        {canKick && (
          <button
            type="button"
            onClick={() => onOpenKickConfirm(member)}
            disabled={isKicking || !member.profileId}
            className="px-4 py-2 rounded-lg border border-red-100 bg-red-50 text-[13px] font-bold text-red-600 hover:bg-red-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isKicking ? 'Đang xóa...' : 'Kick'}
          </button>
        )}
      </div>
    </div>
  );
};

const MemberSection = ({
  title,
  members,
  emptyText,
  groupId,
  canKickMembers = false,
  actionLoadingKeys = [],
  onOpenKickConfirm,
}) => (
  <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="px-4 py-3 border-b border-gray-100">
      <h2 className="text-[15px] font-bold text-gray-900">{title}</h2>
    </div>
    <div className="p-3 flex flex-col gap-2">
      {members.length === 0 ? (
        <p className="px-2 py-3 text-[14px] text-gray-500">{emptyText}</p>
      ) : (
        members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            groupId={groupId}
            canKick={canKickMembers && !isLeader(member)}
            actionLoadingKeys={actionLoadingKeys}
            onOpenKickConfirm={onOpenKickConfirm}
          />
        ))
      )}
    </div>
  </section>
);

const KickConfirmModal = ({
  member,
  groupId,
  actionLoadingKeys,
  onClose,
  onConfirm,
}) => {
  if (!member) {
    return null;
  }

  const kickKey = `kick:${groupId}:${member.profileId}`;
  const isKicking = actionLoadingKeys.includes(kickKey);

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 px-4" style={{ zIndex: 9999 }}>
      <div className="w-full max-w-sm rounded-xl bg-white border border-gray-100 shadow-xl p-5">
        <h2 className="text-base font-bold text-gray-900">Xác nhận kick thành viên</h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          Bạn có chắc muốn kick <span className="font-bold text-gray-900">{member.fullName}</span> khỏi nhóm không?
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isKicking}
            className="py-2 px-4 rounded-lg border border-gray-200 text-[13px] font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => onConfirm(groupId, member.profileId)}
            disabled={isKicking || !member.profileId}
            className="py-2 px-4 rounded-lg bg-red-600 text-[13px] font-bold text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isKicking ? 'Đang kick...' : 'Kick'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

const SpaceMembers = ({
  space,
  detailLoading,
  members,
  loading,
  loadingMore,
  error,
  isLast,
  total,
  actionLoadingKeys,
  onBack,
  onShowFeed,
  onLoadMoreMembers,
  onKickMember,
}) => {
  const [kickTarget, setKickTarget] = useState(null);
  const groupedMembers = useMemo(() => {
    return members.reduce((groups, member) => {
      if (isLeader(member)) {
        groups.leaders.push(member);
      } else {
        groups.regularMembers.push(member);
      }

      return groups;
    }, { leaders: [], regularMembers: [] });
  }, [members]);
  const isArchived = space?.status === 'ARCHIVED';
  const canKickMembers = canManageSpace(space) && !isArchived;

  const handleConfirmKick = async (groupId, targetUserId) => {
    const success = await onKickMember(groupId, targetUserId);

    if (success) {
      setKickTarget(null);
    }
  };

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
              {Number(total || space.membersCount || 0).toLocaleString()} thành viên
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
          <p className="mt-1">Danh sách thành viên chỉ còn để xem, không thể kick thành viên trong trạng thái này.</p>
        </div>
      )}

      {loading && members.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
          {[0, 1, 2, 3].map((item) => (
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
      ) : members.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center text-gray-500">
          Chưa có dữ liệu thành viên.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <MemberSection
            title="Trưởng nhóm"
            members={groupedMembers.leaders}
            emptyText="Chưa có dữ liệu trưởng nhóm."
            groupId={space.id}
            actionLoadingKeys={actionLoadingKeys}
            onOpenKickConfirm={setKickTarget}
          />

          <MemberSection
            title="Thành viên"
            members={groupedMembers.regularMembers}
            emptyText="Chưa có thành viên nào khác."
            groupId={space.id}
            canKickMembers={canKickMembers}
            actionLoadingKeys={actionLoadingKeys}
            onOpenKickConfirm={setKickTarget}
          />

          {!isLast && (
            <div className="flex justify-center py-2">
              <button
                type="button"
                onClick={() => onLoadMoreMembers(space.id)}
                disabled={loadingMore}
                className="px-6 py-2 rounded-full text-[14px] font-bold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {loadingMore ? 'Đang tải...' : 'Xem thêm thành viên'}
              </button>
            </div>
          )}
        </div>
      )}

      <KickConfirmModal
        member={kickTarget}
        groupId={space.id}
        actionLoadingKeys={actionLoadingKeys}
        onClose={() => setKickTarget(null)}
        onConfirm={handleConfirmKick}
      />
    </main>
  );
};

export default SpaceMembers;
