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
      // add member role to the request object for later use
        req.member = decoded; // Attach decoded token to request object
        next();
    });
};
