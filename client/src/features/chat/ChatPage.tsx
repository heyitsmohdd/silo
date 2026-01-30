import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import { useChat } from '@/hooks/useChat';

/**
 * Main Chat Page Component
 * Combines ChatWindow and ChatInput
 */
const ChatPage = () => {
    // Single useChat hook call to prevent duplicate listeners
    const chatHook = useChat();

    return (
        <div className="h-screen flex flex-col">
            <ChatWindow {...chatHook} />
            <ChatInput {...chatHook} />
        </div>
    );
};

export default ChatPage;
