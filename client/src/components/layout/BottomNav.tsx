import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Library, Users, MessageSquare, UserCircle } from 'lucide-react';

export const BottomNav = () => {
    const location = useLocation();

    // Helper function for active state, using the new definition from the instruction
    const isPathActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/', icon: BookOpen, label: 'Articles' },
        { path: '/qna', icon: Library, label: 'Q&A' },
        { path: '/channels', icon: Users, label: 'Batch Chat', highlight: true },
        { path: '/messages', icon: MessageSquare, label: 'Notes' },
        { path: '/profile', icon: UserCircle, label: 'Profile' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-t border-white/10 pb-safe">
            <div className="flex justify-around items-center h-16 px-4">
                {navItems.map(({ path, icon: Icon, label, highlight }) => {
                    // Match paths loosely so nested routes highlight the parent icon
                    // This isActive is for the icon's fill and strokeWidth, as per original logic
                    const isActiveForIcon = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
                    return (
                        <Link
                            key={path}
                            to={path}
                            className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200
                                ${isPathActive(path)
                                    ? 'text-emerald-400 font-medium'
                                    : highlight ? 'text-emerald-500 hover:text-emerald-400 bg-emerald-500/10' : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActiveForIcon ? 'fill-emerald-400/20' : ''}`} strokeWidth={isActiveForIcon ? 2.5 : 2} />
                            <span className="text-[10px] font-medium tracking-wide">{label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    );
};
