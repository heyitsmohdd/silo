
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Flame } from 'lucide-react';
import axiosClient from '@/lib/axios';

interface NewsItem {
    title: string;
    url: string;
    category?: 'TECH' | 'EVENT' | 'BLOG';
    source?: { name: string };
    publishedAt?: string;
}

const NewsHighlights = () => {
    const { data: newsItems, isLoading } = useQuery({
        queryKey: ['news-highlights'],
        queryFn: async () => {
            try {
                const response = await axiosClient.get('/api/news');
                return response.data;
            } catch (error) {
                console.warn('Failed to fetch news highlights', error);
                return [];
            }
        },
        staleTime: 1000// 60// 15,
    });

    if (isLoading) {
        return (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide py-1">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="min-w-[160px] h-9 bg-zinc-900/50 rounded-lg animate-pulse border border-zinc-800/50" />
                ))}
            </div>
        );
    }

    if (!newsItems || newsItems.length === 0) return null;

    return (
        <div className="w-full">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x items-center">

                <div className="flex items-center gap-1.5 px-2 flex-shrink-0">
                    <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Trending</span>
                </div>

                {newsItems.map((item: NewsItem, index: number) => (
                    <a
                        key={index}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="snap-start flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all group whitespace-nowrap"
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.category === 'TECH' ? 'bg-cyan-500' :
                            item.category === 'EVENT' ? 'bg-emerald-500' : 'bg-violet-500'
                            } group-hover:scale-125 transition-transform`} />

                        <span className="text-xs font-medium text-zinc-300 max-w-[200px] truncate group-hover:text-zinc-100 transition-colors">
                            {item.title}
                        </span>

                        <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all -ml-1 group-hover:ml-0" />
                    </a>
                ))}
            </div>
        </div>
    );
};

export default NewsHighlights;
