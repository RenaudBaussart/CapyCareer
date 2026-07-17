import jwtTool from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { pool } from '../../config/database';


/**
 * Middleware pour vérifier l'authentification d'un administrateur.
 * Vérifie la présence et la validité du token JWT dans l'en-tête Authorization.
 * Si le token est valide et que le rôle du membre est "admin", ajoute les informations du membre à la requête (req.member).
 * Si le token est invalide, absent ou si le rôle n'est pas "admin", renvoie une réponse 401 Unauthorized ou 403 Forbidden.
 * @param req - L'objet de requête Express.
 * @param res - L'objet de réponse Express.
 * @param next - La fonction de rappel pour passer au middleware suivant.
 * @returns {void} Ne retourne rien, mais appelle `next()` si l'utilisateur est un administrateur authentifié.
 * @throws {401 Unauthorized} Si aucun token n'est fourni ou si le token est invalide.
 * @throws {403 Forbidden} Si l'utilisateur n'est pas un administrateur.
 * @throws {500 Internal Server Error} Si une erreur inattendue survient lors de la vérification du token.
 */
export const middlewareAuthAdmin = async (req: Request, res: Response, next: NextFunction) => {
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
        if (req.member.role !== 'admin') {
          return res.status(403).json({ error: 'Access refusé, vous devez être un administrateur.' });
        }
        next();
      });

  } catch (error) {
      console.error("Erreur dans le middleware d'authentification :", error);
      return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
