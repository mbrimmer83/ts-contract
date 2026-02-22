import type {
  RouteDef,
  InferPathParams,
  InferQuery,
  InferBody,
  InferHeaders,
  InferResponseBody,
  HttpStatusCodes,
} from '@ts-contract/core';
import {
  validatePathParams,
  validateQuery,
  validateBody,
  validateResponse,
  validateHeaders,
} from '../validate';
import type { ContractPlugin } from '../plugin-types';

declare module '../plugin-types' {
  interface PluginTypeRegistry<R extends RouteDef> {
    validate: {
      validatePathParams: (params: unknown) => InferPathParams<R>;
      validateQuery: (query: unknown) => InferQuery<R>;
      validateBody: (body: unknown) => InferBody<R>;
      validateResponse: <S extends keyof R['responses'] & HttpStatusCodes>(
        status: S,
        data: unknown,
      ) => InferResponseBody<R, S>;
      validateHeaders: (headers: Record<string, unknown>) => InferHeaders<R>;
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
