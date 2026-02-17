
import { Router } from 'express';
import { getLatestNews } from './news.controller.js';

const router = Router();

router.get('/', getLatestNews);

export default router;
