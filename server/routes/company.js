import express from 'express';
import { getCompanyProfile, updateCompanyProfile } from '../controllers/companyController.js';

const router = express.Router();

router.get('/profile', getCompanyProfile);
router.put('/profile', updateCompanyProfile);

export default router;
