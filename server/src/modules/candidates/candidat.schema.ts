import { z } from "zod";

export const applySchema = z.object({
    jobId: z.number().int().positive("L'ID de l'offre est invalide."),
    coverLetter: z.string().max(2000, "La lettre de motivation est trop longue.").optional()
}).strict();