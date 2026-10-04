import express from 'express';
import { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction, 
  exportTransactionsCsv,
  transactionSchema 
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateRequest.js';

const router = express.Router();

router.use(protect); // All transaction routes are protected

router.get('/', getTransactions);
router.post('/', validate(transactionSchema), createTransaction);
router.get('/export', exportTransactionsCsv);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
