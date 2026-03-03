import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '@/lib/axios';
import { Clock, CalendarDays, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface ArticleData {
    id: string;
    title: string;
    content: string; // We will extract a snippet from this
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

const ArticleFeed = () => {
    const [articles, setArticles] = useState<ArticleData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get('/api/articles');
                setArticles(response.data.articles);
            } catch (err: any) {
                console.error('Failed to load articles:', err);
                setError(err.response?.data?.error || 'Failed to load article feed');
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, []);

    // Utility to strip HTML tags from Tiptap content for the preview snippet
    const stripHtml = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    if (isLoading) {
        return (
            <div className="w-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full text-center py-12 text-zinc-400">
                <p>{error}</p>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="w-full text-center py-12 px-4 glass-card">
                <p className="text-zinc-400 mb-4">No articles published in your batch yet.</p>
                <Link to="/write" className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors">
                    Be the first to write one &rarr;
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
                    <span className="bg-emerald-500 w-2 h-6 rounded-full inline-block"></span>
                    Latest Articles
                </h2>
                {/* Hidden on mobile — use the + FAB button instead */}
                <Link to="/write" className="hidden md:flex text-sm font-medium text-zinc-300 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full border border-white/5 shadow-sm">
                    Write Article
                </Link>
            </div>

            <div className="grid gap-6">
                {articles.map((article) => {
                    const snippet = stripHtml(article.content).substring(0, 160) + '...';

                    return (
                        <Link
                            key={article.id}
                            to={`/article/${article.id}`}
                            className="block group bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/5 hover:border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-300"
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                                        {article.author.firstName?.[0] || article.author.username?.[0] || '?'}
                                    </div>
                                    <div className="text-sm text-zinc-400">
                                        <span className="font-medium text-zinc-200">
                                            {article.author.firstName && article.author.lastName
                                                ? `${article.author.firstName} ${article.author.lastName}`
                                                : article.author.username}
                                        </span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-zinc-700"></div>
                                    <div className="text-xs text-zinc-500 flex items-center gap-1.5 hidden sm:flex">
                                        <CalendarDays className="w-3.5 h-3.5" />
                                        <span>{format(new Date(article.createdAt), 'MMM d')}</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-zinc-100 mb-3 group-hover:text-white transition-colors leading-tight">
                                    {article.title}
                                </h3>

                                {article.coverImageUrl && (
                                    <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden mb-5 border border-white/5 relative z-0">
                                        <img
                                            src={article.coverImageUrl}
                                            alt={article.title}
                                            className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-700 ease-out"
                                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        />
                                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl pointer-events-none"></div>
                                    </div>
                                )}

                                <p className="text-zinc-400 leading-relaxed mb-6 line-clamp-2">
                                    {snippet}
                                </p>

                                <div className="mt-auto flex items-center justify-between text-sm text-zinc-500">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        <span>{article.readTime} min read</span>
                                    </div>
                                    <div className="flex items-center text-zinc-300 font-medium opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                                        Read Full Article <ChevronRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default ArticleFeed;
