/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Method, HttpStatusCodes } from './http-types';
import type { SchemaProtocol } from './schema-types';

/**
 * Route definition
 */
export type RouteDef = {
  method: Method;
  path: string;
  pathParams?: SchemaProtocol<any>;
  query?: SchemaProtocol<any>;
  headers?: Record<string, SchemaProtocol<any>>;
  body?: SchemaProtocol<any>;
  responses: Partial<Record<HttpStatusCodes, SchemaProtocol<any>>>;
  summary?: string;
  metadata?: Record<string, string | number | boolean>;
};

/**
 * Contract definition - maps route names to route definitions
 */
export type ContractDef = Record<string, RouteDef>;

/**
 * Creates a new contract
 *
 * @returns {Contract}
 */
export const createContract = <C extends ContractDef>(contract: C): C =>
  contract;
