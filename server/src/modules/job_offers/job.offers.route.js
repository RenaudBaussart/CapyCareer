import { Router } from 'express';
import { adminAuthMiddleware } from '../auth/auth.middleware';
import { 
    getJobOffers, 
    getJobOfferById, 
    createJobOffer, 
    updateJobOffer, 
    deleteJobOffer, 
    totalJobOffersCount,
    refreshJobOffers
} from './job.offers.controller';
 
 const router = Router();
 
router.get('/', getJobOffers);
router.get('/count', totalJobOffersCount);
router.get('/:id', getJobOfferById);
router.post('/', adminAuthMiddleware, createJobOffer);
router.put('/:id', adminAuthMiddleware, updateJobOffer);
router.delete('/:id', adminAuthMiddleware, deleteJobOffer);
router.post('/refresh', adminAuthMiddleware, refreshJobOffers);

export default router;