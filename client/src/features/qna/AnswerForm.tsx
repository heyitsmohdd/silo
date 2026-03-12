import { useState, useRef, useEffect } from 'react';
import axiosClient from '@/lib/axios';
import { Image as ImageIcon } from 'lucide-react';
import GifPicker from '@/components/ui/GifPicker';

interface AnswerFormProps {
    questionId: string;
    onSuccess: () => void;
    parentId?: string;
    onCancel?: () => void;
}

const AnswerForm = ({ questionId, onSuccess, parentId, onCancel }: AnswerFormProps) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
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

    const handleGifSelect = (gifUrl: string) => {
        setContent(prev => prev + `\n![GIF](${gifUrl})`);
        setShowGifPicker(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('Answer cannot be empty');
            return;
        }

        if (content.trim().length < 10) {
            setError('Answer must be at least 10 characters');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            await axiosClient.post(`/academic/questions/${questionId}/answers`, {
                content: content.trim(),
                parentId,
            });

            setContent('');
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to post answer');
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasContent = content.length > 0;
    const isValid = content.trim().length >= 10;
    const isReply = !!parentId;

    return (
        <div className={isReply ? "mt-4 ml-4" : "mt-6"}>
            {!isReply && <h3 className="text-lg font-bold text-zinc-100 mb-3">Your Answer</h3>}

            <form onSubmit={handleSubmit}>
                <div
                    className={`bg-zinc-900 border rounded-xl transition-all ${hasContent ? 'border-zinc-700' : 'border-zinc-800'
                        } focus-within:ring-1 focus-within:ring-zinc-600 relative`}
                >
                    <textarea
                        placeholder={isReply ? "Write a reply..." : "Write your answer..."}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isSubmitting}
                        className={`w-full px-4 py-3 text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-none ${isReply ? 'min-h-[80px]' : 'min-h-[120px]'}`}
                        maxLength={2000}
                        autoFocus={isReply}
                    />

                    <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800 relative">
                        {showGifPicker && (
                            <div ref={pickerRef} className="absolute bottom-full left-4 mb-2 z-50">
                                <GifPicker onGifSelect={handleGifSelect} onClose={() => setShowGifPicker(false)} />
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowGifPicker(!showGifPicker)}
                                className="text-zinc-500 hover:text-emerald-400 transition-colors p-1 rounded-md hover:bg-zinc-800"
                                title="Add GIF"
                            >
                                <ImageIcon className="w-5 h-5" />
                            </button>
                            <span className="text-xs text-zinc-500">
                                {content.length}/2000
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {isReply && onCancel && (
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}

                            {(hasContent || isReply) && (
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !isValid}
                                    className="px-4 py-1.5 text-sm font-bold rounded-full bg-white text-zinc-950 hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (isReply ? 'Replying...' : 'Posting...') : (isReply ? 'Reply' : 'Post Answer')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mt-2 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
};

export default AnswerForm;
