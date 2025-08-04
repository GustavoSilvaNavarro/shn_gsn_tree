type LOG_LEVELS = 'info' | 'trace' | 'debug' | 'warn' | 'error' | 'fatal';

type ENVIRONMENT = 'dev' | 'stg' | 'prd' | 'local' | 'test';

export const NAME = process.env.NAME ?? 'tree_server';
export const ENVIRONMENT: ENVIRONMENT = (process.env.ENVIRONMENT ?? process.env.NODE_ENV ?? 'dev') as ENVIRONMENT;

// ENTRY POINTS
export const PORT = process.env.PORT || 8080;
export const API_URL = process.env.API_URL || 'http://localhost:8080';

// Adapters
export const LOG_LEVEL: LOG_LEVELS = (process.env.LOG_LEVEL as LOG_LEVELS) || ENVIRONMENT === 'test' ? 'fatal' : 'info';
