// 
// ChannelList Component
// Displays list of public channels in sidebar with create functionality


import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Hash, Plus } from 'lucide-react';
import { fetchChannels, type Channel } from '@/api/channelApi';
import socketService from '@/lib/socket';
import CreateChannelModal from './CreateChannelModal';

interface ChannelListProps {
    isModalOpen?: boolean;
    onModalClose?: () => void;
    isMobile?: boolean; // added mobile prop
}

export default function ChannelList({ isModalOpen = false, onModalClose, isMobile }: ChannelListProps) {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        loadChannels();

        // Listen for new channels
        const socket = socketService.getSocket();
        if (socket) {
            socket.on('channel_created', handleChannelCreated);
        }

        return () => {
            if (socket) {
                socket.off('channel_created', handleChannelCreated);
            }
        };
    }, []);

    const loadChannels = async () => {
        try {
            const data = await fetchChannels();
            setChannels(data);
        } catch (error) {
            console.error('Failed to load channels:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChannelCreated = (newChannel: Channel) => {
        setChannels((prev) => {
            if (prev.some(c => c.id === newChannel.id)) return prev;
            return [...prev, newChannel];
        });
        console.log('✅ New channel added to list:', newChannel.name);
    };

    const handleCreateSuccess = (channel?: Channel) => {
        if (channel) {
            navigate(`/channels/${channel.id}`);
        }
    };

    const handleChannelClick = (channelId: string) => {
        navigate(`/channels/${channelId}`);
    };

    const isActive = (channelId: string) => {
        return location.pathname === `/channels/${channelId}`;
    };

    const handleModalClose = () => {
        if (onModalClose) {
            onModalClose();
        }
    };

    if (loading) {
        return (
            <div className="px-3 py-2">
                <p className={`${isMobile ? '' : 'w-0 opacity-0 overflow-hidden md:group-hover:w-auto md:group-hover:opacity-100 transition-all duration-200'} text-sm text-zinc-500 whitespace-nowrap`}>Loading channels...</p>
            </div>
        );
    }

    return (
        <>
            <CreateChannelModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSuccess={handleCreateSuccess}
            />

            <div className="space-y-1">
                {channels.map((channel) => (
                    <button
                        key={channel.id}
                        onClick={() => handleChannelClick(channel.id)}
                        className={`
                            w-full flex items-center px-3 py-2 rounded-lg
                            transition-colors text-left
                            ${isActive(channel.id)
                                ? 'bg-white/10 text-white'
                                : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-300'
                            }
                        `}
                    >
                        <Hash className="w-5 h-5 flex-shrink-0" />
                        <span className={`${isMobile ? 'ml-2' : 'w-0 opacity-0 overflow-hidden md:group-hover:w-auto md:group-hover:opacity-100 md:group-hover:ml-2 transition-all duration-200 delay-75 whitespace-nowrap'} text-sm font-medium truncate`}>{channel.name}</span>
                    </button>
                ))}
            </div>
        </>
    );
}

// 
// ChannelListHeader Component
// Header for channel list with create button

interface ChannelListHeaderProps {
    onCreateClick: () => void;
    isMobile?: boolean; // added mobile prop
}

export function ChannelListHeader({ onCreateClick, isMobile }: ChannelListHeaderProps) {
    return (
        <div className="flex items-center justify-between px-3 mb-2 h-6">
            <h3 className={`${isMobile ? '' : 'w-0 opacity-0 overflow-hidden md:group-hover:w-auto md:group-hover:opacity-100 transition-all duration-200 delay-75 whitespace-nowrap'} text-xs font-semibold text-zinc-500 uppercase tracking-wider`}>
                Community Rooms
            </h3>
            <button
                onClick={onCreateClick}
                className={`${isMobile ? '' : 'w-0 opacity-0 overflow-hidden md:group-hover:w-auto md:group-hover:opacity-100 transition-all duration-200 delay-75'} p-1 rounded-md hover:bg-white/10 transition-colors group/btn`}
                title="Create Channel"
            >
                <Plus className="w-4 h-4 text-zinc-500 group-hover/btn:text-zinc-300" />
            </button>
        </div>
    );
}
