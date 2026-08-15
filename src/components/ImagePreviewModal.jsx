import { useEffect, useState, useCallback } from 'react';

export const ImagePreviewModal = ({ imageUrl, images, initialIndex = 0, onClose }) => {
    // Support both single image (legacy) and array mode
    const imageList = images && images.length > 0 ? images : (imageUrl ? [imageUrl] : []);
    const [currentIndex, setCurrentIndex] = useState(
        images && images.length > 0 ? initialIndex : 0
    );

    const goPrev = useCallback((e) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
    }, [imageList.length]);

    const goNext = useCallback((e) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % imageList.length);
    }, [imageList.length]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose?.();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, goPrev, goNext]);

    if (imageList.length === 0) return null;

    const hasMuliple = imageList.length > 1;

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/92 select-none"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors z-[1010]"
                onClick={onClose}
                title="Đóng"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            {/* Image counter */}
            {hasMuliple && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-[13px] font-semibold z-[1010]">
                    {currentIndex + 1} / {imageList.length}
                </div>
            )}

            {/* Prev button */}
            {hasMuliple && (
                <button
                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors z-[1010]"
                    onClick={goPrev}
                    title="Ảnh trước"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
            )}

            {/* Image */}
            <img
                key={currentIndex}
                src={imageList[currentIndex]}
                alt={`Ảnh ${currentIndex + 1}`}
                className="max-w-[calc(100vw-80px)] max-h-[calc(100vh-80px)] object-contain rounded-md cursor-default"
                onClick={(e) => e.stopPropagation()}
                draggable={false}
            />

            {/* Next button */}
            {hasMuliple && (
                <button
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors z-[1010]"
                    onClick={goNext}
                    title="Ảnh tiếp theo"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
            )}

            {/* Dot indicators */}
            {hasMuliple && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-[1010]">
                    {imageList.map((_, i) => (
                        <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
