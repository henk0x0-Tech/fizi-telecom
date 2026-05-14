import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getSiteContent,
  getSiteSection,
  updateSiteContent,
  updateSiteSection,
  resetSiteContent
} from '../controllers/siteContentController.js';

const router = express.Router();

// Public routes (no auth needed — frontend reads these)
router.get('/', getSiteContent);
router.get('/:section', getSiteSection);

// Protected routes (admin only)
router.put('/', authMiddleware, updateSiteContent);
router.put('/:section', authMiddleware, updateSiteSection);
router.post('/reset', authMiddleware, resetSiteContent);

export default router;
