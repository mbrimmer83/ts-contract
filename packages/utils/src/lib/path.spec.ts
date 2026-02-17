/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContract } from '@ts-contract/core';
import { z } from 'zod';
import { buildPath } from './path';

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

describe('buildPath', () => {
  describe('runtime behavior', () => {
    it('should substitute path params from a route definition', () => {
      const result = buildPath(contract.getPokemon, { id: '25' });
      expect(result).toBe('/pokemon/25');
    });

    it('should return the path as-is for routes with no path params', () => {
      const result = buildPath(contract.listPokemon);
      expect(result).toBe('/pokemon');
    });

    it('should URI-encode param values', () => {
      const result = buildPath(contract.getPokemon, { id: 'hello world' });
      expect(result).toBe('/pokemon/hello%20world');
    });

    it('should append query params', () => {
      const result = buildPath(
        contract.getPokemon,
        { id: '25' },
        { include: 'moves' },
      );
      expect(result).toBe('/pokemon/25?include=moves');
    });

    it('should omit undefined query param values', () => {
      const result = buildPath(
        contract.getPokemon,
        { id: '25' },
        { include: undefined },
      );
      expect(result).toBe('/pokemon/25');
    });

    it('should work with path params and no query params', () => {
      const result = buildPath(contract.getPokemon, { id: '25' });
      expect(result).toBe('/pokemon/25');
    });
  });

  describe('type-level behavior', () => {
    it('should require params when route has pathParams', () => {
      type MissingParams = () => void;
      // @ts-expect-error missing required path params
      const _missing: MissingParams = () => buildPath(contract.getPokemon);

      // @ts-expect-error wrong param key
      const _wrong: MissingParams = () =>
        // @ts-expect-error wrong param key
        buildPath(contract.getPokemon, { name: '25' });
    });

    it('should accept optional query when route has query schema', () => {
      const withQuery = buildPath(
        contract.getPokemon,
        { id: '1' },
        { include: 'moves' },
      );
      expectTypeOf(withQuery).toBeString();

      const withoutQuery = buildPath(contract.getPokemon, { id: '1' });
      expectTypeOf(withoutQuery).toBeString();
    });

    it('should not require params when route has no pathParams', () => {
      const result = buildPath(contract.listPokemon);
      expectTypeOf(result).toBeString();
    });
  });
});
