import { Request, Response, NextFunction } from "express";
import { MemberService } from "./member.service";
import { pool } from "../../config/database";


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

export { getMyProfile };