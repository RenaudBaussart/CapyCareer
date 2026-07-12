import { Router } from 'express';
import { registerMember, loginMember } from './auth.controller';

const router = Router();

router.post('/register', registerMember);
router.post('/login', loginMember);

export default router;