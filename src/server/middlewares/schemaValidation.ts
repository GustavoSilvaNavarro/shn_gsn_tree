import { logger } from '@adapters';
import type { NextFunction, Request, Response } from 'express';
import * as z from 'zod/v4';

export const validateBody = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        logger.error('Error validating schema', err);
        res.status(400).json({
          error: 'Validation failed',
          details: err.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
        return;
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
};
