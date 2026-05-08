import { Bug, MessageSquare, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
    const adminEmail = "siloedu00@gmail.com";
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
    }, []);

    if (!mounted || !isOpen) return null;

    return (
        <>
            {/* Mobile overlay */}
            <div className="fixed inset-0 z-40 md:hidden" onClick={onClose} />

            <div className="absolute left-0 bottom-full mb-2 md:left-full md:bottom-0 md:mb-0 md:ml-2 w-72 z-50 bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-fade-in-scale origin-bottom-left transition-all duration-300">
                <div className="p-4 border-b border-zinc-800 bg-gradient-to-br from-zinc-800/80 to-zinc-900">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-950 flex items-center justify-center ring-1 ring-white/10 shadow-lg">
                            <Bug className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-sm font-bold text-white truncate">Help & Feedback</h2>
                            <p className="text-xs text-zinc-400 truncate">Let us know your thoughts</p>
                        </div>
                    </div>
                </div>

                <div className="p-2 space-y-1">
                    <a
                        href={`mailto:${adminEmail}?subject=Silo Bug Report`}
                        onClick={onClose}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-800/80 transition-all text-zinc-300 hover:text-white group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-md bg-zinc-800/50 text-zinc-400 group-hover:bg-red-500/10 group-hover:text-red-400 transition-colors">
                                <Bug className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">Report a Bug</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    </a>

                    <a
                        href={`mailto:${adminEmail}?subject=Silo Feedback`}
                        onClick={onClose}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-800/80 transition-all text-zinc-300 hover:text-white group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-md bg-zinc-800/50 text-zinc-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">Send Feedback</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    </a>
                </div>
            </div>
        </>
    );
};

export default ContactModal;
