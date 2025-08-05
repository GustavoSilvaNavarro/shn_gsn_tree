import type { Request, Response } from 'express';

export const retrieveTotalTree = (_req: Request, res: Response) => {
  res.status(200).json({ msg: 'Hello World' });
};

export const insertNewNode = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(201).json({ msg: 'Good stuff inserted' });
};
