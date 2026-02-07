import { useState } from 'react';
import axiosClient from '@/lib/axios';

interface AnswerFormProps {
    questionId: string;
    onSuccess: () => void;
}

const AnswerForm = ({ questionId, onSuccess }: AnswerFormProps) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

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

    return (
        <div className="mt-6">
            <h3 className="text-lg font-bold text-zinc-100 mb-3">Your Answer</h3>

            <form onSubmit={handleSubmit}>
                {/* Unified Container - Twitter/X Style */}
                <div
                    className={`bg-zinc-900 border rounded-xl overflow-hidden transition-all ${hasContent ? 'border-zinc-700' : 'border-zinc-800'
                        } focus-within:ring-1 focus-within:ring-zinc-600`}
                >
                    {/* Textarea */}
                    <textarea
                        placeholder="Write your answer..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full min-h-[120px] px-4 py-3 text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                        maxLength={10000}
                    />

                    {/* Bottom Bar: Character Count + Button */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800">
                        <span className="text-xs text-zinc-500">
                            {content.length}/10000
                        </span>

                        {/* Show button only when typing */}
                        {hasContent && (
                            <button
                                type="submit"
                                disabled={isSubmitting || !isValid}
                                className="px-4 py-1.5 text-sm font-bold rounded-full bg-white text-zinc-950 hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Posting...' : 'Post Answer'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Error Message */}
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
