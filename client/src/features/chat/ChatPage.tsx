import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';

/**
 * Main Chat Page Component
 * Combines ChatWindow and ChatInput
 */
const ChatPage = () => {
    return (
        <div className="h-screen flex flex-col">
            <ChatWindow />
            <ChatInput />
        </div>
    );
};

export default ChatPage;
