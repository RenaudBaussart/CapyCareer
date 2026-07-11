import { Request, Response } from "express";
import { z } from "zod";
import { member } from "../members/member.schema";
import { pool } from '../../config/database'; 
import { AuthService } from "./auth.service"; 

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

        if (error.message === "EMAIL_EXISTS") {
            return res.status(409).json({ message: "Un membre avec cet email existe déjà." });
        }

        
        console.error("Erreur lors de l'enregistrement du membre:", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

export { registerMember };