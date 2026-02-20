import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import axiosClient from '@/lib/axios';
import NoteCard from './NoteCard';
import CreateNoteForm from './CreateNoteForm';
import { ListSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { FileText, Plus } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';

const NotesList = () => {
  const { isProfessor } = useAuthStore();
  const [showForm, setShowForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  const { data: notes, isLoading, isError, refetch } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await axiosClient.get('/academic/notes');
      return response.data;
    },
  });

  const notesList = useMemo(() => Array.isArray(notes) ? notes : (notes?.notes || []), [notes]);

  const filteredNotes = useMemo(() => {
    let filtered = [...notesList];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((note: any) =>
        note.title.toLowerCase().includes(lowerSearch) ||
        note.content.toLowerCase().includes(lowerSearch)
      );
    }

    if (subjectFilter) {
      filtered = filtered.filter((note: any) => note.subject === subjectFilter);
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'oldest':
        filtered.sort((a: any, b: any) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'title':
        filtered.sort((a: any, b: any) =>
          a.title.localeCompare(b.title)
        );
        break;
    }

    return filtered;
  }, [notesList, searchTerm, subjectFilter, sortBy]);

  const subjectOptions: string[] = useMemo(() => {
    const subjects = new Set(notesList.map((note: any) => note.subject));
    return Array.from(subjects) as string[];
  }, [notesList]);

  const hasFilters = Boolean(searchTerm || subjectFilter || sortBy !== 'newest');

  const paginatedNotes = useMemo(() => {
    const startIndex = (currentPage - 1)// ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredNotes.slice(startIndex, endIndex);
  }, [filteredNotes, currentPage]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSubjectFilter('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 rounded bg-zinc-800 animate-pulse" />
          <div className="h-10 w-40 rounded-lg bg-zinc-800 animate-pulse" />
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Academic Notes</h1>
        {isProfessor && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Upload Note'}
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {notesList.length > 0 && (
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-lg px-4 py-2.5 placeholder-zinc-500 text-sm focus:ring-1 focus:ring-zinc-600 outline-none"
          />
        )}

        {notesList.length > 0 && (
          <div className="flex gap-2">
            <select
              value={subjectFilter}
              onChange={(e) => {
                setSubjectFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 text-sm hover:text-zinc-100 hover:border-zinc-700 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-600"
            >
              <option value="">All Subjects</option>
              {subjectOptions.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 text-sm hover:text-zinc-100 hover:border-zinc-700 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-600"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title (A-Z)</option>
            </select>

            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {showForm && isProfessor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl animate-in zoom-in-95 duration-200">
            <CreateNoteForm onSuccess={() => setShowForm(false)} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {paginatedNotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={
            hasFilters
              ? 'No notes match your filters'
              : 'No notes yet'
          }
          description={
            hasFilters
              ? 'Try adjusting your search or filters.'
              : isProfessor
                ? 'Upload your first note to share with your batch.'
                : 'Check back later for new notes from your professors.'
          }
          action={
            isProfessor && !hasFilters
              ? {
                label: 'Upload Note',
                onClick: () => setShowForm(true),
              }
              : undefined
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedNotes.map((note: any) => (
              <NoteCard
                key={note.id}
                note={note}
                onUpdate={refetch}
                onDelete={refetch}
              />
            ))}
          </div>

          <Pagination
            totalItems={filteredNotes.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />

          <p className="text-sm text-zinc-400 text-center">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredNotes.length)} of {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
            {hasFilters && ` (filtered from ${notesList.length} total)`}
          </p>
        </>
      )}
    </div>
  );
};

export default NotesList;
