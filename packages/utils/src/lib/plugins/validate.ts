import type {
  RouteDef,
  InferPathParams,
  InferQuery,
  InferBody,
  InferHeaders,
  InferResponseBody,
  HttpStatusCodes,
  ContractPlugin,
} from '@ts-contract/core';
import {
  validatePathParams,
  validateQuery,
  validateBody,
  validateResponse,
  validateHeaders,
} from '../validate';

declare module '@ts-contract/core' {
  interface PluginTypeRegistry<R> {
    validate: {
      validatePathParams: R extends RouteDef
        ? (params: unknown) => InferPathParams<R>
        : never;
      validateQuery: R extends RouteDef
        ? (query: unknown) => InferQuery<R>
        : never;
      validateBody: R extends RouteDef
        ? (body: unknown) => InferBody<R>
        : never;
      validateResponse: R extends RouteDef
        ? <S extends keyof R['responses'] & HttpStatusCodes>(
            status: S,
            data: unknown,
          ) => InferResponseBody<R, S>
        : never;
      validateHeaders: R extends RouteDef
        ? (headers: Record<string, unknown>) => InferHeaders<R>
        : never;
    };
  }
}

export const validatePlugin: ContractPlugin<'validate'> = {
  name: 'validate',
  route: (route) => ({
    validatePathParams: (params: unknown) => validatePathParams(route, params),
    validateQuery: (query: unknown) => validateQuery(route, query),
    validateBody: (body: unknown) => validateBody(route, body),
    validateResponse: (status: number, data: unknown) =>
      validateResponse(route, status as HttpStatusCodes, data),
    validateHeaders: (headers: Record<string, unknown>) =>
      validateHeaders(route, headers),
  }),
};
