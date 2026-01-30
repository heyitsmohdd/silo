import { Link, Outlet, useLocation } from 'react-router-dom';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuthStore } from '@/stores/useAuthStore';

const DashboardLayout = () => {
    const { user } = useAuthStore();

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 h-full border-r border-border bg-muted/30 flex flex-col">
                {/* Logo */}
                <div className="h-14 flex items-center px-6 border-b border-border">
                    <h1 className="text-lg font-semibold text-foreground">
                        Silo
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1">
                    <NavLink to="/notes" icon="📝" label="Notes" />
                    <NavLink to="/chat" icon="💬" label="Chat" />
                    <NavLink to="/profile" icon="👤" label="Profile" />
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
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
                    <div className="h-full flex items-center justify-between px-6">
                        <div className="text-sm font-medium text-foreground">
                            Dashboard
                        </div>

                        {/* Status & Theme Toggle */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                <span className="text-xs text-muted-foreground">Online</span>
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

// Navigation Link Component
interface NavLinkProps {
    to: string;
    icon: string;
    label: string;
}

const NavLink = ({ to, icon, label }: NavLinkProps) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                    ? 'bg-white dark:bg-zinc-800 shadow-sm text-foreground'
                    : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-zinc-900 hover:text-foreground'
                }`}
        >
            <span className="text-base">{icon}</span>
            <span>{label}</span>
        </Link>
    );
};

export default DashboardLayout;
