import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import OAuth2Callback from './features/auth/components/OAuth2Callback'
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import FollowingPage from './pages/FollowingPage';
import NotificationPage from './pages/NotificationPage';
import SpacePage from './pages/SpacePage';
import OnboardingPage from './pages/OnboardingPage';
import TopicPage from './pages/TopicPage';
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage';
import ProtectedRoute from './components/ProtectedRoute';

import { useAuth } from './context/AuthContext';
import ReportManagement from './features/admin/components/ReportManagement';
import UserManagement from './features/admin/components/UserManagement';
import UserDetailPage from './features/admin/components/UserDetailPage';
import AdminLayout from './layouts/AdminLayout';

// Component điều hướng thông minh cho đường dẫn không tồn tại
const NotFoundRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/home" : "/login"} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors duration={3000} />
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/oauth2/callback/google" element={<OAuth2Callback />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/reports" replace />} />
            <Route path="reports" element={<ReportManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="users/:userId" element={<UserDetailPage />} />
            {/* Thêm các trang quản trị khác ở đây */}
          </Route>


          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            {/* App main layout routes */}
            <Route element={<MainLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/following" element={<FollowingPage />} />
              <Route path="/spaces" element={<SpacePage />} />
              <Route path="/notifications" element={<NotificationPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/user/:id" element={<UserPage />} />
              <Route path="/topic/:topicName" element={<TopicPage />} />
              <Route path="/post/:id" element={<PostPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
