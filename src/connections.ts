import { logger } from '@adapters';
import { connectDb } from '@adapters/db';
import { Sequelize } from 'sequelize-typescript';

import { seedNodeTable } from './seeds';

type Connections = {
  db: Sequelize;
};

export const createConnections = async (needSeeding = false): Promise<Connections> => {
  const connections = {} as Connections;

  connections.db = await connectDb();

  if (needSeeding) {
    logger.info('🌱 Starting database seeding...');
    await seedNodeTable();
  }
  return connections;
};

export const closeConnections = async (connections: Connections) => {
  const { db } = connections;

  logger.info('😓 Closing connections...');
  await db.close();
};
