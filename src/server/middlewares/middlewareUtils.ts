import { NotFoundError } from '@errors';
import type { NextFunction, Request, Response } from 'express';

export const endpointNotFound = (req: Request, res: Response, _next: NextFunction) => {
  const routeNotFound = new NotFoundError(`Route ${req.originalUrl}, called using ${req.method} method was not found`);
  return res.status(routeNotFound.statusCode).json({ errors: routeNotFound.serializeError() });
};
