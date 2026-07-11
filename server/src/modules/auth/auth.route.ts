import { Router } from 'express';
import { registerMember } from './auth.controller';

const router = Router();

router.post('/register', registerMember);

export default router;