
import { Request, Response } from 'express';

interface NewsCache {
    data: any[];
    timestamp: number;
}

let newsCache: NewsCache = {
    data: [],
    timestamp: 0,
};

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour



export const getLatestNews = async (_req: Request, res: Response) => {
    try {
        const now = Date.now();

        // Check cache
        if (newsCache.data.length > 0 && (now - newsCache.timestamp < CACHE_DURATION)) {
            console.log('Serving news from cache');
            return res.json(newsCache.data);
        }

        const apiKey = process.env.NEWS_API_KEY;

        if (!apiKey) {
            console.warn('NEWS_API_KEY not found.');
            return res.json([]);
        }

        console.log('Fetching news from NewsAPI...');

        // Using native fetch (Node 18+)
        const response = await fetch(`https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=5&apiKey=${apiKey}`);

        if (!response.ok) {
            throw new Error(`NewsAPI responded with ${response.status}`);
        }

        const data = await response.json() as any;

        if (data.status === 'ok' && Array.isArray(data.articles)) {
            const articles = data.articles.map((article: any) => ({
                ...article,
                category: 'TECH' // Default to TECH
            }));

            // Update cache
            newsCache = {
                data: articles,
                timestamp: now
            };

            return res.json(articles);
        } else {
            throw new Error('Invalid data format from NewsAPI');
        }

    } catch (error) {
        console.error('Error fetching news:', error);
        // Fallback to cache if available even if expired, otherwise empty
        if (newsCache.data.length > 0) {
            console.warn('Serving expired cache due to error');
            return res.json(newsCache.data);
        }
        res.json([]);
    }
};
