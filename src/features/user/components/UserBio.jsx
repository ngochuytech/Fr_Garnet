import React, { useState, useEffect, useRef } from 'react';

const UserBio = ({ bio }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (bio && contentRef.current) {
      const isOverflowing = contentRef.current.scrollHeight > 300;
      setShowSeeMore(isOverflowing);
    }
  }, [bio]);

  if (!bio) return null;

  return (
    <div className="mb-6 group">
      <div className="relative">
        <div
          ref={contentRef}
          className={`text-gray-800 text-[15px] whitespace-pre-wrap break-words break-all leading-relaxed wysiwyg-content w-full bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4 ${!isExpanded ? 'max-h-[300px] overflow-hidden' : ''}`}
          dangerouslySetInnerHTML={{ __html: bio }}
        />
        {showSeeMore && !isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-[60px] bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent pointer-events-none rounded-b-xl border-b border-gray-100" />
        )}

        <div className="mt-2 flex items-center gap-4 relative z-10">
          {showSeeMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium focus:outline-none ml-1"
            >
              {isExpanded ? 'Thu gọn' : 'Xem thêm...'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBio;
