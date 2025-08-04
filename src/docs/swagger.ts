import * as Config from '@config';
import swaggerJsDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tree Server',
      version: '1.0.0',
      description: 'Service backend in NodeJs.',
    },
    servers: [{ url: Config.API_URL, description: 'Base' }],
  },
};

const options: swaggerJsDoc.Options = {
  ...swaggerDefinition,
  failOnErrors: true,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/docs/**/*.yml'],
};

export const swaggerSpec = swaggerJsDoc(options);
