import { Link, Outlet, useLocation } from 'react-router-dom';
import { FileText, MessageSquare, Menu, X, HelpCircle, Bug, Trophy } from 'lucide-react';
import ContactModal from '@/components/ContactModal';
import { useState } from 'react';
import UserMenu from '@/components/UserMenu';
import { NotificationBell } from '@/components/layout/NotificationBell';
import ChannelList, { ChannelListHeader } from '@/components/channels/ChannelList';
import { useSocketConnection } from '@/hooks/useSocketConnection';
import WeeklyStarsWidget from '@/components/leaderboard/WeeklyStarsWidget';
import { siteConfig } from '@/config/site';

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize global socket connection
  useSocketConnection();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-zinc-950 relative">
      <aside className="hidden md:flex w-64 h-[calc(100vh-2rem)] m-4 glass-sidebar rounded-2xl flex-col">
        <SidebarContent onNavigate={closeMobileMenu} />
      </aside>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={closeMobileMenu}
          />

          <aside className="fixed left-0 top-0 bottom-0 w-64 glass-sidebar z-50 md:hidden">
            <SidebarContent onNavigate={closeMobileMenu} isMobile />
          </aside>
        </>
      )}

      <div className="flex-1 flex flex-col relative z-0">
        <header className="h-14 glass-header sticky top-0 z-40 border-b border-white/5">
          <div className="h-full flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
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

            <div className="flex items-center gap-3">
              <NotificationBell />
              <UserMenu />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-[1600px] mx-auto flex gap-6 h-full">
            <div className="flex-1 min-w-0 h-full">
              <Outlet />
            </div>


          </div>
        </main>
      </div>
    </div>
  );
};


// Sidebar Content Component (shared between desktop and mobile)
interface SidebarContentProps {
  onNavigate: () => void;
  isMobile?: boolean;
}

const SidebarContent = ({ onNavigate, isMobile }: SidebarContentProps) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);

  return (
    <>
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <div className="h-14 flex items-center px-6 border-b border-white/5">
        <Link to="/" className="hover:opacity-70 transition-opacity">
          <h1 className="text-sm font-bold text-white font-['Press_Start_2P']">
            {siteConfig.name}
          </h1>
        </Link>
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

      <nav className="flex-1 p-3 space-y-1">
        <NavLink to="/notes" icon={FileText} label="Notes" onClick={onNavigate} />
        <NavLink to="/qna" icon={HelpCircle} label="Q&A" onClick={onNavigate} />
        <NavLink to="/chat" icon={MessageSquare} label="Chat" onClick={onNavigate} />
        <NavLink to="/leaderboard" icon={Trophy} label="Leaderboard" onClick={onNavigate} />
        <button
          onClick={() => setIsContactModalOpen(true)}
          className="w-full relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
        >
          <Bug className="w-4 h-4 flex-shrink-0" />
          <span>Contact</span>
        </button>

        <div className="pt-2">
          <WeeklyStarsWidget />
        </div>

        <div className="pt-4 mt-4 border-t border-white/5">
          <ChannelListHeader onCreateClick={() => setIsCreateChannelOpen(true)} />
          <ChannelList
            isModalOpen={isCreateChannelOpen}
            onModalClose={() => setIsCreateChannelOpen(false)}
          />
        </div>

      </nav>
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
        ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 shadow-lg shadow-emerald-500/10'
        : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 border-l-2 border-transparent'
        }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{label}</span>
    </Link>
  );
};

export default DashboardLayout;
