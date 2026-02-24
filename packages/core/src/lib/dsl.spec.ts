import { expectTypeOf } from 'vitest';
import { z } from 'zod';
import { createContract, isRouteDef } from './dsl';
import type { RouteDef } from './dsl';
import type {
  InferPathParams,
  InferQuery,
  InferBody,
  InferHeaders,
  InferResponseMap,
  InferResponses,
  InferResponseBody,
  InferArgs,
} from './inference-utils';
import type { ExtractPathParams } from './schema-types';

const contract = createContract({
  getContract: {
    method: 'GET',
    path: '/contract/:id',
    pathParams: z.object({ id: z.string() }),
    query: z.object({ include: z.string().optional() }),
    responses: {
      200: z.object({ name: z.string(), type: z.string() }),
      404: z.object({ message: z.string() }),
    },
    summary: 'Get a contract by id',
  },
  createContract: {
    method: 'POST',
    path: '/contract',
    body: z.object({ name: z.string(), type: z.string() }),
    headers: {
      authorization: z.string(),
    },
    responses: {
      201: z.object({ id: z.string(), name: z.string() }),
    },
    summary: 'Create a contract',
  },
  listContract: {
    method: 'GET',
    path: '/contract',
    responses: {
      200: z.array(z.object({ name: z.string() })),
    },
  },
});

describe('createContract', () => {
  it('should preserve route definitions', () => {
    expectTypeOf(contract.getContract).toExtend<RouteDef>();
    expectTypeOf(contract.createContract).toExtend<RouteDef>();
    expectTypeOf(contract.listContract).toExtend<RouteDef>();
  });

  it('should preserve literal method types', () => {
    expectTypeOf(contract.getContract.method).toEqualTypeOf<'GET'>();
    expectTypeOf(contract.createContract.method).toEqualTypeOf<'POST'>();
  });

  it('should preserve literal path types', () => {
    expectTypeOf(contract.getContract.path).toExtend<string>();
    expectTypeOf(contract.createContract.path).toExtend<string>();
  });
});

describe('ExtractPathParams', () => {
  it('should extract single path param', () => {
    expectTypeOf<ExtractPathParams<'/contract/:id'>>().toEqualTypeOf<'id'>();
  });

  it('should extract multiple path params', () => {
    expectTypeOf<
      ExtractPathParams<'/contract/:id/moves/:moveId'>
    >().toEqualTypeOf<'id' | 'moveId'>();
  });

  it('should return never for paths with no params', () => {
    expectTypeOf<ExtractPathParams<'/pokemon'>>().toEqualTypeOf<never>();
  });
});

describe('InferPathParams', () => {
  it('should infer path params from schema', () => {
    type Result = InferPathParams<typeof contract.getContract>;
    expectTypeOf<Result>().toEqualTypeOf<{ id: string }>();
  });

  it('should return undefined when no pathParams defined', () => {
    type Result = InferPathParams<typeof contract.listContract>;
    expectTypeOf<Result>().toEqualTypeOf<undefined>();
  });
});

describe('InferQuery', () => {
  it('should infer query params from schema', () => {
    type Result = InferQuery<typeof contract.getContract>;
    expectTypeOf<Result>().toEqualTypeOf<{ include?: string }>();
  });

  it('should return undefined when no query defined', () => {
    type Result = InferQuery<typeof contract.createContract>;
    expectTypeOf<Result>().toEqualTypeOf<undefined>();
  });
});

describe('InferBody', () => {
  it('should infer body from schema', () => {
    type Result = InferBody<typeof contract.createContract>;
    expectTypeOf<Result>().toEqualTypeOf<{ name: string; type: string }>();
  });

  it('should return undefined when no body defined', () => {
    type Result = InferBody<typeof contract.getContract>;
    expectTypeOf<Result>().toEqualTypeOf<undefined>();
  });
});

