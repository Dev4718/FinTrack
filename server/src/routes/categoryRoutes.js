import express from 'express';
import { 
  getCategories, 
  createCategory, 
  deleteCategory,
  categorySchema 
} from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateRequest.js';

const router = express.Router();

router.use(protect);

router.get('/', getCategories);
router.post('/', validate(categorySchema), createCategory);
router.delete('/:id', deleteCategory);

export default router;
