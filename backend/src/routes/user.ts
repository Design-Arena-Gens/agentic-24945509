import { Router } from 'express';
import { getProfile, updateProfile, deleteAccount, exportData } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validate, schemas } from '../middleware/validator';
import { generalLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticate);

router.get('/profile', generalLimiter, getProfile);
router.patch('/profile', generalLimiter, validate(schemas.updateProfile), updateProfile);
router.delete('/account', generalLimiter, deleteAccount);
router.get('/export', generalLimiter, exportData);

export default router;
