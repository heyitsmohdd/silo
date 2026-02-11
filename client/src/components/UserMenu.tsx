import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { getIdentity } from '@/lib/identity';
import LogoutConfirmationModal from '@/components/LogoutConfirmationModal';

const UserMenu = () => {
    const { user, logout } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    if (!user) return null;

    const identity = getIdentity(user.userId, user.username);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLogoutClick = () => {
        setIsOpen(false);
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        logout();
        navigate('/login');
        setShowLogoutModal(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 p-1.5 rounded-lg bg-zinc-800/40 border border-zinc-700 hover:border-zinc-500 hover:ring-2 hover:ring-emerald-500/20 transition-all group"
            >
                <img
                    src={identity.avatar}
                    alt={identity.name}
                    className="w-8 h-8 rounded-full bg-zinc-900 ring-2 ring-zinc-700 group-hover:ring-emerald-500/50 transition-all"
                />
                <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-64 z-50 rounded-lg bg-zinc-900/95 backdrop-blur-md border border-zinc-800 shadow-2xl shadow-black/50 overflow-hidden">
                        {/* User Info Section */}
                        <div className="p-4 border-b border-zinc-800">
                            <div className="flex items-center gap-3">
                                <img
                                    src={identity.avatar}
                                    alt={identity.name}
                                    className="w-12 h-12 rounded-full bg-zinc-900 ring-2 ring-zinc-800"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">
                                        {identity.name}
                                    </p>
                                    <p className="text-xs text-zinc-400 truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            <Link
                                to="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-800/60 transition-colors text-zinc-200 hover:text-white"
                            >
                                <User className="w-4 h-4" />
                                <span className="text-sm font-medium">View Profile</span>
                            </Link>

                            <Link
                                to="/settings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-800/60 transition-colors text-zinc-200 hover:text-white"
                            >
                                <Settings className="w-4 h-4" />
                                <span className="text-sm font-medium">Settings</span>
                            </Link>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-zinc-800 py-2">
                            <button
                                onClick={handleLogoutClick}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors text-zinc-400 hover:text-red-400"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Log Out</span>
                            </button>
                        </div>
                    </div>
                </>
            )}

            <LogoutConfirmationModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleConfirmLogout}
            />
        </div>
    );
};

export default UserMenu;
