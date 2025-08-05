import '@dotenvx/dotenvx/config';

import { logger } from '@adapters';
import * as Config from '@config';
import { onExit } from 'signal-exit';

import { closeConnections, createConnections } from './connections';
import { startServer } from './server';

// Handle process errors
process.on('uncaughtException', (error) => {
  logger.error('uncaughtException', error);
  throw error;
});
process.on('unhandledRejection', (err) => logger.error('unhandledRejection', err));

// Bootstrap service
(async () => {
  const connections = await createConnections();
  await startServer();
  logger.info(`${Config.NAME} started and running`);

  onExit(() => {
    logger.info(`${Config.NAME} | Service is shutting down, closing connections...`);
    closeConnections(connections).then(() => process.exit(1));
  });
})();
