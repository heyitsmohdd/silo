import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { ArrowLeft, Bold, Italic, Heading1, Heading2, List, ListOrdered, Code, Quote, Undo, Redo, Image as ImageIcon, X } from 'lucide-react';
import axios from '@/lib/axios';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const WriteArticlePage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [showCoverInput, setShowCoverInput] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [hasContent, setHasContent] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Start writing your story...',
                emptyEditorClass: 'is-editor-empty',
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-zinc max-w-none focus:outline-none min-h-[500px] text-zinc-300',
            },
        },
        onUpdate: ({ editor }) => {
            // Check if there is actual text/content beyond an empty <p> tag
            setHasContent(!editor.isEmpty && editor.getText().trim().length > 0);
        }
    });

    const handlePublish = async () => {
        if (!editor || !title.trim() || isPublishing) return;

        try {
            setIsPublishing(true);
            const content = editor.getHTML();

            const response = await axios.post('/api/articles', {
                title: title.trim(),
                content,
                coverImageUrl: coverImageUrl.trim()
            });

            if (response.data?.article?.id) {
                // Navigate directly to the newly published reading view
                navigate(`/article/${response.data.article.id}`);
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Failed to publish article:', error);
            setAlertMessage('Failed to publish article. Please try again.');
        } finally {
            setIsPublishing(false);
        }
    };

    if (!editor) {
        return null; // Don't render until editor is initialized
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800/50">
            {/* Top Navigation / App Bar */}
            <div className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Back</span>
                    </button>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handlePublish}
                            disabled={isPublishing || !title.trim() || !hasContent}
                            className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-zinc-200 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            {isPublishing ? 'Publishing...' : 'Publish'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Editor Toolbar */}
            <div className="sticky top-16 z-40 bg-zinc-900/80 border-b border-zinc-800/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-4 h-12 flex items-center gap-1 overflow-x-auto print:hidden no-scrollbar">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        icon={<Bold className="w-4 h-4" />}
                        title="Bold"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        icon={<Italic className="w-4 h-4" />}
                        title="Italic"
                    />
                    <div className="w-px h-5 bg-zinc-800 mx-2 shrink-0" />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        icon={<Heading1 className="w-4 h-4" />}
                        title="Heading 1"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        icon={<Heading2 className="w-4 h-4" />}
                        title="Heading 2"
                    />
                    <div className="w-px h-5 bg-zinc-800 mx-2 shrink-0" />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        icon={<List className="w-4 h-4" />}
                        title="Bullet List"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        icon={<ListOrdered className="w-4 h-4" />}
                        title="Ordered List"
                    />
                    <div className="w-px h-5 bg-zinc-800 mx-2 shrink-0" />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        icon={<Quote className="w-4 h-4" />}
                        title="Quote"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editor.isActive('codeBlock')}
                        icon={<Code className="w-4 h-4" />}
                        title="Code Block"
                    />
                    <div className="flex-1" />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        icon={<Undo className="w-4 h-4" />}
                        title="Undo"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        icon={<Redo className="w-4 h-4" />}
                        title="Redo"
                    />
                </div>
            </div>

            {/* Full Page Editor Surface */}
            <main className="max-w-4xl mx-auto px-4 py-12 pb-32">

                {/* Cover Image URL Input & Preview */}
                {!showCoverInput && !coverImageUrl ? (
                    <button
                        onClick={() => setShowCoverInput(true)}
                        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors mb-6 text-sm font-medium"
                    >
                        <ImageIcon className="w-4 h-4" />
                        Add Cover Image
                    </button>
                ) : (
                    <div className="mb-8 group relative animate-in fade-in slide-in-from-top-4 duration-300">
                        {coverImageUrl && (
                            <div className="w-full h-[200px] md:h-[350px] rounded-2xl mb-4 overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl">
                                <img
                                    src={coverImageUrl}
                                    alt="Cover Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/800x400/18181b/3f3f46?text=Invalid+Image+URL')}
                                />
                            </div>
                        )}
                        <div className="relative">
                            <input
                                type="url"
                                value={coverImageUrl}
                                onChange={(e) => setCoverImageUrl(e.target.value)}
                                placeholder="Paste an image URL for your header banner (e.g., from Unsplash, Imgur)..."
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-zinc-200 placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                                autoFocus={!coverImageUrl}
                            />
                            <button
                                onClick={() => { setShowCoverInput(false); setCoverImageUrl(''); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1.5 bg-zinc-950 rounded-full border border-zinc-800"
                                title="Remove Cover Image"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2 px-1">
                            Tip: Right-click on an image and select <strong>"Copy Image Address"</strong>. It should usually end in .jpg, .png, or .webp.
                        </p>
                    </div>
                )}

                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Article Title..."
                    className="w-full bg-transparent text-4xl md:text-5xl font-extrabold text-white placeholder:text-zinc-700 border-none outline-none mb-8"
                    autoFocus
                />
                <EditorContent editor={editor} />
            </main>

            {/* Error/Alert Modal */}
            <ConfirmationModal
                isOpen={!!alertMessage}
                onClose={() => setAlertMessage(null)}
                onConfirm={() => setAlertMessage(null)}
                title="Publish Error"
                description={alertMessage || ''}
                confirmText="OK"
                variant="danger"
                hideCancel
            />
        </div>
    );
};

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    icon: React.ReactNode;
    title: string;
}

const ToolbarButton = ({ onClick, isActive, disabled, icon, title }: ToolbarButtonProps) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-2 rounded-lg transition-colors flex items-center justify-center shrink-0
            ${isActive ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}
            ${disabled ? 'opacity-30 cursor-not-allowed' : ''}
        `}
    >
        {icon}
    </button>
);

export default WriteArticlePage;
