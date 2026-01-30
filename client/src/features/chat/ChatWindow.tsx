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
        <div className="flex flex-col h-[calc(100vh-theme(spacing.14))]">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 z-10 pr-20">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-bold text-lg text-neutral-900 dark:text-neutral-50">
                            Batch Channel
                        </h1>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                            {currentUser?.year} • {currentUser?.branch}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            {isConnected ? 'Online' : 'Offline'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-muted-foreground">
                            No messages yet. Start the conversation!
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
                                    className={`max-w-[70%] rounded-lg ${isMe
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-background border border-border text-foreground shadow-sm'
                                        }`}
                                >
                                    {/* Sender Info */}
                                    {!isMe && (
                                        <div className="px-4 pt-3 pb-1 text-xs font-medium text-muted-foreground">
                                            {message.sender.firstName || message.sender.lastName
                                                ? `${message.sender.firstName || ''} ${message.sender.lastName || ''}`.trim()
                                                : 'Unknown User'
                                            }
                                        </div>
                                    )}

                                    {/* Message Content */}
                                    <div className="px-4 py-2 break-words">
                                        {message.content}
                                    </div>

                                    {/* Timestamp */}
                                    <div className={`px-4 pb-2 text-[10px] text-right ${isMe ? 'text-blue-100' : 'text-muted-foreground'}`}>
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
