import { useState, useRef, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import axiosClient from '@/lib/axios';
import { Image as ImageIcon } from 'lucide-react';
import GifPicker from '@/components/ui/GifPicker';

interface CreateQuestionFormProps {
    onSuccess: () => void;
}

const CreateQuestionForm = ({ onSuccess }: CreateQuestionFormProps) => {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
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

        if (!title.trim() || !content.trim() || !tags.trim()) {
            setError('Please fill in all fields');
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

            // Reset form
            setTitle('');
            setContent('');
            setTags('');

            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create question');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 border border-primary rounded-lg bg-card shadow-md">
            <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1.5">
                        Question Title
                    </label>
                    <Input
                        id="title"
                        type="text"
                        placeholder="What's your question about?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isSubmitting}
                        maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        {title.length}/200 characters
                    </p>
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium mb-1.5">
                        Details
                    </label>
                    <textarea
                        id="content"
                        placeholder="Provide more details about your question..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed resize-y"
                        maxLength={2000}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        {content.length}/2000 characters
                    </p>
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium mb-1.5">
                        Tags
                    </label>
                    <Input
                        id="tags"
                        type="text"
                        placeholder="e.g., algorithms, data-structures, python (comma-separated)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        disabled={isSubmitting}
                        maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Separate tags with commas
                    </p>
                </div>

                {error && (
                    <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                        {error}
                    </div>
                )}

                <div className="flex gap-3 justify-between items-center pt-2 relative">
                    <div className="flex items-center gap-2">
                        {showGifPicker && (
                            <div ref={pickerRef} className="absolute bottom-full left-0 mb-2 z-50">
                                <GifPicker onGifSelect={handleGifSelect} onClose={() => setShowGifPicker(false)} />
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setShowGifPicker(!showGifPicker)}
                            className="p-2 text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800 rounded-md transition-colors"
                            title="Add GIF"
                        >
                            <ImageIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <Button
                        type="submit"
                        disabled={isSubmitting || !title.trim() || !content.trim() || !tags.trim()}
                    >
                        {isSubmitting ? 'Posting...' : 'Post Question'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateQuestionForm;
