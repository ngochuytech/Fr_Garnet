import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SpaceSidebar from './SpaceSidebar';
import SpaceGrid from './SpaceGrid';
import SpaceFeed from './SpaceFeed';
import SpaceMembers from './SpaceMembers';
import SpaceJoinRequests from './SpaceJoinRequests';
import SpaceStatus from './SpaceStatus';
import { useSpaces } from '../hooks/useSpaces';

const SpaceView = () => {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const isDetailRoute = Boolean(spaceId);
  const [activeView, setActiveView] = useState('feed');
  const {
    spaces,
    selectedSpace,
    loading,
    detailLoading,
    createLoading,
    error,
    actionLoadingKeys,
    requestedGroupIds,
    selectedMembers,
    membersLoading,
    membersLoadingMore,
    membersError,
    membersIsLast,
    membersTotal,
    selectedJoinRequests,
    joinRequestsLoading,
    joinRequestsLoadingMore,
    joinRequestsError,
    joinRequestsIsLast,
    joinRequestsTotal,
    selectedGroupStatus,
    groupStatusLoading,
    groupStatusError,
    refreshSpaces,
    handleBackToList,
    handleCreateGroup,
    handleJoinGroup,
    handleLeaveGroup,
    handleDeleteGroup,
    handleUpdateGroupAvatar,
    handleUpdateGroupCover,
    handleUpdateGroupName,
    handleUpdateGroupDescription,
    handleReportGroup,
    handleLoadGroupStatus,
    handleLoadMoreMembers,
    handleLoadMoreJoinRequests,
    handleApproveJoinRequest,
    handleRejectJoinRequest,
    handleKickMember,
  } = useSpaces(spaceId || null);

  const handleSelectSpaceView = (groupId) => {
    setActiveView('feed');
    navigate(`/spaces/${groupId}`);
  };

  const handleBackToListView = () => {
    setActiveView('feed');
    handleBackToList();
    navigate('/spaces');
  };

  const handleCreateSpaceView = async (formData) => {
    const createdSpace = await handleCreateGroup(formData);

    if (createdSpace?.id) {
      navigate(`/spaces/${createdSpace.id}`);
    }

    return createdSpace;
  };

  const handleDeleteGroupView = async (groupId) => {
    const success = await handleDeleteGroup(groupId);

    if (success) {
      setActiveView('feed');
      navigate('/spaces');
    }

    return success;
  };

  const handleShowStatusView = () => {
    setActiveView('status');
    if (selectedSpace?.id) {
      handleLoadGroupStatus(selectedSpace.id);
    }
  };

  const statusSpace = selectedSpace
    ? { ...selectedSpace, ...(selectedGroupStatus || {}) }
    : selectedSpace;

  return (
    <div className="w-full min-h-[calc(100vh-50px)] bg-[#faf7f7]">
      <div className="max-w-[1300px] mx-auto px-4 pt-5 pb-10">
        <div className="flex items-start gap-6 lg:justify-between w-full">
          <div className="hidden lg:block lg:w-[280px] shrink-0 sticky top-[78px] h-[calc(100vh-78px)] overflow-y-auto hide-scrollbar">
            <SpaceSidebar
              spaces={spaces}
              selectedSpace={selectedSpace}
              onSelectSpace={handleSelectSpaceView}
              onJoinSpace={handleJoinGroup}
              onLeaveSpace={handleLeaveGroup}
              onDeleteGroup={handleDeleteGroupView}
              onUpdateAvatar={handleUpdateGroupAvatar}
              onUpdateCover={handleUpdateGroupCover}
              onUpdateName={handleUpdateGroupName}
              onUpdateDescription={handleUpdateGroupDescription}
              onReportGroup={handleReportGroup}
              actionLoadingKeys={actionLoadingKeys}
              requestedGroupIds={requestedGroupIds}
              membersTotal={membersTotal}
              joinRequestsTotal={joinRequestsTotal}
              activeView={activeView}
              onShowFeed={() => setActiveView('feed')}
              onShowMembers={() => setActiveView('members')}
              onShowJoinRequests={() => setActiveView('joinRequests')}
              onShowStatus={handleShowStatusView}
            />
          </div>

          <div className="w-full lg:flex-1 max-w-[950px] mx-auto">
            {!isDetailRoute ? (
              <SpaceGrid
                spaces={spaces}
                loading={loading}
                error={error}
                createLoading={createLoading}
                actionLoadingKeys={actionLoadingKeys}
                requestedGroupIds={requestedGroupIds}
                onRetry={() => refreshSpaces()}
                onSelectSpace={handleSelectSpaceView}
                onCreateSpace={handleCreateSpaceView}
                onJoinSpace={handleJoinGroup}
              />
            ) : activeView === 'members' ? (
              <SpaceMembers
                space={selectedSpace}
                detailLoading={detailLoading}
                members={selectedMembers}
                loading={membersLoading}
                loadingMore={membersLoadingMore}
                error={membersError}
                isLast={membersIsLast}
                total={membersTotal}
                actionLoadingKeys={actionLoadingKeys}
                onBack={handleBackToListView}
                onShowFeed={() => setActiveView('feed')}
                onLoadMoreMembers={handleLoadMoreMembers}
                onKickMember={handleKickMember}
              />
            ) : activeView === 'joinRequests' ? (
              <SpaceJoinRequests
                space={selectedSpace}
                detailLoading={detailLoading}
                requests={selectedJoinRequests}
                loading={joinRequestsLoading}
                loadingMore={joinRequestsLoadingMore}
                error={joinRequestsError}
                isLast={joinRequestsIsLast}
                total={joinRequestsTotal}
                actionLoadingKeys={actionLoadingKeys}
                onBack={handleBackToListView}
                onShowFeed={() => setActiveView('feed')}
                onLoadMoreJoinRequests={handleLoadMoreJoinRequests}
                onApproveJoinRequest={handleApproveJoinRequest}
                onRejectJoinRequest={handleRejectJoinRequest}
              />
            ) : activeView === 'status' ? (
              <SpaceStatus
                space={statusSpace}
                detailLoading={detailLoading || groupStatusLoading}
                error={groupStatusError}
                onBack={handleBackToListView}
                onShowFeed={() => setActiveView('feed')}
              />
            ) : (
              <SpaceFeed
                space={selectedSpace}
                detailLoading={detailLoading}
                onBack={handleBackToListView}
                onShowMembers={() => setActiveView('members')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceView;
