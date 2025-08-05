import * as z from 'zod/v4';

export const newNodePayload = z.strictObject({
  label: z.string().trim().min(1, { message: 'Message can not be empty' }),
  parentId: z.nullish(z.int().positive()),
});

export type NodePayload = z.infer<typeof newNodePayload>;
