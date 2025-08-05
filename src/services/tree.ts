import { sequelize } from '@adapters/db';
import { Node } from '@adapters/db/models';
import { BadRequestError } from '@errors';
import type { NodePayload } from '@interfaces';

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
  // It traverses the tree in the database and returns a flat result set
  // that is ordered hierarchically by the generated 'path'.
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

  // Step 1: Execute the raw query using Sequelize
  // The 'type: QueryTypes.SELECT' is crucial to get a clean array of objects
  const results = await sequelize.query(query, { type: 'SELECT' });
  return results;
};
