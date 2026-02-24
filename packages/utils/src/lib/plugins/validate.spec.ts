import { createContract, initContract } from '@ts-contract/core';
import { z } from 'zod';
import { validatePlugin } from './validate';

const contract = createContract({
  getPokemon: {
    method: 'GET',
    path: '/pokemon/:id',
    pathParams: z.object({ id: z.string() }),
    responses: {
      200: z.object({ name: z.string(), type: z.string() }),
      404: z.object({ message: z.string() }),
    },
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
  },
});

describe('validatePlugin', () => {
  const api = initContract(contract).use(validatePlugin).build();

  it('validates successful path params', () => {
    expect(api.getPokemon.validatePathParams({ id: '25' })).toEqual({ id: '25' });
  });

  it('throws on invalid request body', () => {
    expect(() => api.createPokemon.validateBody({ name: 123 })).toThrow();
  });

  it('validates response payload by status code', () => {
    const result = api.getPokemon.validateResponse(200, {
      name: 'Pikachu',
      type: 'electric',
    });
    expect(result).toEqual({ name: 'Pikachu', type: 'electric' });
  });
});
