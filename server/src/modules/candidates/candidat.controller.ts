import { Request, Response, NextFunction } from "express";
import { CandidatService } from "./candidat.service";
import { applySchema } from "./candidat.schema";
import { ZodError } from "zod";
import { pool } from "../../config/database";

/**
 * Redirige l'utilisateur vers le site de l'offre d'emploi en fonction de l'ID du job.
 * @param req - La requête Express contenant l'ID du job dans req.params.jobId.
 * @param res - La réponse Express pour rediriger l'utilisateur vers le site de l'offre.
 * @param next - La fonction next pour passer au middleware suivant en cas d'erreur.
 */
const redirectToSite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = applySchema.parse({
            jobId: parseInt(req.params.jobId as string, 10)
        });

        const candidateId = req.member!.id; 

        const candidatService = new CandidatService(pool);
        const url = await candidatService.redirectToSite(validatedData.jobId, candidateId);

        res.redirect(url);
    } catch (error) {
           if (error instanceof ZodError) {
            return res.status(400).json({ 
                message: "Erreur de validation des données.", 
                errors: error.flatten().fieldErrors 
            });
        }
        next(error);
    }
};

export { redirectToSite };