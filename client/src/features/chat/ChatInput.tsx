import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
    sendMessage: (content: string) => void;
    isConnected: boolean;
}

/**
 * ChatInput Component
 * Floating input bar with icon-only send button
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
        <div className="flex-shrink-0 p-4 bg-zinc-950 border-t border-zinc-800">
            <form onSubmit={handleSubmit} className="relative max-w-full">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isConnected ? 'Type a message...' : 'Connecting...'}
                    disabled={!isConnected}
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
                <button
                    type="submit"
                    disabled={!isConnected || !input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-violet-500 flex items-center justify-center"
                    aria-label="Send message"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
