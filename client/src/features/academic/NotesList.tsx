import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import axiosClient from '@/lib/axios';
import NoteCard from './NoteCard';
import CreateNoteForm from './CreateNoteForm';
import { ListSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { FileText, Plus } from 'lucide-react';
import NoteFilters from './NoteFilters';
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

  const notesList = Array.isArray(notes) ? notes : (notes?.notes || []);

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
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredNotes.slice(startIndex, endIndex);
  }, [filteredNotes, currentPage]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSubjectFilter('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSubjectFilterChange = (value: string) => {
    setSubjectFilter(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

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

      {/* Filters */}
      {notesList.length > 0 && (
        <NoteFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          subjectFilter={subjectFilter}
          onSubjectFilterChange={handleSubjectFilterChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          subjectOptions={subjectOptions}
          hasFilters={hasFilters}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Notes Grid */}
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
                  label: 'Create Note',
                  onClick: () => setShowForm(true),
                }
              : undefined
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedNotes.map((note: any) => (
              <NoteCard
                key={note.id}
                note={note}
                onUpdate={refetch}
                onDelete={refetch}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            totalItems={filteredNotes.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />

          {/* Results Count */}
          <p className="text-sm text-muted-foreground text-center">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredNotes.length)} of {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
            {hasFilters && ` (filtered from ${notesList.length} total)`}
          </p>
        </>
      )}
    </div>
  );
};

export default NotesList;
