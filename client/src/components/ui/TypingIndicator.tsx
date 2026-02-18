import { useEffect, useState } from 'react';

interface TypingIndicatorProps {
    isTyping: boolean;
    names: string[];
}

export function TypingIndicator({ isTyping, names }: TypingIndicatorProps) {
    const [dots, setDots] = useState('');
    const [visibleNames, setVisibleNames] = useState<string[]>([]);

    useEffect(() => {
        if (isTyping) {
            setVisibleNames(names);
        }
    }, [isTyping, names]);

    useEffect(() => {
        if (!isTyping) {
            setDots('');
            return;
        }

        const interval = setInterval(() => {
            setDots((prev) => {
                if (prev.length >= 3) return '';
                return prev + '.';
            });
        }, 500);

        return () => clearInterval(interval);
    }, [isTyping]);

    if (!isTyping || visibleNames.length === 0) return null;

    let text = '';
    const nameList = visibleNames;

    if (nameList.length === 1) {
        text = `${nameList[0]} is typing${dots}`;
    } else if (nameList.length === 2) {
        text = `${nameList[0]} and ${nameList[1]} are typing${dots}`;
    } else if (nameList.length > 2) {
        text = `${nameList[0]} and ${nameList.length - 1} others are typing${dots}`;
    }

    return (
        <div className="px-4 py-1 h-6 text-xs text-zinc-500 font-medium italic flex items-center transition-all duration-300 ease-in-out opacity-100">
            {text}
        </div>
    );
}
