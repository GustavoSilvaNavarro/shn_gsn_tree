import type { AuthzSitesObject } from '@interfaces';
import type { Redis } from 'ioredis';

declare global {
  namespace Express {
    type Context = {
      [key: string]: unknown;
    };

    type ValidationError = {
      value: string;
      msg: string;
      param: string;
      location: string;
    };

    interface ContextValidation {
      fields: string[];
      locations: string[];
      stack: unknown[];
      optional: boolean;
      message?: string;
      _errors: ValidationError[];
      dataMap: Map<string, unknown>;
    }
    interface Request {
      context: Context;
      sites?: Array<string> | Array<AuthzSitesObject>;
      'express-validator#contexts': ContextValidation[];
      redis: Redis;
    }
  }
}
