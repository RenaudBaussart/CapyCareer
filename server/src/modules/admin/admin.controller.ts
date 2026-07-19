import { Request, Response, NextFunction } from "express";
import { AdminService } from "./admin.service";
import { pool } from "../../config/database";
import { updateMemberSchema } from "../members/member.schema";



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
const updateMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.query.id as string, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID invalide dans la query." });
        }

        const profileData = updateMemberSchema.parse(req.body);

        const cleanProfileData = Object.fromEntries(
            Object.entries(profileData).filter(([_, value]) => value !== undefined)
        );

        const adminService = new AdminService(pool);
        const result = await adminService.updateMemberProfile(id, cleanProfileData as any);
        
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};

export { getMembers, banMember, unbanMember, updateMembers };

