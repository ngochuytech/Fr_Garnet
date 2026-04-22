import { useAuth } from "../context/AuthContext";
/**
 * SharePostModal — Modal chia sẻ bài viết tái sử dụng.
 *
 * Props:
 *  - isOpen          : boolean              — hiển thị / ẩn modal
 *  - onClose         : () => void           — đóng modal
 *  - quotedPost      : { authorAvatar, authorName, department, createdAt, content }
 *                        — thông tin bài viết được quote bên trong modal
 *  - editorRef       : React.RefObject      — ref của contentEditable editor
 *  - hasText         : boolean              — editor có nội dung
 *  - isFocused       : boolean              — editor đang được focus
 *  - setIsFocused    : (v: boolean) => void
 *  - handleInput     : () => void           — callback khi gõ vào editor
 *  - applyFormat     : (e, cmd, val?) => void
 *  - handleLink      : (e) => void
 *  - showFormatBar   : boolean
 *  - setShowFormatBar: (v: boolean) => void
 *  - isSharing       : boolean              — đang trong quá trình gọi API
 *  - handleSharePost : () => void           — gọi API chia sẻ
 *  - zIndex          : string (optional)    — Tailwind class z-index, mặc định 'z-[110]'
 *  - formatTimeAgo   : (dateStr) => string  — hàm định dạng thời gian
 */

const formatTimeAgoDefault = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
};

const SharePostModal = ({
  isOpen,
  onClose,
  quotedPost,
  editorRef,
  hasText,
  isFocused,
  setIsFocused,
  handleInput,
  applyFormat,
  handleLink,
  showFormatBar,
  setShowFormatBar,
  isSharing,
  handleSharePost,
  zIndex = 'z-[110]',
  formatTimeAgo = formatTimeAgoDefault,
}) => {
  if (!isOpen) return null;

  const { user: currentUser } = useAuth();

  return (
    <div className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4 bg-[#242424]/80 backdrop-blur-[2px] transition-opacity`}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[620px] overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="relative flex items-center justify-center border-b border-gray-100 py-3 px-4">
          <button
            onClick={onClose}
            className="absolute left-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="font-bold text-[16px] text-gray-900">Chia sẻ bài viết</span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
          {/* User placeholder */}
          <div className="flex items-start gap-2 mb-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={currentUser.avatarUrl}
                alt="Current User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-[15px] text-gray-900 leading-tight">Bạn</span>
            </div>
          </div>

          {/* Editor */}
          <div className="relative mb-4">
            {!hasText && !isFocused && (
              <div className="absolute top-0 left-0 w-full pointer-events-none text-gray-500 text-[15px] pt-1">
                Nói gì đó về bài viết này...
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

          {/* Quoted post preview */}
          {quotedPost && (
            <div className="border-l-4 border-gray-200 p-3 mb-2 hover:bg-gray-50/50 transition-colors rounded-r-md">
              <div className="flex items-center gap-2 mb-1 text-[12px] text-gray-500">
                <img
                  src={
                    quotedPost.authorAvatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(quotedPost.authorName)}&background=dfb9b9&color=6a2f30`
                  }
                  alt={quotedPost.authorName}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span className="font-bold text-gray-900">{quotedPost.authorName}</span>
                {quotedPost.department && (
                  <>
                    <span>&middot;</span>
                    <span>{quotedPost.department}</span>
                  </>
                )}
                <span>&middot;</span>
                <span>{formatTimeAgo(quotedPost.createdAt)}</span>
              </div>
              <div
                className="text-[14px] text-gray-700 line-clamp-3 wysiwyg-editor"
                dangerouslySetInnerHTML={{ __html: quotedPost.content }}
              />
              {quotedPost.images && quotedPost.images.length > 0 && (
                <div className={`grid gap-1 mt-2 ${quotedPost.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {quotedPost.images.map((imgUrl, i) => (
                    <div key={i} className="w-full rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={imgUrl} alt={`Quoted post attachment ${i}`} className="w-full h-auto object-cover max-h-[150px]" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-white mt-auto">
          {/* Format bar */}
          <div className="flex items-center text-gray-500 overflow-x-auto no-scrollbar">
            {!showFormatBar ? (
              <div className="flex items-center gap-1">
                <button
                  onMouseDown={(e) => { e.preventDefault(); setShowFormatBar(true); }}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                  title="Format"
                >
                  <span className="font-serif font-bold text-[16px] text-gray-600">Aa</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-gray-50 rounded-full px-1 py-1 border border-gray-200">
                <button
                  onMouseDown={(e) => { e.preventDefault(); setShowFormatBar(false); }}
                  className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 rounded-full transition-colors shrink-0"
                  title="Hide format"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div className="w-px h-5 bg-gray-300 mx-0.5" />
                <button onMouseDown={(e) => applyFormat(e, 'bold')} className="hover:bg-gray-200 rounded-full transition-colors font-serif font-bold text-[14px] w-7 h-7 flex items-center justify-center text-gray-700" title="Bold">
                  <span className="leading-none">B</span>
                </button>
                <button onMouseDown={(e) => applyFormat(e, 'italic')} className="hover:bg-gray-200 rounded-full transition-colors font-serif italic font-bold text-[14px] w-7 h-7 flex items-center justify-center text-gray-700" title="Italic">
                  <span className="leading-none">I</span>
                </button>
                <button onMouseDown={(e) => applyFormat(e, 'insertOrderedList')} className="hover:bg-gray-200 rounded-full transition-colors shrink-0 w-7 h-7 flex items-center justify-center text-gray-700" title="Numbered List">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
                    <line x1="4" y1="6" x2="4.01" y2="6" /><line x1="4" y1="12" x2="4.01" y2="12" /><line x1="4" y1="18" x2="4.01" y2="18" />
                  </svg>
                </button>
                <button onMouseDown={(e) => applyFormat(e, 'insertUnorderedList')} className="hover:bg-gray-200 rounded-full transition-colors shrink-0 w-7 h-7 flex items-center justify-center text-gray-700" title="Bulleted List">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
                <button onMouseDown={handleLink} className="hover:bg-gray-200 rounded-full transition-colors shrink-0 w-7 h-7 flex items-center justify-center text-gray-700" title="Link">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Share submit button */}
          <button
            onClick={handleSharePost}
            disabled={isSharing}
            className={`px-6 py-2 text-[14px] font-bold text-white rounded-full transition-colors shadow-sm ml-2 ${isSharing ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-95'}`}
            style={{ backgroundColor: 'var(--color-dusty-rose-600)' }}
          >
            {isSharing ? 'Đang chia sẻ...' : 'Share'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SharePostModal;
