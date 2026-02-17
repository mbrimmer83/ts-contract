/**
 * Schema protocol for type-safe parsing
 */
export type SchemaProtocol<TOutput> = {
  parse(input: unknown): TOutput;
};

/**
 * Infer the output type from a schema
 */
export type InferSchema<T> = T extends { parse(input: unknown): infer Out }
  ? Out
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
