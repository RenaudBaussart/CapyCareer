import jwtTool from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { pool } from '../../config/database';

declare global {
  namespace Express {
    interface Request {
      member?: any;
    }
  }
}
/**
 * Middleware pour vérifier l'authentification d'un membre.
 * Vérifie la présence et la validité du token JWT dans l'en-tête Authorization.
 * Si le token est valide, ajoute les informations du membre à la requête (req.member).
 * Si le token est invalide ou absent, renvoie une réponse 401 Unauthorized.
 */
export const middlewareAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
      const [blacklistedTokens]: any = await pool.execute(
          "SELECT 1 FROM BlacklistedTokens WHERE token = ?",
          [token]
      );

      if (blacklistedTokens.length > 0) {
          return res.status(401).json({ error: 'Token révoqué. Veuillez vous reconnecter.' });
      }

      jwtTool.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Invalid token' });
        }
        req.member = decoded;
        next();
      });

  } catch (error) {
      console.error("Erreur dans le middleware d'authentification :", error);
      return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};