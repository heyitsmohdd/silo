import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
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
import { AuthModal } from '@/features/auth/AuthModal';
import ThemeToggle from '@/components/ui/ThemeToggle';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Landing page with AuthModal
const LandingPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Hero Content */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="size-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-serif font-bold text-3xl">S</span>
            </div>
            <span className="font-serif text-4xl font-bold text-foreground">Silo</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Batch's Study Space
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Share notes, ask questions, and collaborate with classmates from your exact year and branch.
          </p>
        </div>

        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg"
        >
          Get Started
        </button>

        <p className="text-xs text-muted-foreground mt-8">
          Batch-Isolated Academic Vault
        </p>
      </div>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

// Protected Route wrapper with modal fallback
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/welcome" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/welcome" element={<LandingPage />} />

          {/* Public Routes (kept for direct access) */}
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
