import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Button from '@/components/ui/Button';

const DashboardLayout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-60 border-r-2 border-dark-border light:border-bright-border flex flex-col">
                {/* Logo/Title */}
                <div className="p-6 border-b-2 border-dark-border light:border-bright-border">
                    <h1 className="text-2xl font-bold font-mono tracking-tighter">
                        SILO
                    </h1>
                    {user && (
                        <div className="mt-2 text-xs font-mono text-dark-border light:text-bright-border">
                            <p className="uppercase">{user.role}</p>
                            <p>{user.batch}</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink to="/" icon="📝" label="Notes" />
                    <NavLink to="/chat" icon="💬" label="Chat" />
                    <NavLink to="/profile" icon="👤" label="Profile" />
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t-2 border-dark-border light:border-bright-border">
                    <Button
                        onClick={handleLogout}
                        variant="secondary"
                        className="w-full"
                    >
                        LOGOUT
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
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
    return (
        <Link
            to={to}
            className="block px-4 py-2 border-2 border-transparent font-mono text-sm uppercase tracking-wider hover:border-dark-border light:hover:border-bright-border hover:bg-dark-text hover:text-dark-bg light:hover:bg-bright-text light:hover:text-bright-bg transition-all duration-75"
        >
            <span className="mr-2">{icon}</span>
            {label}
        </Link>
    );
};

export default DashboardLayout;
