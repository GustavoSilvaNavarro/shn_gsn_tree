import { sequelize } from '@adapters/db';
import { Node } from '@adapters/db/models';
import { BadRequestError } from '@errors';
import type { CloneNodePayload, NodePayload, Nullable, SingleNode, TreeNodeResponse } from '@interfaces';

const ROOT_KEY = 'root';

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

export const buildNodeMap = (nodes: Array<SingleNode>) => {
  const map = new Map<number | string, Array<TreeNodeResponse>>();

  for (const node of nodes) {
    const parent = node.parent_id === null ? ROOT_KEY : node.parent_id;

    if (!map.has(parent)) map.set(parent, []);
    map.get(parent)?.push({ id: node.id, label: node.label, children: [] });
  }
  return map;
};

export const buildTreeFromMap = (
  nodeList: Array<TreeNodeResponse>,
  map: Map<number | string, Array<TreeNodeResponse>>,
) => {
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
  const rootNodes = nodeMap.get(ROOT_KEY) ?? [];
  return buildTreeFromMap(rootNodes, nodeMap);
};

export const querySpecificNode = async (nodeId: number) => {
  // The Recursive CTE query
  const query = `
    WITH RECURSIVE
      subtree AS (
        -- Anchor member: Select the initial node
        SELECT
          id,
          label,
          parent_id
        FROM
          nodes
        WHERE
          id = :node_id
        UNION ALL
        -- Recursive member: Join with the subtree to find children
        SELECT
          t.id,
          t.label,
          t.parent_id
        FROM
          nodes AS t
          JOIN subtree AS s ON s.id = t.parent_id
      )
    SELECT
      *
    FROM
      subtree;
  `;

  const results = (await sequelize.query(query, {
    type: 'SELECT',
    replacements: { node_id: nodeId },
  })) as Array<SingleNode>;
  return results;
};

export const cloneTreeIntoSubTree = async (payload: CloneNodePayload) => {
  const { nodeId, parentId } = payload;
  if (nodeId === parentId) throw new BadRequestError('Node ID and Parent ID can not be the same');

  const subtree = await querySpecificNode(nodeId);
  if (!subtree.length) throw new BadRequestError('Node ID was not found');

  const newNodes: Array<{ label: string; parentId: Nullable<number> }> = [];
  const idMapping: Record<string, number> = {};
  const nodesToUpdate: Array<{ id: number; label: string; parentId: number | null }> = [];

  for (const node of subtree) {
    const newNode = { label: `${node.label} - CLONED`, parentId: null };
    newNodes.push(newNode);
  }

  const createdNodes = await Node.bulkCreate(newNodes);

  for (let i = 0; i < subtree.length; i++) {
    idMapping[subtree[i].id] = createdNodes[i].id;
  }

  // Update the parent IDs of the cloned nodes
  for (let i = 0; i < subtree.length; i++) {
    const originalNode = subtree[i];
    const newId = createdNodes[i].id;

    let newParentId: number | null;

    // top level of the tree it might undefined but it will become a child node
    if (originalNode.id === nodeId) newParentId = parentId;
    else {
      const childParentId = originalNode.parent_id as number;
      newParentId = idMapping[childParentId];
    }

    nodesToUpdate.push({ id: newId, label: createdNodes[i].label, parentId: newParentId });
  }

  // basically I am updating all the created nodes to add parent id
  return await Node.bulkCreate(nodesToUpdate, { updateOnDuplicate: ['parentId'] });
};
