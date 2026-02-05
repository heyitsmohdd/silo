import { useEffect, useRef } from 'react';
import type { Message, User } from '@/hooks/useChat';
import ChatInput from './ChatInput';
import ChatSearch from './ChatSearch';

interface ChatWindowProps {
  messages: Message[];
  isConnected: boolean;
  currentUser: User | null;
  sendMessage: (content: string) => void;
}

/**
 * ChatWindow Component
 * Displays scrollable list of chat messages with iMessage-style bubbles
 */
const ChatWindow = ({ messages, isConnected, currentUser, sendMessage }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSearchResultClick = (messageId: string) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageElement.classList.add('ring-2', 'ring-violet-500');
      setTimeout(() => {
        messageElement.classList.remove('ring-2', 'ring-violet-500');
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header - Transparent Glass */}
      <div className="flex-shrink-0 glass-header border-b border-white/5 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-lg text-white">
              Batch Channel
            </h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              {currentUser?.year} • {currentUser?.branch}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <ChatSearch
              messages={messages}
              onResultClick={handleSearchResultClick}
            />

            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium text-zinc-400">
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-zinc-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message: Message, index: number) => {
            const isMe = message.sender.id === currentUser?.userId;
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const isNewSender = !prevMessage || prevMessage.sender.id !== message.sender.id;

            return (
              <div
                key={message.id}
                id={`message-${message.id}`}
                className={`flex transition-all duration-300 ${isMe ? 'justify-end' : 'justify-start'
                  } ${isNewSender ? 'mt-4' : 'mt-1'}`}
              >
                <div
                  className={`max-w-[75%] ${isMe
                      ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-violet-500/20'
                      : 'bg-zinc-900/60 backdrop-blur-sm border border-white/10 text-zinc-100 rounded-2xl rounded-bl-md'
                    }`}
                >
                  {/* Sender Info - Only for others and only on first message in sequence */}
                  {!isMe && isNewSender && (
                    <div className="px-4 pt-3 pb-1 text-xs font-medium text-zinc-400">
                      {message.sender.firstName || message.sender.lastName
                        ? `${message.sender.firstName || ''} ${message.sender.lastName || ''}`.trim()
                        : 'Unknown User'}
                    </div>
                  )}

                  {/* Message Content */}
                  <div className={`px-4 ${!isMe && isNewSender ? 'py-2' : 'py-3'} break-words`}>
                    {message.content}
                  </div>

                  {/* Timestamp */}
                  <div className={`px-4 pb-2 text-[10px] text-right ${isMe ? 'text-violet-100' : 'text-zinc-500'
                    }`}>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Fixed at Bottom */}
      <ChatInput sendMessage={sendMessage} isConnected={isConnected} />
    </div>
  );
};

export default ChatWindow;
