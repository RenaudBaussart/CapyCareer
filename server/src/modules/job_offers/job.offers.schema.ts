import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const jobOfferSchema = z.object({
    PK_id: z.number().int().openapi({ description: "Primary key of the job offer." }),
    name: z.string().openapi({ description: "Name of the job offer." }),
    contract_type: z.string().openapi({ description: "Type of employment contract." }),
    city: z.string().openapi({ description: "City where the job is located." }),
    country: z.string().openapi({ description: "Country where the job is located." }),
    company: z.string().openapi({ description: "Company offering the job." }),
    salary_max: z.number().nullable().optional().openapi({ description: "Maximum salary." }),
    salary_min: z.number().nullable().optional().openapi({ description: "Minimum salary." }),
    currency: z.string().nullable().optional().openapi({ description: "Currency for the salary." }),
    tag: z.array(z.string()).nullable().optional().openapi({ description: "Tags for the job offer." }),
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
    tag: z.array(z.string()).nullable().optional().openapi({ description: "Tags for the job offer." }),
}).openapi('JobOfferDetail');

export const jobOfferFullSchema = z.object({
    PK_id: z.number().int().optional().openapi({ description: "Primary key of the job offer." }),
    title: z.string().nullable().openapi({ description: "Title of the job offer." }),
    description: z.string().nullable().openapi({ description: "Full description of the job offer." }),
    url: z.string().url().nullable().openapi({ description: "URL to the original job offer." }),
    contract_type: z.string().nullable().openapi({ description: "Type of employment contract." }),
    city: z.string().nullable().openapi({ description: "City where the job is located." }),
    country: z.string().nullable().openapi({ description: "Country where the job is located." }),
    company: z.string().nullable().openapi({ description: "Company offering the job." }),
    is_remote_job: z.boolean().openapi({ description: "Indicates if the job is fully remote." }),
    is_hybride_job: z.boolean().openapi({ description: "Indicates if the job is hybrid." }),
    user_id: z.number().int().nullable().openapi({ description: "ID of the user who posted the job offer." }),
    publish_date: z.string().datetime().nullable().openapi({ description: "Publication date of the offer." }),
    salary_max: z.number().nullable().openapi({ description: "Maximum salary." }),
    salary_min: z.number().nullable().openapi({ description: "Minimum salary." }),
    currency: z.string().nullable().openapi({ description: "Currency for the salary." }),
    tag: z.array(z.string()).nullable().optional().openapi({ description: "Tags for the job offer." }),
}).openapi('JobOfferFull');