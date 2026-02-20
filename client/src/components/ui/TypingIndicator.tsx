import { useEffect, useState } from 'react';

interface TypingIndicatorProps {
    isTyping: boolean;
    names: string[];
}

export function TypingIndicator({ isTyping, names }: TypingIndicatorProps) {
    const [dots, setDots] = useState('');

    useEffect(() => {
        if (!isTyping) return;

        const interval = setInterval(() => {
            setDots((prev) => {
                if (prev.length >= 3) return '';
                return prev + '.';
            });
        }, 500);

        return () => clearInterval(interval);
    }, [isTyping]);

    if (!isTyping || names.length === 0) return null;

    let text = '';

    if (names.length === 1) {
        text = `${names[0]} is typing${dots}`;
    } else if (names.length === 2) {
        text = `${names[0]} and ${names[1]} are typing${dots}`;
    } else if (names.length > 2) {
        text = `${names[0]} and ${names.length - 1} others are typing${dots}`;
    }

    return (
        <div className="px-4 py-1 h-6 text-xs text-zinc-500 font-medium italic flex items-center transition-all duration-300 ease-in-out opacity-100">
            {text}
        </div>
    );
}
