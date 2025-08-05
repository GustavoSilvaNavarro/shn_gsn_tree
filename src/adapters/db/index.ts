import { logger } from '@adapters';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '@config';
import { Sequelize } from 'sequelize-typescript';

import { Node } from './models';

export let sequelize: Sequelize;

export const connectDb = async () => {
  sequelize = new Sequelize({
    host: DB_HOST,
    dialect: 'postgres',
    username: DB_USER,
    port: DB_PORT,
    password: DB_PASSWORD,
    database: DB_NAME,
    models: [Node],
    define: {
      underscored: true,
      timestamps: true,
      freezeTableName: true,
    },
    logging: logger.debug.bind(logger),
  });

  try {
    await sequelize.authenticate();
    logger.info('📻 Sequelize | Connection to db has been established successfully.');
  } catch (err) {
    logger.error('Sequelize - Unable to connect to the database => ', err);
  }

  return sequelize;
};
