import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { getTags } from '../../services/metadataService';
import { updateProfile, updateTopics } from '../../services/profileSerivce';
import { toast } from 'sonner';

const TopicsModal = ({ isOpen, onClose }) => {
    const { user, updateUser } = useAuth();
    const [availableTopics, setAvailableTopics] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedTopics(user?.topics || []);
            setSearchTerm('');
            setIsLoading(true);
            getTags()
                .then(data => setAvailableTopics(data || []))
                .catch(err => {
                    console.error("Failed to fetch topics:", err);
                    toast.error("Không thể tải danh sách chủ đề.");
                })
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, user?.topics]);

    // Handle clicks outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTopic = (topic) => {
        if (selectedTopics.includes(topic)) {
            setSelectedTopics(prev => prev.filter(t => t !== topic));
        } else {
            setSelectedTopics(prev => [...prev, topic]);
        }
        setSearchTerm('');
        setShowDropdown(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateTopics(selectedTopics);
            updateUser({ topics: selectedTopics });
            toast.success("Đã cập nhật chủ đề quan tâm thành công!");
            onClose();
        } catch (error) {
            console.error("Failed to update topics:", error);
            toast.error("Có lỗi xảy ra khi cập nhật.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    // Filter topics: omit already selected ones and match search term
    const filteredTopics = availableTopics.filter(topic =>
        topic.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedTopics.includes(topic)
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white rounded-xl w-full max-w-lg shadow-2xl flex flex-col h-full max-h-[80vh] overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Chủ đề bạn quan tâm</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 overflow-y-auto">
                    <p className="text-[15px] text-gray-600 mb-6 leading-relaxed">
                        Chủ đề là cách CampusHub biết những bài viết nào cần gửi đến bạn. Hãy càng toàn diện và cụ thể càng tốt để nhận được những bài viết phù hợp nhất.
                    </p>

                    <div className="relative" ref={dropdownRef}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Add topic"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-[15px] transition-colors"
                            />
                        </div>

                        {/* Search Dropdown */}
                        {showDropdown && searchTerm && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                {isLoading ? (
                                    <div className="p-3 text-sm text-gray-500 text-center">Loading topics...</div>
                                ) : filteredTopics.length > 0 ? (
                                    filteredTopics.map((topic, index) => (
                                        <div
                                            key={index}
                                            onClick={() => toggleTopic(topic)}
                                            className="px-4 py-2.5 text-[15px] hover:bg-blue-50 cursor-pointer text-gray-700 transition-colors"
                                        >
                                            {topic}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-3 text-sm text-gray-500 text-center">No matching topics found</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Selected Topics */}
                    <div className="space-y-1 mt-4">
                        {selectedTopics.map((topic, index) => (
                            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group border border-transparent shadow-sm bg-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center font-bold text-red-700 text-xs shadow-inner">
                                        {topic.slice(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-[15px] font-medium text-gray-800">{topic}</span>
                                </div>
                                <button
                                    onClick={() => toggleTopic(topic)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        ))}
                        {selectedTopics.length === 0 && (
                            <p className="text-sm text-gray-500 mt-4 italic">You haven't selected any topics yet.</p>
                        )}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-[15px] font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-colors mr-3"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 text-[15px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-md focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default TopicsModal;
