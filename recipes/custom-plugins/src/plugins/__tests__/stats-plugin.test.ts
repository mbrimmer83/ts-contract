import { describe, it, expect, beforeEach } from 'vitest';
import { initContract } from '@ts-contract/core';
import { contract } from '../../test-contract.js';
import { statsPlugin } from '../stats-plugin.js';

describe('statsPlugin', () => {
  it('should add stats methods to routes', () => {
    const api = initContract(contract)
      .use(statsPlugin)
      .build();

    expect(api.getUser.incrementCalls).toBeDefined();
    expect(api.getUser.getCallCount).toBeDefined();
    expect(api.getUser.resetCallCount).toBeDefined();
  });

  it('should start with zero call count', () => {
    const api = initContract(contract)
      .use(statsPlugin)
      .build();

    expect(api.getUser.getCallCount()).toBe(0);
  });

  it('should increment call count', () => {
    const api = initContract(contract)
      .use(statsPlugin)
      .build();

    api.getUser.incrementCalls();
    expect(api.getUser.getCallCount()).toBe(1);

    api.getUser.incrementCalls();
    expect(api.getUser.getCallCount()).toBe(2);
  });

  it('should maintain independent state per route', () => {
    const api = initContract(contract)
      .use(statsPlugin)
      .build();

    api.getUser.incrementCalls();
    api.getUser.incrementCalls();
    api.createUser.incrementCalls();

    expect(api.getUser.getCallCount()).toBe(2);
    expect(api.createUser.getCallCount()).toBe(1);
    expect(api.listUsers.getCallCount()).toBe(0);
  });

  it('should reset call count', () => {
    const api = initContract(contract)
      .use(statsPlugin)
      .build();

    api.getUser.incrementCalls();
    api.getUser.incrementCalls();
    expect(api.getUser.getCallCount()).toBe(2);

    api.getUser.resetCallCount();
    expect(api.getUser.getCallCount()).toBe(0);
  });

  it('should not affect other routes when resetting', () => {
    const api = initContract(contract)
      .use(statsPlugin)
      .build();

    api.getUser.incrementCalls();
    api.createUser.incrementCalls();
    api.createUser.incrementCalls();

    api.getUser.resetCallCount();

    expect(api.getUser.getCallCount()).toBe(0);
    expect(api.createUser.getCallCount()).toBe(2);
  });

  it('should maintain state across multiple api instances', () => {
    const api1 = initContract(contract)
      .use(statsPlugin)
      .build();

    const api2 = initContract(contract)
      .use(statsPlugin)
      .build();

    api1.getUser.incrementCalls();
    api2.getUser.incrementCalls();

    // Each instance has its own state
    expect(api1.getUser.getCallCount()).toBe(1);
    expect(api2.getUser.getCallCount()).toBe(1);
  });
});
