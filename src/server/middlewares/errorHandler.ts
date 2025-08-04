import { InternalServerError } from '@errors';
import { CustomError } from '@server/errors/customError';
import { AxiosError } from 'axios';
import { NextFunction, Request, Response } from 'express';

export const errorHandler = (error: Error | CustomError, _req: Request, res: Response, _0: NextFunction): unknown => {
  if (!(error instanceof CustomError)) {
    const statusError = (error as AxiosError).response?.status;
    const message =
      (error as AxiosError<{ message: string }>).response?.data?.message ??
      (error as AxiosError<{ detail: string }>).response?.data?.detail ??
      error.message;
    error = new InternalServerError(message, statusError);
  }
  const cError = error as CustomError;
  return res.status(cError.statusCode).json({ errors: cError.serializeError() });
};
