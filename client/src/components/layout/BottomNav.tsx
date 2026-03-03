import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Library, Users, MessageSquare, Hash } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

// Small red dot indicator
const RedDot = () => (
    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-zinc-950" />
);

export const BottomNav = () => {
    const location = useLocation();
    const isArticlesTab = location.pathname === '/qna' && location.search.includes('tab=articles');
    const isQnaTab = location.pathname === '/qna' && !location.search.includes('tab=articles');

    const [rawUnreadCount, setRawUnreadCount] = useState(0);

    // Fetch unread DM count whenever route changes (async-only — no sync setState)
    useEffect(() => {
        axios.get('/api/messages/unread-count')
            .then(res => setRawUnreadCount(res.data?.count ?? 0))
            .catch(() => { });
    }, [location.pathname]);

    // Derive badge: clear automatically when already on messages page
    const unreadDMs = rawUnreadCount > 0 && !location.pathname.startsWith('/messages');

    const navItems = [
        {
            path: '/qna?tab=articles',
            icon: BookOpen,
            label: 'Articles',
            isActive: isArticlesTab,
            hasBadge: false, // articles badge driven by FAB interaction
        },
        {
            path: '/qna',
            icon: Library,
            label: 'Q&A',
            isActive: isQnaTab,
            hasBadge: false,
        },
        {
            path: '/chat',
            icon: Users,
            label: 'Rooms',
            isActive: location.pathname === '/chat' || location.pathname.startsWith('/chat/'),
            hasBadge: false,
        },
        {
            path: '/messages',
            icon: MessageSquare,
            label: 'DM',
            isActive: location.pathname === '/messages' || location.pathname.startsWith('/messages/'),
            hasBadge: unreadDMs,
        },
        {
            path: '/channels',
            icon: Hash,
            label: 'Rooms',
            isActive: location.pathname === '/channels' || location.pathname.startsWith('/channels/'),
            hasBadge: false,
        },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-t border-white/10 pb-safe">
            <div className="flex justify-around items-center h-14 px-4">
                {navItems.map(({ path, icon: Icon, label, isActive, hasBadge }) => (
                    <Link
                        key={path}
                        to={path}
                        aria-label={label}
                        className={`relative flex items-center justify-center p-3 rounded-xl transition-all duration-200
                            ${isActive ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <Icon
                            className={`w-5 h-5 ${isActive ? 'fill-emerald-400/20' : ''}`}
                            strokeWidth={isActive ? 2.5 : 2}
                        />
                        {hasBadge && <RedDot />}
                    </Link>
                ))}
            </div>
        </nav>
    );
};
