import { Bug, MessageSquare, ExternalLink, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
    const adminEmail = "siloedu00@gmail.com";
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Handle escape key
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative z-50 w-full max-w-md mx-4 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 p-6">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center space-y-6 mt-2">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center ring-1 ring-white/10">
                        <Bug className="w-6 h-6 text-zinc-400" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-white tracking-tight">
                            Help us improve Silo.
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            Found a glitch or have an idea? Let us know.
                        </p>
                    </div>

                    <div className="grid w-full gap-3">
                        <a
                            href={`mailto:${adminEmail}?subject=Silo Bug Report`}
                            className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 transition-all group cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                                    <Bug className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-zinc-100 group-hover:text-white transition-colors">Report a Bug</div>
                                    <div className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">Something's not working right</div>
                                </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                        </a>

                        <a
                            href={`mailto:${adminEmail}?subject=Silo Feedback`}
                            className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 transition-all group cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-zinc-100 group-hover:text-white transition-colors">Send Feedback</div>
                                    <div className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">Feature request or general thoughts</div>
                                </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                        </a>
                    </div>

                    <div className="pt-4 border-t border-white/5 w-full">
                        <div className="text-xs text-zinc-500">
                            Direct email: <span className="select-all text-zinc-400 hover:text-zinc-300 transition-colors cursor-text">{adminEmail}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ContactModal;
