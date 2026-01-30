import { useEffect, useRef } from 'react';
import type { Message, User } from '@/hooks/useChat';

interface ChatWindowProps {
    messages: Message[];
    isConnected: boolean;
    currentUser: User | null;
}

/**
 * ChatWindow Component
 * Displays scrollable list of chat messages with message bubbles
 */
const ChatWindow = ({ messages, isConnected, currentUser }: ChatWindowProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-black border-b-4 border-black dark:border-white p-4 z-10">
                <div className="flex items-center justify-between">
                    <h1 className="font-black text-xl uppercase">
                        BATCH_CHANNEL :: {isConnected ? 'ONLINE' : 'OFFLINE'}
                    </h1>
                    <div className="font-mono text-xs opacity-50">
                        {currentUser?.year} - {currentUser?.branch}
                    </div>
                </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full opacity-30">
                        <p className="font-mono text-sm uppercase">
                            &gt; NO_MESSAGES_YET
                        </p>
                    </div>
                ) : (
                    messages.map((message: Message) => {
                        const isMe = message.sender.id === currentUser?.userId;

                        return (
                            <div
                                key={message.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] ${isMe
                                        ? 'ml-auto bg-black text-white border border-black'
                                        : 'mr-auto bg-white text-black border border-black'
                                        }`}
                                >
                                    {/* Sender Info */}
                                    {!isMe && (
                                        <div className="px-4 pt-3 pb-1 font-mono text-xs opacity-60 uppercase">
                                            {message.sender.firstName || message.sender.lastName
                                                ? `${message.sender.firstName || ''} ${message.sender.lastName || ''}`.trim()
                                                : 'Unknown User'
                                            }
                                        </div>
                                    )}

                                    {/* Message Content */}
                                    <div className="px-4 py-3 break-words">
                                        {message.content}
                                    </div>

                                    {/* Timestamp */}
                                    <div className="px-4 pb-2 font-mono text-[10px] opacity-40 text-right">
                                        {new Date(message.createdAt).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatWindow;
