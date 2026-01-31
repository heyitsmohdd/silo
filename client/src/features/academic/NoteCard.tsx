import { FileText, ExternalLink, Clock, User as UserIcon } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  subject: string;
  content: string;
  fileUrl?: string;
  createdAt: string;
  author: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  }
}

interface NoteCardProps {
  note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {
  const authorName = note.author.firstName && note.author.lastName
    ? `${note.author.firstName} ${note.author.lastName}`
    : note.author.email.split('@')[0];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="group p-6 border border-border rounded-lg bg-card hover:shadow-md transition-all duration-200 hover:border-primary/50">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="space-y-2 flex-1 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
            <FileText className="w-3 h-3" />
            {note.subject}
          </span>
          <h3 className="font-semibold text-lg text-card-foreground leading-tight group-hover:text-primary transition-colors">
            {note.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(note.createdAt)}</span>
        </div>
      </div>

      {/* Body */}
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
        {note.content}
      </p>

      {/* Footer */}
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <UserIcon className="w-3.5 h-3.5" />
          <span className="truncate max-w-[150px]">{authorName}</span>
        </div>

        {note.fileUrl && (
          <a
            href={note.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View File
          </a>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
