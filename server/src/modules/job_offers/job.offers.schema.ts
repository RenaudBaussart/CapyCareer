import { z } from "zod";

export const jobOfferSchema = z.object({
    PK_id: z.number().int().openapi({ description: "Primary key of the job offer." }),
    name: z.string().openapi({ description: "Name of the job offer." }),
    contract_type: z.string().openapi({ description: "Type of employment contract." }),
    city: z.string().openapi({ description: "City where the job is located." }),
    country: z.string().openapi({ description: "Country where the job is located." }),
    company: z.string().openapi({ description: "Company offering the job." }),
}).openapi('JobOffer');

export const jobOfferDetailSchema = jobOfferSchema.extend({
    description: z.string().nullable().openapi({ description: "Full description of the job offer." }),
    url: z.string().url().openapi({ description: "URL to the original job offer." }),
    is_remote_job: z.boolean().openapi({ description: "Indicates if the job is fully remote." }),
    is_hybride_job: z.boolean().openapi({ description: "Indicates if the job is hybrid." }),
    publish_date: z.string().datetime().openapi({ description: "Publication date of the offer." }),
    salary_max: z.number().nullable().openapi({ description: "Maximum salary." }),
    salary_min: z.number().nullable().openapi({ description: "Minimum salary." }),
    currency: z.string().nullable().openapi({ description: "Currency for the salary." }),
}).openapi('JobOfferDetail');
