import { Router } from 'express';
import { registerMember, loginMember, logoutMember } from './auth.controller';
import { middlewareAuth } from '../../core/middlewares/authMiddleware';
const router = Router();

router.post('/register', registerMember);
router.post('/login', loginMember);
router.post('/logout', middlewareAuth, logoutMember);
export default router;