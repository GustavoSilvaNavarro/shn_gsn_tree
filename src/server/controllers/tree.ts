import { createNewNode, getAllTrees } from '@services';
import type { Request, Response } from 'express';

export const retrieveTotalTree = async (_req: Request, res: Response) => {
  const threes = await getAllTrees();
  res.status(200).json(threes);
};

export const insertNewNode = async (req: Request, res: Response) => {
  const newNode = await createNewNode(req.body);
  res.status(201).json(newNode);
};
