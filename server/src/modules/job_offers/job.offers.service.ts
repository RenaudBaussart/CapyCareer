import { z } from "zod";
import { jobOfferFullSchema } from "./job.offers.schema";

export type fullJobOffer = z.infer<typeof jobOfferFullSchema>;

export const createJobFullOffer = (payload: fullJobOffer) => {
    return jobOfferFullSchema.parse(payload);
}

/* transforme la chaîne tag stockee en BDD en tableau de mots cles */
export function parseTagString(raw: unknown): string[] {
    if (!raw || typeof raw !== 'string') return [];

    const hasComma = raw.includes(',');
    const dashSegments = raw.split(/\s+-\s+/).filter(Boolean);
    const looksLikeDashList = !hasComma && dashSegments.length > 3;

    const segments = looksLikeDashList ? dashSegments : raw.split(',');

    return segments
        .map((s) => s.trim().replace(/^[-(\[]+|[)\]]+$/g, '').trim())
        .filter((s) => s.length > 0 && s.length <= 60);
}