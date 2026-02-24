import type {
  RouteDef,
  InferPathParams,
  InferQuery,
  ContractPlugin,
} from '@ts-contract/core';
import { buildPath } from '../path';

type BuildPathArgs<R extends RouteDef> =
  InferPathParams<R> extends undefined
    ? InferQuery<R> extends undefined
      ? []
      : [params?: undefined, query?: InferQuery<R>]
    : InferQuery<R> extends undefined
      ? [params: InferPathParams<R>]
      : [params: InferPathParams<R>, query?: InferQuery<R>];

declare module '@ts-contract/core' {
  interface PluginTypeRegistry<R> {
    path: {
      buildPath: R extends RouteDef
        ? (...args: BuildPathArgs<R>) => string
        : never;
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
