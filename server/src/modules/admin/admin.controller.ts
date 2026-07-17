import { Request, Response, NextFunction } from "express";
import { AdminService } from "./admin.service";
import { pool } from "../../config/database";



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

export { getMembers };