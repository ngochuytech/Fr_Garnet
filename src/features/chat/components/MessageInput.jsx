import { useState, useRef } from 'react';

/**
 * MessageInput.jsx
 * Thanh nhập tin nhắn ở dưới cùng cửa sổ chat.
 * Props:
 *   - onSend: (content: string) => void
 *   - disabled: boolean
 */
const MessageInput = ({ onSend, disabled }) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setContent('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    // Gửi bằng Enter, xuống dòng bằng Shift + Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-grow textarea
  const handleInput = (e) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    setContent(el.value);
  };

  const canSend = content.trim().length > 0 && !disabled;

  return (
    <div className="px-4 py-3 border-t border-gray-100 bg-white">
      <div
        className={`flex items-end gap-2 rounded-2xl border px-3 py-2 transition-colors ${
          disabled ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 focus-within:border-[#b04f51]'
        }`}
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? 'Chọn một cuộc trò chuyện...' : 'Nhập tin nhắn...'}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none leading-relaxed overflow-hidden"
          style={{ minHeight: '22px', maxHeight: '120px' }}
        />

        <button
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Gửi tin nhắn"
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 ${
            canSend
              ? 'text-white shadow-md hover:opacity-90 active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          style={canSend ? { backgroundColor: 'var(--color-dusty-rose-600)' } : {}}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
      <p className="text-[10px] text-gray-400 mt-1 text-right">
        Enter để gửi · Shift+Enter xuống dòng
      </p>
    </div>
  );
};

export default MessageInput;
