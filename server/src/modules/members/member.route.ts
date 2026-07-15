import { Router } from 'express';
import { middlewareAuthAdmin } from '../../core/middlewares/authMiddleware';
import { getAllMembersProfile } from './member.controller';
const router = Router();

router.get('/', middlewareAuthAdmin, getAllMembersProfile);
export default router;