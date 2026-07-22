import { Request, Response, NextFunction } from "express";
import { AdminService } from "./admin.service";
import { pool } from "../../config/database";
import { updateMemberSchema } from "../members/member.schema";
import { ZodError } from "zod";


/**
 * Récupère la liste des membres ou les membres par rôle.
 * @param req - La requête Express contenant éventuellement le rôle dans req.query.role.
 * @param res - La réponse Express pour envoyer la liste des membres.
 * @param next - La fonction next pour passer au middleware suivant en cas d'erreur.
 */
const getMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminService = new AdminService(pool);

        const roleQuery = req.query.role as string;

        if (roleQuery) {

            const members = await adminService.getMemberByRoleName(roleQuery, req.member?.id);
            return res.status(200).json({
                message: `Liste des ${roleQuery}s récupérée avec succès.`,
                members
            });
        }


        const allMembers = await adminService.getAllMembers(req.member?.id);
        res.status(200).json({ message: "Tous les profils récupérés.", members: allMembers });

    } catch (error: any) {
        next(error);
    }
};

/**
 * Bannit un membre en fonction de son email.
 * @param req - La requête Express contenant l'email du membre à bannir dans req.query.email.
 * @param res - La réponse Express pour confirmer le bannissement.
 * @param next - La fonction next pour passer au middleware suivant en cas d'erreur.
 */
const banMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.query.email as string;


        const adminService = new AdminService(pool);
        const result = await adminService.banMember(email);
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};
/**
 * Débannit un membre en fonction de son email.
 * @param req - La requête Express contenant l'email du membre à débannir dans req.query.email.
 * @param res - La réponse Express pour confirmer le débannissement.
 * @param next - La fonction next pour passer au middleware suivant en cas d'erreur.
 */
const unbanMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.query;

        const adminService = new AdminService(pool);
        const result = await adminService.unbanMember(email as string);
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};

/**
 * Récupère la liste de tous les membres bannis depuis la table Banned
 * @param req - La requête Express
 * @param res - La réponse Express pour envoyer la liste des membres bannis
 * @param next - La fonction next pour passer au middleware suivant en cas d'erreur
 */
const getBannedMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminService = new AdminService(pool);
        const bannedMembers = await adminService.getBannedMembers();

        res.status(200).json(bannedMembers);
    } catch (error: any) {
        next(error);
    }
};


/**
 * Met à jour les informations d'un membre, y compris son rôle et son mot de passe.
 * @param req - La requête Express contenant l'ID du membre dans req.query.id et les nouvelles données dans req.body.
 * @param res - La réponse Express pour confirmer la mise à jour.
 * @param next - La fonction next pour passer au middleware suivant en cas d'erreur.
 * @returns {void} Ne retourne rien, mais envoie une réponse JSON avec un message de succès ou d'erreur.
 * @throws {400 Bad Request} Si les données de mise à jour ne sont pas valides selon le schéma Zod.
 * @throws {401 Unauthorized} Si le token d'authentification est absent ou invalide.
 * @throws {403 Forbidden} Si l'utilisateur n'a pas les droits nécessaires pour effectuer la mise à jour.
 * @throws {500 Internal Server Error} Si une erreur inattendue survient lors de la mise à jour des informations du membre.
 */
const updateMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const memberId = parseInt((req.params.id || req.query.id) as string, 10);
        const adminService = new AdminService(pool);

        let rawData: any = {};
        let successMessage = "Profil mis à jour avec succès.";

        if (req.originalUrl.endsWith('/role')) {
            rawData = { role: req.body.role };
            successMessage = "Rôle du membre mis à jour avec succès.";
        }
        if (req.originalUrl.endsWith('/password') || req.body.password) {
            rawData = { newPassword: req.body.password || req.body.newPassword };
            successMessage = "Mot de passe du membre mis à jour avec succès.";
        }
        else {
            rawData = req.body;
        }


        const validatedData = updateMemberSchema.parse(rawData);


        await adminService.performAdminUpdate(memberId, validatedData);

        res.status(200).json({ message: successMessage });

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


// pour gerer la requete HTTP des stats des users
const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminService = new AdminService(pool);
        const stats = await adminService.getUserStats();

        res.status(200).json(stats);
    } catch (error: any) {
        next(error);
    }
};

export { getMembers, banMember, unbanMember, updateMembers, getStats, getBannedMembers };

