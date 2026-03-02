import ChatWindow from './ChatWindow';

// 
// ChatPage Component
// Main page that orchestrates the chat functionality

const ChatPage = () => {
  return (
    <div className="h-[calc(100dvh-152px)] md:h-[calc(100vh-120px)] w-full flex flex-col min-h-0">
      <ChatWindow />
    </div>
  );
};

export default ChatPage;
