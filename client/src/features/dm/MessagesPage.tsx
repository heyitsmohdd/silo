import DMSidebar from './DMSidebar';
import DMChatWindow from './DMChatWindow';
import { useParams } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

const MessagesPage = () => {
    const { id } = useParams();

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
                        <p className="text-sm">Select a conversation from the sidebar to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage;
