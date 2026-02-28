/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Method, HttpStatusCodes } from './http-types';
import type { SchemaProtocol } from './schema-types';
import type { WebSocketDef } from './websocket-types';

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
 * Contract definition - maps route names to route definitions, WebSocket definitions, or nested contracts
 */
export interface ContractDef {
  [key: string]: RouteDef | WebSocketDef | ContractDef;
}

/**
 * Type guard to check if a value is a RouteDef (has method and path)
 */
export const isRouteDef = (
  value: RouteDef | WebSocketDef | ContractDef,
): value is RouteDef => 'method' in value && 'path' in value;

/**
 * Type guard to check if a value is a WebSocketDef (has type === 'websocket')
 */
export const isWebSocketDef = (
  value: RouteDef | WebSocketDef | ContractDef,
): value is WebSocketDef => 'type' in value && value.type === 'websocket';

/**
 * Creates a new contract
 *
 * @returns {Contract}
 */
export const createContract = <C extends ContractDef>(contract: C): C =>
  contract;
