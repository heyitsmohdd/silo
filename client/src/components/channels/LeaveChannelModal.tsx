import { X, LogOut } from 'lucide-react';
import { createPortal } from 'react-dom';

interface LeaveChannelModalProps {
    isOpen: boolean;
    channelName: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LeaveChannelModal({ isOpen, channelName, onClose, onConfirm }: LeaveChannelModalProps) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <LogOut className="w-5 h-5 text-amber-500" />
                        Leave Channel
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-zinc-300">
                        Are you sure you want to leave <span className="font-semibold text-white">#{channelName}</span>?
                        You will stop receiving messages from this channel.
                    </p>
                </div>

                <div className="px-6 py-4 bg-zinc-950/50 border-t border-white/5 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-500 hover:bg-amber-600 text-black transition-colors"
                    >
                        Leave Channel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
