import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import DashboardLayout from '@/layouts/DashboardLayout';
import LoginForm from '@/features/auth/LoginForm';
import RegisterForm from '@/features/auth/RegisterForm';
import ForgotPassword from '@/features/auth/ForgotPassword';
import ResetPassword from '@/features/auth/ResetPassword';
import DashboardPlaceholder from '@/features/academic/DashboardPlaceholder';
import AcademicLayout from '@/features/academic/AcademicLayout';
import NotesList from '@/features/academic/NotesList';
import QuestionList from '@/features/qna/QuestionList';
import QuestionDetail from '@/features/qna/QuestionDetail';
import ChatPage from '@/features/chat/ChatPage';
import ProfilePage from '@/features/profile/ProfilePage';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPlaceholder />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="notes"
              element={
                <AcademicLayout>
                  <NotesList />
                </AcademicLayout>
              }
            />
            <Route
              path="qna"
              element={
                <AcademicLayout>
                  <QuestionList />
                </AcademicLayout>
              }
            />
            <Route
              path="qna/:questionId"
              element={
                <AcademicLayout>
                  <QuestionDetail />
                </AcademicLayout>
              }
            />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
