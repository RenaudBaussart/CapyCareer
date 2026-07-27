import { Router } from 'express';
import { getJobOffers, getJobOfferById } from './job.offers.controller';

const router = Router();

router.get('/', getJobOffers);
router.get('/:id', getJobOfferById);
export default router;