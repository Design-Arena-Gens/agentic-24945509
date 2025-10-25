import { Router } from 'express';
import { executeAgent } from '../controllers/agentController';
import { authenticate } from '../middleware/auth';
import { validate, schemas } from '../middleware/validator';
import { chatLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticate);

router.post('/execute', chatLimiter, validate(schemas.agent), executeAgent);

export default router;
