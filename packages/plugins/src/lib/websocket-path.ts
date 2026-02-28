import type {
  WebSocketDef,
  InferWebSocketPathParams,
  InferWebSocketQuery,
} from '@ts-contract/core';

type BuildWebSocketPathArgs<W extends WebSocketDef> =
  InferWebSocketPathParams<W> extends undefined
    ? InferWebSocketQuery<W> extends undefined
      ? []
      : [params?: undefined, query?: InferWebSocketQuery<W>]
    : InferWebSocketQuery<W> extends undefined
      ? [params: InferWebSocketPathParams<W>]
      : [params: InferWebSocketPathParams<W>, query?: InferWebSocketQuery<W>];

export const buildWebSocketPath = <W extends WebSocketDef>(
  def: W,
  ...args: BuildWebSocketPathArgs<W>
): string => {
  const [params, query] = args as [
    Record<string, string> | undefined,
    Record<string, unknown> | undefined,
  ];

  let path = def.path;

  if (params) {
    path = path.replace(/:([^/]+)/g, (_, key) => {
      if (!(key in params)) {
        throw new Error(`Missing path parameter: ${key}`);
      }
      return encodeURIComponent(params[key]);
    });
  }

  if (query) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) {
      path += `?${qs}`;
    }
  }

  return path;
};
