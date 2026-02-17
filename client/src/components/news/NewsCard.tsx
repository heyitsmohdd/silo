
import { Calendar, Cpu, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';

export type NewsCategory = 'TECH' | 'EVENT' | 'BLOG';

export interface NewsItemProps {
    id: string;
    title: string;
    content: string;
    category: NewsCategory;
    externalLink?: string | null;
    createdAt: string;
}

const CategoryIcon = ({ category }: { category: NewsCategory }) => {
    switch (category) {
        case 'TECH':
            return <Cpu className="w-4 h-4 text-cyan-400" />;
        case 'EVENT':
            return <Calendar className="w-4 h-4 text-emerald-400" />;
        case 'BLOG':
            return <BookOpen className="w-4 h-4 text-violet-400" />;
        default:
            return <Cpu className="w-4 h-4 text-zinc-400" />;
    }
};

const NewsCard = ({ item }: { item: NewsItemProps }) => {
    return (
        <div className="group relative p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-300">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    <CategoryIcon category={item.category} />
                    <span>{item.category}</span>
                </div>

                {/* Date could go here if needed */}
            </div>

            <h3 className="text-zinc-100 font-semibold mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                {item.title}
            </h3>

            <p className="text-zinc-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                {item.content}
            </p>

            {item.externalLink ? (
                <a
                    href={item.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                    Read More <ExternalLink className="w-3 h-3" />
                </a>
            ) : (
                <button className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                    Read More <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
            )}
        </div>
    );
};

export default NewsCard;
