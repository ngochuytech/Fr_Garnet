import { useState } from 'react';
import SpaceSidebar from './SpaceSidebar';
import SpaceGrid from './SpaceGrid';
import SpaceFeed from './SpaceFeed';

const mockSpaces = [
  {
    id: 1,
    name: 'Cộng đồng Lập trình React',
    description: 'Nơi giao lưu, chia sẻ kiến thức về ReactJS, NextJS và các thư viện liên quan.',
    membersCount: 1520,
    coverUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&q=80',
    avatarUrl: 'https://ui-avatars.com/api/?name=React&background=61DAFB&color=fff&size=128'
  },
  {
    id: 2,
    name: 'Hội sinh viên KTPM',
    description: 'Nhóm dành riêng cho sinh viên ngành Kỹ thuật phần mềm. Thảo luận đồ án, đề tài.',
    membersCount: 850,
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80',
    avatarUrl: 'https://ui-avatars.com/api/?name=SE&background=dfb9b9&color=6a2f30&size=128'
  },
  {
    id: 3,
    name: 'Trí tuệ nhân tạo (AI/ML)',
    description: 'Thực hành Machine Learning, Deep Learning và chia sẻ tài liệu học AI.',
    membersCount: 3200,
    coverUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80',
    avatarUrl: 'https://ui-avatars.com/api/?name=AI&background=231010&color=f7edee&size=128'
  },
  {
    id: 4,
    name: 'Thiết kế UI/UX',
    description: 'Nơi tập hợp các nhà thiết kế tương lai tâm huyết. Share Figma tips và resources.',
    membersCount: 940,
    coverUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80',
    avatarUrl: 'https://ui-avatars.com/api/?name=UX&background=d09596&color=190b0b&size=128'
  },
  {
    id: 5,
    name: 'CLB Tiếng Anh',
    description: 'Luyện speaking, listening, reading, writing hàng ngày cùng các thành viên.',
    membersCount: 410,
    coverUrl: 'https://images.unsplash.com/photo-1522881193457-37ae97c905bf?w=500&q=80',
    avatarUrl: 'https://ui-avatars.com/api/?name=Eng&background=000000&color=fff&size=128'
  }
];

const SpaceView = () => {
  // Quản lý trạng thái nhóm đang được chọn
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);

  // Tìm nhóm đang được chọn dựa vào ID
  const selectedSpace = mockSpaces.find((space) => space.id === selectedSpaceId);

  // Handler xử lý chuyển đổi nhóm
  const handleSelectSpace = (id) => {
    setSelectedSpaceId(id);
  };

  const handleBackToList = () => {
    setSelectedSpaceId(null);
  };

  return (
    <div className="w-full min-h-[calc(100vh-50px)] bg-[#faf7f7]">
      <div className="max-w-[1300px] mx-auto px-4 pt-5 pb-10">
        <div className="flex items-start gap-6 lg:justify-between w-full">
          
          {/* Cột Trái (Left Sidebar) */}
          <div className="hidden lg:block lg:w-[280px] shrink-0 sticky top-[78px] h-[calc(100vh-78px)] overflow-y-auto hide-scrollbar">
            <SpaceSidebar 
              spaces={mockSpaces} 
              selectedSpace={selectedSpace} 
              onSelectSpace={handleSelectSpace} 
            />
          </div>

          {/* Phần chính (Main Content) */}
          <div className="w-full lg:flex-1 max-w-[950px] mx-auto">
            {selectedSpaceId === null ? (
              // Trạng thái 1: Lưới nhóm
              <SpaceGrid spaces={mockSpaces} onSelectSpace={handleSelectSpace} />
            ) : (
              // Trạng thái 2: Chi tiết nhóm (Feed)
              <SpaceFeed space={selectedSpace} onBack={handleBackToList} />
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SpaceView;
