import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  registerSchema, 
  loginSchema 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateRequest.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
