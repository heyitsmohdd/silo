import { Search, X } from 'lucide-react';

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
        <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-md bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 transition-all"
                    />
                </div>

                {/* Tag Filter */}
                <select
                    value={tagFilter}
                    onChange={(e) => onTagFilterChange(e.target.value)}
                    className="h-10 px-4 rounded-md bg-zinc-950 border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 transition-all"
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
                    className="h-10 px-4 rounded-md bg-zinc-950 border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 transition-all"
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    <X className="w-4 h-4" />
                    Clear Filters
                </button>
            )}
        </div>
    );
};

export default QuestionFilters;
