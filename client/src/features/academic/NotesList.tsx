import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import axiosClient from '@/lib/axios';
import NoteCard from './NoteCard';
import CreateNoteForm from './CreateNoteForm';
import { ListSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { FileText, Plus } from 'lucide-react';

const NotesList = () => {
  const { isProfessor } = useAuthStore();
  const [showForm, setShowForm] = useState(false);

  const { data: notes, isLoading, isError, refetch } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await axiosClient.get('/academic/notes');
      return response.data;
    },
  });

  const notesList = Array.isArray(notes) ? notes : (notes?.notes || []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          {isProfessor && (
            <div className="h-10 w-32 rounded-lg bg-muted animate-pulse" />
          )}
        </div>
        <ListSkeleton count={3} />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={FileText}
        title="Unable to load notes"
        description="There was an error loading the notes. Please try again."
        action={{
          label: 'Try Again',
          onClick: () => refetch(),
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Professor Actions */}
      {isProfessor && (
        <div className="flex justify-end">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Note
            </button>
          ) : (
            <button
              onClick={() => setShowForm(false)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-input hover:bg-accent transition-colors"
            >
              Cancel
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
        <EmptyState
          icon={FileText}
          title="No notes yet"
          description={isProfessor ? "Upload your first note to share with your batch." : "Check back later for new notes from your professors."}
          action={isProfessor ? {
            label: 'Create Note',
            onClick: () => setShowForm(true),
          } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notesList.map((note: any) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;
