import { Router, Response } from 'express';
import { sendPrivateMessage, sendPublicMessage } from '../controllers/message.controller';
import authenticate from '../middlewares/auth.middleware';
import cacheControl from '../middlewares/cache.middleware';

const router = Router();

// Health check
router.get('/health', (req, res): void => {
    res.status(200).send('Server is UP')
});

// Route to send public messages via REST
router.post('/messages/public', cacheControl('public', 3600), sendPublicMessage);

// Route to send private messages via REST (with authentication)
router.post('/messages/private', authenticate, cacheControl('private', 60, 'no-store, no-cache'), sendPrivateMessage);

export default router;
