import { Request, Response } from "express";
import { MemberService } from "./member.service";
import { pool } from "../../config/database";

const getAllMembersProfile = async (req: Request, res: Response) => {
    try {
        const memberService = new MemberService(pool);
        const members = await memberService.getAllMembers(req.member?.id);

        res.status(200).json({ message: "Profils des membres récupérés avec succès.", members });
    } catch (error) {
        if (error instanceof Error && error.message === "NO_MEMBERS_FOUND") {
            return res.status(404).json({ message: "Aucun membre trouvé." });
        }
        console.error("Erreur lors de la récupération des profils des membres:", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

export { getAllMembersProfile };