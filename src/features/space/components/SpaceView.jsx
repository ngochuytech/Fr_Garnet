import SpaceSidebar from './SpaceSidebar';
import SpaceGrid from './SpaceGrid';
import SpaceFeed from './SpaceFeed';
import { useSpaces } from '../hooks/useSpaces';

const SpaceView = () => {
  const {
    spaces,
    selectedSpace,
    selectedSpaceId,
    loading,
    detailLoading,
    createLoading,
    error,
    actionLoadingKeys,
    requestedGroupIds,
    refreshSpaces,
    handleSelectSpace,
    handleBackToList,
    handleCreateGroup,
    handleJoinGroup,
    handleLeaveGroup,
    handleUpdateGroupAvatar,
    handleUpdateGroupCover,
    handleUpdateGroupName,
  } = useSpaces();

  return (
    <div className="w-full min-h-[calc(100vh-50px)] bg-[#faf7f7]">
      <div className="max-w-[1300px] mx-auto px-4 pt-5 pb-10">
        <div className="flex items-start gap-6 lg:justify-between w-full">
          <div className="hidden lg:block lg:w-[280px] shrink-0 sticky top-[78px] h-[calc(100vh-78px)] overflow-y-auto hide-scrollbar">
            <SpaceSidebar
              spaces={spaces}
              selectedSpace={selectedSpace}
              onSelectSpace={handleSelectSpace}
              onJoinSpace={handleJoinGroup}
              onLeaveSpace={handleLeaveGroup}
              onUpdateAvatar={handleUpdateGroupAvatar}
              onUpdateCover={handleUpdateGroupCover}
              onUpdateName={handleUpdateGroupName}
              actionLoadingKeys={actionLoadingKeys}
              requestedGroupIds={requestedGroupIds}
            />
          </div>

          <div className="w-full lg:flex-1 max-w-[950px] mx-auto">
            {selectedSpaceId === null ? (
              <SpaceGrid
                spaces={spaces}
                loading={loading}
                error={error}
                createLoading={createLoading}
                actionLoadingKeys={actionLoadingKeys}
                requestedGroupIds={requestedGroupIds}
                onRetry={() => refreshSpaces()}
                onSelectSpace={handleSelectSpace}
                onCreateSpace={handleCreateGroup}
                onJoinSpace={handleJoinGroup}
              />
            ) : (
              <SpaceFeed
                space={selectedSpace}
                detailLoading={detailLoading}
                onBack={handleBackToList}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceView;
