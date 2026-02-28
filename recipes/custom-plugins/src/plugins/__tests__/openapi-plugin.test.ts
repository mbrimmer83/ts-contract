import { describe, it, expect } from 'vitest';
import { initContract } from '@ts-contract/core';
import { contract } from '../../test-contract.js';
import { openapiPlugin } from '../openapi-plugin.js';

describe('openapiPlugin', () => {
  it('should add getOpenAPIOperation method to routes', () => {
    const api = initContract(contract)
      .use(openapiPlugin)
      .build();

    expect(api.getUser.getOpenAPIOperation).toBeDefined();
    expect(typeof api.getUser.getOpenAPIOperation).toBe('function');
  });

  it('should generate OpenAPI operation for route with path params', () => {
    const api = initContract(contract)
      .use(openapiPlugin)
      .build();

    const operation = api.getUser.getOpenAPIOperation();

    expect(operation.operationId).toBe('get__users__id');
    expect(operation.parameters).toHaveLength(1);
    expect(operation.parameters[0]).toEqual({
      name: 'id',
      in: 'path',
      required: true,
    });
  });

  it('should generate OpenAPI operation for route with query params', () => {
    const api = initContract(contract)
      .use(openapiPlugin)
      .build();

    const operation = api.listUsers.getOpenAPIOperation();

    expect(operation.operationId).toBe('get__users');
    expect(operation.parameters).toHaveLength(1);
    expect(operation.parameters[0]).toEqual({
      name: 'query',
      in: 'query',
      required: false,
    });
  });

  it('should generate OpenAPI operation for route without params', () => {
    const api = initContract(contract)
      .use(openapiPlugin)
      .build();

    const operation = api.createUser.getOpenAPIOperation();

    expect(operation.operationId).toBe('post__users');
    expect(operation.parameters).toHaveLength(0);
  });

  it('should include tags when available', () => {
    const api = initContract(contract)
      .use(openapiPlugin)
      .build();

    const operation = api.getUser.getOpenAPIOperation();

    expect(operation.tags).toEqual([]);
  });
});
