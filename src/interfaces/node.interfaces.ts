import { Nullable } from './common';

export type Node = { id: number; label: string; parent_id: Nullable<number> };

export type TreeNodeResponse = {
  id: number;
  label: string;
  children: TreeNodeResponse[];
};
