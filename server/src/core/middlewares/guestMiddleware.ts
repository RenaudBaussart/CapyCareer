import jwtTool from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { pool } from '../../config/database'; 
import { ForbiddenError } from '../../core/errors/HttpError';
/**
 * Middleware pour vérifier si un utilisateur est un invité (non authentifié).
 * Vérifie la présence et la validité du token JWT dans l'en-tête Authorization.
 * Si le token est absent ou invalide, l'utilisateur est considéré comme un invité et la requête continue.
 * Si le token est valide, renvoie une réponse 403 Forbidden.
 * @param req - La requête Express.
 * @param res - La réponse Express.
 * @param next - La fonction next pour passer au middleware suivant.
 * @returns Si l'utilisateur est un invité, la requête continue. Sinon, une réponse 403 est renvoyée.
 */
export const middlewareGuest = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return next();
    }

    try {
      
        jwtTool.verify(token, process.env.JWT_SECRET as string);

        const [blacklistedTokens]: any = await pool.execute(
            "SELECT 1 FROM BlacklistedTokens WHERE token = ?",
            [token]
        );

        if (blacklistedTokens.length > 0) {
            return next();
        }

        throw new ForbiddenError("Vous êtes déjà connecté.");

    } catch (error) {
        if (error instanceof ForbiddenError) {
            return next(error);
        }
        
        next();
    }
};