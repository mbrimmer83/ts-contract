import type { RouteDef, InferPathParams, InferQuery } from '@ts-contract/core';

type BuildPathArgs<R extends RouteDef> =
  InferPathParams<R> extends undefined
    ? InferQuery<R> extends undefined
      ? []
      : [params?: undefined, query?: InferQuery<R>]
    : InferQuery<R> extends undefined
      ? [params: InferPathParams<R>]
      : [params: InferPathParams<R>, query?: InferQuery<R>];

export const buildPath = <R extends RouteDef>(
  route: R,
  ...args: BuildPathArgs<R>
): string => {
  const [params, query] = args as [
    Record<string, string> | undefined,
    Record<string, unknown> | undefined,
  ];

  let path = route.path;

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