describe('InferHeaders', () => {
  it('should infer headers from schema', () => {
    type Result = InferHeaders<typeof contract.createContract>;
    expectTypeOf<Result>().toEqualTypeOf<{ authorization: string }>();
  });

  it('should return undefined when no headers defined', () => {
    type Result = InferHeaders<typeof contract.getContract>;
    expectTypeOf<Result>().toEqualTypeOf<undefined>();
  });
});

describe('InferResponseBody', () => {
  it('should infer response body for a specific status code', () => {
    type Result = InferResponseBody<typeof contract.getContract, 200>;
    expectTypeOf<Result>().toEqualTypeOf<{ name: string; type: string }>();
  });

  it('should infer error response body', () => {
    type Result = InferResponseBody<typeof contract.getContract, 404>;
    expectTypeOf<Result>().toEqualTypeOf<{ message: string }>();
  });

  it('should return never for undefined status codes', () => {
    type Result = InferResponseBody<typeof contract.getContract, 500>;
    expectTypeOf<Result>().toEqualTypeOf<never>();
  });
});

describe('InferResponseMap', () => {
  it('should produce a mapped object keyed by status code', () => {
    type Result = InferResponseMap<typeof contract.getContract>;
    expectTypeOf<Result>().toExtend<{
      200: { name: string; type: string };
      404: { message: string };
    }>();
  });
});

describe('InferResponses', () => {
  it('should produce a discriminated union of { status, body }', () => {
    type Result = InferResponses<typeof contract.getContract>;
    expectTypeOf<Result>().toEqualTypeOf<
      | { status: 200; body: { name: string; type: string } }
      | { status: 404; body: { message: string } }
    >();
  });
});

describe('InferArgs', () => {
  it('should merge params, query, and body into a single args type', () => {
    type Result = InferArgs<typeof contract.getContract>;
    expectTypeOf<Result>().toExtend<{
      params: { id: string };
      query: { include?: string };
    }>();
  });

  it('should include body and headers when defined', () => {
    type Result = InferArgs<typeof contract.createContract>;
    expectTypeOf<Result>().toExtend<{
      body: { name: string; type: string };
      headers: { authorization: string };
    }>();
  });

  it('should produce empty object when no args defined', () => {
    type Result = InferArgs<typeof contract.listContract>;
    expectTypeOf<Result>().toExtend<object>();
  });
});

const nestedContract = createContract({
  contract: {
    getById: {
      method: 'GET',
      path: '/contract/:id',
      pathParams: z.object({ id: z.string() }),
      responses: {
        200: z.object({ name: z.string(), type: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
    list: {
      method: 'GET',
      path: '/contract',
      responses: {
        200: z.array(z.object({ name: z.string() })),
      },
    },
  },
  health: {
    method: 'GET',
    path: '/health',
    responses: {
      200: z.object({ status: z.string() }),
    },
  },
});

describe('nested contracts', () => {
  it('should preserve nested route definitions', () => {
    expectTypeOf(nestedContract.contract.getById).toExtend<RouteDef>();
    expectTypeOf(nestedContract.contract.list).toExtend<RouteDef>();
  });

  it('should preserve top-level route definitions alongside nested ones', () => {
    expectTypeOf(nestedContract.health).toExtend<RouteDef>();
  });

  it('should preserve literal types through nesting', () => {
    expectTypeOf(nestedContract.contract.getById.method).toEqualTypeOf<'GET'>();
    expectTypeOf(nestedContract.contract.getById.path).toExtend<string>();
  });

  it('should infer types from nested routes', () => {
    type Params = InferPathParams<typeof nestedContract.contract.getById>;
    expectTypeOf<Params>().toEqualTypeOf<{ id: string }>();
  });

  it('should distinguish routes from nested contracts with isRouteDef', () => {
    expect(isRouteDef(nestedContract.health)).toBe(true);
    expect(isRouteDef(nestedContract.contract)).toBe(false);
  });
});
