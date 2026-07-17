import { Request, Response, NextFunction } from "express";
import { AdminService } from "./admin.service";
import { pool } from "../../config/database";


const getAllMembersProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminService = new AdminService(pool);
        const members = await adminService.getAllMembers(req.member?.id);

        res.status(200).json({ message: "Profils des membres récupérés avec succès.", members });
    } catch (error: any) {
        next(error);
    }
};

export { getAllMembersProfile };