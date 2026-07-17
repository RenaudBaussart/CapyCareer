import { Router } from 'express';
import { middlewareAuthAdmin } from '../../core/middlewares/adminMiddleware';
import { getAllMembersProfile } from './admin.controller';
const router = Router();

router.get('/', middlewareAuthAdmin, getAllMembersProfile);
router.get('/candidat', middlewareAuthAdmin);
router.get('/recruteur', middlewareAuthAdmin);

export default router;