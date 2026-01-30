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
        <div className="sticky bottom-0 bg-white dark:bg-black border-t-4 border-black dark:border-white p-4">
            <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isConnected ? 'TYPE_MESSAGE...' : 'CONNECTING...'}
                    disabled={!isConnected}
                    className="w-full border-2 border-black dark:border-white p-3 font-mono text-sm focus:outline-none focus:border-black dark:focus:border-white bg-white dark:bg-black disabled:opacity-30"
                />
                <button
                    type="submit"
                    disabled={!isConnected || !input.trim()}
                    className="px-8 py-3 bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white font-black uppercase text-sm hover:translate-y-1 transition-transform disabled:opacity-30 disabled:hover:translate-y-0"
                >
                    [ SEND ]
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
