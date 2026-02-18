// 
// CreateChannelModal Component
// Modal for creating new channels


import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Hash } from 'lucide-react';
import { createChannel, type Channel } from '@/api/channelApi';

interface CreateChannelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (channel?: Channel) => void;
}

export default function CreateChannelModal({ isOpen, onClose, onSuccess }: CreateChannelModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Channel name is required');
            return;
        }

        setLoading(true);
        try {
            const newChannel = await createChannel(name.trim(), description.trim() || undefined);
            setName('');
            setDescription('');
            onSuccess(newChannel);
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create channel');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setName('');
            setDescription('');
            setError('');
            onClose();
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div className="relative bg-zinc-900 rounded-xl border border-white/10 w-full max-w-md mx-4 shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Hash className="w-5 h-5 text-violet-500" />
                        <h2 className="text-lg font-semibold text-white">Create Channel</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="p-1 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="channel-name" className="block text-sm font-medium text-zinc-300 mb-2">
                            Channel Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="channel-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., exam-prep"
                            className="w-full bg-zinc-800 text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-violet-500 transition-colors"
                            disabled={loading}
                            maxLength={50}
                        />
                        <p className="mt-1 text-xs text-zinc-500">
                            Use lowercase letters, numbers, and hyphens
                        </p>
                    </div>

                    <div>
                        <label htmlFor="channel-description" className="block text-sm font-medium text-zinc-300 mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            id="channel-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What's this channel about?"
                            rows={3}
                            className="w-full bg-zinc-800 text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="flex-1 px-4 py-2 bg-violet-500 hover:bg-violet-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg transition-colors font-medium"
                        >
                            {loading ? 'Creating...' : 'Create Channel'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
