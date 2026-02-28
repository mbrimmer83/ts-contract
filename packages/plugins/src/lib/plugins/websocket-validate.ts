import type {
  WebSocketDef,
  InferWebSocketPathParams,
  InferWebSocketQuery,
  InferWebSocketHeaders,
  InferClientMessage,
  InferServerMessage,
  WebSocketPlugin,
} from '@ts-contract/core';
import {
  validateClientMessage,
  validateServerMessage,
  validateWebSocketPathParams,
  validateWebSocketQuery,
  validateWebSocketHeaders,
} from '../websocket-validate';

declare module '@ts-contract/core' {
  interface WebSocketPluginTypeRegistry<W> {
    'websocket-validate': {
      validateClientMessage: W extends WebSocketDef
        ? <E extends keyof W['clientMessages'] & string>(
            eventName: E,
            data: unknown,
          ) => InferClientMessage<W, E>
        : never;
      validateServerMessage: W extends WebSocketDef
        ? <E extends keyof W['serverMessages'] & string>(
            eventName: E,
            data: unknown,
          ) => InferServerMessage<W, E>
        : never;
      validatePathParams: W extends WebSocketDef
        ? (params: unknown) => InferWebSocketPathParams<W>
        : never;
      validateQuery: W extends WebSocketDef
        ? (query: unknown) => InferWebSocketQuery<W>
        : never;
      validateHeaders: W extends WebSocketDef
        ? (headers: Record<string, unknown>) => InferWebSocketHeaders<W>
        : never;
    };
  }
}

export const websocketValidatePlugin: WebSocketPlugin<'websocket-validate'> = {
  name: 'websocket-validate',
  websocket: (def) => ({
    validateClientMessage: (eventName: string, data: unknown) =>
      validateClientMessage(def, eventName, data),
    validateServerMessage: (eventName: string, data: unknown) =>
      validateServerMessage(def, eventName, data),
    validatePathParams: (params: unknown) =>
      validateWebSocketPathParams(def, params),
    validateQuery: (query: unknown) => validateWebSocketQuery(def, query),
    validateHeaders: (headers: Record<string, unknown>) =>
      validateWebSocketHeaders(def, headers),
  }),
};
