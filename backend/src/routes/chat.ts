import { Router } from 'express';
import { chat, saveChat, getChatHistory, getChat, deleteChat, searchChats } from '../controllers/chatController';
import { authenticate } from '../middleware/auth';
import { validate, schemas } from '../middleware/validator';
import { chatLimiter, generalLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticate);

router.post('/', chatLimiter, validate(schemas.chat), chat);
router.post('/save', generalLimiter, saveChat);
router.get('/history', generalLimiter, getChatHistory);
router.get('/search', generalLimiter, searchChats);
router.get('/:id', generalLimiter, getChat);
router.delete('/:id', generalLimiter, deleteChat);

export default router;
