import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);
// schema de base pour une offre simple (ex: liste)
export const jobOfferSchema = z.object({
    PK_id: z.number().int().openapi({ description: "Primary key of the job offer." }),
    title: z.string().openapi({ description: "Title of the job offer." }),
    company: z.string().openapi({ description: "Company offering the job." }),
    contract_type: z.string().nullable().optional().openapi({ description: "Type of employment contract." }),
    city: z.string().nullable().optional().openapi({ description: "City where the job is located." }),
    country: z.string().nullable().optional().openapi({ description: "Country where the job is located." }),
    salary_max: z.number().nullable().optional().openapi({ description: "Maximum salary." }),
    salary_min: z.number().nullable().optional().openapi({ description: "Minimum salary." }),
    currency: z.string().nullable().optional().openapi({ description: "Currency for the salary." }),
    tag: z.string().nullable().optional().openapi({ description: "Tags for the job offer." }),
}).openapi('JobOffer');

// schema pour les details complets d'une offre (extension du premier)
export const jobOfferDetailSchema = jobOfferSchema.extend({
    description: z.string().nullable().optional().openapi({ description: "Full description of the job offer." }),
    url: z.string().url().nullable().optional().openapi({ description: "URL to the original job offer." }),
    is_remote_job: z.boolean().nullable().optional().openapi({ description: "Indicates if the job is fully remote." }),
    is_hybride_job: z.boolean().nullable().optional().openapi({ description: "Indicates if the job is hybrid." }),
    publish_date: z.string().nullable().optional().openapi({ description: "Publication date of the offer." }),
}).openapi('JobOfferDetail');

// schema complet (creation / mise a jour en BDD)
export const jobOfferFullSchema = z.object({
    PK_id: z.number().int().optional().openapi({ description: "Primary key of the job offer." }),
    title: z.string().nullable().optional().openapi({ description: "Title of the job offer." }),
    description: z.string().nullable().optional().openapi({ description: "Full description of the job offer." }),
    url: z.string().nullable().optional().openapi({ description: "URL to the original job offer." }),
    contract_type: z.string().nullable().optional().openapi({ description: "Type of employment contract." }),
    city: z.string().nullable().optional().openapi({ description: "City where the job is located." }),
    country: z.string().nullable().optional().openapi({ description: "Country where the job is located." }),
    company: z.string().nullable().optional().openapi({ description: "Company offering the job." }),
    is_remote_job: z.boolean().nullable().optional().openapi({ description: "Indicates if the job is fully remote." }),
    is_hybride_job: z.boolean().nullable().optional().openapi({ description: "Indicates if the job is hybrid." }),
    user_id: z.number().int().nullable().optional().openapi({ description: "ID of the user who posted the job offer." }),
    publish_date: z.string().nullable().optional().openapi({ description: "Publication date of the offer." }),
    salary_max: z.number().nullable().optional().openapi({ description: "Maximum salary." }),
    salary_min: z.number().nullable().optional().openapi({ description: "Minimum salary." }),
    currency: z.string().nullable().optional().openapi({ description: "Currency for the salary." }),
    tag: z.string().nullable().optional().openapi({ description: "Tags for the job offer." }),
}).openapi('JobOfferFull');

// schema dedie a la mise a jour partielle (PUT / PATCH)
export const updateJobOfferSchema = jobOfferFullSchema.partial();