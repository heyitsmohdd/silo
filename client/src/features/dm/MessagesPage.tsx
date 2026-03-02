import DMSidebar from './DMSidebar';
import DMChatWindow from './DMChatWindow';
import { useParams } from 'react-router-dom';
import { MessageSquare, X, Info } from 'lucide-react';
import { useState } from 'react';

const MessagesPage = () => {
    const { id } = useParams();
    const [showPrompt, setShowPrompt] = useState(true);

    return (
        <div className="flex bg-zinc-950 rounded-2xl border border-zinc-800/50 overflow-hidden shadow-2xl h-[calc(100vh-120px)] min-h-[500px]">
            {/* Desktop: Sidebar is always visible. Mobile: Sidebar visible only if no conversation is selected */}
            <div className={`w-full md:w-80 h-full ${id ? 'hidden md:block' : 'block'}`}>
                <DMSidebar />
            </div>

            {/* Desktop: Chat Window always visible. Mobile: Chat Window visible only if a conversation is selected */}
            <div className={`flex-1 h-full ${id ? 'block' : 'hidden md:block'}`}>
                {id ? (
                    <DMChatWindow />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 bg-zinc-900/20">
                        <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h3 className="text-lg font-medium text-zinc-300 mb-2">Your Messages</h3>
                        <p className="text-sm">Select a conversation from the sidebar to start chatting.</p>

                        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-4 max-w-sm text-center">
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                <span className="font-semibold text-zinc-300 block mb-1">Want to start a new chat?</span>
                                You can message anyone directly by clicking on their avatar or profile anywhere in the Dashboard.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Helper Popup - Mounted at Root so it isn't hidden by Sidebar cuts */}
            {!id && showPrompt && (
                <div className="fixed bottom-24 left-4 right-4 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-xl p-4 z-[100] animate-in slide-in-from-bottom-5 md:hidden">
                    <button
                        onClick={() => setShowPrompt(false)}
                        className="absolute top-2 right-2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors bg-zinc-800/50 rounded-full"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Info className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed pr-2">
                            <span className="font-semibold text-white block mb-0.5 text-[13px]">How to start a chat</span>
                            You can message anyone directly by clicking on their avatar or profile anywhere in the Dashboard.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagesPage;
