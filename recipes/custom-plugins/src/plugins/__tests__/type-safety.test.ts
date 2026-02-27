import { describe, it, expectTypeOf } from 'vitest';
import { initContract } from '@ts-contract/core';
import { contract } from '../../test-contract.js';
import { loggerPlugin } from '../logger-plugin.js';
import { openapiPlugin } from '../openapi-plugin.js';
import { mockPlugin } from '../mock-plugin.js';
import { requestPlugin } from '../request-plugin.js';
import { cachePlugin } from '../cache-plugin.js';
import { statsPlugin } from '../stats-plugin.js';

describe('Plugin Type Safety', () => {
  describe('loggerPlugin', () => {
    it('should have correctly typed logRoute method', () => {
      const api = initContract(contract).use(loggerPlugin).build();

      expectTypeOf(api.getUser.logRoute).toBeFunction();
      expectTypeOf(api.getUser.logRoute).parameters.toEqualTypeOf<[]>();
      expectTypeOf(api.getUser.logRoute).returns.toEqualTypeOf<void>();
    });
  });

  describe('openapiPlugin', () => {
    it('should have correctly typed getOpenAPIOperation method', () => {
      const api = initContract(contract).use(openapiPlugin).build();

      expectTypeOf(api.getUser.getOpenAPIOperation).toBeFunction();
      expectTypeOf(api.getUser.getOpenAPIOperation).parameters.toEqualTypeOf<
        []
      >();
      expectTypeOf(api.getUser.getOpenAPIOperation).returns.toMatchTypeOf<{
        operationId: string;
        summary?: string;
        tags: string[];
        parameters: Array<{
          name: string;
          in: 'path' | 'query' | 'header';
          required: boolean;
        }>;
      }>();
    });
  });

  describe('mockPlugin', () => {
    it('should have correctly typed generateMockResponse method', () => {
      const api = initContract(contract).use(mockPlugin).build();

      expectTypeOf(api.getUser.generateMockResponse).toBeFunction();
      expectTypeOf(api.getUser.generateMockResponse).parameters.toEqualTypeOf<
        [number]
      >();
      expectTypeOf(
        api.getUser.generateMockResponse,
      ).returns.toEqualTypeOf<unknown>();
    });
  });

  describe('requestPlugin', () => {
    it('should have correctly typed buildRequest method with path params', () => {
      const api = initContract(contract).use(requestPlugin).build();

      expectTypeOf(api.getUser.buildRequest).toBeFunction();

      // Test that params are typed correctly
      const request = api.getUser.buildRequest({
        params: { id: '123' },
      });

      expectTypeOf(request).toEqualTypeOf<Request>();
    });

    it('should have correctly typed buildRequest method with query params', () => {
      const api = initContract(contract).use(requestPlugin).build();

      // Test that query params are typed correctly
      const request = api.listUsers.buildRequest({
        query: { page: '1', limit: '10' },
      });

      expectTypeOf(request).toEqualTypeOf<Request>();
    });

    it('should have correctly typed buildRequest method with body', () => {
      const api = initContract(contract).use(requestPlugin).build();

      // Test that body is typed correctly
      const request = api.createUser.buildRequest({
        body: { name: 'Alice', email: 'alice@example.com' },
      });

      expectTypeOf(request).toEqualTypeOf<Request>();
    });
  });

  describe('cachePlugin', () => {
    it('should have correctly typed getCacheKey method with params', () => {
      const api = initContract(contract).use(cachePlugin).build();

      expectTypeOf(api.getUser.getCacheKey).toBeFunction();

      // Test that params are typed correctly
      const key = api.getUser.getCacheKey({
        params: { id: '123' },
      });

      expectTypeOf(key).toEqualTypeOf<string[]>();
    });

    it('should have correctly typed getCacheKey method with query', () => {
      const api = initContract(contract).use(cachePlugin).build();

      // Test that query params are typed correctly
      const key = api.listUsers.getCacheKey({
        query: { page: '1', limit: '10' },
      });

      expectTypeOf(key).toEqualTypeOf<string[]>();
    });
  });

  describe('statsPlugin', () => {
    it('should have correctly typed stats methods', () => {
      const api = initContract(contract).use(statsPlugin).build();

      expectTypeOf(api.getUser.incrementCalls).toBeFunction();
      expectTypeOf(api.getUser.incrementCalls).parameters.toEqualTypeOf<[]>();
      expectTypeOf(api.getUser.incrementCalls).returns.toEqualTypeOf<void>();

      expectTypeOf(api.getUser.getCallCount).toBeFunction();
      expectTypeOf(api.getUser.getCallCount).parameters.toEqualTypeOf<[]>();
      expectTypeOf(api.getUser.getCallCount).returns.toEqualTypeOf<number>();

      expectTypeOf(api.getUser.resetCallCount).toBeFunction();
      expectTypeOf(api.getUser.resetCallCount).parameters.toEqualTypeOf<[]>();
      expectTypeOf(api.getUser.resetCallCount).returns.toEqualTypeOf<void>();
    });
  });

  describe('Multiple Plugins', () => {
    it('should compose plugin types correctly', () => {
      const api = initContract(contract)
        .use(loggerPlugin)
        .use(cachePlugin)
        .use(statsPlugin)
        .build();

      // All plugin methods should be available
      expectTypeOf(api.getUser.logRoute).toBeFunction();
      expectTypeOf(api.getUser.getCacheKey).toBeFunction();
      expectTypeOf(api.getUser.incrementCalls).toBeFunction();
      expectTypeOf(api.getUser.getCallCount).toBeFunction();
      expectTypeOf(api.getUser.resetCallCount).toBeFunction();
    });
  });
});
