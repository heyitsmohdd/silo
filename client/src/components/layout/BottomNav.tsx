import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Library, Users, MessageSquare, UserCircle } from 'lucide-react';

export const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { path: '/qna?tab=articles', matchPath: '/qna', icon: BookOpen, label: 'Articles' },
        { path: '/qna', matchPath: '/qna', icon: Library, label: 'Q&A' },
        { path: '/chat', matchPath: '/chat', icon: Users, label: 'Channels' },
        { path: '/messages', matchPath: '/messages', icon: MessageSquare, label: 'DM' },
        { path: '/profile', matchPath: '/profile', icon: UserCircle, label: 'Profile' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-t border-white/10 pb-safe">
            <div className="flex justify-around items-center h-16 px-4">
                {navItems.map(({ path, matchPath, icon: Icon, label }) => {
                    const isActive = location.pathname === matchPath || location.pathname.startsWith(matchPath + '/');
                    return (
                        <Link
                            key={path}
                            to={path}
                            className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200
                                ${isActive ? 'text-emerald-400 font-medium' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'fill-emerald-400/20' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium tracking-wide">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};
