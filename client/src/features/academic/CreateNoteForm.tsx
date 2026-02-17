import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/lib/axios';
import { X, Upload } from 'lucide-react';

interface CreateNotePayload {
    title: string;
    subject: string;
    content: string;
    fileUrl?: string;
}

interface CreateNoteFormProps {
    onSuccess: () => void;
    onClose: () => void;
}

const CreateNoteForm = ({ onSuccess, onClose }: CreateNoteFormProps) => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [fileUrl, setFileUrl] = useState('');

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (newNote: CreateNotePayload) => {
            const response = await axiosClient.post('/academic/notes', newNote);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            onSuccess();
            // Reset form
            setTitle('');
            setSubject('');
            setContent('');
            setFileUrl('');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ title, subject, content, fileUrl });
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
                <h2 className="text-xl font-bold text-white">Upload Academic Note</h2>
                <button
                    type="button"
                    onClick={onClose}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="e.g. Data Structures Lecture 1"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Subject</label>
                        <input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            placeholder="e.g. CS101"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">File URL</label>
                        <input
                            value={fileUrl}
                            onChange={(e) => setFileUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Description</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all min-h-[120px] resize-y"
                        placeholder="Brief detailed description of the note contents..."
                        required
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {mutation.isPending ? (
                            'Uploading...'
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Upload Note
                            </>
                        )}
                    </button>
                    {mutation.isError && (
                        <p className="mt-3 text-red-400 text-sm text-center">
                            Failed to upload note. Please try again.
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CreateNoteForm;
