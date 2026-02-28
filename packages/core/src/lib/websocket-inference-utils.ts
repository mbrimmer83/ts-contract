import type { WebSocketDef } from './websocket-types';
import type { InferSchema, StandardSchemaV1 } from './schema-types';

type InferOrUndefined<T> =
  T extends StandardSchemaV1<unknown, infer Out> ? Out : undefined;

/**
 * Infer path parameters from a WebSocket definition
 */
export type InferWebSocketPathParams<W extends WebSocketDef> = InferOrUndefined<
  W['pathParams']
>;

/**
 * Infer query parameters from a WebSocket definition
 */
export type InferWebSocketQuery<W extends WebSocketDef> = InferOrUndefined<
  W['query']
>;

/**
 * Infer request headers from a WebSocket definition
 */
export type InferWebSocketHeaders<W extends WebSocketDef> =
  W['headers'] extends Record<string, StandardSchemaV1>
    ? { [K in keyof W['headers']]: InferSchema<W['headers'][K]> }
    : undefined;

/**
 * Infer all client message schemas as a mapped object keyed by event name
 */
export type InferClientMessages<W extends WebSocketDef> = {
  [K in keyof W['clientMessages']]: InferSchema<W['clientMessages'][K]>;
};

/**
 * Infer all server message schemas as a mapped object keyed by event name
 */
export type InferServerMessages<W extends WebSocketDef> = {
  [K in keyof W['serverMessages']]: InferSchema<W['serverMessages'][K]>;
};

/**
 * Infer a specific client message type by event name
 */
export type InferClientMessage<
  W extends WebSocketDef,
  EventName extends keyof W['clientMessages'],
> = W['clientMessages'][EventName] extends StandardSchemaV1<unknown, infer Out>
  ? Out
  : never;

/**
 * Infer a specific server message type by event name
 */
export type InferServerMessage<
  W extends WebSocketDef,
  EventName extends keyof W['serverMessages'],
> = W['serverMessages'][EventName] extends StandardSchemaV1<unknown, infer Out>
  ? Out
  : never;
