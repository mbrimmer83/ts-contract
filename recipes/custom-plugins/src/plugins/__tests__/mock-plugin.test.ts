import { describe, it, expect } from 'vitest';
import { initContract } from '@ts-contract/core';
import { contract } from '../../test-contract.js';
import { mockPlugin } from '../mock-plugin.js';

describe('mockPlugin', () => {
  it('should add generateMockResponse method to routes', () => {
    const api = initContract(contract)
      .use(mockPlugin)
      .build();

    expect(api.getUser.generateMockResponse).toBeDefined();
    expect(typeof api.getUser.generateMockResponse).toBe('function');
  });

  it('should generate mock data for 200 response', () => {
    const api = initContract(contract)
      .use(mockPlugin)
      .build();

    const mockData = api.getUser.generateMockResponse(200);

    expect(mockData).toEqual({
      id: '123',
      name: 'Mock User',
      email: 'mock@example.com',
    });
  });

  it('should generate mock data for 201 response', () => {
    const api = initContract(contract)
      .use(mockPlugin)
      .build();

    const mockData = api.createUser.generateMockResponse(201);

    expect(mockData).toEqual({
      id: '123',
      name: 'Mock User',
      email: 'mock@example.com',
    });
  });

  it('should throw error for non-existent status code', () => {
    const api = initContract(contract)
      .use(mockPlugin)
      .build();

    expect(() => {
      api.getUser.generateMockResponse(500);
    }).toThrow('No response schema for status 500');
  });

  it('should generate mock data for different routes', () => {
    const api = initContract(contract)
      .use(mockPlugin)
      .build();

    const getUserMock = api.getUser.generateMockResponse(200);
    const createUserMock = api.createUser.generateMockResponse(201);

    expect(getUserMock).toBeDefined();
    expect(createUserMock).toBeDefined();
  });
});
