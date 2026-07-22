import { z } from "zod";
import { jobOfferFullSchema } from "./job.offers.schema";

export type fullJobOffer = z.infer<typeof jobOfferFullSchema>;

export const createJobFullOffer = (payload: fullJobOffer) => {
    return jobOfferFullSchema.parse(payload);
}