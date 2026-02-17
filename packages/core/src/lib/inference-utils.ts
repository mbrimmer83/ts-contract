import type { RouteDef } from './dsl';
import type { InferSchema, SchemaProtocol } from './schema-types';
import type { HttpStatusCodes } from './http-types';

type InferOrUndefined<T> =
  T extends SchemaProtocol<infer Out> ? Out : undefined;

/**
 * Infer path parameters from a route
 */
export type InferPathParams<R extends RouteDef> = InferOrUndefined<
  R['pathParams']
>;
/**
 * Infer query parameters from a route
 */
export type InferQuery<R extends RouteDef> = InferOrUndefined<R['query']>;
/**
 * Infer request body from a route
 */
export type InferBody<R extends RouteDef> = InferOrUndefined<R['body']>;
/**
 * Infer request headers from a route
 */
export type InferHeaders<R extends RouteDef> =
  R['headers'] extends Record<string, SchemaProtocol<unknown>>
    ? { [K in keyof R['headers']]: InferSchema<R['headers'][K]> }
    : undefined;

/**
 * Infer all response schemas as a mapped object keyed by status code
 */
export type InferResponseMap<R extends RouteDef> = {
  [K in keyof R['responses']]: InferSchema<R['responses'][K]>;
};

/**
 * Infer a specific response body from a route by status code
 */
export type InferResponseBody<R extends RouteDef, S extends HttpStatusCodes> =
  R['responses'][S] extends SchemaProtocol<infer Out> ? Out : never;

/**
 * Infer all responses as a discriminated union of { status, body }
 */
export type InferResponses<R extends RouteDef> = {
  [K in keyof R['responses'] &
    HttpStatusCodes]: R['responses'][K] extends SchemaProtocol<infer Out>
    ? { status: K; body: Out }
    : never;
}[keyof R['responses'] & HttpStatusCodes];

/**
 * Merge path, query, body, and header parameters into a single type
 */
export type MergeArgs<P, Q, B, H> = (P extends undefined
  ? object
  : { params: P }) &
  (Q extends undefined ? object : { query: Q }) &
  (B extends undefined ? object : { body: B }) &
  (H extends undefined ? object : { headers: H });

/**
 * Infer all arguments from a route
 */
export type InferArgs<R extends RouteDef> = MergeArgs<
  InferPathParams<R>,
  InferQuery<R>,
  InferBody<R>,
  InferHeaders<R>
>;
