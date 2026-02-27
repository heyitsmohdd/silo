import { useState, useEffect } from 'react';
import axiosClient from '@/lib/axios';
import type { Conversation } from '@/types/dm.types';
import { useAuthStore } from '@/stores/useAuthStore';
import { getIdentity } from '@/lib/identity';
import { Link, useParams } from 'react-router-dom';
import socketService from '@/lib/socket';

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins || 1}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
};

const DMSidebar = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthStore();
    const { id: activeConversationId } = useParams();

    useEffect(() => {
        fetchConversations();

        // Real-time refresh: re-fetch sidebar when a new DM is received
        const socket = socketService.getSocket();
        if (socket) {
            socket.on('receive_dm', fetchConversations);
            return () => { socket.off('receive_dm', fetchConversations); };
        }
    }, []);

    const fetchConversations = async () => {
        try {
            const res = await axiosClient.get('/api/dm/conversations');
            setConversations(res.data.conversations);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full md:w-80 border-r border-zinc-800/50 bg-zinc-950/50 flex flex-col h-full animate-pulse p-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-zinc-800/50" />
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-4 bg-zinc-800/50 rounded w-3/4" />
                            <div className="h-3 bg-zinc-800/50 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full md:w-80 border-r border-zinc-800/50 bg-zinc-950/50 flex flex-col h-full">
            <div className="p-4 border-b border-zinc-800/50">
                <h2 className="text-lg font-bold text-white">Direct Messages</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-6 text-center text-zinc-500 text-sm">
                        No conversations yet. Start chatting from someone's profile!
                    </div>
                ) : (
                    conversations.map((conv) => {
                        const targetUser = conv.participants[0];
                        if (!targetUser) return null;

                        const identity = getIdentity(targetUser.id, targetUser.username);
                        const lastMessage = conv.messages[0];
                        const isActive = conv.id === activeConversationId;

                        return (
                            <Link
                                key={conv.id}
                                to={`/messages/${conv.id}`}
                                className={`flex items-center gap-3 p-4 border-b border-zinc-800/20 hover:bg-zinc-800/50 transition-colors ${isActive ? 'bg-zinc-800/80 border-l-2 border-l-emerald-500' : ''
                                    }`}
                            >
                                <img
                                    src={identity.avatar}
                                    alt={identity.name}
                                    className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="text-sm font-medium text-zinc-200 truncate">
                                            {identity.name}
                                        </h3>
                                        <span className="text-[10px] text-zinc-500 flex-shrink-0 ml-2">
                                            {formatTimeAgo(conv.updatedAt)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-400 truncate">
                                        {lastMessage ? (
                                            <>
                                                {lastMessage.senderId === user?.userId ? 'You: ' : ''}
                                                {lastMessage.content}
                                            </>
                                        ) : (
                                            <span className="italic">No messages yet</span>
                                        )}
                                    </p>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default DMSidebar;
