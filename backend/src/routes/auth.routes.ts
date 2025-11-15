import { Router } from 'express';
import { login, refresh, logout } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { loginSchema, refreshTokenSchema } from '../schemas/auth.schema';
import { authLimiter } from '../middleware/rate-limiter';

const router = Router();

// Public routes
router.post('/login', authLimiter, validateRequest(loginSchema), login);

// Protected routes
router.post(
  '/refresh',
  authenticate,
  validateRequest(refreshTokenSchema),
  refresh
);
router.post('/logout', authenticate, logout);

export default router;
