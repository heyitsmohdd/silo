
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import axiosClient from '@/lib/axios';
import NoteCard from './NoteCard';
import CreateNoteForm from './CreateNoteForm';

const NotesList = () => {
    const { user, isProfessor } = useAuthStore();
    const [showForm, setShowForm] = useState(false);

    const { data: notes, isLoading, isError } = useQuery({
        queryKey: ['notes'],
        queryFn: async () => {
            const response = await axiosClient.get('/academic/notes');
            return response.data;
        },
    });

    // Handle array or wrapped response - API returns { notes: [], total, limit, offset }
    const notesList = Array.isArray(notes) ? notes : (notes?.notes || []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-black/20 dark:border-white/20">
                <p className="font-mono text-sm animate-pulse">
                    [ CONNECTING_TO_SILO... ]
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-8 border-4 border-red-600 text-red-600 font-mono text-center">
                <h3 className="text-xl font-bold uppercase mb-2">ERR::CONNECTION_LOST</h3>
                <p className="text-sm opacity-80">UNABLE_TO_FETCH_SECURE_RECORDS</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 border-2 border-red-600 hover:bg-red-600 hover:text-white uppercase text-xs transition-colors"
                >
                    RETRY_CONNECTION
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Professor Actions */}
            {isProfessor && (
                <div className="flex justify-end">
                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 font-black uppercase text-sm hover:translate-y-1 transition-transform rounded-none"
                        >
                            + NEW_PACKET
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowForm(false)}
                            className="border-2 border-black dark:border-white px-6 py-3 font-bold uppercase text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-none"
                        >
                            CLOSE_UPLOADER
                        </button>
                    )}
                </div>
            )}

            {/* Create Form */}
            {showForm && isProfessor && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <CreateNoteForm onSuccess={() => setShowForm(false)} />
                </div>
            )}

            {/* Notes Grid */}
            {notesList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-black dark:border-white opacity-50">
                    <p className="font-mono text-lg">
                        &gt; 0_RECORDS_FOUND
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {notesList.map((note: any) => (
                        <NoteCard key={note.id} note={note} />
                    ))}
                </div>
            )}

            {/* Footer Metadata */}
            <div className="pt-12 text-center font-mono text-[10px] opacity-30 uppercase">
                SECURE_CONNECTION :: ENCRYPTED :: {user?.userId}
            </div>
        </div>
    );
};

export default NotesList;
