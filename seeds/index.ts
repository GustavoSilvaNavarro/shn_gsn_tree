import '@dotenvx/dotenvx/config';

const seedData = [
  { id: 1, label: 'root' },
  { id: 2, label: 'bear', parentId: 1 },
  { id: 3, label: 'cat', parentId: 2 },
  { id: 4, label: 'frog', parentId: 1 },
  { id: 5, label: 'root2' },
  { id: 6, label: 'John', parentId: 5 },
];

import { connectDb } from '../src/adapters/db';
import { Node } from '../src/adapters/db/models';

export const seedNodeTable = async () => {
  const sequelize = await connectDb();

  await Node.bulkCreate(seedData);

  await sequelize.close();
};
