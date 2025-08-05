import type { Request, Response } from 'express';

export const monitoringController = (_req: Request, res: Response): void => {
  res.status(204).end();
};
