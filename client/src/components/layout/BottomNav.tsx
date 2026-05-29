import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Library, Users, MessageSquare } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export const BottomNav = () => {
    const location = useLocation();
    const isArticlesTab = location.pathname === '/qna' && location.search.includes('tab=articles');
    const isQnaTab = location.pathname === '/qna' && !location.search.includes('tab=articles');
    const isRooms = location.pathname === '/chat' || location.pathname.startsWith('/chat/');
    const isDM = location.pathname.startsWith('/messages');

    const { isProfessor } = useAuthStore();
    if (isProfessor) return null;

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
            label: 'Rooms',
            isActive: isRooms,
        },
        {
            path: '/messages',
            icon: MessageSquare,
            label: 'DM',
            isActive: isDM,
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
                        className={`relative flex items-center justify-center p-3 rounded-xl transition-all duration-200
                            ${isActive ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <div className="relative group transition-transform duration-200 hover:-translate-y-1 hover:scale-110 active:scale-95 flex items-center justify-center">
                            <Icon
                                className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'fill-emerald-400/20 text-emerald-400' : ''}`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                        </div>
                        {isActive && (
                            <div className="absolute bottom-1 w-1 h-1 bg-emerald-400 rounded-full animate-fade-in-scale" />
                        )}
                    </Link>
                ))}
            </div>
        </nav>
    );
};
