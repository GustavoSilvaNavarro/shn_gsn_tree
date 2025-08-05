import { createNewNode } from '@services';
import type { Request, Response } from 'express';

export const retrieveTotalTree = (_req: Request, res: Response) => {
  res.status(200).json({ msg: 'Hello World' });
};

export const insertNewNode = async (req: Request, res: Response) => {
  const newNode = await createNewNode(req.body);
  res.status(201).json(newNode);
};
