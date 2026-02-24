import type {
  RouteDef,
  InferPathParams,
  InferQuery,
  InferBody,
  InferHeaders,
  InferResponseBody,
  HttpStatusCodes,
  StandardSchemaV1,
} from '@ts-contract/core';

/**
 * Validate a value against a Standard Schema, throwing on failure
 */
const validateSchema = <T>(
  schema: StandardSchemaV1<unknown, T>,
  value: unknown,
  label: string,
): T => {
  const result = schema['~standard'].validate(
    value,
  ) as StandardSchemaV1.Result<T>;
  if ('issues' in result && result.issues) {
    const messages = result.issues.map((i) => i.message).join(', ');
    throw new Error(`Validation failed for ${label}: ${messages}`);
  }
  return (result as { value: T }).value;
};

export const validatePathParams = <R extends RouteDef>(
  route: R,
  params: unknown,
): InferPathParams<R> => {
  if (!route.pathParams) {
    throw new Error(`Route "${route.path}" has no pathParams schema`);
  }
  return validateSchema(
    route.pathParams,
    params,
    `pathParams of ${route.path}`,
  ) as InferPathParams<R>;
};

export const validateQuery = <R extends RouteDef>(
  route: R,
  query: unknown,
): InferQuery<R> => {
  if (!route.query) {
    throw new Error(`Route "${route.path}" has no query schema`);
  }
  return validateSchema(
    route.query,
    query,
    `query of ${route.path}`,
  ) as InferQuery<R>;
};

export const validateBody = <R extends RouteDef>(
  route: R,
  body: unknown,
): InferBody<R> => {
  if (!route.body) {
    throw new Error(`Route "${route.path}" has no body schema`);
  }
  return validateSchema(
    route.body,
    body,
    `body of ${route.path}`,
  ) as InferBody<R>;
};

export const validateResponse = <
  R extends RouteDef,
  S extends keyof R['responses'] & HttpStatusCodes,
>(
  route: R,
  status: S,
  data: unknown,
): InferResponseBody<R, S> => {
  const schema = route.responses[status];
  if (!schema) {
    throw new Error(
      `Route "${route.path}" has no response schema for status ${String(status)}`,
    );
  }
  return validateSchema(
    schema,
    data,
    `response ${String(status)} of ${route.path}`,
  ) as InferResponseBody<R, S>;
};

export const validateHeaders = <R extends RouteDef>(
  route: R,
  headers: Record<string, unknown>,
): InferHeaders<R> => {
  if (!route.headers) {
    throw new Error(`Route "${route.path}" has no headers schema`);
  }
  const result: Record<string, unknown> = {};
  for (const [key, schema] of Object.entries(route.headers)) {
    result[key] = validateSchema(
      schema,
      headers[key],
      `header "${key}" of ${route.path}`,
    );
  }
  return result as InferHeaders<R>;
};
