import { expectTypeOf } from 'vitest';
import { z } from 'zod';
import { createContract } from './dsl';
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
  getPokemon: {
    method: 'GET',
    path: '/pokemon/:id',
    pathParams: z.object({ id: z.string() }),
    query: z.object({ include: z.string().optional() }),
    responses: {
      200: z.object({ name: z.string(), type: z.string() }),
      404: z.object({ message: z.string() }),
    },
    summary: 'Get a pokemon by id',
  },
  createPokemon: {
    method: 'POST',
    path: '/pokemon',
    body: z.object({ name: z.string(), type: z.string() }),
    headers: {
      authorization: z.string(),
    },
    responses: {
      201: z.object({ id: z.string(), name: z.string() }),
    },
    summary: 'Create a pokemon',
  },
  listPokemon: {
    method: 'GET',
    path: '/pokemon',
    responses: {
      200: z.array(z.object({ name: z.string() })),
    },
  },
});

describe('createContract', () => {
  it('should preserve route definitions', () => {
    expectTypeOf(contract.getPokemon).toExtend<RouteDef>();
    expectTypeOf(contract.createPokemon).toExtend<RouteDef>();
    expectTypeOf(contract.listPokemon).toExtend<RouteDef>();
  });

  it('should preserve literal method types', () => {
    expectTypeOf(contract.getPokemon.method).toEqualTypeOf<'GET'>();
    expectTypeOf(contract.createPokemon.method).toEqualTypeOf<'POST'>();
  });

  it('should preserve literal path types', () => {
    expectTypeOf(contract.getPokemon.path).toExtend<string>();
    expectTypeOf(contract.createPokemon.path).toExtend<string>();
  });
});

describe('ExtractPathParams', () => {
  it('should extract single path param', () => {
    expectTypeOf<ExtractPathParams<'/pokemon/:id'>>().toEqualTypeOf<'id'>();
  });

  it('should extract multiple path params', () => {
    expectTypeOf<
      ExtractPathParams<'/pokemon/:id/moves/:moveId'>
    >().toEqualTypeOf<'id' | 'moveId'>();
  });

  it('should return never for paths with no params', () => {
    expectTypeOf<ExtractPathParams<'/pokemon'>>().toEqualTypeOf<never>();
  });
});

describe('InferPathParams', () => {
  it('should infer path params from schema', () => {
    type Result = InferPathParams<typeof contract.getPokemon>;
    expectTypeOf<Result>().toEqualTypeOf<{ id: string }>();
  });

  it('should return undefined when no pathParams defined', () => {
    type Result = InferPathParams<typeof contract.listPokemon>;
    expectTypeOf<Result>().toEqualTypeOf<undefined>();
  });
});

describe('InferQuery', () => {
  it('should infer query params from schema', () => {
    type Result = InferQuery<typeof contract.getPokemon>;
    expectTypeOf<Result>().toEqualTypeOf<{ include?: string }>();
  });

  it('should return undefined when no query defined', () => {
    type Result = InferQuery<typeof contract.createPokemon>;
    expectTypeOf<Result>().toEqualTypeOf<undefined>();
  });
});

describe('InferBody', () => {
  it('should infer body from schema', () => {
    type Result = InferBody<typeof contract.createPokemon>;
    expectTypeOf<Result>().toEqualTypeOf<{ name: string; type: string }>();
  });

  it('should return undefined when no body defined', () => {
    type Result = InferBody<typeof contract.getPokemon>;
    expectTypeOf<Result>().toEqualTypeOf<undefined>();
  });
});

describe('InferHeaders', () => {
  it('should infer headers from schema', () => {
    type Result = InferHeaders<typeof contract.createPokemon>;
    expectTypeOf<Result>().toEqualTypeOf<{ authorization: string }>();
  });

  it('should return undefined when no headers defined', () => {
    type Result = InferHeaders<typeof contract.getPokemon>;
    expectTypeOf<Result>().toEqualTypeOf<undefined>();
  });
});

describe('InferResponseBody', () => {
  it('should infer response body for a specific status code', () => {
    type Result = InferResponseBody<typeof contract.getPokemon, 200>;
    expectTypeOf<Result>().toEqualTypeOf<{ name: string; type: string }>();
  });

  it('should infer error response body', () => {
    type Result = InferResponseBody<typeof contract.getPokemon, 404>;
    expectTypeOf<Result>().toEqualTypeOf<{ message: string }>();
  });

  it('should return never for undefined status codes', () => {
    type Result = InferResponseBody<typeof contract.getPokemon, 500>;
    expectTypeOf<Result>().toEqualTypeOf<never>();
  });
});

describe('InferResponseMap', () => {
  it('should produce a mapped object keyed by status code', () => {
    type Result = InferResponseMap<typeof contract.getPokemon>;
    expectTypeOf<Result>().toExtend<{
      200: { name: string; type: string };
      404: { message: string };
    }>();
  });
});

describe('InferResponses', () => {
  it('should produce a discriminated union of { status, body }', () => {
    type Result = InferResponses<typeof contract.getPokemon>;
    expectTypeOf<Result>().toEqualTypeOf<
      | { status: 200; body: { name: string; type: string } }
      | { status: 404; body: { message: string } }
    >();
  });
});

describe('InferArgs', () => {
  it('should merge params, query, and body into a single args type', () => {
    type Result = InferArgs<typeof contract.getPokemon>;
    expectTypeOf<Result>().toExtend<{
      params: { id: string };
      query: { include?: string };
    }>();
  });

  it('should include body and headers when defined', () => {
    type Result = InferArgs<typeof contract.createPokemon>;
    expectTypeOf<Result>().toExtend<{
      body: { name: string; type: string };
      headers: { authorization: string };
    }>();
  });

  it('should produce empty object when no args defined', () => {
    type Result = InferArgs<typeof contract.listPokemon>;
    expectTypeOf<Result>().toExtend<object>();
  });
});
