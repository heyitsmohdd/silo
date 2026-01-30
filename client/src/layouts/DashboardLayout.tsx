import { Link, Outlet, useLocation } from 'react-router-dom';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuthStore } from '@/stores/useAuthStore';
import { useState } from 'react';

const DashboardLayout = () => {
    const { user } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex w-64 h-full border-r border-border bg-muted/30 flex-col">
                <SidebarContent user={user} onNavigate={closeMobileMenu} />
            </aside>

            {/* Sidebar - Mobile Overlay */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={closeMobileMenu}
                    />

                    {/* Sidebar */}
                    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-background z-50 md:hidden">
                        <SidebarContent user={user} onNavigate={closeMobileMenu} />
                    </aside>
                </>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
                    <div className="h-full flex items-center justify-between px-4 md:px-6">
                        <div className="flex items-center gap-3">
                            {/* Hamburger Menu - Mobile Only */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
                                aria-label="Toggle menu"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-foreground"
                                >
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            </button>

                            <div className="text-sm font-medium text-foreground">
                                Dashboard
                            </div>
                        </div>

                        {/* Status & Theme Toggle */}
                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                <span className="text-xs text-muted-foreground">Online</span>
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
}

const SidebarContent = ({ user, onNavigate }: SidebarContentProps) => {
    return (
        <>
            {/* Logo */}
            <div className="h-14 flex items-center px-6 border-b border-border">
                <h1 className="text-base font-medium text-foreground">
                    Silo
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                <NavLink to="/notes" icon="📝" label="Notes" onClick={onNavigate} />
                <NavLink to="/chat" icon="💬" label="Chat" onClick={onNavigate} />
                <NavLink to="/profile" icon="👤" label="Profile" onClick={onNavigate} />
            </nav>

            {/* User Info Footer */}
            {user && (
                <div className="p-4 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                        <p className="font-medium text-foreground capitalize">
                            {user.role.toLowerCase()}
                        </p>
                        <p className="mt-0.5">
                            {user.year} • {user.branch}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

// Navigation Link Component
interface NavLinkProps {
    to: string;
    icon: string;
    label: string;
    onClick?: () => void;
}

const NavLink = ({ to, icon, label, onClick }: NavLinkProps) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            onClick={onClick}
            className={`relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                    ? 'bg-white dark:bg-zinc-800 shadow-sm text-foreground'
                    : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-zinc-900 hover:text-foreground'
                }`}
        >
            {isActive && <span className="absolute left-0 w-0.5 h-6 bg-blue-600 rounded-r" />}
            <span className="text-base">{icon}</span>
            <span>{label}</span>
        </Link>
    );
};

export default DashboardLayout;
