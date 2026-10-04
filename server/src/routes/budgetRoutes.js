import express from 'express';
import { 
  getBudgets, 
  upsertBudget, 
  deleteBudget,
  budgetSchema 
} from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateRequest.js';

const router = express.Router();

router.use(protect);

router.get('/', getBudgets);
router.post('/', validate(budgetSchema), upsertBudget);
router.delete('/:id', deleteBudget);

export default router;
