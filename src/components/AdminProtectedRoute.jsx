import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardStatsAPI } from '../features/admin/services/dashboardService';

const AdminProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAdminAccess = async () => {
            if (!isAuthenticated) return;
            try {
                // Gọi API của admin để kiểm tra quyền
                await getDashboardStatsAPI();
                setIsAuthorized(true);
            } catch (error) {
                setIsAuthorized(false);
            } finally {
                setIsChecking(false);
            }
        };

        if (!isLoading) {
            if (isAuthenticated) {
                checkAdminAccess();
            } else {
                setIsChecking(false);
            }
        }
    }, [isAuthenticated, isLoading]);

    if (isLoading || isChecking) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8f9fb]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAuthorized) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8f9fb] font-sans">
                <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            <path d="M12 8v4"/><path d="M12 16h.01"/>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Truy cập bị từ chối</h1>
                    <p className="text-[15px] text-gray-500 mb-8 leading-relaxed">
                        Bạn không có quyền truy cập vào khu vực quản trị viên. Vui lòng quay lại.
                    </p>
                    <Link 
                        to="/home" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 hover:-translate-y-0.5 transition-all duration-200 shadow-md shadow-gray-200"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        Về Trang Chủ
                    </Link>
                </div>
            </div>
        );
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
