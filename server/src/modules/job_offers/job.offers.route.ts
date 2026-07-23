import { Router } from 'express';
import { 
    getJobOffers, 
    getJobOfferById, 
    createJobOffer, 
    updateJobOffer, 
    deleteJobOffer, 
    totalJobOffersCount 
} from './job.offers.controller';

const router = Router();

router.get('/', getJobOffers);
router.get('/count', totalJobOffersCount);
router.get('/:id', getJobOfferById);
router.post('/', createJobOffer);
router.put('/:id', updateJobOffer);
router.delete('/:id', deleteJobOffer);

export default router;