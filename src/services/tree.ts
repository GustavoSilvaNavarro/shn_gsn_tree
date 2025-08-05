import { sequelize } from '@adapters/db';
import { Node } from '@adapters/db/models';
import { BadRequestError } from '@errors';
import type { NodePayload, SingleNode, TreeNodeResponse } from '@interfaces';

export const createNewNode = async (payload: NodePayload) => {
  const { label, parentId } = payload;

  if (parentId) {
    const parentNode = await Node.findByPk(parentId);
    if (!parentNode) throw new BadRequestError(`Parent node with ID ${parentId} not found.`);
  }

  const newNode = await Node.create({ label, parentId });
  return newNode;
};

export const queryNodes = async () => {
  // The Recursive CTE query
  const query = `
    WITH RECURSIVE "hierarchy" ("id", "label", "parent_id", "path") AS (
      SELECT
        "id",
        "label",
        "parent_id",
        ARRAY["id"] AS "path"
      FROM
        "nodes"
      WHERE
        "parent_id" IS NULL
      UNION ALL
      SELECT
        "n"."id",
        "n"."label",
        "n"."parent_id",
        "h"."path" || "n"."id"
      FROM
        "hierarchy" AS "h"
      JOIN "nodes" AS "n" ON "n"."parent_id" = "h"."id"
    )
    SELECT "id", "label", "parent_id" FROM "hierarchy" ORDER BY "path";
  `;

  const results = (await sequelize.query(query, { type: 'SELECT' })) as Array<SingleNode>;
  return results;
};

const buildNodeMap = (nodes: Array<SingleNode>) => {
  const map = new Map<number | string, Array<TreeNodeResponse>>();

  for (const node of nodes) {
    const parent = node.parent_id === null ? 'root' : node.parent_id;

    if (!map.has(parent)) map.set(parent, []);
    map.get(parent)?.push({ id: node.id, label: node.label, children: [] });
  }
  return map;
};

const buildTreeFromMap = (nodeList: Array<TreeNodeResponse>, map: Map<number | string, Array<TreeNodeResponse>>) => {
  for (const node of nodeList) {
    if (map.has(node.id)) {
      node.children = buildTreeFromMap(map.get(node.id) ?? [], map);
    }
  }
  return nodeList;
};

export const getAllTrees = async () => {
  const nodes = await queryNodes();

  const nodeMap = buildNodeMap(nodes);

  const rootNodes = nodeMap.get('root') ?? [];
  return buildTreeFromMap(rootNodes, nodeMap);
};
