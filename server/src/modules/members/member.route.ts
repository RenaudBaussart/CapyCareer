import { Router } from 'express';
import { middlewareAuth} from '../../core/middlewares/authMiddleware';
import { deleteMyProfile, getMyProfile, updateMyProfile } from './member.controller';
const router = Router();


router.get('/me', middlewareAuth, getMyProfile)
router.put('/me', middlewareAuth, updateMyProfile)
router.delete('/me', middlewareAuth, deleteMyProfile)
router.patch('/me/password', middlewareAuth, updateMyProfile)
router.patch('/me/account', middlewareAuth, updateMyProfile) 
export default router;