const UserTab = ({ activeTab, onTabChange }) => {
  const tabs = ['Bài đăng', 'Người theo dõi', 'Đang theo dõi'];

  return (
    <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar mb-4 mt-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange && onTabChange(tab)}
          className={`whitespace-nowrap px-3 py-3 text-sm font-semibold transition-colors ${activeTab === tab
            ? 'text-[#b04f51] border-b-2 border-[#b04f51]'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default UserTab;
