import { Router } from 'express';
import { getJobOffers, getJobOfferById } from './job.offert.controller';

const router = Router();

router.get('/job-offers', getJobOffers);
router.get('/job-offers/:id', getJobOfferById);
export default router;