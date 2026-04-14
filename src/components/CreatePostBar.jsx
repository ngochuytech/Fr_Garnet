import { useCreatePostBar } from '../hooks/useCreatePostBar'
export const CreatePostBar = ({ avatarUrl, onPostCreated }) => {
    const { isExpanded,
        editorRef,
        isFocused,
        hasText,
        showFormatBar,
        setIsFocused,
        applyFormat,
        handleLink,
        setShowFormatBar,
        handleInput,
        handleSubmit,
        insertQuote,
        insertCode,
        insertMath,
    } = useCreatePostBar(onPostCreated);
    return (
        <div
            className={`flex flex-col gap-2 p-3 rounded-xl border transition-all cursor-text ${isExpanded
                ? 'border-[#d09596] bg-white shadow-sm'
                : 'border-gray-200 bg-white hover:border-[#dfb9b9]'
                }`}
            onClick={() => {
                if (!isExpanded && editorRef.current) {
                    editorRef.current.focus();
                }
            }}
        >
            <form className="flex items-start gap-3" onSubmit={handleSubmit}>
                <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 shadow-sm mt-0.5">
                    <img src={avatarUrl} alt="Your Avatar" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0 relative">
                    {(!hasText && !isFocused) && (
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none text-gray-400 text-[14px] mt-1.5">
                            Bạn đang nghĩ gì? Hỏi hoặc chia sẻ với cộng đồng...
                        </div>
                    )}
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleInput}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full bg-transparent border-none outline-none text-[15px] text-gray-800 overflow-y-auto wysiwyg-editor break-words whitespace-pre-wrap mt-1"
                        style={{
                            minHeight: isExpanded ? '60px' : '24px',
                            maxHeight: '400px'
                        }}
                    />
                </div>

                {/* Khi chưa expand, hiển thị nút Đăng thu nhỏ */}
                {!isExpanded && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                            onClick={handleSubmit}
                            disabled={!hasText}
                            className="px-3 py-1.5 text-[13px] font-semibold rounded-full text-white transition-colors shadow-sm cursor-not-allowed opacity-60"
                            style={{ backgroundColor: 'var(--color-dusty-rose-600)' }}
                        >
                            Đăng
                        </button>
                    </div>
                )}
            </form>

            {isExpanded && (
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-gray-500 overflow-x-auto no-scrollbar">
                        {!showFormatBar ? (
                            <>
                                <button onMouseDown={(e) => { e.preventDefault(); setShowFormatBar(true); }} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors" title="Format">
                                    <span className="font-serif font-bold text-[15px] px-1 text-gray-600">Aa</span>
                                </button>
                                <button onMouseDown={(e) => e.preventDefault()} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors" title="Thêm ảnh">
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
                    <button
                        onClick={handleSubmit}
                        disabled={!hasText}
                        className={`px-6 py-1.5 text-[14px] font-semibold rounded-full text-white transition-colors shadow-sm ${hasText ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-60'}`}
                        style={{ backgroundColor: 'var(--color-dusty-rose-600)' }}
                    >
                        Đăng
                    </button>
                </div>
            )}
        </div>
    );
};
