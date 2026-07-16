import { Router } from 'express';
import { registerMember, loginMember, logoutMember } from './auth.controller';
import { middlewareAuth } from '../../core/middlewares/authMiddleware';
import { loginLimiter } from '../../core/middlewares/rateLimiter';
import { middlewareGuest } from '../../core/middlewares/guestMiddleware';
const router = Router();

router.post('/register', middlewareGuest, registerMember);
router.post('/login', loginLimiter, middlewareGuest, loginMember);
router.post('/logout', middlewareAuth, logoutMember);
export default router;