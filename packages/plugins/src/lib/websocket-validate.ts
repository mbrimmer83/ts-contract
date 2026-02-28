import type {
  WebSocketDef,
  InferWebSocketPathParams,
  InferWebSocketQuery,
  InferWebSocketHeaders,
  InferClientMessage,
  InferServerMessage,
  StandardSchemaV1,
} from '@ts-contract/core';

/**
 * Validate a value against a Standard Schema, throwing on failure
 */
const validateSchema = <T>(
  schema: StandardSchemaV1<unknown, T>,
  value: unknown,
  label: string,
): T => {
  const result = schema['~standard'].validate(
    value,
  ) as StandardSchemaV1.Result<T>;
  if ('issues' in result && result.issues) {
    const messages = result.issues.map((i) => i.message).join(', ');
    throw new Error(`Validation failed for ${label}: ${messages}`);
  }
  return (result as { value: T }).value;
};

export const validateClientMessage = <
  W extends WebSocketDef,
  E extends keyof W['clientMessages'] & string,
>(
  def: W,
  eventName: E,
  data: unknown,
): InferClientMessage<W, E> => {
  const schema = def.clientMessages[eventName];
  if (!schema) {
    throw new Error(
      `WebSocket "${def.path}" has no client message schema for event "${eventName}"`,
    );
  }
  return validateSchema(
    schema,
    data,
    `client message "${eventName}" of ${def.path}`,
  ) as InferClientMessage<W, E>;
};

export const validateServerMessage = <
  W extends WebSocketDef,
  E extends keyof W['serverMessages'] & string,
>(
  def: W,
  eventName: E,
  data: unknown,
): InferServerMessage<W, E> => {
  const schema = def.serverMessages[eventName];
  if (!schema) {
    throw new Error(
      `WebSocket "${def.path}" has no server message schema for event "${eventName}"`,
    );
  }
  return validateSchema(
    schema,
    data,
    `server message "${eventName}" of ${def.path}`,
  ) as InferServerMessage<W, E>;
};

export const validateWebSocketPathParams = <W extends WebSocketDef>(
  def: W,
  params: unknown,
): InferWebSocketPathParams<W> => {
  if (!def.pathParams) {
    throw new Error(`WebSocket "${def.path}" has no pathParams schema`);
  }
  return validateSchema(
    def.pathParams,
    params,
    `pathParams of ${def.path}`,
  ) as InferWebSocketPathParams<W>;
};

export const validateWebSocketQuery = <W extends WebSocketDef>(
  def: W,
  query: unknown,
): InferWebSocketQuery<W> => {
  if (!def.query) {
    throw new Error(`WebSocket "${def.path}" has no query schema`);
  }
  return validateSchema(
    def.query,
    query,
    `query of ${def.path}`,
  ) as InferWebSocketQuery<W>;
};

export const validateWebSocketHeaders = <W extends WebSocketDef>(
  def: W,
  headers: Record<string, unknown>,
): InferWebSocketHeaders<W> => {
  if (!def.headers) {
    throw new Error(`WebSocket "${def.path}" has no headers schema`);
  }
  const result: Record<string, unknown> = {};
  for (const [key, schema] of Object.entries(def.headers)) {
    result[key] = validateSchema(
      schema,
      headers[key],
      `header "${key}" of ${def.path}`,
    );
  }
  return result as InferWebSocketHeaders<W>;
};
