import express from 'express';
import { login, verifyToken, authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/verify', authMiddleware, verifyToken);

export default router;
