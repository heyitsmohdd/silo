import { Link, useLocation } from 'react-router-dom';
import { Home, HelpCircle, MessageSquare, FileText } from 'lucide-react';

export const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/qna', icon: HelpCircle, label: 'Q&A' },
        { path: '/notes', icon: FileText, label: 'Notes' },
        { path: '/messages', icon: MessageSquare, label: 'Messages' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-t border-white/10 pb-safe">
            <div className="flex justify-around items-center h-16 px-4">
                {navItems.map(({ path, icon: Icon, label }) => {
                    // Match paths loosely so nested routes highlight the parent icon
                    const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
                    return (
                        <Link
                            key={path}
                            to={path}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'fill-emerald-400/20' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium tracking-wide">{label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    );
};
