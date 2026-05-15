import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getCompanyProfile, updateCompanyProfile } from '../controllers/companyController.js';

const router = express.Router();

router.get('/profile', getCompanyProfile);
router.put('/profile', authMiddleware, updateCompanyProfile);

export default router;
