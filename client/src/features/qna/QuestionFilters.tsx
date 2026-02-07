import { Search, Filter, ArrowUpDown, X } from 'lucide-react';

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
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                {/* Search Input - Pill Shape */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-10 pl-11 pr-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-all"
                    />
                </div>

                {/* Ghost Button: Tags Filter */}
                <div className="relative">
                    <select
                        value={tagFilter}
                        onChange={(e) => onTagFilterChange(e.target.value)}
                        className="appearance-none h-10 pl-3 pr-8 rounded-lg bg-transparent border border-transparent text-zinc-400 text-sm hover:bg-zinc-800/40 hover:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-all cursor-pointer"
                    >
                        <option value="" className="bg-zinc-900">All Tags</option>
                        {allTags.map((tag) => (
                            <option key={tag} value={tag} className="bg-zinc-900">
                                {tag}
                            </option>
                        ))}
                    </select>
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                </div>

                {/* Ghost Button: Sort */}
                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest' | 'upvotes')}
                        className="appearance-none h-10 pl-3 pr-8 rounded-lg bg-transparent border border-transparent text-zinc-400 text-sm hover:bg-zinc-800/40 hover:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-all cursor-pointer"
                    >
                        <option value="newest" className="bg-zinc-900">Newest</option>
                        <option value="oldest" className="bg-zinc-900">Oldest</option>
                        <option value="upvotes" className="bg-zinc-900">Top</option>
                    </select>
                    <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                </div>
            </div>

            {/* Clear Filters Button */}
            {hasFilters && (
                <button
                    onClick={onClearFilters}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    <X className="w-3 h-3" />
                    Clear
                </button>
            )}
        </div>
    );
};

export default QuestionFilters;
