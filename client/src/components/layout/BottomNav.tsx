import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Library, Users, MessageSquare, UserCircle } from 'lucide-react';

export const BottomNav = () => {
    const location = useLocation();
    const isArticlesTab = location.pathname === '/qna' && location.search.includes('tab=articles');
    const isQnaTab = location.pathname === '/qna' && !location.search.includes('tab=articles');

    const navItems = [
        {
            path: '/qna?tab=articles',
            icon: BookOpen,
            label: 'Articles',
            isActive: isArticlesTab,
        },
        {
            path: '/qna',
            icon: Library,
            label: 'Q&A',
            isActive: isQnaTab,
        },
        {
            path: '/chat',
            icon: Users,
            label: 'Batch Chat',
            isActive: location.pathname === '/chat' || location.pathname.startsWith('/chat/'),
        },
        {
            path: '/messages',
            icon: MessageSquare,
            label: 'DM',
            isActive: location.pathname === '/messages' || location.pathname.startsWith('/messages/'),
        },
        {
            path: '/profile',
            icon: UserCircle,
            label: 'Profile',
            isActive: location.pathname === '/profile',
        },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-t border-white/10 pb-safe">
            <div className="flex justify-around items-center h-14 px-4">
                {navItems.map(({ path, icon: Icon, label, isActive }) => (
                    <Link
                        key={path}
                        to={path}
                        aria-label={label}
                        className={`flex items-center justify-center p-3 rounded-xl transition-all duration-200
                            ${isActive ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <Icon
                            className={`w-5 h-5 ${isActive ? 'fill-emerald-400/20' : ''}`}
                            strokeWidth={isActive ? 2.5 : 2}
                        />
                    </Link>
                ))}
            </div>
        </nav>
    );
};
