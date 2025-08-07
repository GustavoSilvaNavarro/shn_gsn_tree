import * as z from 'zod/v4';

export const newNodePayload = z.strictObject({
  label: z.string().trim().min(1, { message: 'Label can not be empty' }),
  parentId: z.nullish(z.int().positive()),
});

export type NodePayload = z.infer<typeof newNodePayload>;

export const payloadCloneNode = z.strictObject({
  nodeId: z.int().positive(),
  parentId: z.int().positive(),
});

export type CloneNodePayload = z.infer<typeof payloadCloneNode>;
