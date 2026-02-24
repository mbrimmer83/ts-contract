import { createContract, initContract } from '@ts-contract/core';
import { z } from 'zod';
import { pathPlugin } from './path';

const contract = createContract({
  getPokemon: {
    method: 'GET',
    path: '/pokemon/:id',
    pathParams: z.object({ id: z.string() }),
    query: z.object({ include: z.string().optional() }),
    responses: {
      200: z.object({ name: z.string(), type: z.string() }),
    },
  },
  listPokemon: {
    method: 'GET',
    path: '/pokemon',
    responses: {
      200: z.array(z.object({ name: z.string() })),
    },
  },
});

describe('pathPlugin', () => {
  const api = initContract(contract).use(pathPlugin).build();

  it('builds paths for routes with params and query', () => {
    const result = api.getPokemon.buildPath({ id: '25' }, { include: 'moves' });
    expect(result).toBe('/pokemon/25?include=moves');
  });

  it('builds paths for routes without path params', () => {
    const result = api.listPokemon.buildPath();
    expect(result).toBe('/pokemon');
  });
});
