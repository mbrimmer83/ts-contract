/* eslint-disable @typescript-eslint/no-unused-vars */
import { expectTypeOf } from 'vitest';
import { createContract } from '@ts-contract/core';
import type { RouteDef } from '@ts-contract/core';
import { z } from 'zod';
import { initContract } from './contract-builder';
import { pathPlugin } from './plugins/path';
import { validatePlugin } from './plugins/validate';
import type { ContractPlugin } from './plugin-types';

const contract = createContract({
  pokemon: {
    getById: {
      method: 'GET',
      path: '/pokemon/:id',
      pathParams: z.object({ id: z.string() }),
      query: z.object({ include: z.string().optional() }),
      responses: {
        200: z.object({ name: z.string(), type: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
    create: {
      method: 'POST',
      path: '/pokemon',
      body: z.object({ name: z.string(), type: z.string() }),
      responses: {
        201: z.object({ id: z.string(), name: z.string() }),
      },
    },
    list: {
      method: 'GET',
      path: '/pokemon',
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
  describe('with pathPlugin', () => {
    const api = initContract(contract).use(pathPlugin).build();

    it('should build path with params for nested routes', () => {
      const result = api.pokemon.getById.buildPath({ id: '25' });
      expect(result).toBe('/pokemon/25');
    });

    it('should build path with query params', () => {
      const result = api.pokemon.getById.buildPath(
        { id: '25' },
        { include: 'moves' },
      );
      expect(result).toBe('/pokemon/25?include=moves');
    });

    it('should build path for routes with no params', () => {
      const result = api.pokemon.list.buildPath();
      expect(result).toBe('/pokemon');
    });

    it('should build path for top-level routes', () => {
      const result = api.health.buildPath();
      expect(result).toBe('/health');
    });
  });

  describe('with validatePlugin', () => {
    const api = initContract(contract).use(validatePlugin).build();

    it('should validate path params', () => {
      const result = api.pokemon.getById.validatePathParams({ id: '25' });
      expect(result).toEqual({ id: '25' });
    });

    it('should validate body', () => {
      const result = api.pokemon.create.validateBody({
        name: 'Pikachu',
        type: 'electric',
      });
      expect(result).toEqual({ name: 'Pikachu', type: 'electric' });
    });

    it('should throw on invalid body', () => {
      expect(() => api.pokemon.create.validateBody({ name: 123 })).toThrow();
    });
  });

  describe('with multiple plugins', () => {
    const api = initContract(contract)
      .use(pathPlugin)
      .use(validatePlugin)
      .build();

    it('should have both buildPath and validate methods', () => {
      const path = api.pokemon.getById.buildPath({ id: '25' });
      expect(path).toBe('/pokemon/25');

      const params = api.pokemon.getById.validatePathParams({ id: '25' });
      expect(params).toEqual({ id: '25' });
    });

    it('should work on nested and top-level routes', () => {
      expect(api.health.buildPath()).toBe('/health');
      expect(api.pokemon.list.buildPath()).toBe('/pokemon');
    });
  });

  describe('with custom plugin', () => {
    const loggingPlugin = {
      name: 'logging' as const,
      route: <R extends RouteDef>(route: R) => ({
        getMethod: () => route.method,
        getPath: () => route.path,
      }),
    } satisfies ContractPlugin;

    const api = initContract(contract)
      .use(pathPlugin)
      .use(loggingPlugin)
      .build();

    it('should include custom plugin methods', () => {
      expect(api.pokemon.getById.getMethod()).toBe('GET');
      expect(api.pokemon.getById.getPath()).toBe('/pokemon/:id');
    });

    it('should include built-in plugin methods alongside custom', () => {
      expect(api.pokemon.getById.buildPath({ id: '1' })).toBe('/pokemon/1');
    });
  });

  describe('type-level behavior', () => {
    const api = initContract(contract)
      .use(pathPlugin)
      .use(validatePlugin)
      .build();

    it('should type buildPath return as string', () => {
      const result = api.pokemon.getById.buildPath({ id: '25' });
      expectTypeOf(result).toBeString();
    });

    it('should type validateBody return correctly', () => {
      const result = api.pokemon.create.validateBody({
        name: 'Pikachu',
        type: 'electric',
      });
      expectTypeOf(result).toEqualTypeOf<{ name: string; type: string }>();
    });

    it('should type validatePathParams return correctly', () => {
      const result = api.pokemon.getById.validatePathParams({ id: '25' });
      expectTypeOf(result).toEqualTypeOf<{ id: string }>();
    });

    it('should not require params for routes without pathParams', () => {
      const result = api.health.buildPath();
      expectTypeOf(result).toBeString();
    });
  });
});
