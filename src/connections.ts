import { logger } from '@adapters';
import { connectDb } from '@adapters/db';
import { Sequelize } from 'sequelize-typescript';

type Connections = {
  db: Sequelize;
};

export const createConnections = async (): Promise<Connections> => {
  const connections = {} as Connections;

  connections.db = await connectDb();

  return connections;
};

export const closeConnections = async (connections: Connections) => {
  const { db } = connections;

  logger.info('😓 Closing connections...');
  await db.close();
};
