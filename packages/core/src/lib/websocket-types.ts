/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SchemaProtocol } from './schema-types';

/**
 * WebSocket definition
 *
 * Note: Message schemas should include a type discriminator field that matches
 * the event name (e.g., for event 'new_msg', schema should have type: z.literal('new_msg')).
 * This is enforced at runtime by the validation plugin.
 */
export type WebSocketDef = {
  type: 'websocket';
  path: string;
  pathParams?: SchemaProtocol<any>;
  query?: SchemaProtocol<any>;
  headers?: Record<string, SchemaProtocol<any>>;
  clientMessages: Record<string, SchemaProtocol<any>>;
  serverMessages: Record<string, SchemaProtocol<any>>;
  summary?: string;
  metadata?: Record<string, string | number | boolean>;
};
