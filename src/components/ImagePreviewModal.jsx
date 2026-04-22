import { useEffect } from 'react';

export const ImagePreviewModal = ({ imageUrl, onClose }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && onClose) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!imageUrl) return null;

    return (
        <div 
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4"
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-[1010]"
                onClick={onClose}
                title="Đóng"
            >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <img 
                src={imageUrl} 
                alt="Enlarged preview" 
                className="max-w-full max-h-full object-contain select-none cursor-default"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
};
