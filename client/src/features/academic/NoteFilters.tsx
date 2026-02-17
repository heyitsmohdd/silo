import { Search, X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

interface NoteFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  subjectFilter: string;
  onSubjectFilterChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  subjectOptions: string[];
  hasFilters: boolean;
  onClearFilters: () => void;
}

const NoteFilters = ({
  searchTerm,
  onSearchChange,
  subjectFilter,
  onSubjectFilterChange,
  sortBy,
  onSortChange,
  subjectOptions,
  hasFilters,
  onClearFilters,
}: NoteFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search notes by title or content..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Subject"
            value={subjectFilter}
            onChange={(e) => onSubjectFilterChange(e.target.value)}
            options={[
              { value: '', label: 'All Subjects' },
              ...subjectOptions.map((s) => ({ value: s, label: s })),
            ]}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <Select
            label="Sort By"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'title', label: 'Title (A-Z)' },
            ]}
          />
        </div>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className="w-full"
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
};

export default NoteFilters;
