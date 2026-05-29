import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '@/lib/axios';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { getIdentity } from '@/lib/identity';
import { Pulse } from '@/components/ui/Skeleton';

const ArticleSkeleton = () => (
    <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800/80 rounded-lg overflow-hidden">
                <Pulse className="w-full h-52 bg-zinc-800/60" />
            </div>
        ))}
    </div>
);

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

const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent ?? '';
};

const ArticleFeed = () => {
    const [articles, setArticles] = useState<ArticleData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const articlesResponse = await axios.get('/api/articles');
                setArticles(articlesResponse.data.articles);
            } catch (err: unknown) {
                const apiError = err as { response?: { data?: { error?: string } } };
                console.error('Failed to load articles:', err);
                setError(apiError.response?.data?.error ?? 'Failed to load article feed');
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (isLoading) return <ArticleSkeleton />;

    if (error) {
        return (
            <div className="w-full text-center py-12 text-zinc-400">
                <p>{error}</p>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="w-full text-center py-12 px-4">
                <p className="text-zinc-400 mb-4">No articles published in your batch yet.</p>
                <Link to="/write" className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors">
                    Be the first to write one &rarr;
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-end mb-4">
                <Link
                    to="/write"
                    className="hidden md:flex text-sm font-medium text-zinc-300 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full border border-zinc-700/60"
                >
                    Write Article
                </Link>
            </div>

            <div className="grid gap-3">
                {articles.map((article) => {
                    const snippet = stripHtml(article.content).substring(0, 160) + '...';
                    const authorName = article.author.firstName && article.author.lastName
                        ? `${article.author.firstName} ${article.author.lastName}`
                        : article.author.username;
                    const identity = getIdentity(article.author.id, article.author.username);

                    if (article.coverImageUrl) {
                        return (
                            <Link
                                key={article.id}
                                to={`/article/${article.id}`}
                                className="relative block rounded-lg overflow-hidden border border-zinc-800/80 hover:border-zinc-700 group h-52 md:h-64 transition-all duration-150"
                            >
                                {/* Cover image */}
                                <img
                                    src={article.coverImageUrl}
                                    alt={article.title}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />

                                {/* Gradient overlay — top fade for author, bottom fade for title */}
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />

                                {/* Author row — top */}
                                <div className="absolute top-0 left-0 right-0 flex items-center gap-2 p-4">
                                    <img
                                        src={identity.avatar}
                                        alt={authorName}
                                        className="w-5 h-5 rounded-full ring-1 ring-white/20"
                                    />
                                    <span className="text-xs font-medium text-white/70">{authorName}</span>
                                    <span className="text-white/30 text-xs">·</span>
                                    <span className="text-xs text-white/50">{format(new Date(article.createdAt), 'MMM d')}</span>
                                </div>

                                {/* Title + meta — bottom */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-lg font-semibold text-white leading-snug mb-2 group-hover:text-zinc-100 transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                                        <Clock className="w-3 h-3" />
                                        <span>{article.readTime} min read</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    }

                    // Text-only card (no cover image)
                    return (
                        <Link
                            key={article.id}
                            to={`/article/${article.id}`}
                            className="block bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/40 rounded-lg p-4 transition-all duration-150 group"
                        >
                            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2.5">
                                <img
                                    src={identity.avatar}
                                    alt={authorName}
                                    className="w-5 h-5 rounded-full ring-1 ring-zinc-700/60"
                                />
                                <span className="font-medium text-zinc-300">{authorName}</span>
                                <span className="text-zinc-600">·</span>
                                <span>{format(new Date(article.createdAt), 'MMM d')}</span>
                            </div>

                            <h3 className="text-[15px] font-semibold text-zinc-100 leading-snug group-hover:text-white transition-colors mb-1.5 line-clamp-2">
                                {article.title}
                            </h3>

                            <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 mb-3">
                                {snippet}
                            </p>

                            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                <Clock className="w-3 h-3" />
                                <span>{article.readTime} min read</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default ArticleFeed;
