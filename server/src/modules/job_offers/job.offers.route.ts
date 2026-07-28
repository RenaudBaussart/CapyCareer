import { Router } from 'express';
import {
    getJobOffers,
    getJobOfferById,
    createJobOffer,
    updateJobOffer,
    deleteJobOffer,
    totalJobOffersCount,
    refreshJobOffers,
    getLastSyncDate
} from './job.offers.controller';

const router = Router();

router.get('/', getJobOffers);
router.get('/count', totalJobOffersCount);
router.post('/refresh', refreshJobOffers);
router.get('/last-sync', getLastSyncDate);
router.get('/:id', getJobOfferById);
router.post('/', createJobOffer);
router.put('/:id', updateJobOffer);
router.delete('/:id', deleteJobOffer);

export default router;