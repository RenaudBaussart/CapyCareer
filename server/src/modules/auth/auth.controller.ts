import { Request, Response } from "express";
import { z } from "zod";
import { member } from "../members/member.schema";
import { pool } from '../../config/database'; 
import { AuthService } from "./auth.service"; 
import { loginSchema } from "./auth.schema";

const registerMember = async (req: Request, res: Response) => { 
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

        if (error.message === "EMAIL_EXISTS" || error.message === "USERNAME_EXISTS") {
            return res.status(409).json({ message: "Un membre avec cet utilisateur existe déjà." });
        }

        
        console.error("Erreur lors de l'enregistrement du membre:", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

const loginMember = async (req: Request, res: Response) => {
    try {
        const loginData = loginSchema.parse(req.body);
        
        const authService = new AuthService(pool);
        const token = await authService.login(loginData.username, loginData.password);

        res.status(200).json({ message: "Connexion réussie.", token });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ 
                message: "Erreur de validation des données.", 
                errors: error.flatten().fieldErrors 
            });
        }

        
        if (error.message === "USER_NOT_FOUND" || error.message === "INVALID_PASSWORD") {
            return res.status(401).json({ message: "Identifiants incorrects." }); 
        }

        console.error("Erreur lors de la connexion du membre:", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

const logoutMember = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const authService = new AuthService(pool);
        await authService.logout(token as string);

        res.status(200).json({ message: "Déconnexion réussie." });
    } catch (error: any) {
        console.error("Erreur lors de la déconnexion du membre:", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
}
    
export { registerMember, loginMember, logoutMember };