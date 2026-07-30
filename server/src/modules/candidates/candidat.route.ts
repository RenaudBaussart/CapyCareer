import { Router } from 'express';
import { redirectToSite } from './candidat.controller';
import { middlewareAuth } from '../../core/middlewares/authMiddleware';

const router = Router();


router.get('/redirect/:jobId',middlewareAuth, redirectToSite);

export default router;