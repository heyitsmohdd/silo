import { Search, X } from 'lucide-react';
import Input from '@/components/ui/Input';

interface QuestionFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    tagFilter: string;
    onTagFilterChange: (value: string) => void;
    sortBy: string;
    onSortChange: (value: 'newest' | 'oldest' | 'upvotes') => void;
    allTags: string[];
    hasFilters: boolean;
    onClearFilters: () => void;
}

const QuestionFilters = ({
    searchTerm,
    onSearchChange,
    tagFilter,
    onTagFilterChange,
    sortBy,
    onSortChange,
    allTags,
    hasFilters,
    onClearFilters,
}: QuestionFiltersProps) => {
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Tag Filter */}
                <select
                    value={tagFilter}
                    onChange={(e) => onTagFilterChange(e.target.value)}
                    className="h-10 px-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                    <option value="">All Tags</option>
                    {allTags.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>

                {/* Sort Dropdown */}
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest' | 'upvotes')}
                    className="h-10 px-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="upvotes">Most Upvoted</option>
                </select>
            </div>

            {/* Clear Filters Button */}
            {hasFilters && (
                <button
                    onClick={onClearFilters}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-4 h-4" />
                    Clear Filters
                </button>
            )}
        </div>
    );
};

export default QuestionFilters;
