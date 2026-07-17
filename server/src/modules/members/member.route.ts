import { Router } from 'express';
import { middlewareAuth} from '../../core/middlewares/authMiddleware';
import { middlewareAuthAdmin } from '../../core/middlewares/adminMiddleware';
import { getMyProfile } from './member.controller';
const router = Router();


router.get('/me', middlewareAuth, getMyProfile)

export default router;