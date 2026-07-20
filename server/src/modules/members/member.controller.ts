import { Request, Response, NextFunction } from "express";
import { MemberService } from "./member.service";
import { pool } from "../../config/database";
import { updateAccountSchema, updateProfileSchema, updatePasswordSchema } from "./member.schema";
import { ZodError } from "zod"; 

/**
 * Récupère le profil du membre actuellement connecté.
 * @param req - La requête Express contenant l'ID du membre dans req.member.id.
 * @param res - La réponse Express pour envoyer le profil du membre.
 * @param next - La fonction next pour passer au middleware suivant en cas d'erreur.
 */
const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const myId = req.member.id;
        const memberService = new MemberService(pool);
        const member = await memberService.getMemberById(myId);
        
        res.status(200).json({ message: "Mon profil récupéré.", member });
    } catch (error: any) {
        next(error);
    }
};

/**
 * Met à jour le profil du membre actuellement connecté.
 * @param req - La requête Express contenant les données à mettre à jour dans req.body.
 * @param res - La réponse Express pour confirmer la mise à jour du profil.
 * @param next - La fonction next pour passer au middleware suivant en cas d'erreur.
 */
const updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const myId = req.member.id;
        const memberService = new MemberService(pool);
        
        let validatedData: any;
        let successMessage = "";

        if (req.originalUrl.endsWith('/password')) {
            const parsedData = updatePasswordSchema.parse(req.body); 
            validatedData = { newPassword: parsedData.password };
            successMessage = "Mot de passe mis à jour avec succès.";
        } 
        else if (req.originalUrl.endsWith('/account')) {
            validatedData = updateAccountSchema.parse(req.body);
            successMessage = "Informations de compte mises à jour avec succès.";
        } 
        else {
            validatedData = updateProfileSchema.parse(req.body);
            successMessage = "Profil mis à jour avec succès.";
        }

        await memberService.modifyYourProfile(myId, validatedData);
        
        res.status(200).json({ message: successMessage });

    } catch (error: any) {
        if (error instanceof ZodError) {
            return res.status(400).json({ 
                message: "Erreur de validation des données.", 
                errors: error.flatten().fieldErrors 
            });
        }
        next(error);
    }
};

const deleteMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const myId = req.member.id;
        
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Token non fourni." });
        }

        const memberService = new MemberService(pool);
        const result = await memberService.deleteYourProfile(myId, token);
        
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};

export { getMyProfile, updateMyProfile, deleteMyProfile };