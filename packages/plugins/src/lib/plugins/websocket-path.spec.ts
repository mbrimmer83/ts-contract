import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createContract, initContract } from '@ts-contract/core';
import { websocketPathPlugin } from './websocket-path';

describe('websocketPathPlugin', () => {
  const contract = createContract({
    chat: {
      type: 'websocket' as const,
      path: '/ws/chat/:roomId',
      pathParams: z.object({ roomId: z.string() }),
      query: z.object({ token: z.string() }),
      clientMessages: {},
      serverMessages: {},
    },
    simple: {
      type: 'websocket' as const,
      path: '/ws/simple',
      clientMessages: {},
      serverMessages: {},
    },
  });

  const api = initContract(contract).useWebSocket(websocketPathPlugin).build();

  describe('buildPath', () => {
    it('should build path with params and query', () => {
      const path = api.chat.buildPath(
        { roomId: '123' },
        { token: 'abc-token' },
      );
      expect(path).toBe('/ws/chat/123?token=abc-token');
    });

    it('should build path with only params', () => {
      const path = api.chat.buildPath({ roomId: '456' });
      expect(path).toBe('/ws/chat/456');
    });

    it('should build path without params or query', () => {
      const path = api.simple.buildPath();
      expect(path).toBe('/ws/simple');
    });

    it('should encode path parameters', () => {
      const path = api.chat.buildPath({ roomId: 'room with spaces' });
      expect(path).toBe('/ws/chat/room%20with%20spaces');
    });

    it('should handle multiple query parameters', () => {
      const contractWithQuery = createContract({
        ws: {
          type: 'websocket' as const,
          path: '/ws/test',
          query: z.object({
            token: z.string(),
            userId: z.string(),
            debug: z.boolean().optional(),
          }),
          clientMessages: {},
          serverMessages: {},
        },
      });

      const apiWithQuery = initContract(contractWithQuery)
        .useWebSocket(websocketPathPlugin)
        .build();

      const path = apiWithQuery.ws.buildPath(undefined, {
        token: 'abc',
        userId: '123',
        debug: true,
      });
      expect(path).toBe('/ws/test?token=abc&userId=123&debug=true');
    });

    it('should skip undefined query parameters', () => {
      const contractWithQuery = createContract({
        ws: {
          type: 'websocket' as const,
          path: '/ws/test',
          query: z.object({
            token: z.string(),
            optional: z.string().optional(),
          }),
          clientMessages: {},
          serverMessages: {},
        },
      });

      const apiWithQuery = initContract(contractWithQuery)
        .useWebSocket(websocketPathPlugin)
        .build();

      const path = apiWithQuery.ws.buildPath(undefined, {
        token: 'abc',
        optional: undefined,
      });
      expect(path).toBe('/ws/test?token=abc');
    });

    it('should throw error for missing path parameter', () => {
      expect(() => {
        // @ts-expect-error - testing runtime error
        api.chat.buildPath({});
      }).toThrow('Missing path parameter: roomId');
    });
  });
});
