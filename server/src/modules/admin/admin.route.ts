import { Router } from 'express';
import { middlewareAuthAdmin } from '../../core/middlewares/adminMiddleware';
import { getMembers, banMember, unbanMember, updateMembers, getStats, getBannedMembers } from './admin.controller';
import { middlewareAuth } from '../../core/middlewares/authMiddleware';
const router = Router();

router.get('/members', middlewareAuthAdmin, getMembers);
router.delete('/members/ban', middlewareAuthAdmin, banMember);
router.delete('/members/unban', middlewareAuthAdmin, unbanMember);
router.patch('/members/:id/role', middlewareAuthAdmin, updateMembers);
router.patch('/members/:id/password', middlewareAuthAdmin, updateMembers);
router.put('/members/:id', middlewareAuthAdmin, updateMembers);

// route pour les stats user
router.get('/stats/users', middlewareAuth, middlewareAuthAdmin, getStats);
// route pour les users banned
router.get('/banned', middlewareAuthAdmin, getBannedMembers);
export default router;