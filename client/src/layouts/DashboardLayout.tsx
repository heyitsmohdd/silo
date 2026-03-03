import { Link, Outlet, useLocation } from 'react-router-dom';
import { FileText, MessageSquare, X, HelpCircle, Bug, Trophy, Send, PenSquare, Menu } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import ContactModal from '@/components/ContactModal';
import { useState } from 'react';
import UserMenu from '@/components/UserMenu';
import { NotificationBell } from '@/components/layout/NotificationBell';
import ChannelList, { ChannelListHeader } from '@/components/channels/ChannelList';
import { useSocketConnection } from '@/hooks/useSocketConnection';
import WeeklyStarsWidget from '@/components/leaderboard/WeeklyStarsWidget';
import { siteConfig } from '@/config/site';

const DashboardLayout = () => {
  // Initialize global socket connection
  useSocketConnection();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex bg-zinc-950 relative h-screen overflow-hidden pb-16 md:pb-0">
      {/* 1. Left Sidebar (Hidden on Mobile unless open) */}
      <aside className={`fixed inset-y-0 left-0 z-[60] w-64 bg-zinc-950 transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:m-4 md:w-[4.5rem] md:hover:w-64 md:h-[calc(100vh-2rem)] md:rounded-2xl glass-sidebar overflow-hidden group`}>
        <SidebarContent onNavigate={closeMobileMenu} isMobile={isMobileMenuOpen} />
      </aside>

      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50] md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-0 min-w-0 md:pl-0">
        <header className="h-14 glass-header sticky top-0 z-40 border-b border-white/5">
          <div className="h-full flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              {/* Hamburger Menu - Mobile Only */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 -ml-2 rounded-md hover:bg-zinc-800/40 text-zinc-300 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <Link to="/" className="md:hidden w-8 h-8 hidden items-center justify-center bg-emerald-500 rounded text-black font-bold text-xs shrink-0">S</Link>
              <div className="text-sm font-medium text-zinc-100 hidden sm:block">
                Dashboard
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationBell />
              <UserMenu />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 relative">
          <div className="max-w-[1600px] mx-auto flex gap-6 h-full">

            {/* Center Feed Outlet */}
            <div className="flex-1 min-w-0 h-full">
              <Outlet />
            </div>

          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};


// Sidebar Content Component (Desktop strictly)
interface SidebarContentProps {
  onNavigate?: () => void;
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

      <div className={`h-14 flex items-center ${isMobile ? 'px-6' : 'px-4'} border-b border-white/5`}>
        <div className="w-10 flex justify-center pl-1 shrink-0">
          <Link to="/" className="w-6 h-6 flex items-center justify-center bg-emerald-500 rounded text-black font-bold text-xs" title={siteConfig.name}>S</Link>
        </div>
        <Link to="/" className={`hover:opacity-70 transition-opacity ${isMobile ? '' : 'w-0 opacity-0 overflow-hidden md:group-hover:w-auto md:group-hover:opacity-100 md:group-hover:ml-3 transition-all duration-200 delay-100 whitespace-nowrap'}`}>
          <h1 className="text-sm font-bold text-white font-['Press_Start_2P']">
            {siteConfig.name}
          </h1>
        </Link>
        {isMobile && onNavigate && (
          <button
            onClick={onNavigate}
            className="ml-auto p-1.5 rounded-md hover:bg-zinc-800/40 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-x-hidden overflow-y-auto custom-scrollbar">
        <NavLink to="/write" icon={PenSquare} label="Write Article" onClick={onNavigate} isMobile={isMobile} />
        <NavLink to="/notes" icon={FileText} label="Notes" onClick={onNavigate} isMobile={isMobile} />
        <NavLink to="/qna" icon={HelpCircle} label="Q&A" onClick={onNavigate} isMobile={isMobile} />
        <NavLink to="/chat" icon={MessageSquare} label="Batch Chat" onClick={onNavigate} isMobile={isMobile} />
        <NavLink to="/messages" icon={Send} label="Messages" onClick={onNavigate} isMobile={isMobile} />
        <NavLink to="/leaderboard" icon={Trophy} label="Leaderboard" onClick={onNavigate} isMobile={isMobile} />
        <button
          onClick={() => setIsContactModalOpen(true)}
          className={`w-full relative flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200`}
        >
          <Bug className="w-5 h-5 flex-shrink-0" />
          <span className={`${isMobile ? 'ml-3' : 'w-0 opacity-0 overflow-hidden md:group-hover:w-auto md:group-hover:opacity-100 md:group-hover:ml-3 transition-all duration-200 delay-75 whitespace-nowrap'}`}>Contact</span>
        </button>

        <div className="pt-2">
          <WeeklyStarsWidget isMobile={isMobile} />
        </div>

        <div className="pt-4 mt-4 border-t border-white/5">
          <ChannelListHeader onCreateClick={() => setIsCreateChannelOpen(true)} isMobile={isMobile} />
          <ChannelList
            isModalOpen={isCreateChannelOpen}
            onModalClose={() => setIsCreateChannelOpen(false)}
            isMobile={isMobile}
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
  isMobile?: boolean;
}

const NavLink = ({ to, icon: Icon, label, onClick, isMobile }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
        ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 shadow-lg shadow-emerald-500/10'
        : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 border-l-2 border-transparent'
        }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className={`${isMobile ? 'ml-3' : 'w-0 opacity-0 overflow-hidden md:group-hover:w-auto md:group-hover:opacity-100 md:group-hover:ml-3 transition-all duration-200 delay-75 whitespace-nowrap'}`}>{label}</span>
    </Link>
  );
};

export default DashboardLayout;
