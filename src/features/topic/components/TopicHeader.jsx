const TopicHeader = ({ topicName, imageUrl, followerCount }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-2 shadow-sm flex items-start gap-4">
      {/* image */}
      <img
        src={imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
        alt={topicName}
        className="w-[100px] h-[100px] rounded-xl object-cover"
      />
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{topicName || "Topic Name"}</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100/80 hover:bg-gray-200 transition-colors rounded-full border border-gray-200 text-gray-600 text-[13px] font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
            Following · {followerCount != null ? followerCount : "1.1M"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default TopicHeader;
