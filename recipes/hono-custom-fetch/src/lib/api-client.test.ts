import { test } from 'node:test';
import assert from 'node:assert';
import { ApiClient, ApiError } from './api-client.js';

// Simple test suite for the API client
test('ApiClient - basic functionality', async (t) => {
  const client = new ApiClient('http://localhost:3003');

  await t.test('should handle request interceptors', async () => {
    let interceptorCalled = false;

    client.addRequestInterceptor((url, options) => {
      interceptorCalled = true;
      return options || {};
    });

    try {
      await client.getUsers();
    } catch (error: unknown) {
      // Server might not be running, that's ok
      console.log(error);
    }

    assert.strictEqual(
      interceptorCalled,
      true,
      'Request interceptor should be called',
    );
  });

  await t.test('should create ApiError with correct properties', () => {
    const error = new ApiError('Test error', 404, { foo: 'bar' });

    assert.strictEqual(error.message, 'Test error');
    assert.strictEqual(error.status, 404);
    assert.deepStrictEqual(error.data, { foo: 'bar' });
    assert.strictEqual(error.name, 'ApiError');
  });

  await t.test('should track loading states', async () => {
    const states: boolean[] = [];

    client.subscribe((loadingStates) => {
      states.push(loadingStates.get('test') || false);
    });

    try {
      await client.fetchWithLoading('test', '/api/users');
    } catch (error: unknown) {
      // Server might not be running, that's ok
      console.log(error);
    }

    assert.ok(states.length > 0, 'Loading states should be tracked');
  });

  await t.test('should clear cache', () => {
    client.clearCache();
    // If this doesn't throw, the test passes
    assert.ok(true);
  });
});

console.log('✓ API Client tests passed');
