import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMajors, getTags } from '../features/profile/services/metadataService';
import { setupProfile } from '../features/profile/services/profileSerivce';
import { toast } from 'sonner';

const OnboardingPage = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1 = Major, 2 = Hobbies
    const [majors, setMajors] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If user already completed onboarding, redirect them
    useEffect(() => {
        if (user && user.department) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    // Fetch majors and tags on mount
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [majorsData, tagsData] = await Promise.all([getMajors(), getTags()]);
                setMajors(majorsData || []);
                setTags(tagsData || []);
            } catch (error) {
                console.error('Failed to fetch metadata:', error);
                toast.error('Có lỗi xảy ra khi lấy dữ liệu hệ thống.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchMetadata();
    }, []);

    const toggleTag = (tag) => {
        const tagName = tag.topicName || tag;
        if (selectedTags.includes(tagName)) {
            setSelectedTags(selectedTags.filter((t) => t !== tagName));
        } else {
            setSelectedTags([...selectedTags, tagName]);
        }
    };

    const handleNext = () => {
        if (!selectedMajor) {
            toast.error('Vui lòng chọn chuyên ngành của bạn.');
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedTags.length < 3) {
            toast.error('Vui lòng chọn ít nhất 3 sở thích.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                major: selectedMajor,
                hobbies: selectedTags,
            };
            await setupProfile(payload);
            toast.success('Hồ sơ đã được thiết lập thành công!');
            updateUser({ department: selectedMajor });
            navigate('/home', { replace: true });
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span className="text-sm font-medium text-slate-500">Đang tải dữ liệu...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                
                {/* Header & Progress */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-white relative">
                    <h2 className="text-3xl font-bold tracking-tight">Thiết lập hồ sơ 👋</h2>
                    <p className="mt-2 text-blue-100 mb-6 text-lg">
                        Hãy cho chúng mình biết thêm một chút về bạn nhé.
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mt-8 relative">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-white/20">
                            <div 
                                style={{ width: step === 1 ? '50%' : '100%' }} 
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white transition-all duration-500 ease-in-out"
                            ></div>
                        </div>
                        <div className="flex justify-between text-sm font-medium text-blue-100">
                            <span className={step >= 1 ? 'text-white' : ''}>1. Chuyên ngành</span>
                            <span className={step >= 2 ? 'text-white' : ''}>2. Sở thích</span>
                        </div>
                    </div>
                </div>

                {/* Body Content */}
                <div className="px-8 py-10 min-h-[350px] flex flex-col">
                    {step === 1 && (
                        <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 w-full text-center">Chuyên ngành của bạn là gì?</h3>
                            <div className="max-w-md mx-auto">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Chuyên ngành đang theo học <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedMajor}
                                    onChange={(e) => setSelectedMajor(e.target.value)}
                                    className="block w-full px-4 py-4 text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 text-slate-900 shadow-sm"
                                    required
                                >
                                    <option value="" disabled>-- Chọn chuyên ngành --</option>
                                    {majors.map((major) => (
                                        <option key={major} value={major}>
                                            {major}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Sở thích của bạn là gì?</h3>
                                    <p className="text-sm text-slate-500 mt-1">Chọn ít nhất 3 thẻ đam mê để kết nối dễ dàng hơn.</p>
                                </div>
                                <span className={`mt-3 md:mt-0 text-sm font-medium px-3 py-1.5 rounded-full ${selectedTags.length >= 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    Đã chọn {selectedTags.length}/3
                                </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 max-h-[350px] overflow-y-auto p-4 border border-slate-100 rounded-2xl bg-slate-50 relative">
                                {tags.map((tag) => {
                                    const tagName = tag.topicName || tag;
                                    const isSelected = selectedTags.includes(tagName);
                                    return (
                                        <button
                                            key={tagName}
                                            type="button"
                                            onClick={() => toggleTag(tag)}
                                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 
                                            ${isSelected 
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105 border-transparent' 
                                                : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm'
                                            }`}
                                        >
                                            {tagName}
                                        </button>
                                    );
                                })}
                                {tags.length === 0 && (
                                    <div className="w-full text-center text-slate-500 py-8 text-sm">
                                        Không có dữ liệu sở thích.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center rounded-b-3xl">
                    {step === 1 ? (
                        <div className="w-full relative flex justify-end">
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={!selectedMajor}
                                className="px-8 py-3.5 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                Tiếp tục
                            </button>
                        </div>
                    ) : (
                        <div className="w-full flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                disabled={isSubmitting}
                                className="px-6 py-3.5 rounded-xl text-slate-700 font-semibold bg-white border border-slate-200 hover:bg-slate-100 focus:ring-4 focus:ring-slate-100 transition-all disabled:opacity-50"
                            >
                                Quay lại
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting || selectedTags.length < 3}
                                className="px-8 py-3.5 flex items-center justify-center rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md min-w-[200px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                        </svg>
                                        Đang lưu...
                                    </>
                                ) : (
                                    'Hoàn tất thiết lập'
                                )}
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default OnboardingPage;
