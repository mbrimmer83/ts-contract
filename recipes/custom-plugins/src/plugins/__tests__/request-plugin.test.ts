import { describe, it, expect } from 'vitest';
import { initContract } from '@ts-contract/core';
import { contract } from '../../test-contract.js';
import { requestPlugin } from '../request-plugin.js';

describe('requestPlugin', () => {
  it('should add buildRequest method to routes', () => {
    const api = initContract(contract).use(requestPlugin).build();

    expect(api.getUser.buildRequest).toBeDefined();
    expect(typeof api.getUser.buildRequest).toBe('function');
  });

  it('should build request with path params', () => {
    const api = initContract(contract).use(requestPlugin).build();

    const request = api.getUser.buildRequest({
      params: { id: '123' },
    });

    const url = new URL(request.url);
    expect(url.pathname).toBe('/users/123');
    expect(request.method).toBe('GET');
  });

  it('should build request with query params', () => {
    const api = initContract(contract).use(requestPlugin).build();

    const request = api.listUsers.buildRequest({
      query: { page: '1', limit: '10' },
    });

    const url = new URL(request.url);
    expect(url.pathname).toBe('/users');
    expect(url.searchParams.get('page')).toBe('1');
    expect(url.searchParams.get('limit')).toBe('10');
    expect(request.method).toBe('GET');
  });

  it('should build request with body', async () => {
    const api = initContract(contract).use(requestPlugin).build();

    const request = api.createUser.buildRequest({
      body: { name: 'Alice', email: 'alice@example.com' },
    });

    const url = new URL(request.url);
    expect(url.pathname).toBe('/users');
    expect(request.method).toBe('POST');

    const body = await request.json();
    expect(body).toEqual({
      name: 'Alice',
      email: 'alice@example.com',
    });
  });

  it('should build request with custom headers', () => {
    const api = initContract(contract).use(requestPlugin).build();

    const request = api.getUser.buildRequest({
      params: { id: '123' },
      headers: { Authorization: 'Bearer token' },
    });

    expect(request.headers.get('Authorization')).toBe('Bearer token');
    expect(request.headers.get('Content-Type')).toBe('application/json');
  });

  it('should encode path params', () => {
    const api = initContract(contract).use(requestPlugin).build();

    const request = api.getUser.buildRequest({
      params: { id: 'user@123' },
    });

    const url = new URL(request.url);
    expect(url.pathname).toBe('/users/user%40123');
  });

  it('should handle optional query params', () => {
    const api = initContract(contract).use(requestPlugin).build();

    const request = api.listUsers.buildRequest({
      query: { page: '1' },
    });

    const url = new URL(request.url);
    expect(url.pathname).toBe('/users');
    expect(url.searchParams.get('page')).toBe('1');
  });
});
