import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';
import GifPicker from '@/components/ui/GifPicker';

interface ChatInputProps {
    sendMessage: (content: string) => void;
    onTyping?: (isTyping: boolean) => void;
    isConnected: boolean;
}

// 
// ChatInput Component
// Floating input bar with icon-only send button

const ChatInput = ({ sendMessage, onTyping, isConnected }: ChatInputProps) => {
    const [input, setInput] = useState('');
    const [showGifPicker, setShowGifPicker] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowGifPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        if (onTyping) {
            onTyping(e.target.value.length > 0);
        }
    };

    const handleGifSelect = (gifUrl: string) => {
        sendMessage(`\n![GIF](${gifUrl})`);
        setShowGifPicker(false);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!input.trim() || !isConnected) return;

        sendMessage(input);
        setInput('');
        if (onTyping) onTyping(false);
    };

    return (
        <div className="flex-shrink-0 p-3 md:p-4 bg-zinc-950 border-t border-zinc-800 relative">
            {showGifPicker && (
                <div ref={pickerRef} className="absolute bottom-full right-4 mb-2 z-50">
                    <GifPicker onGifSelect={handleGifSelect} onClose={() => setShowGifPicker(false)} />
                </div>
            )}
            <form onSubmit={handleSubmit} className="relative max-w-full flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setShowGifPicker(!showGifPicker)}
                    disabled={!isConnected}
                    className="flex-shrink-0 min-h-[48px] min-w-[48px] md:min-h-[48px] md:min-w-[48px] p-2.5 md:p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label="Toggle GIF Picker"
                >
                    <ImageIcon className="w-5 h-5" />
                </button>
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder={isConnected ? 'Type a message...' : 'Connecting...'}
                        disabled={!isConnected}
                        className="w-full min-h-[48px] px-4 py-3 pr-14 md:pr-12 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base md:text-sm"
                        style={{ fontSize: '16px' }}
                    />
                    <button
                        type="submit"
                        disabled={!isConnected || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500 flex items-center justify-center"
                        aria-label="Send message"
                    >
                        <Send className="w-5 h-5 md:w-4 md:h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInput;
