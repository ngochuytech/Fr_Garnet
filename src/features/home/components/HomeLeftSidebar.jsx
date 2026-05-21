import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../../utils/api';
import { getGroups } from '../../space/services/spaceService';

const getFallbackGroupAvatarUrl = (name) => (
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Group')}&background=dfb9b9&color=6a2f30&size=128`
);

const isJoinedGroup = (group) => (
  group?.isMember ||
  group?.memberStatus === 'APPROVED' ||
  group?.isLeader ||
  ['LEADER', 'OWNER'].includes(group?.memberRole) ||
  ['LEADER', 'OWNER'].includes(group?.role)
);

const normalizeGroup = (group) => {
  const name = group?.name || 'Nhóm chưa đặt tên';

  return {
    ...group,
    id: group?.id,
    name,
    membersCount: Number(group?.memberCount ?? group?.membersCount ?? 0),
    avatarUrl: group?.avatarUrl || group?.avatar || getFallbackGroupAvatarUrl(name),
    isArchived: group?.isArchived || group?.status === 'ARCHIVED',
  };
};

const getListItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  return payload?.items || payload?.content || [];
};

const GroupSection = ({ title, groups, emptyText, actionText }) => (
  <div>
    <p className="px-1 mb-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">
      {title}
    </p>
    <div className="flex flex-col gap-0.5">
      {groups.length === 0 ? (
        <p className="px-2 py-2 text-[12px] text-gray-500">{emptyText}</p>
      ) : (
        groups.map((group) => (
          <Link
            key={group.id}
            to={`/spaces/${group.id}`}
            className="flex items-center justify-between gap-2 px-2 py-2 rounded-lg hover:bg-[#f7edee] transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={group.avatarUrl}
                alt={group.name}
                className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span
                  className="text-[13px] font-medium text-gray-800 truncate leading-tight group-hover:text-[#6a2f30] transition-colors"
                  title={group.name}
                >
                  {group.name}
                </span>
                <span className="text-[11px] text-gray-400">
                  {group.membersCount.toLocaleString()} thành viên
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-white border border-gray-200 text-gray-700 group-hover:bg-gray-50 text-[11px] font-semibold rounded-full transition-colors flex-shrink-0">
              {actionText}
            </span>
          </Link>
        ))
      )}
    </div>
  </div>
);

const HomeLeftSidebar = () => {
  const [showAllSpaces, setShowAllSpaces] = useState(false);
  const [topics, setTopics] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await apiFetch('/users/topics');
        setTopics(data);
      } catch (error) {
        console.error('Failed to fetch topics:', error);
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getGroups();
        setGroups(getListItems(data).map(normalizeGroup));
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const visibleSpaces = showAllSpaces ? topics : topics.slice(0, 4);
  const joinedGroups = groups.filter(isJoinedGroup).slice(0, 2);
  const discoverGroups = groups
    .filter((group) => !isJoinedGroup(group) && !group.isArchived)
    .slice(0, 2);

  return (
    <aside className="w-full pb-6 pr-2">
      {/* Spaces */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
            Topics
          </span>
        </div>

        <nav className="flex flex-col gap-0.5">
          {visibleSpaces.map((topic) => {
            return (
              <Link
                key={topic?.topicName}
                to={`/topic/${encodeURIComponent(topic?.topicName || '')}`}
                className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg text-left transition-all hover:bg-[#f7edee] group"
              >
                <img src={topic?.imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&q=80"} alt={topic.topicName} className="w-8 h-8 rounded-lg flex-shrink-0 object-cover" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-medium text-gray-800 truncate leading-tight group-hover:text-[#6a2f30] transition-colors">
                    {topic.topicName}
                  </span>
                  <span className="text-[11px] text-gray-400">{topic.followerCount} thành viên</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {topics.length > 4 && (
          <button
            onClick={() => setShowAllSpaces(!showAllSpaces)}
            className="mt-1 w-full text-left px-2 py-1.5 text-[13px] font-medium rounded-lg hover:bg-[#f7edee] transition-colors flex items-center gap-1"
            style={{ color: 'var(--color-dusty-rose-600)' }}
          >
            {showAllSpaces ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
                Thu gọn
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                Xem thêm ({topics.length - 4})
              </>
            )}
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-1 mb-4" />

      {/* Groups */}
      <div className="mb-5">
        <div className="flex flex-col gap-3">
          <GroupSection title="Nhóm của tôi" groups={joinedGroups} emptyText="Chưa tham gia nhóm nào." actionText="Xem" />
          <GroupSection title="Khám phá hội nhóm" groups={discoverGroups} emptyText="Không có nhóm để khám phá." actionText="Tham gia" />
        </div>
      </div>
    </aside>
  );
};

export default HomeLeftSidebar;
