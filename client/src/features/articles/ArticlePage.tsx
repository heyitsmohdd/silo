import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '@/lib/axios';
import { ArrowLeft, Clock, CalendarDays, Trash2, Share2, Check } from 'lucide-react';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '@/stores/useAuthStore';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { siteConfig } from '@/config/site';

interface ArticleData {
    id: string;
    title: string;
    content: string;
    readTime: number;
    coverImageUrl?: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
    };
}

const ArticlePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();

    const [article, setArticle] = useState<ArticleData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`/api/articles/${id}`);
                setArticle(response.data.article);
            } catch (err: any) {
                console.error('Failed to load article:', err);
                setError(err.response?.data?.error || 'Failed to load article');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchArticle();
        }
    }, [id]);

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleShareClick = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2s
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const confirmDelete = async () => {
        try {
            setIsDeleting(true);
            await axios.delete(`/api/articles/${id}`);
            setIsDeleteModalOpen(false);
            navigate('/');
        } catch (err: any) {
            console.error('Failed to delete article:', err);
            setAlertMessage(err.response?.data?.error || 'Failed to delete article');
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
                <span className="text-xl font-semibold text-zinc-200 mb-2">Article not found</span>
                <p>{error}</p>
                <Link to="/" className="mt-6 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors text-sm">
                    Return Home
                </Link>
            </div>
        );
    }

    const plainTextContent = article.content.replace(/<[^>]+>/g, '').substring(0, 150) + (article.content.length > 150 ? '...' : '');
    const currentUrl = window.location.href;
    const coverImage = article.coverImageUrl || `${siteConfig.url}/pwa-512x512.png`;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800/50">
            <Helmet>
                <title>{`${article.title} | ${siteConfig.name}`}</title>
                <meta name="description" content={plainTextContent} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={plainTextContent} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:image" content={coverImage} />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>
            {/* Top Navigation */}
            <div className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 transition-colors duration-300">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 duration-200" />
                        <span className="hidden sm:inline font-medium">Back to Feed</span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Share Action (Public) */}
                        <button
                            onClick={handleShareClick}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 rounded-full transition-all border border-zinc-700/50 hover:border-zinc-600"
                        >
                            {isCopied ? (
                                <>
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    <span className="hidden sm:inline text-emerald-400">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Share</span>
                                </>
                            )}
                        </button>

                        {/* Delete Action (Authors Only) */}
                        {user?.userId === article?.author.id && (
                            <button
                                onClick={handleDeleteClick}
                                disabled={isDeleting}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:text-white bg-red-500/10 hover:bg-red-600 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/20 hover:border-red-500"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                    {isDeleting ? 'Deleting...' : 'Delete Article'}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {article.coverImageUrl && (
                <div className="w-full h-[35vh] md:h-[50vh] lg:h-[500px] relative select-none">
                    <img
                        src={article.coverImageUrl}
                        alt="Article Cover"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    {/* Cinematic bottom gradient blending into the dark background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none"></div>
                </div>
            )}

            <main className={`max-w-3xl mx-auto px-4 relative z-10 ${article.coverImageUrl ? 'pt-8 md:pt-12 -mt-16 md:-mt-32 pb-32' : 'py-12 md:py-20 pb-32'} ${!isAuthenticated ? 'mb-24' : ''}`}>
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-8 tracking-tight">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                <span className="text-emerald-500 font-bold">
                                    {article.author.firstName?.[0] || article.author.username?.[0] || '?'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-zinc-200">
                                    {article.author.firstName && article.author.lastName
                                        ? `${article.author.firstName} ${article.author.lastName}`
                                        : article.author.username}
                                </span>
                                <span className="text-zinc-500 text-xs">@{article.author.username}</span>
                            </div>
                        </div>

                        <div className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:block" />

                        <div className="flex items-center gap-3 sm:gap-4 shrink-0 mt-2 sm:mt-0">
                            <div className="flex items-center gap-1.5" title="Published Date">
                                <CalendarDays className="w-4 h-4" />
                                <span>{format(new Date(article.createdAt), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-1.5" title="Estimated Read Time">
                                <Clock className="w-4 h-4" />
                                <span>{article.readTime} min read</span>
                            </div>
                        </div>
                    </div>
                </header>

                <hr className="border-zinc-800 mb-12" />

                {/* The Tailwind Typography Prose Container */}
                <div className="relative">
                    {/* The Full Unrestricted Content Area */}
                    <article
                        className="prose prose-invert prose-emerald max-w-none prose-lg
                            prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl 
                            prose-a:text-emerald-400 hover:prose-a:text-emerald-300
                            prose-p:leading-relaxed prose-p:text-zinc-300 
                            prose-blockquote:border-emerald-500/50 prose-blockquote:bg-emerald-500/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                            prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:text-sm prose-pre:shadow-2xl"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>
            </main>

            {/* Persistent Sticky Auth Banner (Silo Style) */}
            {!isAuthenticated && (
                <div className="fixed bottom-0 left-0 w-full z-[100] bg-emerald-600 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] border-t border-emerald-500/50 transform transition-transform duration-500">
                    <div className="max-w-7xl mx-auto px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center justify-center md:justify-between gap-4">
                        <div className="hidden md:block flex-1">
                            <h3 className="text-xl lg:text-3xl font-bold text-white mb-1 drop-shadow-sm tracking-tight">
                                Unlock the full experience
                            </h3>
                            <p className="text-sm lg:text-base text-emerald-50 font-medium">
                                Join Silo to engage in discussions, save articles, and connect with authors.
                            </p>
                        </div>
                        <div className="block md:hidden flex-1 text-center w-full">
                            <h3 className="text-xl font-bold text-white mb-0 drop-shadow-sm tracking-tight">
                                Unlock the full experience
                            </h3>
                        </div>
                        <div className="flex items-center justify-center gap-3 w-full md:w-auto shrink-0">
                            <Link
                                to={`/login?redirectTo=/article/${id}`}
                                className="px-5 py-2 min-w-[100px] border border-white/50 text-white font-bold rounded-full hover:bg-white/10 transition-colors text-center text-[15px]"
                            >
                                Log in
                            </Link>
                            <Link
                                to={`/register`}
                                className="px-5 py-2 min-w-[100px] bg-white text-emerald-900 font-bold rounded-full hover:bg-zinc-100 transition-colors text-center text-[15px] shadow-sm"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Article"
                description="Are you sure you want to delete this article? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
                isLoading={isDeleting}
            />

            {/* Error/Alert Modal */}
            <ConfirmationModal
                isOpen={!!alertMessage}
                onClose={() => setAlertMessage(null)}
                onConfirm={() => setAlertMessage(null)}
                title="Error"
                description={alertMessage || ''}
                confirmText="OK"
                variant="danger"
                hideCancel
            />
        </div>
    );
};

export default ArticlePage;
