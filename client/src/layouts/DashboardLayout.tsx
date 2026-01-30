import { Link, Outlet, useLocation } from 'react-router-dom';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuthStore } from '@/stores/useAuthStore';

const DashboardLayout = () => {
    const { user } = useAuthStore();

    return (
        <div className="flex min-h-screen bg-white dark:bg-neutral-950">
            {/* Sidebar */}
            <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 flex flex-col bg-white dark:bg-neutral-950 shadow-soft">
                {/* Logo/Title */}
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                        Silo
                    </h1>
                    {user && (
                        <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                            <p className="font-medium capitalize">{user.role.toLowerCase()}</p>
                            <p className="text-xs mt-1">
                                {user.year} • {user.branch}
                            </p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    <NavLink to="/notes" icon="📝" label="Notes" />
                    <NavLink to="/chat" icon="💬" label="Chat" />
                    <NavLink to="/profile" icon="👤" label="Profile" />
                </nav>

                {/* Footer - App Version */}
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                    <p className="text-xs text-neutral-500 dark:text-neutral-600 text-center">
                        v1.0.0
                    </p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-900">
                <Outlet />
            </main>

            {/* Theme Toggle */}
            <ThemeToggle />
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
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850 hover:text-neutral-900 dark:hover:text-neutral-50'
                }`}
        >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
        </Link>
    );
};

export default DashboardLayout;
