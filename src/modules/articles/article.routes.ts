import { Router } from 'express';
import { ArticleController } from './article.controller.js';
import { requireAuth } from '../../shared/middleware/auth.middleware.js';

const router = Router();

// Create new long-form article
router.post('/', requireAuth, ArticleController.createArticle as any);

// Fetch all articles for the global feed
router.get('/', requireAuth, ArticleController.getAllArticles as any);

// Fetch an article for reading (Public - Auth Wall handled by frontend)
router.get('/:id', ArticleController.getArticle as any);

// Delete an article
router.delete('/:id', requireAuth, ArticleController.deleteArticle as any);

export default router;
