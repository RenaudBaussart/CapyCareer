import { z } from "zod";

export const jobOfferSchema = z.object({
    PK_content_hash: z.string().openapi({ description: "Unique identifier for the job offer." }),
    name: z.string().openapi({ description: "Name of the job offer." }),
    contract_type: z.string().openapi({ description: "Type of employment contract." }),
    city: z.string().openapi({ description: "City where the job is located." }),
    country: z.string().openapi({ description: "Country where the job is located." }),
    company: z.string().openapi({ description: "Company offering the job." }),
}).openapi('JobOffer');
