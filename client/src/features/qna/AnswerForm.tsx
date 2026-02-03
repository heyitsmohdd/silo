import { useState } from 'react';
import Button from '@/components/ui/Button';
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

    return (
        <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">Your Answer</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <textarea
                        placeholder="Write your answer here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full min-h-[150px] px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed resize-y"
                        maxLength={10000}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        {content.length}/10000 characters (minimum 10)
                    </p>
                </div>

                {error && (
                    <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                        {error}
                    </div>
                )}

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isSubmitting || content.trim().length < 10}
                    >
                        {isSubmitting ? 'Posting...' : 'Post Answer'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AnswerForm;
