import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, Lock, Plus, Users } from 'lucide-react';
import { fetchChannels, createChannel, type Channel } from '@/api/channelApi';

const ChannelListPage = () => {
    const navigate = useNavigate();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchChannels()
            .then(setChannels)
            .finally(() => setIsLoading(false));
    }, []);

    const handleCreate = async () => {
        if (!newName.trim() || isCreating) return;
        try {
            setIsCreating(true);
            const channel = await createChannel(newName.trim(), newDesc.trim());
            navigate(`/channels/${channel.id}`);
        } catch (e) {
            console.error('Failed to create channel', e);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <h1 className="text-lg font-bold">Batch Chat</h1>
                </div>
                <button
                    onClick={() => setShowCreate(v => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    New
                </button>
            </div>

            {/* Create Channel Inline Form */}
            {showCreate && (
                <div className="mx-4 mt-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <input
                        autoFocus
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        placeholder="Channel name..."
                        className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                    <input
                        value={newDesc}
                        onChange={e => setNewDesc(e.target.value)}
                        placeholder="Description (optional)"
                        className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleCreate}
                            disabled={!newName.trim() || isCreating}
                            className="flex-1 py-2 rounded-lg bg-emerald-500 text-zinc-950 font-semibold text-sm disabled:opacity-50 transition-opacity"
                        >
                            {isCreating ? 'Creating…' : 'Create'}
                        </button>
                        <button
                            onClick={() => setShowCreate(false)}
                            className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-400 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Channel List */}
            <div className="px-4 mt-4 space-y-2">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-16 rounded-2xl bg-zinc-900/60 animate-pulse" />
                    ))
                ) : channels.length === 0 ? (
                    <div className="text-center py-16 text-zinc-500">
                        <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No channels yet. Create one!</p>
                    </div>
                ) : (
                    channels.map(channel => (
                        <button
                            key={channel.id}
                            onClick={() => navigate(`/channels/${channel.id}`)}
                            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/40 hover:bg-zinc-800/60 border border-zinc-800/50 hover:border-zinc-700 transition-all text-left group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                {channel.type === 'PRIVATE'
                                    ? <Lock className="w-4 h-4 text-emerald-400" />
                                    : <Hash className="w-4 h-4 text-emerald-400" />
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-zinc-100 group-hover:text-white truncate">
                                    {channel.name}
                                </p>
                                {channel.description && (
                                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                                        {channel.description}
                                    </p>
                                )}
                            </div>
                            {channel.isDefault && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                                    default
                                </span>
                            )}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChannelListPage;
