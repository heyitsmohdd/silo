import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, BellRing, CheckCheck, MessageSquare, ArrowUp, AtSign, Reply } from 'lucide-react';
import axios from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import socketService from '@/lib/socket';

interface Notification {
    id: string;
    type: 'REPLY' | 'UPVOTE' | 'MENTION' | 'DIRECT_MESSAGE';
    message: string;
    resourceId: string | null;
    isRead: boolean;
    createdAt: string;
    actor: {
        id: string;
        username: string | null;
        firstName: string | null;
        lastName: string | null;
    };
}

const urlB64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const getActorName = (actor: Notification['actor']) => {
    if (actor.username) return actor.username;
    if (actor.firstName && actor.lastName) return `${actor.firstName} ${actor.lastName}`;
    if (actor.firstName) return actor.firstName;
    return 'Someone';
};

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
};

const notificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'REPLY': return <Reply className="w-3.5 h-3.5 text-blue-400" />;
        case 'UPVOTE': return <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />;
        case 'MENTION': return <AtSign className="w-3.5 h-3.5 text-amber-400" />;
        case 'DIRECT_MESSAGE': return <MessageSquare className="w-3.5 h-3.5 text-violet-400" />;
        default: return <Bell className="w-3.5 h-3.5 text-zinc-400" />;
    }
};

const notificationBg = (type: Notification['type']) => {
    switch (type) {
        case 'REPLY': return 'bg-blue-500/15';
        case 'UPVOTE': return 'bg-emerald-500/15';
        case 'MENTION': return 'bg-amber-500/15';
        case 'DIRECT_MESSAGE': return 'bg-violet-500/15';
        default: return 'bg-zinc-500/15';
    }
};

export const NotificationBell = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [pushStatus, setPushStatus] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Mark all as read — only when user explicitly clicks the checkmark
    const markAsRead = useCallback(async () => {
        if (unreadCount === 0) return;

        try {
            await axios.post('/api/notifications/mark-read');
            setUnreadCount(0);
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true }))
            );
        } catch {
            // Silently fail — notification state will correct on next fetch
        }
    }, [unreadCount]);

    // Handle notification click
    const handleNotificationClick = useCallback((e: React.MouseEvent, notification: Notification) => {
        e.preventDefault();
        e.stopPropagation();

        if (notification.resourceId) {
            const targetPath = notification.type === 'DIRECT_MESSAGE'
                ? `/messages/${notification.resourceId}`
                : `/qna/${notification.resourceId}`;

            navigate(targetPath);
            setTimeout(() => setIsOpen(false), 100);
        } else {
            setIsOpen(false);
        }
    }, [navigate]);

    // Toggle dropdown — no longer auto-marks as read
    const toggleDropdown = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch on mount and setup Socket.IO listener
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/api/notifications');
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.unreadCount);
            } catch {
                // Will retry on next mount
            }
        };

        fetchNotifications();

        const socket = socketService.getSocket();

        const handleNewNotification = (notification: Notification) => {
            setNotifications((prev) => [notification, ...prev.slice(0, 49)]);
            setUnreadCount((prev) => prev + 1);
        };

        if (socket) {
            socket.on('notification:new', handleNewNotification);
        }

        // Also listen for late socket connections
        const unsubscribe = socketService.onConnectionChange((sock) => {
            if (sock) {
                sock.off('notification:new', handleNewNotification);
                sock.on('notification:new', handleNewNotification);
            }
        });

        return () => {
            const currentSocket = socketService.getSocket();
            if (currentSocket) {
                currentSocket.off('notification:new', handleNewNotification);
            }
            unsubscribe();
        };
    }, []);

    // Check push notification support on mount
    useEffect(() => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            setPushStatus('unsupported');
            return;
        }
        setPushStatus(Notification.permission);
    }, []);

    const subscribeToPush = useCallback(async () => {
        const permissionPromise = Notification.requestPermission();
        setIsSubscribing(true);
        try {
            const permission = await permissionPromise;
            setPushStatus(permission as typeof pushStatus);

            if (permission !== 'granted') return;

            const registration = await navigator.serviceWorker.ready;
            const applicationServerKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

            if (!applicationServerKey) {
                throw new Error('VAPID key is missing');
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlB64ToUint8Array(applicationServerKey)
            });

            await axios.post('/api/notifications/push/subscribe', subscription.toJSON());
        } catch {
            alert('Failed to subscribe. If you are on iOS, please add this app to your Home Screen first.');
        } finally {
            setIsSubscribing(false);
        }
    }, [pushStatus]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-zinc-400 hover:text-white transition-colors duration-200 rounded-xl hover:bg-white/5 active:scale-95"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-emerald-500 rounded-full animate-notification-pop shadow-lg shadow-emerald-500/30">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] bg-zinc-900/95 backdrop-blur-xl border border-white/8 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-fade-in-scale">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAsRead}
                                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-white/5"
                                title="Mark all as read"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                <span>Mark all read</span>
                            </button>
                        )}
                    </div>

                    {/* Push notification prompt */}
                    {pushStatus === 'default' && (
                        <div className="px-4 py-3 bg-emerald-500/5 border-b border-emerald-500/10 flex flex-col gap-2">
                            <p className="text-xs text-zinc-300">
                                Get notified when someone replies or mentions you!
                            </p>
                            <button
                                onClick={subscribeToPush}
                                disabled={isSubscribing}
                                className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-50 glow-emerald active:scale-[0.98]"
                            >
                                <BellRing className="w-3.5 h-3.5" />
                                {isSubscribing ? 'Enabling...' : 'Enable Push Notifications'}
                            </button>
                        </div>
                    )}

                    {pushStatus === 'unsupported' && (
                        <div className="px-4 py-3 bg-amber-500/5 border-b border-amber-500/10">
                            <p className="text-xs text-amber-200/80">
                                Push notifications aren't supported here. On iOS, add this app to your Home Screen first!
                            </p>
                        </div>
                    )}

                    {/* Notification list */}
                    <div className="max-h-[28rem] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-12 text-center">
                                <Bell className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                                <p className="text-sm text-zinc-500">No notifications yet</p>
                                <p className="text-xs text-zinc-600 mt-1">We'll let you know when something happens</p>
                            </div>
                        ) : (
                            notifications.map((notification, index) => (
                                <button
                                    key={notification.id}
                                    onClick={(e) => handleNotificationClick(e, notification)}
                                    className={`w-full px-4 py-3 text-left hover:bg-white/[0.03] transition-colors duration-150 border-b border-white/[0.03] last:border-0 animate-fade-in ${
                                        !notification.isRead ? 'bg-emerald-500/[0.03]' : ''
                                    }`}
                                    style={{ animationDelay: `${Math.min(index * 30, 150)}ms` }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${notificationBg(notification.type)} flex items-center justify-center`}>
                                            {notificationIcon(notification.type)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-zinc-200 leading-snug">
                                                <span className="font-medium text-white">{getActorName(notification.actor)}</span>{' '}
                                                <span className="text-zinc-400">{notification.message}</span>
                                            </p>
                                            <p className="text-[11px] text-zinc-600 mt-1">
                                                {timeAgo(notification.createdAt)}
                                            </p>
                                        </div>

                                        {!notification.isRead && (
                                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500 mt-2 shadow-lg shadow-emerald-500/50" />
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
