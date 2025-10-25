import { Router } from 'express';
import { getMemory, setMemory, deleteMemory, clearMemory } from '../controllers/memoryController';
import { authenticate } from '../middleware/auth';
import { validate, schemas } from '../middleware/validator';
import { generalLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticate);

router.get('/', generalLimiter, getMemory);
router.post('/', generalLimiter, validate(schemas.memory), setMemory);
router.delete('/:key', generalLimiter, deleteMemory);
router.delete('/', generalLimiter, clearMemory);

export default router;
