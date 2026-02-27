import { useState, useEffect, useRef } from 'react';
import { Bell, BellRing } from 'lucide-react';
import axios from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import socketService from '@/lib/socket';

interface Notification {
    id: string;
    type: 'REPLY' | 'UPVOTE' | 'MENTION';
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

export const NotificationBell = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [pushStatus, setPushStatus] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();



    // Mark all as read
    const markAsRead = async () => {
        if (unreadCount === 0) return;

        try {
            await axios.post('/api/notifications/mark-read');
            setUnreadCount(0);
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true }))
            );
        } catch (error) {
            console.error('Failed to mark notifications as read:', error);
        }
    };

    // Handle notification click
    const handleNotificationClick = (e: React.MouseEvent, notification: Notification) => {
        e.preventDefault();
        e.stopPropagation();

        console.log('🔔 Notification clicked:', notification);
        console.log('📍 Resource ID:', notification.resourceId);

        if (notification.resourceId) {
            const targetPath = `/qna/${notification.resourceId}`;
            console.log('🧭 Navigating to:', targetPath);

            // Navigate first, then close dropdown
            navigate(targetPath);

            // Small delay before closing to ensure navigation starts
            setTimeout(() => {
                setIsOpen(false);
            }, 100);
        } else {
            console.warn('⚠️ No resourceId found in notification');
            setIsOpen(false);
        }
    };

    // Toggle dropdown
    const toggleDropdown = () => {
        if (!isOpen) {
            markAsRead();
        }
        setIsOpen(!isOpen);
    };

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
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        fetchNotifications();

        // Get socket instance
        const socket = socketService.getSocket();

        if (socket) {
            // Listen for real-time notifications
            socket.on('notification:new', (notification: Notification) => {
                console.log('📬 New notification received:', notification);

                // Add to notifications list
                setNotifications((prev) => [notification, ...prev]);

                // Increment unread count
                setUnreadCount((prev) => prev + 1);
            });

            // Cleanup listener on unmount
            return () => {
                socket.off('notification:new');
            };
        }
    }, []);

    // Check push notification support on mount
    useEffect(() => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            setPushStatus('unsupported');
            return;
        }
        setPushStatus(Notification.permission);
    }, []);

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

    const subscribeToPush = async () => {
        setIsSubscribing(true);
        try {
            const permission = await Notification.requestPermission();
            setPushStatus(permission as typeof pushStatus);

            if (permission !== 'granted') return;

            const registration = await navigator.serviceWorker.ready;

            // Get public key from env
            const applicationServerKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlB64ToUint8Array(applicationServerKey)
            });

            // Send subscription to backend
            await axios.post('/api/notifications/push/subscribe', subscription.toJSON());
            console.log('Successfully subscribed to push notifications');

        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
        } finally {
            setIsSubscribing(false);
        }
    };

    // Get actor display name
    const getActorName = (actor: Notification['actor']) => {
        if (actor.username) return actor.username;
        if (actor.firstName && actor.lastName) return `${actor.firstName} ${actor.lastName}`;
        if (actor.firstName) return actor.firstName;
        return 'Someone';
    };

    // Format time ago
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

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-violet-500 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-zinc-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                        <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    </div>

                    {pushStatus === 'default' && (
                        <div className="px-4 py-3 bg-violet-500/10 border-b border-violet-500/20 flex flex-col gap-2">
                            <p className="text-xs text-zinc-300">
                                Get notified immediately when someone replies to your question or mentions you!
                            </p>
                            <button
                                onClick={subscribeToPush}
                                disabled={isSubscribing}
                                className="flex items-center justify-center gap-2 w-full py-1.5 px-3 bg-violet-500 hover:bg-violet-600 text-white rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                            >
                                <BellRing className="w-3.5 h-3.5" />
                                {isSubscribing ? 'Enabling...' : 'Enable Push Notifications'}
                            </button>
                        </div>
                    )}

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-zinc-500">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    onClick={(e) => handleNotificationClick(e, notification)}
                                    className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${!notification.isRead ? 'bg-violet-500/5' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                                            <Bell className="w-4 h-4 text-violet-400" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white">
                                                <span className="font-medium">{getActorName(notification.actor)}</span>{' '}
                                                <span className="text-zinc-400">{notification.message}</span>
                                            </p>
                                            <p className="text-xs text-zinc-500 mt-1">
                                                {timeAgo(notification.createdAt)}
                                            </p>
                                        </div>

                                        {!notification.isRead && (
                                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-violet-500" />
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
