import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { submitContactForm, getContacts, updateContactStatus } from '../controllers/contactController.js';

const router = express.Router();

router.post('/submit', submitContactForm);
router.get('/', authMiddleware, getContacts);
router.put('/:id/status', authMiddleware, updateContactStatus);

export default router;
