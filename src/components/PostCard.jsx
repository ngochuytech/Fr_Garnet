import { usePostCard } from '../hooks/usePostCard';
import CommentInput from './CommentInput';

const PostCard = ({ author, avatarUrl, authorCredential, timeAgo, title, content, image, upvotes }) => {
  const {
    isCommentOpen, toggleComment,
    activeReplyId, setActiveReplyId,
    isOptionOpen, toggleOption, optionRef,
    isShareModalOpen, openShareModal, closeShareModal,
    sharePrivacy,
    isFocused, setIsFocused,
    hasText,
    showFormatBar, setShowFormatBar,
    editorRef,
    handleInput, applyFormat, handleLink, 
  } = usePostCard();

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
      <h3 className="text-[15px] md:text-[16px] font-bold text-gray-900 mb-1 leading-snug cursor-pointer">
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
              <span className="text-[13px] font-medium">{upvotes}</span>
            </button>
            <button className="flex items-center px-3 py-1.5 border-l border-gray-300 hover:bg-gray-100 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
            </button>
          </div>
          {/* Comment button */}
          <button
            onClick={toggleComment}
            className={`flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ${isCommentOpen ? 'bg-gray-100 text-blue-600' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </button>


          {/* Share button */}
          <button 
            onClick={openShareModal}
            className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
          </button>
        </div>
        {/* Option button */}
        <div className='relative' ref={optionRef}>
          <button
            onClick={toggleOption}
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
          <CommentInput 
            avatarUrl="https://ui-avatars.com/api/?name=User&background=dfb9b9&color=6a2f30" 
            placeholder="Add a comment..." 
            bgClass="bg-gray-50/80"
            toggleComment={toggleComment} />

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
                    <CommentInput avatarUrl="https://ui-avatars.com/api/?name=User&background=dfb9b9&color=6a2f30" placeholder="Reply..." bgClass="bg-transparent" toggleComment={toggleComment}/>
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

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#242424]/80 backdrop-blur-[2px] transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[620px] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="relative flex items-center justify-center border-b border-gray-100 py-3 px-4">
              {/* Close Button */}
              <button onClick={closeShareModal} className="absolute left-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              {/* Privacy Dropdown */}
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 text-[14px] font-bold text-gray-700 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                {sharePrivacy}
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
              {/* User Info */}
              <div className="flex items-start gap-2 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img src="https://ui-avatars.com/api/?name=Huy+Nguyen&background=dfb9b9&color=6a2f30" alt="Current User" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[15px] text-gray-900 leading-tight">Huy Nguyễn</span>
                  <button className="flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full border border-gray-300 text-[13px] text-gray-600 hover:bg-gray-50">
                    knows Vietnamese
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
              </div>

              {/* Text Editor */}
              <div className="relative mb-4">
                {(!hasText && !isFocused) && (
                  <div className="absolute top-0 left-0 w-full pointer-events-none text-gray-500 text-[15px] pt-1">
                    Say something about this...
                  </div>
                )}
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleInput}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full min-h-[40px] max-h-[200px] text-[15px] text-gray-800 outline-none overflow-y-auto wysiwyg-editor break-words whitespace-pre-wrap pt-1"
                />
              </div>

              {/* Quoted Post */}
              <div className="border-l-3 border-gray-200 p-3 sm:p-4 mb-2 hover:bg-gray-50/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-2 text-gray-500 text-[13px]">
                  <img src={avatarUrl} alt={author} className="w-5 h-5 rounded-full object-cover" />
                  <span className="font-bold text-gray-900 ml-0.5">{author}</span>
                  <span>&middot;</span>
                  <span>{timeAgo}</span>
                </div>
                <h4 className="text-[15px] font-bold text-gray-900 mb-1.5 leading-snug">{title}</h4>
                <p className="text-[14px] text-gray-700 line-clamp-3 leading-normal">
                  {content}
                </p>
                {image && (
                   <div className="w-full rounded mt-2 border border-gray-100">
                     <img src={image} className="w-full h-auto max-h-[150px] object-cover rounded" />
                   </div>
                )}
              </div>
            </div>

            {/* Modal Footer / Formatter ToolBar */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-white mt-auto">
              {/* Format Bar */}
              <div className="flex items-center text-gray-500 overflow-x-auto no-scrollbar">
                {!showFormatBar ? (
                  <div className="flex items-center gap-1">
                    <button onMouseDown={(e) => { e.preventDefault(); setShowFormatBar(true); }} className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors" title="Format">
                      <span className="font-serif font-bold text-[16px] text-gray-600">Aa</span>
                    </button>
                    <button onMouseDown={(e) => e.preventDefault()} className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors" title="Add Image">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-gray-50 rounded-full px-1 py-1 border border-gray-200">
                    <button onMouseDown={(e) => { e.preventDefault(); setShowFormatBar(false); }} className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 rounded-full transition-colors shrink-0" title="Hide format">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <div className="w-px h-5 bg-gray-300 mx-0.5"></div>
                    <button onMouseDown={(e) => applyFormat(e, 'bold')} className="hover:bg-gray-200 rounded-full transition-colors font-serif font-bold text-[14px] w-7 h-7 flex items-center justify-center text-gray-700" title="Bold"><span className="leading-none">B</span></button>
                    <button onMouseDown={(e) => applyFormat(e, 'italic')} className="hover:bg-gray-200 rounded-full transition-colors font-serif italic font-bold text-[14px] w-7 h-7 flex items-center justify-center text-gray-700" title="Italic"><span className="leading-none">I</span></button>
                    <button onMouseDown={(e) => applyFormat(e, 'insertOrderedList')} className="hover:bg-gray-200 rounded-full transition-colors shrink-0 w-7 h-7 flex items-center justify-center text-gray-700" title="Numbered List">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><line x1="4" y1="6" x2="4.01" y2="6"/><line x1="4" y1="12" x2="4.01" y2="12"/><line x1="4" y1="18" x2="4.01" y2="18"/></svg>
                    </button>
                    <button onMouseDown={(e) => applyFormat(e, 'insertUnorderedList')} className="hover:bg-gray-200 rounded-full transition-colors shrink-0 w-7 h-7 flex items-center justify-center text-gray-700" title="Bulleted List">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    </button>
                    <button onMouseDown={handleLink} className="hover:bg-gray-200 rounded-full transition-colors shrink-0 w-7 h-7 flex items-center justify-center text-gray-700" title="Link">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Share Button (Save) */}
              <button className="px-6 py-2 text-[14px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors shadow-sm ml-2">
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
