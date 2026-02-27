import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initContract } from '@ts-contract/core';
import { contract } from '../../test-contract.js';
import { loggerPlugin } from '../logger-plugin.js';

describe('loggerPlugin', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {}) as ReturnType<typeof vi.spyOn>;
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should add logRoute method to routes', () => {
    const api = initContract(contract).use(loggerPlugin).build();

    expect(api.getUser.logRoute).toBeDefined();
    expect(typeof api.getUser.logRoute).toBe('function');
  });

  it('should log GET route information', () => {
    const api = initContract(contract).use(loggerPlugin).build();

    api.getUser.logRoute();

    expect(consoleSpy).toHaveBeenCalledWith('GET /users/:id');
  });

  it('should log POST route information', () => {
    const api = initContract(contract).use(loggerPlugin).build();

    api.createUser.logRoute();

    expect(consoleSpy).toHaveBeenCalledWith('POST /users');
  });

  it('should log different routes independently', () => {
    const api = initContract(contract).use(loggerPlugin).build();

    api.getUser.logRoute();
    api.listUsers.logRoute();
    api.createUser.logRoute();

    expect(consoleSpy).toHaveBeenCalledTimes(3);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'GET /users/:id');
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'GET /users');
    expect(consoleSpy).toHaveBeenNthCalledWith(3, 'POST /users');
  });
});
