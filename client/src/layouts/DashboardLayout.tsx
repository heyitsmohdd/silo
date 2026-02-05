import { Link, Outlet, useLocation } from 'react-router-dom';
import { FileText, MessageSquare, User, Menu, X, HelpCircle, Settings } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuthStore } from '@/stores/useAuthStore';
import { useState } from 'react';

const DashboardLayout = () => {
  const { user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-zinc-950 relative">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 h-[calc(100vh-2rem)] m-4 glass-sidebar rounded-2xl flex-col">
        <SidebarContent user={user} onNavigate={closeMobileMenu} />
      </aside>

      {/* Sidebar - Mobile Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={closeMobileMenu}
          />

          {/* Sidebar */}
          <aside className="fixed left-0 top-0 bottom-0 w-64 glass-sidebar z-50 md:hidden">
            <SidebarContent user={user} onNavigate={closeMobileMenu} isMobile />
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-0">
        {/* Header */}
        <header className="h-14 glass-header sticky top-0 z-40 border-b border-white/5">
          <div className="h-full flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              {/* Hamburger Menu - Mobile Only */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md hover:bg-zinc-800/40 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              <div className="text-sm font-medium text-zinc-100">
                Dashboard
              </div>
            </div>

            {/* Status & Theme Toggle */}
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-xs text-zinc-400">Online</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Sidebar Content Component (shared between desktop and mobile)
interface SidebarContentProps {
  user: any;
  onNavigate: () => void;
  isMobile?: boolean;
}

const SidebarContent = ({ user, onNavigate, isMobile }: SidebarContentProps) => {
  return (
    <>
      {/* Logo */}
      <div className="h-14 flex items-center px-6 border-b border-white/5">
        <h1 className="text-base font-semibold text-white">
          Silo
        </h1>
        {isMobile && (
          <button
            onClick={onNavigate}
            className="ml-auto p-1.5 rounded-md hover:bg-zinc-800/40 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <NavLink to="/notes" icon={FileText} label="Notes" onClick={onNavigate} />
        <NavLink to="/qna" icon={HelpCircle} label="Q&A" onClick={onNavigate} />
        <NavLink to="/chat" icon={MessageSquare} label="Chat" onClick={onNavigate} />
        <NavLink to="/profile" icon={User} label="Profile" onClick={onNavigate} />
      </nav>

      {/* Compact Profile Section */}
      {user && (
        <div className="p-4 border-t border-white/5">
          <Link
            to="/profile"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/40 transition-colors group"
            onClick={onNavigate}
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-lg shadow-violet-500/20">
              {user.firstName
                ? user.firstName[0]
                : user.userId[0]?.toUpperCase() || 'U'}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.firstName
                  ? `${user.firstName} ${user.lastName || ''}`
                  : user.userId}
              </p>
              <p className="text-xs text-zinc-400 truncate">
                {user.year} • {user.branch}
              </p>
            </div>

            {/* Settings Icon */}
            <Settings className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 transition-colors flex-shrink-0" />
          </Link>
        </div>
      )}
    </>
  );
};

// Navigation Link Component
interface NavLinkProps {
  to: string;
  icon: any;
  label: string;
  onClick?: () => void;
}

const NavLink = ({ to, icon: Icon, label, onClick }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
          ? 'bg-violet-500/10 text-violet-400 border-l-2 border-violet-500 shadow-lg shadow-violet-500/10'
          : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 border-l-2 border-transparent'
        }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{label}</span>
    </Link>
  );
};

export default DashboardLayout;
