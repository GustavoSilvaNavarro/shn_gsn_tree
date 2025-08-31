// NOTE: Configuration file to run migration using sequelize-cli
const ENVIRONMENT = process.env.ENVIRONMENT ?? process.env.NODE_ENV ?? 'local';

const localConfig = {
  username: 'postgres',
  password: 'password',
  database: 'tree_db',
  host: '127.0.0.1',
  port: 5433,
  dialect: 'postgres',
};

const prodConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  dialect: 'postgres',
};

let config;

if (!['prd', 'stg', 'dev'].includes(ENVIRONMENT)) config = localConfig;
else config = prodConfig;

export default config;
