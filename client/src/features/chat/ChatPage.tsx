import { useChat } from '@/hooks/useChat';
import ChatWindow from './ChatWindow';

// 
// ChatPage Component
// Main page that orchestrates the chat functionality

const ChatPage = () => {
  const { messages, sendMessage, isConnected, currentUser } = useChat();

  return (
    <div className="h-[100dvh] flex flex-col">
      <ChatWindow
        messages={messages}
        sendMessage={sendMessage}
        isConnected={isConnected}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ChatPage;
