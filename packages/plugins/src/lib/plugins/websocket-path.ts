import type {
  WebSocketDef,
  InferWebSocketPathParams,
  InferWebSocketQuery,
  WebSocketPlugin,
} from '@ts-contract/core';
import { buildWebSocketPath } from '../websocket-path';

type BuildPathArgs<W extends WebSocketDef> =
  InferWebSocketPathParams<W> extends undefined
    ? InferWebSocketQuery<W> extends undefined
      ? []
      : [params?: undefined, query?: InferWebSocketQuery<W>]
    : InferWebSocketQuery<W> extends undefined
      ? [params: InferWebSocketPathParams<W>]
      : [params: InferWebSocketPathParams<W>, query?: InferWebSocketQuery<W>];

declare module '@ts-contract/core' {
  interface WebSocketPluginTypeRegistry<W> {
    'websocket-path': {
      buildPath: W extends WebSocketDef
        ? (...args: BuildPathArgs<W>) => string
        : never;
    };
  }
}

export const websocketPathPlugin: WebSocketPlugin<'websocket-path'> = {
  name: 'websocket-path',
  websocket: (def) => ({
    buildPath: (...args: unknown[]) =>
      buildWebSocketPath(
        def,
        ...(args as [Record<string, string>, Record<string, unknown>]),
      ),
  }),
};
