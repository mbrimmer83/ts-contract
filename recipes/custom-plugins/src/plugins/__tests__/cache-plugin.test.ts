import { describe, it, expect } from 'vitest';
import { initContract } from '@ts-contract/core';
import { contract } from '../../test-contract.js';
import { cachePlugin } from '../cache-plugin.js';

describe('cachePlugin', () => {
  it('should add getCacheKey method to routes', () => {
    const api = initContract(contract)
      .use(cachePlugin)
      .build();

    expect(api.getUser.getCacheKey).toBeDefined();
    expect(typeof api.getUser.getCacheKey).toBe('function');
  });

  it('should generate cache key with method and path', () => {
    const api = initContract(contract)
      .use(cachePlugin)
      .build();

    const key = api.getUser.getCacheKey();

    expect(key).toEqual(['GET', '/users/:id']);
  });

  it('should generate cache key with params', () => {
    const api = initContract(contract)
      .use(cachePlugin)
      .build();

    const key = api.getUser.getCacheKey({
      params: { id: '123' },
    });

    expect(key).toEqual(['GET', '/users/:id', '{"id":"123"}']);
  });

  it('should generate cache key with query params', () => {
    const api = initContract(contract)
      .use(cachePlugin)
      .build();

    const key = api.listUsers.getCacheKey({
      query: { page: '1', limit: '10' },
    });

    expect(key).toEqual(['GET', '/users', '{"page":"1","limit":"10"}']);
  });

  it('should generate cache key with both params and query', () => {
    const api = initContract(contract)
      .use(cachePlugin)
      .build();

    const key = api.getUser.getCacheKey({
      params: { id: '123' },
    });

    expect(key).toHaveLength(3);
    expect(key[0]).toBe('GET');
    expect(key[1]).toBe('/users/:id');
    expect(key[2]).toBe('{"id":"123"}');
  });

  it('should generate different keys for different routes', () => {
    const api = initContract(contract)
      .use(cachePlugin)
      .build();

    const key1 = api.getUser.getCacheKey({ params: { id: '123' } });
    const key2 = api.listUsers.getCacheKey();

    expect(key1).not.toEqual(key2);
  });

  it('should generate different keys for different params', () => {
    const api = initContract(contract)
      .use(cachePlugin)
      .build();

    const key1 = api.getUser.getCacheKey({ params: { id: '123' } });
    const key2 = api.getUser.getCacheKey({ params: { id: '456' } });

    expect(key1).not.toEqual(key2);
  });
});
