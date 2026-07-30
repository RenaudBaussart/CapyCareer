import { Request, Response, NextFunction } from 'express';
import { pool } from '../../config/database';
import { RowDataPacket } from 'mysql2/promise';

/**
 * Middleware qui vérifie uniquement si le membre (identifié par req.member.id)
 * est présent dans la table Banned.
 */
export const checkBanned = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.member?.id; 
    if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    try {
    
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT email FROM User_ WHERE PK_id = ?",
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Membre non trouvé.' });
        }

        const userEmail = rows[0]!.email;

        const [isBanned] = await pool.execute<RowDataPacket[]>(
            "SELECT 1 FROM Banned WHERE email = ?",
            [userEmail]
        );

        if (isBanned.length > 0) {
            return res.status(403).json({ error: 'Ce compte a été banni.' });
        }

        next();
    } catch (error) {
        console.error("Erreur dans le middleware :", error);
        return res.status(500).json({ error: 'Erreur interne.' });
    }
};