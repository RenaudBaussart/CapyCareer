import { Request, Response, NextFunction } from 'express';
import { HttpError } from './HttpError';
import { logErrorToFile } from './ErrorsLogger';

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log l'erreur dans un fichier de log quotidien
  logErrorToFile(err.message, err);

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
