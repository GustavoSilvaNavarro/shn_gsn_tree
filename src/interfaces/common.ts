import type { Request } from 'express';

export type Nullable<T> = T | null;

export interface ServiceParamRequest extends Request {
  params: { service_param: string };
}

export type AxiosOptions = {
  headers: {
    Authorization?: string;
    'x-api-source': string;
  };
  data?: any;
  timeout: number;
};

type Impersonator = {
  id?: string;
  username?: string;
};

export type Token = {
  sub: string;
  realm_access: { roles: Array<string> };
  impersonator?: Impersonator;
  name?: string;
  email?: string;
  clientId?: string;
};
