// 
// JoinChannelModal Component
// Confirmation modal for joining a channel


import { Hash, Users, X } from 'lucide-react';

interface JoinChannelModalProps {
    isOpen: boolean;
    channelName: string;
    channelDescription: string | null;
    memberCount: number;
    onClose: () => void;
    onConfirm: () => void;
}

export default function JoinChannelModal({
    isOpen,
    channelName,
    channelDescription,
    memberCount,
    onClose,
    onConfirm,
}: JoinChannelModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-zinc-900 rounded-xl border border-white/10 w-full max-w-md mx-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-2 text-violet-500">
                        <Hash className="w-5 h-5" />
                        <h2 className="text-lg font-semibold text-white">Join Channel</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Hash className="w-5 h-5 text-violet-500" />
                            <h3 className="text-xl font-semibold text-white">{channelName}</h3>
                        </div>

                        {channelDescription && (
                            <p className="text-zinc-400 text-sm mb-4">
                                {channelDescription}
                            </p>
                        )}

                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <Users className="w-4 h-4" />
                            <span>{memberCount} {memberCount === 1 ? 'member' : 'members'} online</span>
                        </div>

                        <div className="mt-4 p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                            <p className="text-sm text-violet-300">
                                You'll be able to see all messages and participate in discussions.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                        >
                            <Hash className="w-4 h-4" />
                            Join Channel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
