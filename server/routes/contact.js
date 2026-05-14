import express from 'express';
import { submitContactForm, getContacts, updateContactStatus } from '../controllers/contactController.js';

const router = express.Router();

router.post('/submit', submitContactForm);
router.get('/', getContacts);
router.put('/:id/status', updateContactStatus);

export default router;
