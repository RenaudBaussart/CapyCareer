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

  let decoded: any;

  try {
    decoded = jwtTool.verify(token, process.env.JWT_SECRET as string) as any;
  } catch (jwtError) {
    // token invalide, expiré ou malformé -> 401, pas 500
    return res.status(401).json({ error: 'Token invalide ou expiré. Veuillez vous reconnecter.' });
  }

  req.member = decoded;

  try {
    const [blacklistedTokens]: any = await pool.execute(
        "SELECT 1 FROM Blacklist WHERE token = ?",
        [token]
    );

    if (blacklistedTokens.length > 0) {
        return res.status(401).json({ error: 'Token révoqué. Veuillez vous reconnecter.' });
    }

    // vérifie que le compte existe toujours (détecte les comptes supprimés)
    const [users]: any = await pool.execute(
        "SELECT email FROM User_ WHERE PK_id = ?",
        [decoded.id]
    );

    if (users.length === 0) {
        return res.status(401).json({ error: 'Ce compte n\'existe plus. Veuillez vous reconnecter.' });
    }

    const memberEmail = users[0].email;

    const [banned]: any = await pool.execute(
        "SELECT 1 FROM Banned WHERE email = ?",
        [memberEmail]
    );

    if (banned.length > 0) {
        return res.status(401).json({ error: 'Ce compte a été banni.' });
    }

    next();

  } catch (error) {
      // ici uniquement les vraies erreurs serveur (DB down, etc.)
      console.error("Erreur dans le middleware d'authentification :", error);
      return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};