
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/lib/axios';

interface CreateNotePayload {
    title: string;
    subject: string;
    content: string;
    fileUrl?: string;
}

const CreateNoteForm = ({ onSuccess }: { onSuccess: () => void }) => {
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
        <form onSubmit={handleSubmit} className="border-4 border-black dark:border-white p-6 mb-12 bg-white dark:bg-black rounded-none">
            <h4 className="font-black uppercase text-xl mb-6 tracking-tight">[ UPLOAD_NEW_PACKET ]</h4>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase font-mono">TITLE</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Ex: LECTURE_01_NOTES"
                            className="w-full bg-transparent border-2 border-black dark:border-white p-3 font-mono text-sm focus:outline-none focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black transition-colors rounded-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase font-mono">SUBJECT</label>
                        <input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            placeholder="Ex: DATA_STRUCTURES"
                            className="w-full bg-transparent border-2 border-black dark:border-white p-3 font-mono text-sm focus:outline-none focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black transition-colors rounded-none"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase font-mono">CONTENT_SUMMARY</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-transparent border-2 border-black dark:border-white p-3 font-mono text-sm focus:outline-none focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black transition-colors min-h-[100px] rounded-none"
                        placeholder="Brief description of the material..."
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase font-mono">FILE_URL (OPTIONAL)</label>
                    <input
                        value={fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)}
                        placeholder="https://example.com/notes.pdf"
                        className="w-full bg-transparent border-2 border-black dark:border-white p-3 font-mono text-sm focus:outline-none focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black transition-colors rounded-none"
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="bg-black text-white dark:bg-white dark:text-black px-8 py-3 font-bold uppercase hover:opacity-80 disabled:opacity-50 transition-opacity rounded-none"
                    >
                        {mutation.isPending ? 'TRANSMITTING...' : 'UPLOAD_PACKET'}
                    </button>
                </div>
            </div>

            {mutation.isError && (
                <div className="mt-4 border-2 border-danger p-2 text-danger font-mono text-xs uppercase text-center">
                    [ ERROR: TRANSMISSION_FAILED ]
                </div>
            )}
        </form>
    );
};

export default CreateNoteForm;
