import express from 'express';
import { 
  getGoals, 
  createGoal, 
  updateGoal,
  contributeGoal, 
  deleteGoal,
  goalSchema 
} from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateRequest.js';

const router = express.Router();

router.use(protect);

router.get('/', getGoals);
router.post('/', validate(goalSchema), createGoal);
router.put('/:id', updateGoal);
router.patch('/:id/contribute', contributeGoal);
router.delete('/:id', deleteGoal);

export default router;
