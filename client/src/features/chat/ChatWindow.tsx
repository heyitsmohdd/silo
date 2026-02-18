import { useEffect, useRef } from 'react';
import type { Message } from '@/hooks/useChat';
import ChatInput from './ChatInput';
import ChatSearch from './ChatSearch';
import { getIdentity } from '@/lib/identity';
import { TypingIndicator } from '@/components/ui/TypingIndicator';
import { useChat } from '@/hooks/useChat';

// 
// ChatWindow Component
// GitHub Discussions / Discord style message list with avatars

const ChatWindow = () => {
  const { messages, isConnected, currentUser, sendMessage, sendTyping, typingUsers } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSearchResultClick = (messageId: string) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageElement.classList.add('ring-2', 'ring-emerald-500');
      setTimeout(() => {
        messageElement.classList.remove('ring-2', 'ring-emerald-500');
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 glass-header border-b border-white/5 px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="font-semibold text-base md:text-lg text-white">
              Batch Channel
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
              {currentUser?.year} • {currentUser?.branch}
            </p>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <ChatSearch
              messages={messages}
              onResultClick={handleSearchResultClick}
            />

            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs md:text-sm font-medium text-zinc-400">
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-zinc-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message: Message, index: number) => {
            const isMe = message.sender.id === currentUser?.userId;
            const identity = getIdentity(message.sender.id, message.sender.username);
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const isNewSender = !prevMessage || prevMessage.sender.id !== message.sender.id;

            return (
              <div
                key={message.id}
                id={`message-${message.id}`}
                className={`flex gap-3 transition-all duration-300 ${isNewSender ? 'mt-4' : 'mt-1'
                  }`}
              >
                {isNewSender ? (
                  <img
                    src={identity.avatar}
                    alt={identity.name}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-900 ring-2 ring-zinc-800 flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 md:w-10 flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  {isNewSender && (
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-sm text-zinc-200">
                        {identity.name}
                      </span>
                      {isMe && (
                        <span className="text-xs text-emerald-400 font-medium">
                          (You)
                        </span>
                      )}
                      <span className="text-xs text-zinc-500">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}

                  <div
                    className={`rounded-lg px-3 py-2 break-words ${isMe
                      ? 'bg-zinc-800/30 border border-zinc-700/50'
                      : 'bg-transparent'
                      }`}
                  >
                    <p className="text-sm md:text-sm text-zinc-100 leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 bg-zinc-950">
        <TypingIndicator
          isTyping={typingUsers.length > 0}
          names={typingUsers.map(u => u.firstName)}
        />
        <ChatInput
          sendMessage={sendMessage}
          onTyping={sendTyping}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
