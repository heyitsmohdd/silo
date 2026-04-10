import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useRegisterSW } from 'virtual:pwa-register/react';

import { useAuthStore } from '@/stores/useAuthStore';
import { siteConfig } from '@/config/site';

// Eagerly loaded (needed for initial render)
import DashboardLayout from '@/layouts/DashboardLayout';
import InstallPrompt from '@/components/InstallPrompt';

// Lazy-loaded route components — each becomes its own chunk
const NewLandingPage = lazy(() => import('@/pages/LandingPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const LegalPage = lazy(() => import('@/pages/LegalPage'));
const LoginForm = lazy(() => import('@/features/auth/LoginForm'));
const RegisterForm = lazy(() => import('@/features/auth/RegisterForm'));
const ForgotPassword = lazy(() => import('@/features/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/features/auth/ResetPassword'));
const RequestAccess = lazy(() => import('@/pages/RequestAccess'));
const DashboardPlaceholder = lazy(() => import('@/features/academic/DashboardPlaceholder'));
const AcademicLayout = lazy(() => import('@/features/academic/AcademicLayout'));
const NotesList = lazy(() => import('@/features/academic/NotesList'));
const QuestionList = lazy(() => import('@/features/qna/QuestionList'));
const QuestionDetail = lazy(() => import('@/features/qna/QuestionDetail'));
const ChatPage = lazy(() => import('@/features/chat/ChatPage'));
const ProfilePage = lazy(() => import('@/features/profile/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const ChannelView = lazy(() => import('@/features/channels/ChannelView'));
const ChannelListPage = lazy(() => import('@/features/channels/ChannelListPage'));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'));
const MessagesPage = lazy(() => import('@/features/dm/MessagesPage'));
const WriteArticlePage = lazy(() => import('@/features/articles/WriteArticlePage'));
const ArticlePage = lazy(() => import('@/features/articles/ArticlePage'));

// Route loading fallback
const RouteLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      <span className="text-sm text-zinc-500">Loading...</span>
    </div>
  </div>
);

// Wrap lazy components with Suspense
const S = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<RouteLoader />}>{children}</Suspense>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Protected Route wrapper with modal fallback
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/welcome" replace />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/welcome" element={<S><NewLandingPage /></S>} />
      <Route path="/about" element={<S><AboutPage /></S>} />
      <Route path="/legal" element={<S><LegalPage /></S>} />

      <Route path="/login" element={<S><LoginForm /></S>} />
      <Route path="/register" element={<S><RegisterForm /></S>} />
      <Route path="/forgot-password" element={<S><ForgotPassword /></S>} />
      <Route path="/reset-password" element={<S><ResetPassword /></S>} />
      <Route path="/request-access" element={<S><RequestAccess /></S>} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<S><DashboardPlaceholder /></S>} />
        <Route path="chat" element={<S><ChatPage /></S>} />
        <Route path="profile" element={<S><ProfilePage /></S>} />
        <Route path="settings" element={<S><SettingsPage /></S>} />
        <Route
          path="notes"
          element={
            <S><AcademicLayout>
              <NotesList />
            </AcademicLayout></S>
          }
        />
        <Route
          path="qna"
          element={
            <S><AcademicLayout>
              <QuestionList />
            </AcademicLayout></S>
          }
        />
        <Route
          path="qna/:questionId"
          element={
            <S><AcademicLayout>
              <QuestionDetail />
            </AcademicLayout></S>
          }
        />
        <Route path="channels" element={<S><ChannelListPage /></S>} />
        <Route path="channels/:channelId" element={<S><ChannelView /></S>} />
        <Route path="leaderboard" element={<S><LeaderboardPage /></S>} />
        <Route path="messages" element={<S><MessagesPage /></S>} />
        <Route path="messages/:id" element={<S><MessagesPage /></S>} />
      </Route>

      {/* Full-Page Text Editor Route */}
      <Route
        path="/write"
        element={
          <ProtectedRoute>
            <S><WriteArticlePage /></S>
          </ProtectedRoute>
        }
      />

      {/* Dynamic Article Reading Route (Public/Mixed Auth) */}
      <Route path="/article/:id" element={<S><ArticlePage /></S>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
);

const App = () => {
  // Setup auto-updating Service Worker for iOS PWAs
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // Auto-check for updates every 10 minutes
        setInterval(() => {
          r.update();
        }, 10 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  // Silently trigger update sequence when new vite hash detected
  if (needRefresh) {
    updateServiceWorker(true);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Helmet>
          <title>{siteConfig.name}</title>
          <meta name="description" content={siteConfig.description} />
        </Helmet>
        <InstallPrompt />
        <RouterProvider router={router} />
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
