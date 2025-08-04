import { logger } from '@adapters';
import * as Config from '@config';
import { swaggerSpec } from '@docs/swagger';
import { endpointNotFound, errorHandler } from '@middlewares';
import appRoutes from '@routes';
import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';

export const app: Application = express();

export const startServer = async (): Promise<void> => {
  try {
    app.set('port', Config.PORT);

    app.use(helmet());
    app.use(compression());
    app.use(cors({ preflightContinue: true }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('dev'));

    app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    app.use('/', appRoutes);

    app.use(/\/.*/, endpointNotFound);
    app.use(errorHandler);

    if (Config.ENVIRONMENT !== 'test') {
      app.listen(app.get('port'));
      logger.info(`🛫 ${Config.NAME} running, listening on http://localhost:${Config.PORT}`);
    }
  } catch (error) {
    logger.fatal('Could not start server', error);
  }
};
