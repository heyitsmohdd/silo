import { useState, type FormEvent } from 'react';

interface ChatInputProps {
    sendMessage: (content: string) => void;
    isConnected: boolean;
}

/**
 * ChatInput Component
 * Fixed bottom input bar for sending messages
 */
const ChatInput = ({ sendMessage, isConnected }: ChatInputProps) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!input.trim() || !isConnected) return;

        sendMessage(input);
        setInput('');
    };

    return (
        <div className="flex-shrink-0 bg-background border-t border-border p-4">
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-full">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isConnected ? 'Type a message...' : 'Connecting...'}
                    disabled={!isConnected}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                    type="submit"
                    disabled={!isConnected || !input.trim()}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
