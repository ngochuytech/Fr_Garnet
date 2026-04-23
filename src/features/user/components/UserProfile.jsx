import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../../utils/api';

import UserHeader from './UserHeader';
import UserBio from './UserBio';
import UserTab from './UserTab';
import UserPosts from './UserPosts';
import UserSidebar from './UserSidebar';

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Bài đăng');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const data = await apiFetch(`/users/profiles/${id}`, {
                    method: 'GET',
                });
                setProfileData(data);
            } catch (error) {
                console.error("Lỗi khi tải trang cá nhân:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUserProfile();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="w-full flex justify-center items-center py-20">
                <svg className="animate-spin h-8 w-8 text-[#8d3f41]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="w-full flex flex-col justify-center items-center py-20 gap-4">
                <h2 className="text-xl font-bold text-gray-700">Người dùng không tồn tại</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-[#8d3f41] text-white rounded-lg hover:bg-[#6a2f30]"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center py-6 px-4 bg-white">
            <div className="flex flex-col md:flex-row w-full max-w-[1300px] gap-8">

                {/* Left Column - Main Content */}
                <div className="flex-1 md:max-w-[850px] flex flex-col">
                    <UserHeader user={profileData} />
                    
                    <UserBio bio={profileData.bio} />

                    <UserTab activeTab={activeTab} onTabChange={setActiveTab} isOtherUser={true} />

                    {activeTab === 'Bài đăng' && <UserPosts userId={id} />}
                    {activeTab === 'Người theo dõi' && <div className="py-10 text-center text-gray-500">Chưa có người theo dõi</div>}
                    {activeTab === 'Đang theo dõi' && <div className="py-10 text-center text-gray-500">Chưa theo dõi ai</div>}
                </div>

                {/* Right Column - Sidebar */}
                <UserSidebar user={profileData} />

            </div>
        </div>
    );
};

export default UserProfile;