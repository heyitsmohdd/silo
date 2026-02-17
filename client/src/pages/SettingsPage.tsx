import { useState, useEffect } from 'react';
import { Moon, Trash2, User } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import Button from '@/components/ui/Button';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import LogoutConfirmationModal from '@/components/LogoutConfirmationModal';
import { getIdentity } from '@/lib/identity';

const THEME_KEY = 'silo_theme';

const SettingsPage = () => {
    const { user, logout } = useAuthStore();
    // Initial Theme Setup
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window === 'undefined') return true;
        const savedTheme = localStorage.getItem(THEME_KEY);
        return savedTheme === 'dark' || savedTheme === null;
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Derived State
    const alias = user?.userId ? getIdentity(user.userId, user.username).name : '';

    useEffect(() => {
        // Sync DOM with state
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    const toggleTheme = () => {
        const newTheme = !darkMode ? 'dark' : 'light';
        setDarkMode(!darkMode);
        localStorage.setItem(THEME_KEY, newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        // In a real app, calling an API endpoint would happen here
        setShowDeleteModal(false);
        alert('Account deletion logic executed. Goodbye!');
        logout(); // Assuming we want to logout the user after simulated deletion
    };

    const handleConfirmLogout = () => {
        logout();
        setShowLogoutModal(false);
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in-50 duration-500 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-zinc-400">Manage your account and preferences.</p>
            </div>

            <section className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-100 border-b border-white/5 pb-2">
                    <User className="w-5 h-5 text-zinc-400" />
                    <h2 className="text-lg font-semibold">My Identity</h2>
                </div>

                <div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <div className="text-sm text-zinc-400 mb-1">Current Alias</div>
                        <div className="text-2xl font-bold text-white tracking-wide">{alias || 'Loading...'}</div>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-100 border-b border-white/5 pb-2">
                    <Moon className="w-5 h-5 text-zinc-400" />
                    <h2 className="text-lg font-semibold">Interface</h2>
                </div>

                <div className="glass-card p-6 flex items-center justify-between">
                    <div>
                        <div className="font-medium text-white">Dark Mode</div>
                        <div className="text-sm text-zinc-400">Adjust the appearance of the application</div>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${darkMode ? 'bg-emerald-500' : 'bg-zinc-700'
                            }`}
                        role="switch"
                        aria-checked={darkMode}
                    >
                        <span
                            className={`${darkMode ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`}
                        />
                    </button>
                </div>
            </section>



            < section className="pt-4" >
                <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-red-400">
                                <Trash2 className="w-5 h-5" />
                                <h3 className="font-semibold">Delete Account</h3>
                            </div>
                            <p className="text-sm text-red-500/80">
                                Permanently delete your account and all your messages. This action cannot be undone.
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            className="shrink-0"
                            onClick={handleDeleteAccount}
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </section >

            < DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
            />

            < LogoutConfirmationModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleConfirmLogout}
            />
        </div >
    );
};

export default SettingsPage;
