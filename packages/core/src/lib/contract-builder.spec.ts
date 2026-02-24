import { expectTypeOf } from 'vitest';
import { initContract } from './contract-builder';
import { createContract } from './dsl';
import type { ContractPlugin } from './plugin-types';
import type { RouteDef } from './dsl';

import { z } from 'zod';

declare module './plugin-types' {
  interface PluginTypeRegistry<R> {
    info: {
      method: () => R extends RouteDef ? R['method'] : never;
      path: () => R extends RouteDef ? R['path'] : never;
    };
    tag: {
      tag: () => 'custom';
    };
  }
}

const contract = createContract({
  contract: {
    getById: {
      method: 'GET',
      path: '/contract/:id',
      pathParams: z.object({ id: z.string() }),
      query: z.object({ include: z.string().optional() }),
      responses: {
        200: z.object({ name: z.string(), type: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
    create: {
      method: 'POST',
      path: '/contract',
      body: z.object({ name: z.string(), type: z.string() }),
      responses: {
        201: z.object({ id: z.string(), name: z.string() }),
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

describe('initContract', () => {
  describe('with custom plugins only', () => {
    const infoPlugin = {
      name: 'info' as const,
      route: <R extends RouteDef>(route: R) => ({
        method: () => route.method,
        path: () => route.path,
      }),
    } satisfies ContractPlugin<'info'>;

    const tagPlugin = {
      name: 'tag' as const,
      route: () => ({
        tag: () => 'custom',
      }),
    } satisfies ContractPlugin<'tag'>;

    const api = initContract(contract).use(infoPlugin).use(tagPlugin).build();

    it('applies plugin methods to nested routes', () => {
      expect(api.contract.getById.method()).toBe('GET');
      expect(api.contract.getById.path()).toBe('/contract/:id');
      expect(api.contract.getById.tag()).toBe('custom');
    });

    it('applies plugin methods to top-level routes', () => {
      expect(api.health.method()).toBe('GET');
      expect(api.health.path()).toBe('/health');
      expect(api.health.tag()).toBe('custom');
    });

    it('preserves route-specific literal typing', () => {
      const method = api.contract.create.method();
      expectTypeOf(method).toEqualTypeOf<'POST'>();

      const path = api.contract.list.path();
      expectTypeOf(path).toExtend<string>();
    });
  });
});
