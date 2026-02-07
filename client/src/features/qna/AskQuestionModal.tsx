import { useState } from 'react';
import { X } from 'lucide-react';
import axiosClient from '@/lib/axios';

interface AskQuestionModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const AskQuestionModal = ({ onClose, onSuccess }: AskQuestionModalProps) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate minimum lengths matching backend
        if (title.trim().length < 5) {
            setError('Title must be at least 5 characters');
            return;
        }

        if (content.trim().length < 10) {
            setError('Details must be at least 10 characters');
            return;
        }

        if (!tags.trim()) {
            setError('At least one tag is required');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            await axiosClient.post('/academic/questions', {
                title: title.trim(),
                content: content.trim(),
                tags: tags.trim(),
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            // Extract detailed error message
            const errorMessage = err.response?.data?.message
                || err.response?.data?.error
                || err.message
                || 'Failed to create question';
            setError(errorMessage);
            console.error('Question creation error:', err.response?.data);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="w-full max-w-2xl bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                        <h2 className="text-xl font-bold text-zinc-100">
                            Ask a Question
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-zinc-800/60 transition-colors"
                        >
                            <X className="w-5 h-5 text-zinc-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Error Message */}
                        {error && (
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-2">
                                Question Title <span className="text-zinc-500">(minimum 5 characters)</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                placeholder="What's your question about?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={isSubmitting}
                                maxLength={200}
                                className="w-full px-3 py-3 rounded-md bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            />
                            <p className="text-xs text-zinc-500 mt-1">
                                {title.length}/200 characters {title.length > 0 && title.length < 5 && <span className="text-amber-500">• Need at least 5 characters</span>}
                            </p>
                        </div>

                        {/* Content */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-zinc-300 mb-2">
                                Details <span className="text-zinc-500">(minimum 10 characters)</span>
                            </label>
                            <textarea
                                id="content"
                                placeholder="Provide more details about your question..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                disabled={isSubmitting}
                                maxLength={10000}
                                className="w-full min-h-[150px] px-3 py-3 rounded-md bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed resize-y transition-all"
                            />
                            <p className="text-xs text-zinc-500 mt-1">
                                {content.length}/10000 characters {content.length > 0 && content.length < 10 && <span className="text-amber-500">• Need at least 10 characters</span>}
                            </p>
                        </div>

                        {/* Tags */}
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-zinc-300 mb-2">
                                Tags
                            </label>
                            <input
                                id="tags"
                                type="text"
                                placeholder="e.g., algorithms, data-structures, python"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                disabled={isSubmitting}
                                maxLength={200}
                                className="w-full px-3 py-3 rounded-md bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            />
                            <p className="text-xs text-zinc-500 mt-1">
                                Separate tags with commas
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-700 hover:bg-zinc-800/40 transition-colors text-zinc-100 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || title.trim().length < 5 || content.trim().length < 10 || !tags.trim()}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-100 text-zinc-950 font-bold hover:bg-white transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Posting...' : 'Post Question'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AskQuestionModal;
