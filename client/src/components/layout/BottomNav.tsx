import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Library, Users, MessageSquare, Hash } from 'lucide-react';
import { useEffect } from 'react';
import { isStale, markSeen } from '@/hooks/useNewContentDot';

// Small red dot indicator
const RedDot = () => (
    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-zinc-950 animate-pulse" />
);

const KEYS = {
    articles: 'articles',
    qna: 'qna',
    rooms: 'rooms',
    dm: 'dm',
    channels: 'channels',
};

export const BottomNav = () => {
    const location = useLocation();
    const isArticlesTab = location.pathname === '/qna' && location.search.includes('tab=articles');
    const isQnaTab = location.pathname === '/qna' && !location.search.includes('tab=articles');
    const isRooms = location.pathname === '/chat' || location.pathname.startsWith('/chat/');
    const isDM = location.pathname.startsWith('/messages');
    const isChannels = location.pathname.startsWith('/channels');

    // Mark current section as seen (localStorage write only — no setState)
    useEffect(() => {
        if (isArticlesTab) markSeen(KEYS.articles);
        else if (isQnaTab) markSeen(KEYS.qna);
        else if (isRooms) markSeen(KEYS.rooms);
        else if (isDM) markSeen(KEYS.dm);
        else if (isChannels) markSeen(KEYS.channels);
    }, [location.pathname, location.search, isArticlesTab, isQnaTab, isRooms, isDM, isChannels]);

    // Compute dots inline — isStale() reads localStorage, no useState needed
    // Dots are suppressed on the currently active section
    const navItems = [
        {
            path: '/qna?tab=articles',
            icon: BookOpen,
            label: 'Articles',
            isActive: isArticlesTab,
            hasBadge: !isArticlesTab && isStale(KEYS.articles),
        },
        {
            path: '/qna',
            icon: Library,
            label: 'Q&A',
            isActive: isQnaTab,
            hasBadge: !isQnaTab && isStale(KEYS.qna),
        },
        {
            path: '/chat',
            icon: Users,
            label: 'Rooms',
            isActive: isRooms,
            hasBadge: !isRooms && isStale(KEYS.rooms),
        },
        {
            path: '/messages',
            icon: MessageSquare,
            label: 'DM',
            isActive: isDM,
            hasBadge: !isDM && isStale(KEYS.dm),
        },
        {
            path: '/channels',
            icon: Hash,
            label: 'Channels',
            isActive: isChannels,
            hasBadge: !isChannels && isStale(KEYS.channels),
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
