import React, { useState, useRef, useEffect } from 'react';
import CommentInput from './CommentInput';

const PostCard = ({ author, avatarUrl, authorCredential, timeAgo, title, content, image, upvotes }) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const optionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionRef.current && !optionRef.current.contains(event.target)) {
        setIsOptionOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOptionOpen) {
        setIsOptionOpen(false);
      }
    };

    if (isOptionOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOptionOpen]);

  return (
    <div className="py-4 border-b border-gray-200">
      {/* Post Header */}
      <div className="flex items-start gap-2 mb-2">
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 cursor-pointer">
          <img src={avatarUrl} alt={`${author}'s Avatar`} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center text-[13px] text-gray-900 font-bold flex-wrap">
            <span className="cursor-pointer hover:underline">{author}</span>
            <span className="mx-1 font-normal text-gray-500">&middot;</span>
            <button className="text-blue-600 font-medium hover:underline text-[13px]">Theo dõi</button>
          </div>
          <div className="text-[13px] text-gray-500 line-clamp-1">
            {authorCredential} <span className="mx-1">&middot;</span> {timeAgo}
          </div>
        </div>
      </div>

      {/* Post Title & Content */}
      <h3 className="text-[15px] md:text-[16px] font-bold text-gray-900 mb-1 leading-snug hover:underline cursor-pointer">
        {title}
      </h3>
      <p className="text-[14px] md:text-[15px] text-gray-800 leading-normal mb-3">
        {content}
      </p>

      {/* Post Image (Optional) */}
      {image && (
        <div className="w-full rounded-md overflow-hidden mb-3 border border-gray-200 bg-gray-50">
          <img src={image} alt="Post attachment" className="w-full h-auto object-cover max-h-[300px] sm:max-h-[400px]" />
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between text-gray-500 mt-1">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <div className="flex rounded-full overflow-hidden border border-gray-200 bg-gray-50/50 flex-shrink-0">
            <button className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 transition-colors text-gray-600 hover:text-blue-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
              <span className="text-[13px] font-medium border-r border-gray-300 pr-2">{upvotes}</span>
            </button>
            <button className="flex items-center px-2 py-1.5 hover:bg-gray-100 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
            </button>
          </div>
          {/* Comment button */}
          <button
            onClick={() => setIsCommentOpen(!isCommentOpen)}
            className={`flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ${isCommentOpen ? 'bg-gray-100 text-blue-600' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </button>


          {/* Share button */}
          <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
          </button>
        </div>
        {/* Option button */}
        <div className='relative' ref={optionRef}>
          <button
            onClick={() => setIsOptionOpen(!isOptionOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
          </button>

          {/* Option Section */}
          {isOptionOpen && (
            <div className="absolute right-0 bottom-full mt-1 bg-white border border-gray-200 rounded shadow-md w-48 z-10">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit Post</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete Post</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Report Post</button>
            </div>
          )}
        </div>
      </div>

      {/* Comment Section */}
      {isCommentOpen && (
        <div className="mt-3 pt-2">
          {/* Add a comment input */}
          <CommentInput avatarUrl="https://ui-avatars.com/api/?name=User&background=dfb9b9&color=6a2f30" placeholder="Add a comment..." bgClass="bg-gray-50/80" />

          {/* Comments Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
            <span className="text-[14px] font-bold text-gray-800">Bình luận</span>
            <button className="flex items-center text-[13px] text-gray-500 font-medium hover:bg-gray-100 px-2 py-1 rounded">
              Recommended
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

          {/* Comments List (Mock) */}
          <div className="flex flex-col gap-4">

            {/* Comment Item 1 */}
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img src="https://ui-avatars.com/api/?name=Timothy+D&background=random" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center text-[13px] text-gray-900 border-l-[2px] border-blue-500 pl-2">
                  <span className="font-bold hover:underline cursor-pointer">Timothy DiGiuseppe</span>
                  <span className="mx-1 text-gray-500">&middot;</span>
                  <span className="text-gray-500">2y</span>
                </div>
                <p className="text-[14px] text-gray-800 mt-[2px] leading-snug pl-2">
                  A memorable example of appearance versus reality. Thank you!
                </p>
                {/* Comment Actions */}
                <div className="flex items-center gap-1 mt-1 text-gray-500 pl-2">
                  <div className="flex items-center rounded-full bg-gray-50/50 border border-transparent hover:bg-gray-100 border-gray-100">
                    <button className="flex items-center gap-1 px-2 py-1 transition-colors text-gray-600 hover:text-blue-600">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                      <span className="text-[12px] font-medium border-r border-gray-300 pr-2">2</span>
                    </button>
                    <button className="flex items-center px-2 py-1 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                    </button>
                  </div>
                  <button
                    onClick={() => setActiveReplyId(activeReplyId === 'comment1' ? null : 'comment1')}
                    className={`px-3 py-1 text-[13px] font-medium rounded transition-colors ml-1 ${activeReplyId === 'comment1' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
                    Reply
                  </button>
                  <button className="ml-auto p-1 rounded-full hover:bg-gray-100 text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                  </button>
                </div>

                {/* Active Reply Input for Comment 1 */}
                {activeReplyId === 'comment1' && (
                  <div className="mt-2 ml-2">
                    <CommentInput avatarUrl="https://ui-avatars.com/api/?name=User&background=dfb9b9&color=6a2f30" placeholder="Reply..." bgClass="bg-transparent" />
                  </div>
                )}

                {/* Nested Reply */}
                <div className="flex items-start gap-2 mt-3 mb-1 pl-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-0.5">
                    <img src={avatarUrl} alt="Author Reply" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col flex-1 border-l border-gray-200 pl-3 ml-1">
                    <div className="flex items-center text-[13px] text-gray-900">
                      <span className="font-bold hover:underline cursor-pointer">{author}</span>
                      <span className="mx-1 text-gray-500">&middot;</span>
                      <span className="text-[11px] bg-blue-100 text-blue-700 font-bold px-1 rounded mr-1">Author</span>
                      <span className="text-gray-500">&middot; 2y</span>
                    </div>
                    <p className="text-[14px] text-gray-800 mt-[2px] leading-snug">
                      Yes, thanks. I have to admit I was secretly pleased my Japanese was good enough to fool her ears.
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-gray-500">
                      <div className="flex items-center rounded-full bg-gray-50/50 border border-transparent hover:bg-gray-100 border-gray-100">
                        <button className="flex items-center gap-1 px-2 py-1 transition-colors text-gray-600 hover:text-blue-600">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                          <span className="text-[12px] font-medium border-r border-gray-300 pr-2">7</span>
                        </button>
                        <button className="flex items-center px-2 py-1 transition-colors border-r border-gray-300 pr-2 border-none">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                        </button>
                      </div>
                      <button
                        onClick={() => setActiveReplyId(activeReplyId === 'reply1' ? null : 'reply1')}
                        className={`px-3 py-1 text-[13px] font-medium rounded transition-colors ml-1 ${activeReplyId === 'reply1' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
                        Reply
                      </button>
                    </div>

                    {/* Active Reply Input for Reply 1 */}
                    {activeReplyId === 'reply1' && (
                      <div className="mt-2 text-gray-800">
                        <CommentInput avatarUrl="https://ui-avatars.com/api/?name=User&background=dfb9b9&color=6a2f30" placeholder="Reply..." bgClass="bg-transparent" />
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
