import '@dotenvx/dotenvx/config';

import { logger } from '@adapters';
import * as Config from '@config';

import { startServer } from './server';

// Handle process errors
process.on('uncaughtException', (error) => {
  logger.error('uncaughtException', error);
  throw error;
});
process.on('unhandledRejection', (err) => logger.error('unhandledRejection', err));

// Bootstrap service
(async () => {
  await startServer();
  logger.info(`${Config.NAME} started and running`);
})();
