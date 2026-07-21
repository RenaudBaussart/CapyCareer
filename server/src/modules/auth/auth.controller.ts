import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { member } from "../members/member.schema";
import { pool } from '../../config/database'; 
import { AuthService } from "./auth.service"; 
import { loginSchema } from "./auth.schema";

const registerMember = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const validatedData = member.parse(req.body);

        const authService = new AuthService(pool);

        const token = await authService.register(validatedData);

        res.status(201).json({ message: "Membre enregistré avec succès.", token });

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ 
                message: "Erreur de validation des données.", 
                errors: error.flatten().fieldErrors 
            });
        }

        next(error);
    }
};

const loginMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginData = loginSchema.parse(req.body);
        
        const authService = new AuthService(pool);
        const token = await authService.login(loginData.username, loginData.password,loginData.stayConnected);

        res.status(200).json({ message: "Connexion réussie.", token });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ 
                message: "Erreur de validation des données.", 
                errors: error.flatten().fieldErrors 
            });
        }

        
        next(error);
    }
};

const logoutMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const authService = new AuthService(pool);
        await authService.logout(token as string);

        res.status(200).json({ message: "Déconnexion réussie." });
    } catch (error: any) {
        next(error);
    }
}
    
export { registerMember, loginMember, logoutMember };