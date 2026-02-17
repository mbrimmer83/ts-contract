/**
 * Standard Schema v1 result types
 */
export interface StandardSchemaV1Issue {
  readonly message: string;
  readonly path?: ReadonlyArray<PropertyKey | { readonly key: PropertyKey }>;
}

export type StandardSchemaV1Result<Output> =
  | { readonly value: Output; readonly issues?: undefined }
  | { readonly issues: ReadonlyArray<StandardSchemaV1Issue> };

/**
 * Standard Schema v1 protocol — implemented by Zod v4, Valibot v1, ArkType, etc.
 */
export interface StandardSchemaV1<Input = unknown, Output = Input> {
  readonly '~standard': {
    readonly version: 1;
    readonly vendor: string;
    readonly validate: (
      value: unknown,
    ) =>
      | StandardSchemaV1Result<Output>
      | Promise<StandardSchemaV1Result<Output>>;
    readonly types?: { readonly input: Input; readonly output: Output };
  };
}

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
export type InferSchema<T> =
  T extends StandardSchemaV1<unknown, infer Out> ? Out : never;

/**
 * Extract path parameters from a path string
 */
export type ExtractPathParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractPathParams<`/${Rest}`>
    : T extends `${string}:${infer Param}`
      ? Param
      : never;
