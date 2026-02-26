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

    const identity = user ? getIdentity(user.userId, user.username) : { name: '', avatar: '' };

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

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
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

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                    <div className="absolute right-0 mt-2 w-72 z-50 rounded-xl bg-zinc-900/95 backdrop-blur-md border border-zinc-800 shadow-2xl shadow-black/50 overflow-hidden">
                        <div className="p-5 border-b border-zinc-800 bg-gradient-to-br from-zinc-800/80 to-zinc-900">
                            <div className="flex items-center gap-4">
                                <img
                                    src={identity.avatar}
                                    alt={identity.name}
                                    className="w-14 h-14 rounded-full bg-zinc-950 ring-2 ring-zinc-700 shadow-lg"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-base font-bold text-white truncate">
                                            {identity.name}
                                        </p>
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 tracking-wide uppercase">
                                            {user.role}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-400 truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-2 space-y-1">
                            <Link
                                to="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/80 transition-all text-zinc-300 hover:text-white group"
                            >
                                <div className="p-1.5 rounded-md bg-zinc-800/50 text-zinc-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">View Profile</span>
                            </Link>

                            <Link
                                to="/settings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/80 transition-all text-zinc-300 hover:text-white group"
                            >
                                <div className="p-1.5 rounded-md bg-zinc-800/50 text-zinc-400 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                                    <Settings className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">Settings</span>
                            </Link>
                        </div>

                        <div className="p-2 border-t border-zinc-800/50">
                            <button
                                onClick={handleLogoutClick}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-all text-zinc-400 hover:text-red-400 group"
                            >
                                <div className="p-1.5 rounded-md bg-zinc-800/50 text-zinc-400 group-hover:bg-red-500/10 group-hover:text-red-400 transition-colors">
                                    <LogOut className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium group-hover:translate-x-0.5 transition-transform">Log Out</span>
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
