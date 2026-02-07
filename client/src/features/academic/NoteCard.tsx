import { useState } from 'react';
import { FileText, ExternalLink, Clock, User as UserIcon, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import axiosClient from '@/lib/axios';

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
  };
  authorId: string;
}

interface NoteCardProps {
  note: Note;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const NoteCard = ({ note, onUpdate, onDelete }: NoteCardProps) => {
  const { user, isProfessor } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const canEdit = isProfessor || user?.userId === note.authorId;

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

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;

    setIsSaving(true);
    try {
      await axiosClient.put(`/academic/notes/${note.id}`, {
        title: editTitle.trim(),
        content: editContent.trim(),
      });
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      console.error('Failed to update note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return;
    }

    try {
      await axiosClient.delete(`/academic/notes/${note.id}`);
      onDelete?.();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  if (isEditing) {
    return (
      <div className="group p-6 border border-emerald-500 rounded-lg bg-zinc-900/50 shadow-md">
        <div className="space-y-4">
          <div>
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Note title"
              disabled={isSaving}
            />
          </div>
          <div>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Note content"
              className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed resize-y"
              disabled={isSaving}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group p-6 border border-zinc-800 rounded-lg bg-zinc-900/50 hover:border-zinc-600 transition-all duration-200 relative">
      {/* Menu Button */}
      {canEdit && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4 text-zinc-400" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 z-20 min-w-[150px] bg-zinc-900 border border-zinc-800 rounded-md shadow-lg py-1">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 text-left transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 text-left transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4 pr-8">
        <div className="space-y-2 flex-1 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FileText className="w-3 h-3" />
            {note.subject}
          </span>
          <h3 className="font-semibold text-lg text-white leading-tight line-clamp-1">
            {note.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-400 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(note.createdAt)}</span>
        </div>
      </div>

      {/* Body */}
      <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-4">
        {note.content}
      </p>

      {/* Footer */}
      <div className="pt-3 mt-3 border-t border-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <UserIcon className="w-3.5 h-3.5" />
          <span className="truncate max-w-[150px]">{authorName}</span>
        </div>

        {note.fileUrl && (
          <a
            href={note.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
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
