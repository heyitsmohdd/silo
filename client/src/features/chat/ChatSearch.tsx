import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import Input from '@/components/ui/Input';
import type { Message } from '@/hooks/useChat';

interface ChatSearchProps {
  messages: Message[];
  onResultClick: (messageId: string) => void;
}

const ChatSearch = ({ messages, onResultClick }: ChatSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase();
    return messages.filter((msg) =>
      msg.content.toLowerCase().includes(term)
    );
  }, [searchTerm, messages]);

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (isSearching) {
      setSearchTerm('');
    }
  };

  const handleResultClick = (messageId: string) => {
    onResultClick(messageId);
    setIsSearching(false);
    setSearchTerm('');
  };

  if (!isSearching) {
    return (
      <button
        onClick={toggleSearch}
        className="p-2 rounded-md hover:bg-muted transition-colors"
        aria-label="Search messages"
      >
        <Search className="w-5 h-5 text-muted-foreground" />
      </button>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-0 bg-transparent focus-visible:ring-0 px-0 h-auto py-2"
          autoFocus
        />
        <button
          onClick={toggleSearch}
          className="p-1 rounded-md hover:bg-muted transition-colors"
          aria-label="Close search"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-soft-lg max-h-80 overflow-y-auto z-50">
          {searchResults.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No messages found
            </div>
          ) : (
            <div className="divide-y divide-border">
              {searchResults.slice(0, 10).map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleResultClick(msg.id)}
                  className="w-full text-left p-3 hover:bg-muted transition-colors"
                >
                  <p className="text-sm line-clamp-2 mb-1">
                    {msg.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </button>
              ))}
              {searchResults.length > 10 && (
                <div className="p-3 text-center text-xs text-muted-foreground">
                  Showing 10 of {searchResults.length} results
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatSearch;
