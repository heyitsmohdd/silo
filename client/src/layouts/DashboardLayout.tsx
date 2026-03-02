import { Link, Outlet, useLocation } from 'react-router-dom';
import { FileText, MessageSquare, Menu, X, HelpCircle, Bug, Trophy, Send } from 'lucide-react';
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
      <aside className="hidden md:flex flex-col m-4 glass-sidebar rounded-2xl group w-[4.5rem] hover:w-64 transition-all duration-300 ease-in-out z-50">
        <SidebarContent onNavigate={closeMobileMenu} />
      </aside>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={closeMobileMenu}
          />

          <aside className="fixed left-0 top-0 bottom-0 w-64 glass-sidebar z-50 md:hidden flex flex-col group">
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

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 relative">
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

      <div className={`h-14 flex items-center ${isMobile ? 'px-6' : 'px-4'} border-b border-white/5`}>
        <div className="w-10 flex justify-center pl-1 shrink-0">
          <Link to="/" className="w-6 h-6 flex items-center justify-center bg-emerald-500 rounded text-black font-bold text-xs" title={siteConfig.name}>S</Link>
        </div>
        <Link to="/" className={`hover:opacity-70 transition-opacity ${isMobile ? '' : 'w-0 opacity-0 overflow-hidden md:group-hover:w-auto md:group-hover:opacity-100 md:group-hover:ml-3 transition-all duration-200 delay-100 whitespace-nowrap'}`}>
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

      <nav className="flex-1 p-3 space-y-1 overflow-x-hidden overflow-y-auto custom-scrollbar">
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
