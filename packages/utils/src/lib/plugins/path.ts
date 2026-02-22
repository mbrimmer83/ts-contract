import type { RouteDef, InferPathParams, InferQuery } from '@ts-contract/core';
import { buildPath } from '../path';
import type { ContractPlugin } from '../plugin-types';

type BuildPathArgs<R extends RouteDef> =
  InferPathParams<R> extends undefined
    ? InferQuery<R> extends undefined
      ? []
      : [params?: undefined, query?: InferQuery<R>]
    : InferQuery<R> extends undefined
      ? [params: InferPathParams<R>]
      : [params: InferPathParams<R>, query?: InferQuery<R>];

declare module '../plugin-types' {
  interface PluginTypeRegistry<R extends RouteDef> {
    path: {
      buildPath: (...args: BuildPathArgs<R>) => string;
    };
  }
}

export const pathPlugin: ContractPlugin<'path'> = {
  name: 'path',
  route: (route) => ({
    buildPath: (...args: unknown[]) =>
      buildPath(
        route,
        ...(args as [Record<string, string>, Record<string, unknown>]),
      ),
  }),
};
