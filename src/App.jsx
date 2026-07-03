import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import OAuth2Callback from './features/auth/components/OAuth2Callback'
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import FollowingPage from './pages/FollowingPage';
import NotificationPage from './pages/NotificationPage';
import SpacePage from './pages/SpacePage';
import SpaceDetailPage from './pages/SpaceDetailPage';
import OnboardingPage from './pages/OnboardingPage';
import TopicPage from './pages/TopicPage';
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { useAuth } from './context/AuthContext';
import ReportManagement from './features/admin/components/ReportManagement';
import ReportDetailPage from './features/admin/components/ReportDetailPage';
import UserManagement from './features/admin/components/UserManagement';
import UserDetailPage from './features/admin/components/UserDetailPage';
import ContentModeration from './features/admin/components/ContentModeration';
import AdminLayout from './layouts/AdminLayout';
import ContentDetailPage from './features/admin/components/ContentDetailPage';
import Dashboard from './features/admin/components/Dashboard';
import AdminProfile from './features/admin/components/AdminProfile';
import AdminNotificationPage from './features/admin/components/AdminNotificationPage';

import GroupManagement from './features/admin/components/GroupManagement';
import NotFoundPage from './pages/NotFoundPage';


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
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/oauth2/callback/google" element={<OAuth2Callback />} />
          </Route>

          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="reports" element={<ReportManagement />} />
              <Route path="reports/:reportId" element={<ReportDetailPage />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="users/:userId" element={<UserDetailPage />} />
              <Route path="groups" element={<GroupManagement />} />
              <Route path="posts" element={<ContentModeration />} />
              <Route path="posts/:postId" element={<ContentDetailPage />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="notifications" element={<AdminNotificationPage />} />
              {/* Thêm các trang quản trị khác ở đây */}
            </Route>
          </Route>


          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            {/* App main layout routes */}
            <Route element={<MainLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/following" element={<FollowingPage />} />
              <Route path="/spaces" element={<SpacePage />} />
              <Route path="/spaces/:spaceId" element={<SpaceDetailPage />} />
              <Route path="/notifications" element={<NotificationPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/user/:id" element={<UserPage />} />
              <Route path="/topic/:topicName" element={<TopicPage />} />
              <Route path="/post/:id" element={<PostPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
