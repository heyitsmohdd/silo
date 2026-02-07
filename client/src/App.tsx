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
import NewLandingPage from '@/pages/LandingPage';

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Hero Content */}
      <div className="text-center max-w-xl mx-auto">
        {/* Logo Section */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-8">
            <div className="size-20 rounded-2xl bg-primary/10 dark:bg-primary/20 border-2 border-primary/20 flex items-center justify-center">
              <span className="text-primary font-serif font-bold text-4xl">S</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4 tracking-tight">
            Silo
          </h1>
          <p className="text-xl text-muted-foreground font-medium mb-2">
            Your Batch&apos;s Study Space
          </p>
          <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            Share notes, ask questions, and collaborate with classmates from your exact year and branch.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-8 py-3.5 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] text-base"
        >
          Get Started
        </button>

        <p className="text-xs text-muted-foreground mt-12 opacity-50">
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
          <Route path="/welcome" element={<NewLandingPage />} />

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
