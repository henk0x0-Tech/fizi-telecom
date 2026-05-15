import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan
} from '../controllers/planController.js';

const router = express.Router();

router.get('/', getAllPlans);
router.post('/', authMiddleware, createPlan);
router.put('/:id', authMiddleware, updatePlan);
router.delete('/:id', authMiddleware, deletePlan);

export default router;
