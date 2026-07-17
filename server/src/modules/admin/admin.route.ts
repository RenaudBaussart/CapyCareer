import { Router } from 'express';
import { middlewareAuthAdmin } from '../../core/middlewares/adminMiddleware';
import { getMembers, banMember, unbanMember } from './admin.controller';
const router = Router();

router.get('/members', middlewareAuthAdmin, getMembers);
router.delete('/members/ban', middlewareAuthAdmin, banMember);
router.delete('/members/unban', middlewareAuthAdmin, unbanMember);
export default router;