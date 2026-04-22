import { useAuth } from '../../../../context/AuthContext';
import { useProfileSidebar } from '../../hooks/posts/useProfileSidebar';
import CredentialModal from './CredentialModal';
import HighlightModal from './HighlightModal';
import TopicsModal from './TopicsModal';

const ProfileSidebar = ({ userProp }) => {
  const { user: contextUser } = useAuth();
  const user = userProp || contextUser;
  const isOwnProfile = contextUser?.email === user?.email;
  const { isModalOpen, modalType, isModalEditHighlightOpen, isTopicsModalOpen, openModal, closeModal, setIsModalEditHighlightOpen, closeModalEditHighlight, openTopicsModal, closeTopicsModal } = useProfileSidebar();

  return (
    <div className="w-full md:w-[380px] flex-shrink-0 flex flex-col gap-6">

      {/* Credentials & Highlights */}
      <div>
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
          <h3 className="text-[15px] font-medium text-gray-700">Thông tin</h3>
          {isOwnProfile && (
            <button onClick={() => setIsModalEditHighlightOpen(prev => !prev)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div 
            className={`flex items-center gap-3 group ${isOwnProfile && !user?.department ? 'cursor-pointer' : 'cursor-default'}`} 
            onClick={() => isOwnProfile && !user?.department && openModal('education')}
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            {user?.department ? (
              <span className="text-[15px] text-gray-700">{user.department}</span>
            ) : isOwnProfile ? (
              <span className="text-sm font-medium text-blue-600 group-hover:underline">Thêm học vấn</span>
            ) : null}
          </div>

          <div 
            className={`flex items-center gap-3 group ${isOwnProfile ? 'cursor-pointer' : 'cursor-default'}`} 
            onClick={() => isOwnProfile && openModal('location')}
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {isOwnProfile ? (
              <span className="text-sm font-medium text-blue-600 group-hover:underline">Thêm địa điểm</span>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span className="text-[15px] text-gray-700">Tiếng việt</span>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.5"></rect>
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.5"></line>
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.5"></line>
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.5"></line>
            </svg>
            <span className="text-[15px] text-gray-700">Tham gia March 2026</span>
          </div>
        </div>
      </div>

      {/* Knows About */}
      <div>
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
          <h3 className="text-[15px] font-medium text-gray-700">Quan tâm</h3>
          {isOwnProfile && (
            <button onClick={openTopicsModal} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {user?.topics?.length > 0 ? (
            user.topics.map((topic, index) => (
              <div key={index} className="flex items-center gap-3 p-1 rounded hover:bg-gray-50 cursor-pointer group">
                {topic.imageUrl ? (
                  <img src={topic.imageUrl} alt={topic.topicName} className="w-8 h-8 rounded shrink-0 object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded shrink-0 bg-red-100 flex items-center justify-center font-bold text-red-700 text-xs shadow-sm">
                    {topic.topicName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-gray-800 hover:text-blue-600 transition-colors">{topic.topicName}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[14px] text-gray-500 italic">Chưa có chủ đề quan tâm</p>
          )}
        </div>
      </div>

      <CredentialModal
        isOpen={isModalOpen}
        onClose={closeModal}
        type={modalType}
      />

      <HighlightModal
        isOpen={isModalEditHighlightOpen}
        onClose={closeModalEditHighlight}
        openCredentialModal={openModal}
      />

      <TopicsModal
        isOpen={isTopicsModalOpen}
        onClose={closeTopicsModal}
      />

    </div>
  );
};

export default ProfileSidebar;
