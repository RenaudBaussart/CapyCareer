import { Router } from 'express';
import { middlewareAuthAdmin } from '../../core/middlewares/adminMiddleware';
import { getMembers } from './admin.controller';
const router = Router();

router.get('/members', middlewareAuthAdmin, getMembers);

export default router;