import { Router } from 'express';
import { addAPIKey, validateAPIKey, getAPIKeys, deleteAPIKey, updateAPIKeyModels } from '../controllers/apiKeyController';
import { authenticate } from '../middleware/auth';
import { validate, schemas } from '../middleware/validator';
import { generalLimiter, apiKeyLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticate);

router.get('/', generalLimiter, getAPIKeys);
router.post('/', generalLimiter, validate(schemas.addAPIKey), addAPIKey);
router.post('/validate', apiKeyLimiter, validate(schemas.validateAPIKey), validateAPIKey);
router.delete('/:provider', generalLimiter, deleteAPIKey);
router.patch('/:provider/models', generalLimiter, updateAPIKeyModels);

export default router;
