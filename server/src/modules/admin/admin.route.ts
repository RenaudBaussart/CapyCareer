import { Router } from 'express';
import { middlewareAuthAdmin } from '../../core/middlewares/adminMiddleware';
import { getMembers, banMember, unbanMember, updateMembers } from './admin.controller';
const router = Router();

router.get('/members', middlewareAuthAdmin, getMembers);
router.delete('/members/ban', middlewareAuthAdmin, banMember);
router.delete('/members/unban', middlewareAuthAdmin, unbanMember);
router.patch('/members/:id/role', middlewareAuthAdmin, updateMembers);
router.patch('/members/:id/password', middlewareAuthAdmin, updateMembers);
router.put('/members/:id', middlewareAuthAdmin, updateMembers);
export default router;