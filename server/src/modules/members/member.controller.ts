import { Request, Response, NextFunction } from "express";
import { MemberService } from "./member.service";
import { pool } from "../../config/database";


/**
 * Recupere la liste de tous les profils des membres.
 * @param req - La requête Express.
 * @param res - La réponse Express.
 * @param next - La fonction next pour passer au middleware suivant en cas d'erreur.
 * @returns Une réponse JSON contenant la liste des profils des membres.
 * @throws Une erreur si aucun membre n'est trouvé ou si une erreur de base de données se produit.
 */
const getAllMembersProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const memberService = new MemberService(pool);
        const members = await memberService.getAllMembers(req.member?.id);

        res.status(200).json({ message: "Profils des membres récupérés avec succès.", members });
    } catch (error: any) {
        next(error);
    }
};
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

export { getAllMembersProfile, getMyProfile };