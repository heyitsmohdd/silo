import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '@/lib/axios';
import type { DirectMessage } from '@/types/dm.types';
import { useAuthStore } from '@/stores/useAuthStore';
import { getIdentity } from '@/lib/identity';
import { ShieldAlert, Send } from 'lucide-react';
import type { Socket } from 'socket.io-client';
import socketService from '@/lib/socket';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog';

type TargetUser = {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
};

const DMChatWindow = () => {
    const { id: conversationId } = useParams();
    const { user } = useAuthStore();
    const [messages, setMessages] = useState<DirectMessage[]>([]);
    const [targetUser, setTargetUser] = useState<TargetUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockedByMe, setBlockedByMe] = useState(false);
    const [blockedByThem, setBlockedByThem] = useState(false);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const topElementRef = useRef<HTMLDivElement>(null);

    // Socket ref
    const socketRef = useRef<Socket | null>(null);

    // Fetch messages logic (Cursor based)
    const fetchMessages = useCallback(async (cursor: string | null) => {
        if (!conversationId) return;

        try {
            const endpoint = `/api/dm/messages/${conversationId}${cursor ? `?cursor=${cursor}` : ''}`;
            const res = await axiosClient.get(endpoint);

            const newMessages = res.data.messages;

            if (cursor) {
                // Prepend older messages when scrolling up
                setMessages(prev => [...prev, ...newMessages]);
            } else {
                // Initial load
                setMessages(newMessages);
            }

            setNextCursor(res.data.nextCursor);
            setHasMore(!!res.data.nextCursor);

        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    }, [conversationId]);

    // Initial Fetch & Socket Setup
    useEffect(() => {
        if (!conversationId || !user) return;

        // Auto-scroll on initial load only
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                // Fetch just this single conversation — much more efficient
                const convRes = await axiosClient.get(`/api/dm/conversations/${conversationId}`);
                const conversation = convRes.data.conversation;

                if (conversation) {
                    const target: TargetUser = conversation.participants[0];
                    setTargetUser(target);
                    const blockRes = await axiosClient.get(`/api/dm/block/status/${target.id}`);
                    setIsBlocked(blockRes.data.isBlocked);
                    setBlockedByMe(blockRes.data.blockedByMe);
                    setBlockedByThem(blockRes.data.blockedByThem);
                }

                await fetchMessages(null);
                scrollToBottom();
            } catch (error) {
                console.error('Failed to load DM context:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();

        // Socket logic using global context
        const socket = socketService.getSocket();
        if (!socket) {
            console.error('❌ [DMChatWindow] Global socket not found.');
            return;
        }

        socketRef.current = socket;

        // Emit immediately if already connected
        if (socket.connected) {
            socket.emit('join_dm', { conversationId });
        }

        const handleConnect = () => {
            socket.emit('join_dm', { conversationId });
        };

        const handleReceiveDm = (message: DirectMessage) => {
            console.log('📬 [DMChatWindow] Received socket message:', message);
            // Only append if it belongs to this room
            if (message.conversationId === conversationId) {
                setMessages(prev => [message, ...prev.filter(m => m.id !== message.id)]);
                scrollToBottom();
            }
        };

        const handleError = (data: { message: string }) => {
            if (data.message === 'Message cannot be delivered') {
                setErrorMessage('You cannot send a message to this user.');
                setTimeout(() => setErrorMessage(null), 4000);
            } else if (data.message === 'Too many messages, please slow down.') {
                setErrorMessage('Slow down! You are sending messages too fast.');
                setTimeout(() => setErrorMessage(null), 4000);
            }
        };

        socket.on('connect', handleConnect);
        socket.on('receive_dm', handleReceiveDm);
        socket.on('error', handleError);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('receive_dm', handleReceiveDm);
            socket.off('error', handleError);
        };
    }, [conversationId, user, fetchMessages]);

    // Infinite Scroll Observer Setup
    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
            setIsLoadingMore(true);

            // Capture scroll height before loading more
            const container = chatContainerRef.current;
            const previousScrollHeight = container?.scrollHeight || 0;

            fetchMessages(nextCursor).then(() => {
                setIsLoadingMore(false);
                // Restore scroll position so it doesn't jump to the top visually
                if (container) {
                    const newScrollHeight = container.scrollHeight;
                    container.scrollTop = newScrollHeight - previousScrollHeight;
                }
            });
        }
    }, [hasMore, isLoading, isLoadingMore, nextCursor, fetchMessages]);

    useEffect(() => {
        const element = topElementRef.current;
        const option = { root: null, rootMargin: '20px', threshold: 0 };
        observerRef.current = new IntersectionObserver(handleObserver, option);
        if (element) observerRef.current.observe(element);

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [handleObserver]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputValue.trim() || isBlocked || !socketRef.current || !conversationId) return;

        const payload = {
            conversationId,
            content: inputValue.trim()
        };
        console.log('📤 [DMChatWindow] Emitting send_dm:', payload);

        socketRef.current.emit('send_dm', payload);

        setInputValue('');
        // Optimistic UI updates are handled by the 'receive_dm' event echoing the message back
    };

    const handleBlockUser = async () => {
        if (!targetUser) return;
        try {
            await axiosClient.post('/api/dm/block', { targetUserId: targetUser.id });
            setIsBlocked(true);
            setBlockedByMe(true);
            setIsBlockModalOpen(false);
        } catch (error) {
            console.error('Failed to block user:', error);
            setErrorMessage('Failed to block user. Please try again.');
            setTimeout(() => setErrorMessage(null), 4000);
        }
    };

    const handleUnblockUser = async () => {
        if (!targetUser) return;
        try {
            await axiosClient.post('/api/dm/unblock', { targetUserId: targetUser.id });
            setBlockedByMe(false);
            if (!blockedByThem) {
                setIsBlocked(false);
            }
        } catch (error) {
            console.error('Failed to unblock user:', error);
            setErrorMessage('Failed to unblock user. Please try again.');
            setTimeout(() => setErrorMessage(null), 4000);
        }
    };

    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center text-zinc-500">Loading conversation...</div>;
    }

    if (!targetUser) {
        return <div className="flex-1 flex items-center justify-center text-zinc-500">Conversation not found</div>;
    }

    const targetIdentity = getIdentity(targetUser.id, targetUser.username);

    return (
        <div className="flex-1 flex flex-col h-full bg-zinc-950">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-zinc-800/50 glass-header">
                <div className="flex items-center gap-3">
                    <img
                        src={targetIdentity.avatar}
                        alt={targetIdentity.name}
                        className="w-10 h-10 rounded-full border border-zinc-700"
                    />
                    <div>
                        <h2 className="text-white font-bold">{targetIdentity.name}</h2>
                        <span className="text-xs text-zinc-400">
                            {targetUser.role === 'STUDENT' ? 'Verified Student' : 'Professor'}
                        </span>
                    </div>
                </div>

                {blockedByMe ? (
                    <button
                        onClick={handleUnblockUser}
                        className="px-3 py-1.5 text-sm font-medium bg-zinc-800 text-zinc-300 hover:text-white rounded-lg transition-colors border border-zinc-700/50"
                    >
                        Unblock
                    </button>
                ) : (
                    <button
                        onClick={() => setIsBlockModalOpen(true)}
                        className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Block User"
                    >
                        <ShieldAlert className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Chat Area */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-4"
            >
                <div ref={messagesEndRef} />

                {errorMessage && (
                    <div className="sticky bottom-0 mb-2 mx-auto px-4 py-2 bg-red-900/60 border border-red-700/50 text-red-300 text-xs rounded-xl text-center">
                        {errorMessage}
                    </div>
                )}

                {messages.map((message) => {
                    const isMe = message.senderId === user?.userId;
                    return (
                        <div
                            key={message.id}
                            className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                        >
                            <div
                                className={`px-4 py-2 rounded-2xl ${isMe
                                    ? 'bg-emerald-600 text-white rounded-br-sm'
                                    : 'bg-zinc-800 text-zinc-200 rounded-bl-sm border border-zinc-700/50'
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                            <span className="text-[10px] text-zinc-500 mt-1 px-1">
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    );
                })}

                <div ref={topElementRef} className="h-4 w-full flex-shrink-0 flex justify-center items-center">
                    {isLoadingMore && <span className="text-xs text-zinc-500 animate-pulse">Loading older messages...</span>}
                </div>
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 p-4 border-t border-zinc-800/50 bg-zinc-950">
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-end gap-2"
                >
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder={blockedByMe ? "You blocked this user. Unblock them to send a message." : (blockedByThem ? "You cannot reply to this conversation" : "Message...")}
                        disabled={isBlocked}
                        className={`flex-1 max-h-32 min-h-[44px] bg-zinc-900 border border-zinc-700/50 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none ${isBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isBlocked}
                        className="h-[44px] w-[44px] rounded-xl bg-emerald-500 text-zinc-950 flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-400 transition-colors"
                    >
                        <Send className="w-5 h-5 -ml-0.5" />
                    </button>
                </form>
            </div>

            {/* Block User Dialog */}
            <Dialog open={isBlockModalOpen} onOpenChange={setIsBlockModalOpen}>
                <DialogContent onClose={() => setIsBlockModalOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Block {targetIdentity.name}?</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="mt-2 mb-6">
                        They won't be able to message you. You can unblock them later from your profile settings.
                    </DialogDescription>
                    <div className="flex justify-end gap-3 flex-wrap">
                        <button
                            onClick={() => setIsBlockModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleBlockUser}
                            className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                            Block User
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DMChatWindow;
