import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createContract, initContract } from '@ts-contract/core';
import { websocketValidatePlugin } from './websocket-validate';

describe('websocketValidatePlugin', () => {
  const contract = createContract({
    chat: {
      type: 'websocket' as const,
      path: '/ws/chat/:roomId',
      pathParams: z.object({ roomId: z.string() }),
      query: z.object({ token: z.string() }),
      headers: {
        authorization: z.string(),
      },
      clientMessages: {
        new_msg: z.object({
          type: z.literal('new_msg'),
          body: z.string(),
        }),
        typing: z.object({
          type: z.literal('typing'),
          isTyping: z.boolean(),
        }),
      },
      serverMessages: {
        new_msg: z.object({
          type: z.literal('new_msg'),
          id: z.string(),
          body: z.string(),
          userId: z.string(),
        }),
        user_typing: z.object({
          type: z.literal('user_typing'),
          userId: z.string(),
          isTyping: z.boolean(),
        }),
      },
    },
  });

  const api = initContract(contract)
    .useWebSocket(websocketValidatePlugin)
    .build();

  describe('validateClientMessage', () => {
    it('should validate valid client message', () => {
      const result = api.chat.validateClientMessage('new_msg', {
        type: 'new_msg',
        body: 'Hello!',
      });
      expect(result).toEqual({
        type: 'new_msg',
        body: 'Hello!',
      });
    });

    it('should validate different message type', () => {
      const result = api.chat.validateClientMessage('typing', {
        type: 'typing',
        isTyping: true,
      });
      expect(result).toEqual({
        type: 'typing',
        isTyping: true,
      });
    });

    it('should throw on invalid message data', () => {
      expect(() => {
        api.chat.validateClientMessage('new_msg', {
          type: 'new_msg',
          body: 123, // should be string
        });
      }).toThrow(/Validation failed/);
    });

    it('should throw on missing required fields', () => {
      expect(() => {
        api.chat.validateClientMessage('new_msg', {
          type: 'new_msg',
          // missing body
        });
      }).toThrow(/Validation failed/);
    });
  });

  describe('validateServerMessage', () => {
    it('should validate valid server message', () => {
      const result = api.chat.validateServerMessage('new_msg', {
        type: 'new_msg',
        id: 'msg-123',
        body: 'Hello from server!',
        userId: 'user-456',
      });
      expect(result).toEqual({
        type: 'new_msg',
        id: 'msg-123',
        body: 'Hello from server!',
        userId: 'user-456',
      });
    });

    it('should validate different server message type', () => {
      const result = api.chat.validateServerMessage('user_typing', {
        type: 'user_typing',
        userId: 'user-789',
        isTyping: false,
      });
      expect(result).toEqual({
        type: 'user_typing',
        userId: 'user-789',
        isTyping: false,
      });
    });

    it('should throw on invalid server message data', () => {
      expect(() => {
        api.chat.validateServerMessage('new_msg', {
          type: 'new_msg',
          id: 'msg-123',
          body: 'Hello',
          userId: 123, // should be string
        });
      }).toThrow(/Validation failed/);
    });
  });

  describe('validatePathParams', () => {
    it('should validate valid path params', () => {
      const result = api.chat.validatePathParams({ roomId: '123' });
      expect(result).toEqual({ roomId: '123' });
    });

    it('should throw on invalid path params', () => {
      expect(() => {
        api.chat.validatePathParams({ roomId: 123 });
      }).toThrow(/Validation failed/);
    });

    it('should throw on missing path params', () => {
      expect(() => {
        api.chat.validatePathParams({});
      }).toThrow(/Validation failed/);
    });
  });

  describe('validateQuery', () => {
    it('should validate valid query params', () => {
      const result = api.chat.validateQuery({ token: 'abc-token' });
      expect(result).toEqual({ token: 'abc-token' });
    });

    it('should throw on invalid query params', () => {
      expect(() => {
        api.chat.validateQuery({ token: 123 });
      }).toThrow(/Validation failed/);
    });

    it('should throw on missing query params', () => {
      expect(() => {
        api.chat.validateQuery({});
      }).toThrow(/Validation failed/);
    });
  });

  describe('validateHeaders', () => {
    it('should validate valid headers', () => {
      const result = api.chat.validateHeaders({ authorization: 'Bearer token' });
      expect(result).toEqual({ authorization: 'Bearer token' });
    });

    it('should throw on invalid headers', () => {
      expect(() => {
        api.chat.validateHeaders({ authorization: 123 });
      }).toThrow(/Validation failed/);
    });

    it('should throw on missing headers', () => {
      expect(() => {
        api.chat.validateHeaders({});
      }).toThrow(/Validation failed/);
    });
  });
});
