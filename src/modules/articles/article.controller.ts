import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const prisma = new PrismaClient();

// Setup DOMPurify to run safely within Node.js
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window as any);

// Utility: Calculate read time based on raw word count
const calculateReadTime = (htmlContent: string): number => {
    // Strip HTML tags using regex to calculate sheer word count
    const text = htmlContent.replace(/<[^>]*>?/gm, '');
    const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;

    // Standard reading speed is ~200 words per minute
    return Math.ceil(wordCount / 200) || 1; // Minimum 1 minute read
};

export class ArticleController {

    // POST /api/articles
    static async createArticle(req: Request, res: Response) {
        try {
            const { title, content, coverImageUrl } = req.body;
            const user = (req as any).user; // Decoded from JWT auth middleware

            console.log('--- CREATE ARTICLE INITIATED ---');
            console.log('Payload Title:', title);
            console.log('Payload Content length:', content?.length);
            console.log('JWT User Context:', user);

            if (!title || !content) {
                console.log('Failed: Missing title or content');
                return res.status(400).json({ error: 'Title and content are required' });
            }

            if (!user) {
                console.log('Failed: Missing user object from JWT middleware');
                return res.status(401).json({ error: 'Unauthorized: No user context found' });
            }

            // Important Security: Sanitize incoming HTML to prevent XSS payloads
            const sanitizedContent = DOMPurify.sanitize(content, {
                ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code'],
                ALLOWED_ATTR: ['href', 'target', 'rel', 'class'], // Class allows for syntax highlighting
            });

            const readTime = calculateReadTime(sanitizedContent);

            console.log('Executing Prisma article.create() ...');
            const article = await prisma.article.create({
                data: {
                    title,
                    content: sanitizedContent,
                    readTime,
                    coverImageUrl: coverImageUrl ? String(coverImageUrl).trim() : null,
                    year: user.year,       // Strict Batch tracking
                    branch: user.branch,   // Strict Batch tracking
                    authorId: user.userId,
                },
            });

            console.log('Success! Article created with ID:', article.id);

            return res.status(201).json({
                message: 'Article published successfully',
                article,
            });

        } catch (error) {
            console.error('--- FATAL CREATE ARTICLE ERROR ---');
            console.error(error);
            console.error('----------------------------------');
            return res.status(500).json({ error: 'Failed to publish article', details: error instanceof Error ? error.message : 'Unknown Database Error' });
        }
    }

    // GET /api/articles
    static async getAllArticles(req: Request, res: Response) {
        try {
            const user = (req as any).user;

            // Standard feed: fetch latest 50 articles from the user's batch context
            const articles = await prisma.article.findMany({
                where: {
                    isDeleted: false,
                    year: user.year,
                    branch: user.branch
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 50,
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                        }
                    }
                }
            });

            return res.json({ articles });
        } catch (error) {
            console.error('Get all articles error:', error);
            return res.status(500).json({ error: 'Failed to fetch articles feed' });
        }
    }

    // GET /api/articles/:id
    static async getArticle(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const article = await prisma.article.findUnique({
                where: { id },
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                        }
                    }
                }
            });

            if (!article || article.isDeleted) {
                return res.status(404).json({ error: 'Article not found' });
            }

            return res.json({ article });

        } catch (error) {
            console.error('Get article error:', error);
            return res.status(500).json({ error: 'Failed to fetch article' });
        }
    }

    // DELETE /api/articles/:id
    static async deleteArticle(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = (req as any).user;

            console.log(`--- DELETE ARTICLE INITIATED: Article ID ${id} ---`);

            const article = await prisma.article.findUnique({
                where: { id }
            });

            if (!article || article.isDeleted) {
                return res.status(404).json({ error: 'Article not found' });
            }

            // Verify authorship
            if (article.authorId !== user.userId) {
                console.log(`Failed Delete: User ${user.userId} attempted to delete Article authored by ${article.authorId}`);
                return res.status(403).json({ error: 'Unauthorized: You can only delete your own articles' });
            }

            // Perform Soft Delete
            await prisma.article.update({
                where: { id },
                data: { isDeleted: true }
            });

            console.log(`Success! Article ${id} soft-deleted.`);
            return res.json({ message: 'Article deleted successfully' });

        } catch (error) {
            console.error('Delete article error:', error);
            return res.status(500).json({ error: 'Failed to delete article' });
        }
    }
}
