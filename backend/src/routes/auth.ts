import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/authController';
import { validate, schemas } from '../middleware/validator';
import { generalLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', generalLimiter, validate(schemas.register), register);
router.post('/login', generalLimiter, validate(schemas.login), login);
router.post('/refresh', generalLimiter, refresh);
router.post('/logout', generalLimiter, logout);

export default router;
