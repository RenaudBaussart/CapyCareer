import jwtTool from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare global {
  // extend the Express Request interface to include a member property
  namespace Express {
    interface Request {
      member?: any;
    }
  }
}

export const middlewareAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
    jwtTool.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
        req.member = decoded; 
        next();
    });
};
/**
 * Middleware pour vérifier si l'utilisateur est un administrateur.
 * @param req - L'objet de requête Express.
 * @param res - L'objet de réponse Express.
 * @param next - La fonction de rappel pour passer au middleware suivant.
 * @returns {void} Ne retourne rien, mais appelle `next()` si l'utilisateur est un administrateur.
 * @throws {401 Unauthorized} Si aucun token n'est fourni ou si le token est invalide.
 * @throws {403 Forbidden} Si l'utilisateur n'est pas un administrateur.
 */
export const middlewareAuthAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
    jwtTool.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
        req.member = decoded; 
        if (req.member.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }
        next();
    });
}
