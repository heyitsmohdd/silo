
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
    return (
        <div className="border-4 border-black dark:border-white p-4 space-y-4 hover:translate-x-1 hover:-translate-y-1 transition-transform duration-100 bg-white dark:bg-black rounded-none">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <span className="inline-block bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 text-xs font-mono uppercase font-bold tracking-wider">
                        {note.subject}
                    </span>
                    <h3 className="font-bold text-xl uppercase leading-tight">
                        {note.title}
                    </h3>
                </div>
                <div className="font-mono text-[10px] opacity-60 whitespace-nowrap">
                    {new Date(note.createdAt).toLocaleDateString()}
                </div>
            </div>

            {/* Body */}
            <p className="font-mono text-sm opacity-80 line-clamp-2 leading-relaxed">
                {note.content}
            </p>

            {/* Footer */}
            <div className="pt-4 border-t-2 border-black/10 dark:border-white/10 flex items-center justify-between">
                <div className="text-[10px] font-mono uppercase opacity-60">
                    UPLOADED BY [{note.author.email.split('@')[0]}]
                </div>

                {note.fileUrl && (
                    <a
                        href={note.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold uppercase border-2 border-transparent hover:border-black dark:hover:border-white px-2 py-1 transition-colors"
                    >
                        [ OPEN_FILE ]
                    </a>
                )}
            </div>
        </div>
    );
};

export default NoteCard;
