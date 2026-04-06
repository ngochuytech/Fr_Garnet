import { useProfileDescriptionEditor } from '../../hooks/useProfileDescriptionEditor';

const ProfileDescriptionEditor = () => {
  const {
    editorRef,
    contentRef,
    isEditingDesc,
    setIsEditingDesc,
    description,
    showFormatBar,
    setShowFormatBar,
    hasText,
    isFocused,
    setIsFocused,
    charCount,
    isExpanded,
    setIsExpanded,
    showSeeMore,
    handleLink,
    insertQuote,
    insertCode,
    insertMath,
    handleUpdate,
    openEditor,
    handleEditorInput,
    applyFormat, } = useProfileDescriptionEditor();
  return (
    <div className="mb-6">
      {isEditingDesc ? (
        <div className="border border-gray-300 rounded-xl overflow-hidden flex flex-col shadow-sm bg-white">
          {/* Text Editor Area */}
          <div className="relative">
            {(!hasText && !isFocused) && (
              <div className="absolute top-0 left-0 w-full pointer-events-none text-gray-400 text-[15px] p-3 mt-0.5">
                Write a description about yourself...
              </div>
            )}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning={true}
              onInput={handleEditorInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full min-h-[120px] max-h-[400px] p-3 text-[15px] text-gray-800 outline-none overflow-y-auto wysiwyg-editor break-words whitespace-pre-wrap mt-0.5"
            />
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-1 text-gray-500 overflow-x-auto no-scrollbar">
              {!showFormatBar ? (
                <>
                  <button onMouseDown={(e) => { e.preventDefault(); setShowFormatBar(true); }} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors" title="Format">
                    <span className="font-serif font-bold text-[15px] px-1 text-gray-600">Aa</span>
                  </button>
                  <button onMouseDown={(e) => e.preventDefault()} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors" title="Add image">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-1">
                  <button onMouseDown={(e) => { e.preventDefault(); setShowFormatBar(false); }} className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 rounded-full transition-colors shrink-0" title="Hide format">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                  </button>
                  <div className="flex items-center gap-0.5 text-gray-600 ml-1">
                    <button onMouseDown={(e) => applyFormat(e, 'bold')} className="hover:bg-gray-100 rounded-md transition-colors font-serif font-bold text-[15px] w-7 h-7 flex items-center justify-center" title="Bold"><span className="leading-none">B</span></button>
                    <button onMouseDown={(e) => applyFormat(e, 'italic')} className="hover:bg-gray-100 rounded-md transition-colors font-serif italic font-bold text-[15px] w-7 h-7 flex items-center justify-center" title="Italic"><span className="leading-none">I</span></button>
                    <button onMouseDown={(e) => applyFormat(e, 'insertOrderedList')} className="hover:bg-gray-100 rounded-md transition-colors shrink-0 w-7 h-7 flex items-center justify-center" title="Numbered List">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><line x1="4" y1="6" x2="4.01" y2="6" /><line x1="4" y1="12" x2="4.01" y2="12" /><line x1="4" y1="18" x2="4.01" y2="18" /></svg>
                    </button>
                    <button onMouseDown={(e) => applyFormat(e, 'insertUnorderedList')} className="hover:bg-gray-100 rounded-md transition-colors shrink-0 w-7 h-7 flex items-center justify-center" title="Bulleted List">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                    </button>
                    <button onMouseDown={handleLink} className="hover:bg-gray-100 rounded-md transition-colors shrink-0 w-7 h-7 flex items-center justify-center" title="Link">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    </button>
                    <button onMouseDown={insertQuote} className="hover:bg-gray-100 rounded-md transition-colors font-serif font-bold text-[18px] shrink-0 w-7 h-7 flex items-center justify-center" title="Quote"><span className="leading-none mt-2">”</span></button>
                    <button onMouseDown={insertCode} className="hover:bg-gray-100 rounded-md transition-colors font-mono font-bold text-[14px] shrink-0 w-7 h-7 flex items-center justify-center" title="Code"><span className="leading-none">{`{}`}</span></button>
                    <button onMouseDown={insertMath} className="hover:bg-gray-100 rounded-md transition-colors font-serif font-bold text-[15px] shrink-0 w-7 h-7 flex items-center justify-center" title="Math"><span className="leading-none">Σ</span></button>
                    <button onMouseDown={(e) => applyFormat(e, 'undo')} className="hover:bg-gray-100 rounded-md transition-colors shrink-0 w-7 h-7 flex items-center justify-center" title="Undo">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (charCount <= 1000) handleUpdate();
                }}
                disabled={charCount > 1000}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${charCount > 1000 ? 'bg-blue-300 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                Update
              </button>
              <button
                onMouseDown={(e) => { e.preventDefault(); setIsEditingDesc(false); }}
                className="text-gray-500 hover:bg-gray-200/50 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
            <div className={`text-xs font-medium ${charCount > 1000 ? 'text-red-500' : 'text-gray-500'}`}>
              {charCount} / 1000 chữ
            </div>
          </div>
        </div>
      ) : (
        <div className="group">
          {description ? (
            <div className="relative">
              <div
                ref={contentRef}
                className={`text-gray-800 text-[15px] whitespace-pre-wrap leading-relaxed wysiwyg-content transition-all duration-300 ${!isExpanded ? 'max-h-[400px] overflow-hidden' : ''}`}
                dangerouslySetInnerHTML={{ __html: description }}
              />
              {showSeeMore && !isExpanded && (
                <div className="absolute top-[350px] left-0 w-full h-[50px] bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}

              <div className="mt-2 flex items-center gap-4">
                {showSeeMore && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {isExpanded ? 'Thu gọn' : 'Xem thêm...'}
                  </button>
                )}
                <p
                  onClick={openEditor}
                  className="text-gray-500 text-sm cursor-pointer hover:underline inline-block opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Edit description
                </p>
              </div>
            </div>
          ) : (
            <p
              onClick={openEditor}
              className="text-gray-500 hover:text-gray-800 text-sm cursor-pointer hover:underline underline-offset-2 transition-colors font-medium"
            >
              Hãy viết mô tả về bản thân bạn
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDescriptionEditor;
