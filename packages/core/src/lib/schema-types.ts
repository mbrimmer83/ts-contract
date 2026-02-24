import type { StandardSchemaV1 } from '@standard-schema/spec';

export type { StandardSchemaV1 } from '@standard-schema/spec';

/**
 * Schema protocol — alias for StandardSchemaV1
 */
export type SchemaProtocol<TOutput = unknown> = StandardSchemaV1<
  unknown,
  TOutput
>;

/**
 * Infer the output type from a Standard Schema
 */
export type InferSchema<T> = T extends StandardSchemaV1
  ? StandardSchemaV1.InferOutput<T>
  : never;

/**
 * Extract path parameters from a path string
 */
export type ExtractPathParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractPathParams<`/${Rest}`>
    : T extends `${string}:${infer Param}`
      ? Param
      : never;
