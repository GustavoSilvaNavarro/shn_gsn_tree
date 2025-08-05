import { Node } from '@adapters/db/models';
import { BadRequestError } from '@errors';
import { NewNodePayload } from '@interfaces';

export const createNewNode = async (payload: NewNodePayload) => {
  const { label, parentId } = payload;

  if (parentId) {
    const parentNode = await Node.findByPk(parentId);
    if (!parentNode) throw new BadRequestError(`Parent node with ID ${parentId} not found.`);
  }

  const newNode = await Node.create({ label, parentId });
  return newNode;
};
