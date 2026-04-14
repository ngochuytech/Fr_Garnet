import { useState, useEffect, use } from 'react';

const mockCredentials = [
    {
        id: 1,
        title: 'Biết Tiếng Việt',
        icon: (
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
        )
    },
    {
        id: 2,
        title: 'Học tại Đại học Bách Khoa Hà Nội',
        icon: (
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
        )
    },
    {
        id: 3,
        title: 'Sống tại Hà Nội',
        icon: (
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
    }
];

const HighlightModal = ({ isOpen, onClose, openCredentialModal }) => {
    const [choice, setChoice] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        setChoice(null);
        setShowDropdown(false);
    }, [isOpen]);

    const handleSelectOption = (type) => {
        onClose();
        setTimeout(() => {
            openCredentialModal(type);
        }, 150);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#242424]/80 backdrop-blur-[2px] transition-opacity"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-[620px] flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between h-14 border-b border-gray-200 px-6">
                    <h2 className="text-lg font-bold text-gray-900">Điểm nổi bật</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-visible p-6 relative min-h-[320px]">
                    <div className="relative inline-block">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className='h-7 rounded-full bg-white border-2 border-blue-500 hover:bg-blue-100 transition-colors flex items-center'
                        >
                            <span className="flex text-sm font-medium text-blue-600 px-4 py-1 gap-2 items-center">
                                Thêm thông tin
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </span>
                        </button>
                    
                        {showDropdown && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-2">
                                <button onClick={() => handleSelectOption('profile-focus')} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm xl:text-base text-gray-700 font-medium">Sở thích, kỹ năng, ngành học</button>
                                <button onClick={() => handleSelectOption('education')} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm xl:text-base text-gray-700 font-medium">Học vấn</button>
                                <button onClick={() => handleSelectOption('location')} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm xl:text-base text-gray-700 font-medium">Địa điểm</button>
                                <button onClick={() => handleSelectOption('language')} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm xl:text-base text-gray-700 font-medium">Ngoại ngữ</button>
                            </div>
                        )}
                    </div>
                    <div className='mt-8'>
                        <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Thông tin của bạn</h3>
                        <div className='border-t border-gray-200'>
                            {mockCredentials.map((cred) => (
                                <div key={cred.id} className="flex items-center gap-3 py-3.5 border-b border-gray-200 group">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        {cred.icon}
                                    </div>
                                    <div className="flex items-center text-[15px]">
                                        <span className="text-[15px] text-gray-800">{cred.title}</span>
                                        <span className="text-[12px] text-gray-400 mx-1.5">·</span>
                                        <span className="text-[12px] text-gray-400">Mặc định</span>
                                        <span className="text-[12px] text-gray-400 mx-1.5">·</span>
                                        <button className="text-[12px] text-gray-400 hover:underline transition-colors focus:outline-none">Chỉnh sửa</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighlightModal;