import express from 'express';
import { 
  getDashboardSummary, 
  getCategoryBreakdown, 
  getMonthlyCashflow 
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard-summary', getDashboardSummary);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/monthly-cashflow', getMonthlyCashflow);

export default router;
