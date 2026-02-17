// 
// ChannelView Component
// Professional Discord/Slack-style chat interface with member sidebar


import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Hash, Loader2, Trash2, Users, Crown, Clock } from 'lucide-react';
import { fetchChannelMessages, fetchChannel, deleteChannel, type ChannelMessage, type Channel, type User } from '@/api/channelApi';
import { useAuthStore } from '@/stores/useAuthStore';
import DeleteChannelModal from '@/components/channels/DeleteChannelModal';
import JoinChannelModal from '@/components/channels/JoinChannelModal';

import { useSocket } from '@/hooks/useSocket';

export default function ChannelView() {
    const { channelId } = useParams<{ channelId: string }>();
    const navigate = useNavigate();
    const currentUser = useAuthStore((state) => state.user);


    const socket = useSocket();

    const [channel, setChannel] = useState<Channel | null>(null);
    const [messages, setMessages] = useState<ChannelMessage[]>([]);
    const [members, setMembers] = useState<User[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showMembers, setShowMembers] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [hasJoined, setHasJoined] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Effects moved to bottom to prevent hoisting issues

    const loadMessages = useCallback(async () => {
        if (!channelId) return;

        try {
            const [channelData, messagesData] = await Promise.all([
                fetchChannel(channelId),
                fetchChannelMessages(channelId)
            ]);
            setChannel(channelData);
            setMessages(messagesData);
        } catch (error) {
            console.error('Failed to load channel data:', error);
        } finally {
            setLoading(false);
        }
    }, [channelId]);

    const handleJoinChannel = () => {
        setShowJoinModal(false);
        setHasJoined(true);

        if (socket && channelId) {
            socket.emit('join_channel', { channelId });
        }
    };

    const handleDeclineJoin = () => {
        setShowJoinModal(false);
        navigate('/channels');
    };

    const leaveChannel = useCallback(() => {
        if (socket && channelId) {
            socket.emit('leave_channel', { channelId });
        }
    }, [socket, channelId]);

    const handleNewMessage = (message: ChannelMessage) => {
        setMessages((prev) => [...prev, message]);
    };

    const handleMemberListUpdate = (data: { members: User[] }) => {
        setMembers(data.members);
        console.log('👥 Member list updated:', data.members.length, 'members');
    };

    const handleChannelDeleted = useCallback((data: { channelId: string }) => {
        if (data.channelId === channelId) {
            navigate('/channels');
        }
    }, [channelId, navigate]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || !channelId || sending) return;

        setSending(true);

        if (socket) {
            socket.emit('send_channel_message', {
                channelId,
                content: newMessage.trim(),
            });
            setNewMessage('');
        }

        setSending(false);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!channel || !channelId) return;

        setIsDeleting(true);
        try {
            await deleteChannel(channelId);
            setIsDeleteModalOpen(false);
            navigate('/channels');
        } catch (error) {
            console.error('Failed to delete channel:', error);
            alert('Failed to delete channel');
            setIsDeleting(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const getDisplayName = (author: ChannelMessage['author'] | User) => {
        if ('username' in author && author.username) return author.username;
        if (author.firstName && author.lastName) {
            return `${author.firstName} ${author.lastName}`;
        }
        if (author.firstName) return author.firstName;
        return 'Anonymous';
    };

    const getInitials = (user: User) => {
        if (user.username) return user.username.substring(0, 2).toUpperCase();
        if (user.firstName) return user.firstName.substring(0, 1).toUpperCase();
        return 'A';
    };

    const isOwner = channel?.ownerId === currentUser?.userId;
    const isEmpty = members.length === 0;


    useEffect(() => {
        if (!channelId) return;

        loadMessages();
        // Reset state on channel change
        setHasJoined(false);
        setShowJoinModal(true);
    }, [channelId, loadMessages]);


    useEffect(() => {
        if (!socket || !channelId) return;


        console.log('🔌 Socket status in ChannelView:', socket.connected ? 'Connected' : 'Disconnected', socket.id);

        if (socket.connected) {
            socket.on('new_channel_message', (msg) => {
                console.log('📩 New message received:', msg);
                handleNewMessage(msg);
            });
            socket.on('update_member_list', (data) => {
                console.log('👥 Member list updated event:', data);
                handleMemberListUpdate(data);
            });
            socket.on('channel_deleted', handleChannelDeleted);
            socket.on('channel_joined', (data) => {
                console.log('✅ Joined channel confirmed:', data);
            });


            console.log('Emit join_channel listener setup');

            // If we have joined locally, ensure back-end knows
            if (hasJoined) {
                console.log('🚀 Emitting join_channel event');
                socket.emit('join_channel', { channelId });
            }
        }

        return () => {
            if (hasJoined) {
                leaveChannel();
            }
            if (socket) {
                socket.off('new_channel_message');
                socket.off('update_member_list');
                socket.off('channel_deleted');
                socket.off('channel_joined');
            }
        };
    }, [channelId, socket, socket?.connected, hasJoined, leaveChannel, handleChannelDeleted]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
            </div>
        );
    }


    if (!hasJoined && !loading) {
        return (
            <>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <Hash className="w-12 h-12 text-violet-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">#{channel?.name}</h2>
                        <p className="text-zinc-400 text-sm">Join this channel to start chatting</p>
                    </div>
                </div>
                <JoinChannelModal
                    isOpen={showJoinModal}
                    channelName={channel?.name || ''}
                    channelDescription={channel?.description || null}
                    memberCount={members.length}
                    onClose={handleDeclineJoin}
                    onConfirm={handleJoinChannel}
                />
            </>
        );
    }

    return (
        <div className="flex h-full bg-zinc-950">
            <div className="flex-1 flex flex-col">
                <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Hash className="w-5 h-5 text-violet-500" />
                        <div>
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                {channel?.name || 'Loading...'}
                                {isEmpty && (
                                    <span className="flex items-center gap-1 text-xs text-amber-500 font-normal">
                                        <Clock className="w-3 h-3" />
                                        Empty: Deleting in 60m
                                    </span>
                                )}
                            </h2>
                            {channel?.description && (
                                <p className="text-sm text-zinc-400">{channel.description}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowMembers(!showMembers)}
                            className="lg:hidden p-2 rounded-md hover:bg-white/5 transition-colors"
                            title="Toggle Members"
                        >
                            <Users className="w-5 h-5 text-zinc-400" />
                        </button>

                        {isOwner && !channel?.isDefault && (
                            <button
                                onClick={handleDeleteClick}
                                className="p-2 rounded-md hover:bg-red-500/10 transition-colors group"
                                title="Delete Channel"
                            >
                                <Trash2 className="w-5 h-5 text-zinc-400 group-hover:text-red-500" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className="group">
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm font-semibold text-white">
                                    {getDisplayName(message.author)}
                                </span>
                                <span className="text-xs text-zinc-500">
                                    {formatTime(message.createdAt)}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-300 mt-1">
                                {message.content}
                            </p>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-white/5 p-4">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={`Message #${channel?.name || 'channel'}`}
                            className="flex-1 bg-zinc-900 text-white px-4 py-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-violet-500 transition-colors text-sm"
                            disabled={sending}
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || sending}
                            className="bg-violet-500 hover:bg-violet-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                        >
                            {sending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {showMembers && (
                <div className="w-60 border-l border-white/5 bg-zinc-950/50 flex flex-col hidden lg:flex">
                    <div className="px-4 py-4 border-b border-white/5">
                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Members — {members.length}
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        {members.length === 0 ? (
                            <p className="text-sm text-zinc-500 text-center py-8">
                                No members online
                            </p>
                        ) : (
                            <div className="space-y-1">
                                {members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/5 transition-colors"
                                    >
                                        <div className="relative">
                                            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-semibold">
                                                {getInitials(member)}
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-950" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white truncate flex items-center gap-1">
                                                {getDisplayName(member)}
                                                {member.id === channel?.ownerId && (
                                                    <Crown className="w-3 h-3 text-amber-500 flex-shrink-0" />
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <DeleteChannelModal
                isOpen={isDeleteModalOpen}
                channelName={channel?.name || ''}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
            />
        </div>
    );
}
