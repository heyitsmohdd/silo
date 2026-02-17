// 
// DeleteChannelModal Component
// Professional confirmation modal for deleting a channel


import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteChannelModalProps {
    isOpen: boolean;
    channelName: string;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export default function DeleteChannelModal({
    isOpen,
    channelName,
    onClose,
    onConfirm,
    loading = false,
}: DeleteChannelModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => !loading && onClose()}
            />

            <div className="relative bg-zinc-900 rounded-xl border border-white/10 w-full max-w-sm mx-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="w-5 h-5" />
                        <h2 className="text-lg font-semibold text-white">Delete Channel</h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-1 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 text-zinc-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-zinc-300 text-sm leading-relaxed">
                            Are you sure you want to delete <span className="font-semibold text-white">#{channelName}</span>?
                        </p>
                        <p className="text-zinc-500 text-xs mt-2">
                            This action cannot be undone. All messages in this channel will be permanently removed.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                'Deleting...'
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    Delete Channel
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
